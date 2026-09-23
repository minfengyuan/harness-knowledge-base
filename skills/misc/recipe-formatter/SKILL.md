---
name: recipe-formatter
description: "将用户提供的菜谱文字或明确要求保存的菜谱整理为结构化 Obsidian 菜谱，自动分类并打标签。Use when the user wants recipe text formatted, normalized, tagged, or saved as a recipe note. Do not trigger merely because the user asks how to cook a dish unless they also want recipe-note formatting or saving."
---

# Recipe Formatter（菜谱格式化）

将用户提供的菜名或菜谱描述整理为标准格式，并在用户要求保存时写入 Obsidian vault。

## 依赖技能

- **obsidian-markdown** — 遵循 Obsidian Flavored Markdown 规范（frontmatter、标签、wikilinks 等）
- **obsidian-cli** — 使用 `obsidian` CLI 创建笔记

## 保存路径

菜谱保存到 Obsidian vault 路径：

`/Users/marvin/Library/Mobile Documents/iCloud~md~obsidian/Documents/DigitalGarden/02-Kitchen/`

对应 vault 内相对路径：`02-Kitchen/{菜名}.md`。

## 工作流程

1. 读取 `references/categories.md` 获取分类体系。
2. 根据输入判断烹饪方式和菜品类型，选取对应标签。
3. 按下方模板组装 Obsidian Flavored Markdown 内容。
4. 如果用户要求保存，使用 Obsidian CLI 创建笔记。
5. 如果目标文件已存在，先保留现有文件；只有用户明确要求更新或覆盖该菜谱时才使用覆盖选项。
6. 在聊天中返回格式化结果或摘要；执行保存时同时报告保存结果。

## 输出模板

```markdown
---
tags:
  - 菜谱
  - {烹饪方式标签}
  - {菜品类型标签}
created: {YYYY-MM-DD}
---

# {菜名}

## 准备食材

- **主料：**
  - {食材1} {用量}
  - {食材2} {用量}
- **辅料：**
  - {食材} {用量}
- **调料：**
  - {调料1} {用量}
  - {调料2} {用量}

## 制作步骤

1. **{小标题}：** {步骤描述}
2. **{小标题}：** {步骤描述}
3. ...
```

## 规则

- 标签从 `references/categories.md` 中选取，至少一个烹饪方式 + 一个菜品类型。
- frontmatter `tags` 始终包含 `菜谱` 基础标签，再加烹饪方式和菜品类型标签，不带 `#` 前缀。
- 用量尽量从用户输入保留；信息不足时可标“适量”。只有用户仅给菜名且明确要求补全菜谱时，才根据常见做法补全缺失食材和步骤。
- 用户给出详细描述时以提取和整理为主，不随意改变内容。
- 步骤用简洁动词开头。
- 创建新笔记时不要静默覆盖同名文件。覆盖属于单独的写入决策，必须来自用户明确要求。
