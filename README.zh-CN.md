# design-skills

[English](README.md) | **简体中文**

别让 Claude Code 一上来就瞎写前端代码。

平时让 AI 写页面，最头疼的就是：**它根本不知道自己写出来长什么样**。模块之间各玩各的、字号乱跳、配色一股廉价模板味，改两轮直接崩掉。

这套 skills 来自我们给真实产品官网和后台重构时沉淀的规则：**强迫 Claude 像正经设计师一样干活——先搜参考、用大模型出图给你挑方向、你点头了才准写代码，写完还要逐项验收。**

## 真实改版效果

官网首页实测改版前后对比。改版后首屏做成了一个可交互的动态窗口：输入研究课题、逐步执行、交付分析报告。

![官网改版前后对比](docs/showcase/website.gif)

## 包含哪些 Skill

| Skill | 用来干嘛 | 触发时机 |
| --- | --- | --- |
| [`website-design`](skills/website-design/SKILL.md) | 官网、Landing Page、后台界面的全流程设计与实现 | 「重新设计这个页面」「现在这个后台太丑了」「给工作台找点好参考」 |
| [`image-gen`](skills/image-gen/SKILL.md) | 走 OpenAI 兼容中转调用 GPT Image 出图，纯 Node 脚本零多余依赖 | 需要插画、图标、背景，或在设计流程中生成效果图供确认时 |

## 它是怎么干活的？

```mermaid
flowchart LR
  A[你的需求] --> B[搜参考截图<br/>+ 推荐布局方案]
  B --> C[生成 2-3 套方向效果图]
  C -->|你挑一套| D[细化局部效果图<br/>+ 交互状态分镜]
  D -->|你敲定| E[写代码<br/>挂预览路由]
  E --> F[逐项对照检查<br/>视觉 · 无障碍 · 响应式]
```

核心就一条硬性规矩：**图没敲定，不准动手写一行代码；代码写完，对不上效果图不准提交。**

### website-design 解决了哪些坑？

- **拒绝拼凑感**：强迫整页统一基准背景色、模块容器规范和层级字号，避免各模块像从五个不同模板拼出来的。
- **动效不瞎加**：动效和质感必须跟着业务交互走，优先用稳定的成熟动效库，坚决不加劣质浮夸动画。
- **交互有反馈**：按钮 hover、加载、空状态、移动端适配必须做全，直接对齐真实产品的组件交互标准。
- **踩坑实录**：内置了对比度合规、减少动效适配、移动端溢出、多语言文案，以及第三方登录页（如 Clerk）定制样式的避坑规则。

目录结构：

```
skills/
├── website-design/
│   ├── SKILL.md                 # 主流程、设计规范、选库标准
│   └── references/
│       ├── ui-references.md     # 参考站库、交互对照、截图检索方式
│       ├── draft-prompts.md     # 效果图生成提示词模板
│       ├── build-patterns.md    # 组件库选型、动效实现方案、登录页定制
│       └── verification.md      # 视觉还原、无障碍、响应式检查清单
└── image-gen/
    ├── SKILL.md
    ├── config.example.json
    └── scripts/gen.mjs
```

## 安装使用

建议用软链接安装，后续 `git pull` 更新直接生效：

```bash
git clone https://github.com/WithZeng/design-skills.git ~/Documents/design-skills
ln -s ~/Documents/design-skills/skills/website-design ~/.claude/skills/website-design
ln -s ~/Documents/design-skills/skills/image-gen ~/.claude/skills/image-gen
```

装好后，在 Claude Code 里直接说「帮我重新设计一下官网首页」即可触发。

## 配置出图工具 (image-gen)

1. 复制配置文件，填入你的中转站域名、默认模型、单次请求价格与默认预算 `defaultBudget`：

   ```bash
   cp skills/image-gen/config.example.json skills/image-gen/config.json
   ```

2. 配置 API Key（不要提交到 git）：在 `~/.config/image-gen/` 下放环境变量文件，或通过 `IMAGE_GEN_ENV` 指定路径，设置 `OPENAI_BASE_URL` 和 `OPENAI_API_KEY`（可加 `_2` … `_4` 作为备用中转，主中转失败时自动切换）。

3. 测试中转站可用模型：

   ```bash
   node skills/image-gen/scripts/gen.mjs --models
   ```

单次出图预算可通过 `--budget` 限制，未指定时走 `defaultBudget`；所有调用流水会自动记录在 `~/.config/image-gen/requests.jsonl` 便于对账。
