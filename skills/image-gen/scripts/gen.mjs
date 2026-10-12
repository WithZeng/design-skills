#!/usr/bin/env node
// Standalone image generation (GPT Image models via OpenAI-compatible relays). Works from any directory.
//   node gen.mjs --models                                  list image models on each relay (free)
//   node gen.mjs --prompt "…" --out img.png --budget 0.10  one image per call (n=1)
//     [--model m] [--size 1024x1024] [--quality low|medium|high] [--transparent] [--ref a.png --ref b.png]
//     [--prompt-file f.txt] [--primary-only] [--force]
//   node gen.mjs --probe --budget 0.10                     one low-quality test image
// Credentials: OPENAI_BASE_URL / OPENAI_API_KEY (+ _2 … _4 as fallbacks) from the first env file found:
//   $IMAGE_GEN_ENV, ~/.config/image-gen/.env, or "envFile" in ../config.json. The key is never printed or logged.
// Prices per request come from ../config.json. A relay is skipped when its price would push the estimated
// spend over --budget (failed requests count: relays may bill them). Every request sent is appended to
// ~/.config/image-gen/requests.jsonl.
import {readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(os.homedir(), '.config/image-gen');
const die = (msg) => {
  console.error(`image-gen: ${msg}`);
  process.exit(1);
};
const readJson = (file, fallback) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
};
const cfg = readJson(path.join(HERE, '../config.json'), {});
const PRICE = cfg.price ?? {};
const priceOf = (host) => Number(PRICE[host] ?? PRICE['*'] ?? 0);

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const val = (n) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : undefined;
};
const vals = (n) => argv.flatMap((a, i) => (a === n ? [argv[i + 1]] : []));

const envFile = [process.env.IMAGE_GEN_ENV, path.join(LOG_DIR, '.env'), cfg.envFile].filter(Boolean).find((f) => existsSync(f));
if (!envFile) die('no credentials file: set IMAGE_GEN_ENV, create ~/.config/image-gen/.env, or set "envFile" in config.json');
const env = Object.fromEntries(
  readFileSync(envFile, 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^(['"])(.*)\1$/, '$2')]),
);
const RELAYS = [['OPENAI_BASE_URL', 'OPENAI_API_KEY'], ...[2, 3, 4].map((i) => [`OPENAI_BASE_URL_${i}`, `OPENAI_API_KEY_${i}`])]
  .filter(([b, k]) => env[b] && env[k])
  .map(([b, k]) => ({base: env[b].replace(/\/+$/, ''), key: env[k], host: new URL(env[b]).host}))
  .slice(0, flag('--primary-only') ? 1 : undefined);
if (!RELAYS.length) die(`OPENAI_BASE_URL / OPENAI_API_KEY missing in ${envFile}`);

if (flag('--models')) {
  for (const r of RELAYS) {
    try {
      const res = await fetch(`${r.base}/models`, {headers: {Authorization: `Bearer ${r.key}`}});
      const j = await res.json().catch(() => null);
      const ids = (j?.data ?? []).map((m) => m.id).filter((id) => /image/i.test(id));
      console.log(`${r.host}  HTTP ${res.status}  $${priceOf(r.host)}/request  image models: ${ids.join(', ') || '(none listed)'}`);
    } catch (e) {
      console.log(`${r.host}  unreachable: ${e.cause?.code ?? e.message}`);
    }
  }
  process.exit(0);
}

const probe = flag('--probe');
const prompt = probe
  ? 'A single small yellow five-pointed star sticker with a thick black outline, centered on a plain white background.'
  : (val('--prompt') ?? (val('--prompt-file') ? readFileSync(val('--prompt-file'), 'utf8').trim() : undefined));
const out = probe ? path.join(LOG_DIR, 'probe.png') : val('--out');
if (!prompt || !out) die('usage: gen.mjs --prompt "…" --out file.png --budget <usd> [--model m] [--size WxH] [--quality q] [--transparent] [--ref f]… | --models | --probe');
const budget = Number(val('--budget'));
if (!Number.isFinite(budget) || budget <= 0) die('--budget <usd> is required: the user must approve a budget before any paid call');
const outPath = path.resolve(out);
if (existsSync(outPath) && !flag('--force')) die(`${outPath} exists (use --force to overwrite)`);

const model = val('--model') ?? cfg.defaultModel ?? 'gpt-image-2.5-sunburst';
const size = probe ? '1024x1024' : (val('--size') ?? '1024x1024');
const quality = probe ? 'low' : (val('--quality') ?? 'high');
const refs = vals('--ref');
const common = {model, prompt, n: '1', size, quality, output_format: 'png', ...(flag('--transparent') ? {background: 'transparent'} : {})};

let spent = 0;
let sent = 0;
const log = (row) => {
  sent++;
  spent += priceOf(row.relay);
  mkdirSync(LOG_DIR, {recursive: true});
  appendFileSync(path.join(LOG_DIR, 'requests.jsonl'), JSON.stringify({date: new Date().toISOString(), model, cwd: process.cwd(), ...row}) + '\n');
};

/** POST to each relay in turn until one answers with something other than 404/429/5xx, within the budget */
async function post(route, makeInit) {
  let last = 'no relay fits the budget';
  for (const r of RELAYS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (spent + priceOf(r.host) > budget) {
        console.warn(`  skip ${r.host}: $${priceOf(r.host)}/request would exceed budget $${budget} (est. spent $${spent.toFixed(2)})`);
        break;
      }
      try {
        const init = makeInit();
        const res = await fetch(`${r.base}${route}`, {...init, headers: {...init.headers, Authorization: `Bearer ${r.key}`}});
        if (res.status === 429 || res.status >= 500 || res.status === 404) {
          last = `${r.host}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`;
          log({relay: r.host, status: res.status});
          console.warn(`  ${last} → next relay`);
          break;
        }
        return {res, host: r.host};
      } catch (e) {
        last = `${r.host}: ${e.cause?.code ?? e.message}`;
        log({relay: r.host, status: 'network', error: last});
        if (attempt === 0) {
          console.warn(`  ${last} → retrying once`);
          await new Promise((ok) => setTimeout(ok, 3000));
        } else console.warn(`  ${last} → next relay`);
      }
    }
  }
  die(`no relay succeeded; last: ${last}`);
}

const mime = (f) => (f.endsWith('.png') ? 'image/png' : f.endsWith('.webp') ? 'image/webp' : 'image/jpeg');
const {res, host} = refs.length
  ? await post('/images/edits', () => {
      const fd = new FormData();
      for (const [k, v] of Object.entries(common)) fd.append(k, v);
      for (const r of refs) fd.append('image[]', new Blob([readFileSync(path.resolve(r))], {type: mime(r)}), path.basename(r));
      return {method: 'POST', headers: {}, body: fd};
    })
  : await post('/images/generations', () => ({method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...common, n: 1})}));

const text = await res.text();
let json = null;
try {
  json = JSON.parse(text);
} catch {}
log({relay: host, status: res.status, images: json?.data?.length ?? 0, usage: json?.usage ?? null, out: outPath});
if (!res.ok || !json) die(`HTTP ${res.status} from ${host}: ${text.slice(0, 400)}`);
const d = json.data?.[0];
if (!d) die(`no image in response from ${host}`);
mkdirSync(path.dirname(outPath), {recursive: true});
if (d.b64_json) writeFileSync(outPath, Buffer.from(d.b64_json, 'base64'));
else if (d.url) writeFileSync(outPath, Buffer.from(await (await fetch(d.url)).arrayBuffer()));
else die(`response from ${host} has neither b64_json nor url`);
console.log(`saved ${outPath} · ${model} via ${host} · requests sent: ${sent}${Object.keys(PRICE).length ? ` · est. $${spent.toFixed(2)}` : ''}${json.usage ? ` · tokens ${JSON.stringify(json.usage)}` : ''}`);
