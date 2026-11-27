// node --test skills/image-gen/scripts/gen.test.mjs  (local mock relay, no real requests)
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {mkdtempSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const GEN = fileURLToPath(new URL('./gen.mjs', import.meta.url));

test('a request whose response body is cut off is still logged', async (t) => {
  const server = http.createServer((req, res) => {
    res.writeHead(400, {'Content-Length': '100'});
    res.write('partial', () => res.destroy());
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const home = mkdtempSync(path.join(os.tmpdir(), 'image-gen-test-'));
  t.after(() => {
    server.close();
    rmSync(home, {recursive: true, force: true});
  });
  const creds = path.join(home, 'creds');
  writeFileSync(creds, `OPENAI_BASE_URL=http://127.0.0.1:${server.address().port}/v1\nOPENAI_API_KEY=test\n`);

  const args = [GEN, '--prompt', 'x', '--out', path.join(home, 'x.png'), '--model', 'm', '--budget', '100'];
  const code = await new Promise((ok) =>
    execFile(process.execPath, args, {env: {...process.env, HOME: home, IMAGE_GEN_ENV: creds}}, (e) => ok(e?.code ?? 0)),
  );

  assert.equal(code, 1);
  let rows = [];
  try {
    rows = readFileSync(path.join(home, '.config/image-gen/requests.jsonl'), 'utf8').trim().split('\n');
  } catch {}
  assert.equal(rows.length, 1, 'log every sent request in gen.mjs before exiting, or reruns undercount spend');
});
