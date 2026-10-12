# design-skills

Claude Code 的两个设计类 skill，来自一次产品官网改版的实战总结。

| Skill | 用途 |
| --- | --- |
| [`website-design`](skills/website-design/SKILL.md) | 官网 / 落地页从出图稿到上线的完整流程：先出图稿确认、统一页面系统、Next.js + Tailwind + Motion + Magic UI 实现、i18n 与无障碍 / e2e 验证。附 UI 参考站清单。 |
| [`image-gen`](skills/image-gen/SKILL.md) | 通过 OpenAI 兼容中转调用 GPT Image 模型出图，无依赖 Node 脚本，带预算上限与请求日志。`website-design` 用它出图稿。 |

## 安装

```bash
git clone https://github.com/WithZeng/design-skills.git ~/Documents/design-skills
ln -s ~/Documents/design-skills/skills/website-design ~/.claude/skills/website-design
ln -s ~/Documents/design-skills/skills/image-gen ~/.claude/skills/image-gen
```

## 配置 image-gen

1. 复制 `skills/image-gen/config.example.json` 为 `config.json`（已被 gitignore），填入中转站域名与每次请求的价格。
2. 凭据放在 `~/.config/image-gen/` 下的环境变量文件，或用 `IMAGE_GEN_ENV` 指向自己的文件，变量为 `OPENAI_BASE_URL` / `OPENAI_API_KEY`（备用 `_2` … `_4`）。凭据不要放进本仓库。
3. 免费检查可用模型：`node skills/image-gen/scripts/gen.mjs --models`。

每次出图都会花钱：花费上限取 `--budget`，不传时取 `config.json` 的 `defaultBudget`；所有请求记录在 `~/.config/image-gen/requests.jsonl`。
