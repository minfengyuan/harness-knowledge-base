---
name: recipe-formatter
description: "将菜谱或菜名文字整理为结构化菜谱，自动分类并打标签，保存到 Obsidian vault。Use when the user provides a dish name, recipe text, or cooking description and wants it formatted into a structured recipe with category tags. Triggers on: recipe formatting, 菜谱, 做法, 食谱, 怎么做, how to cook."
---

# Recipe Formatter（菜谱格式化）

将用户输入的菜名或菜谱描述整理为标准格式，并自动分类打标签，保存到 Obsidian vault。

## 依赖技能

- **obsidian-markdown** — 遵循 Obsidian Flavored Markdown 规范（frontmatter、标签、wikilinks 等）
- **obsidian-cli** — 使用 `obsidian` CLI 创建笔记

## 保存路径

菜谱保存到 Obsidian vault 路径：

```
/Users/marvin/Library/Mobile Documents/iCloud~md~obsidian/Documents/DigitalGarden/02-Kitchen/
```

对应 vault 内相对路径：`02-Kitchen/{菜名}.md`

## 工作流程

1. 读取 `references/categories.md` 获取完整分类体系
2. 根据输入判断烹饪方式和菜品类型，选取对应标签
3. 按下方模板组装 Obsidian Flavored Markdown 内容（含 frontmatter）
4. 使用 `obsidian-cli` 创建笔记：
   ```bash
   obsidian-cli create -v DigitalGarden -c '{完整 markdown 内容}' "02-Kitchen/{菜名}"
   ```
   - 文件已存在时加 `-o` 覆盖
5. 在聊天中回复格式化后的菜谱摘要，确认已保存

## 输出模板

遵循 obsidian-markdown 技能规范，使用 frontmatter properties 和 Obsidian 标签语法：

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

- 标签从 `references/categories.md` 中选取，至少一个烹饪方式 + 一个菜品类型
- frontmatter `tags` 始终包含 `菜谱` 基础标签，再加烹饪方式和菜品类型标签（不带 `#` 前缀）
- 用量尽量给出（克/毫升/个/适量），信息不足时标"适量"
- 步骤用简洁动词开头（热锅、下入、翻炒、焖煮…）
- 如果用户只给了菜名，根据常见做法补全食材和步骤
- 如果用户给了详细描述，提取并整理，不随意增删内容
- 文件已存在时加 `-o` 标志覆盖
