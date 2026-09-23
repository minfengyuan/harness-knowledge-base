---
name: photo-illustration-styles
description: Photo-to-illustration style transfer. Use when the user wants an uploaded photo transformed into a curated illustration style; recommend 2–3 suitable styles when none is specified.
---

# 照片插画风格转换

把照片作为内容来源生成插画。只对会改变最终成品且用户尚未明确的设置进行确认。

## 决策门

生成前需要确定三项：

1. **风格**：用户未指定时，基于照片推荐 2–3 个差异明显的候选并等待选择。
2. **输出方式**：是否拼接原图。用户未说明时，在风格确定后确认。
3. **文字**：是否添加文字。若选择添加但没有提供文案，推荐 2–3 个英文诗意标题并等待选择。

用户已经明确的选项不得重复询问。只要仍缺少上述会改变成品的必要决定，就不要调用图像生成；全部确定后直接生成，不增加额外确认轮次。

## 内容不变量

- 保留主体类别与数量、人物或动物的关键特征、姿态、动作、朝向、遮挡和相对位置。
- 只删减非关键细节，不虚构主体、道具、地点、年份、事件或身份。
- 不添加文字时禁止画面文字、Logo、水印或签名。
- 用户提供确切文案时逐字使用。
- 不把本技能的来源截图、示例界面或历史版式当作生成参考。

## 输出模式

### 纯插画

默认沿用原照片方向与宽高比；用户指定其他比例时遵从用户要求。

### 原图 + 插画拼接

- 整体严格 3:4 竖版，以水平中线分割，上下区域高度各 50%，单区为 3:2。
- 上半忠实保留原照片，只允许以核心主体为中心等比缩放或必要的轻微裁切。禁止拉伸、重画、扩图、换景、滤镜或改变原有光线与颜色。
- 下半为所选风格插画，在 3:2 区域内重新安排主体、留白和文字。
- 若必要裁切会移除关键主体或破坏核心空间关系，说明具体冲突并让用户选择是否继续。

## 工作流

1. **检查照片。** 识别主体、数量、关键外观、姿态、层级、空间关系、代表性环境、主色和宽高比，形成内容不变量。
2. **确定风格。** 已指定则直接采用；未指定则从风格索引中推荐适配度最高且视觉方向有差异的 2–3 个候选，并说明照片依据和视觉取舍。
3. **补齐输出决定。** 一次性确认仍缺失的拼接与文字设置；若需要标题，推荐 2–3 个 2–5 个英文单词的标题。
4. **加载一份风格参考。** 只读取已选风格对应的参考文件。
5. **组装生成提示。** 合并照片不变量、输出模式、风格参考和已确认文字；不添加用户或照片中没有的创意元素。
6. **生成。** 使用可用的图像生成工具完成风格转换，确保所有目标照片都作为输入。
7. **检查。** 核对主体识别度、数量、姿态、空间关系、构图、色彩、媒介质感、文字规则和禁用项。拼接时额外检查整体 3:4、上下各占 50%、原图未被重绘或拉伸。
8. **修正明显偏差。** 仅针对确认到的具体偏差做一次定向迭代，再次核对。
9. **交付。** 展示最终图片，并说明所用风格。只有用户要求时才附最终生成提示或保存到指定位置。

## 风格推荐

根据照片主导特征匹配风格。推荐 2–3 个候选，不直接替用户选定；如果一个风格明显更合适，可标为首选，同时给出合理替代方向。

| 照片的主导特征 | 选择风格 | 参考文件 |
| --- | --- | --- |
| 单一人物、宠物、日常小物或轻松片段；想要蜡笔、简笔画或稚拙粗线条 | 极简拙趣手绘 / naive whimsical hand-drawn | [naive-whimsical-handdrawn.md](references/naive-whimsical-handdrawn.md) |
| 多主体、自然环境或完整叙事场景；需要粗线条绘本与温暖生活记录感 | 平绘绘本 / flat picture-book | [flat-picture-book.md](references/flat-picture-book.md) |
| 主体轮廓清晰、原图色彩关系强，适合用不透明色块和刷痕概括 | 丙烯画手绘 / acrylic hand-painted | [acrylic-handpainted.md](references/acrylic-handpainted.md) |
| 地点、建筑、物件或生活场景具有明确主视觉和地方感，适合编辑旅行海报 | 极简扁平矢量 / minimal flat-vector | [minimal-flat-vector.md](references/minimal-flat-vector.md) |
| 重复、网格、排列、前后层级或结构关系突出 | 极简几何解构 / minimal geometric deconstruction | [minimal-geometric-deconstruction.md](references/minimal-geometric-deconstruction.md) |
| 地标、建筑、山水或适合折面分层的轮廓 | 手工折纸风 / handcrafted origami | [handcrafted-origami.md](references/handcrafted-origami.md) |
| 氛围、旅行记忆、方向与色彩关系重于具体轮廓 | 极简抽象诗意 / minimal abstract poetic | [minimal-abstract-poetic.md](references/minimal-abstract-poetic.md) |
| 艺术书封、小主体大留白或无法明确归类 | 极简纸感手绘 / minimal paper hand-drawn | [minimal-paper-handdrawn.md](references/minimal-paper-handdrawn.md) |
| 旅行地标适合缩成小型纪念章，偏好深色油墨、缺墨和版印颗粒 | 油墨印章图章 / ink stamp print | [ink-stamp-print.md](references/ink-stamp-print.md) |
| 场景可拆成主卡片、贴纸和少量纸片，偏好手帐或旅行纪念物语汇 | 手帐拼贴与旅行纪念贴纸 / journal collage sticker | [journal-collage-sticker.md](references/journal-collage-sticker.md) |
| 中国建筑、桥梁或水乡适合浓淡墨块、飞白和断续笔线 | 写意毛笔水墨 / expressive brush ink | [expressive-brush-ink.md](references/expressive-brush-ink.md) |
| 城市、桥梁或基础设施的方向与光线关系突出，适合轻盈平滑渐变 | 极简渐变插画 / minimal gradient | [minimal-gradient.md](references/minimal-gradient.md) |
| 山水、江南建筑或东方场景气质突出，适合柔和层叠的国风装饰性平面 | 极简国风山水 / minimal Chinese landscape | [minimal-chinese-landscape.md](references/minimal-chinese-landscape.md) |

常见别名：
- 粗线条绘本风 → 平绘绘本
- 蜡笔简笔画 → 极简拙趣手绘
- 像素化解构风 / 抽象矩形色块 / 复古几何版画 → 极简几何解构
- 现代主义海报 → 极简扁平矢量
- 手帐拼贴画 / 旅行纪念贴纸 → 手帐拼贴与旅行纪念贴纸

## 推荐回复格式

风格未指定时：

```text
根据这张照片，我推荐：
1. <风格名>（首选）— <照片依据>；<预期视觉重点>
2. <风格名> — <照片依据>；<与首选不同的视觉取舍>
3. <可选第三风格> — <仅在确有第三个合理方向时加入>

请选择一个风格；如果你还没有说明是否拼接原图或是否添加文字，我会一起确认这些缺失项。
```

需要标题时：

```text
请选择标题：
1. <English Title>
2. <English Title>
3. <可选第三标题>
```

标题只依据照片可见内容与所选风格，不虚构事实；文字只放在插画区域留白中，不覆盖关键主体。

## 生成提示结构

```text
Use case: style-transfer
Asset type: <standalone illustration | 3:4 vertical photo-and-illustration composite>
Primary request: 将输入照片转换为“<所选风格>”的插画成品
Input image: <内容与构图来源>
Subject and invariants: <主体、数量、识别特征、姿态、动作、朝向、遮挡与相对位置>
Scene/backdrop: <保留环境线索与可删减细节>
Style/medium: <所选风格参考中的正向提示与媒介规则>
Composition/framing: <确认的比例或拼接规则>
Color palette: <原图颜色关系 + 风格限制>
Materials/textures: <纸张、颜料、印刷或折纸质感>
Text: <none | 已确认的确切标题及位置>
Composite rules: <仅拼接时填写>
Constraints: 照片是内容来源；保留不变量；遵守已确认的拼接和文字选择；不添加无关元素、Logo、水印或签名
Avoid: <公共禁用项 + 所选风格负面约束>
```

公共禁用项：写实摄影复刻、复杂细节堆砌、商业卡通感、电商感、模板感、光滑数字渲染、AI 式精致堆砌、无关装饰、虚构内容、Logo、水印和签名。

## 风格索引

- [极简纸感手绘](references/minimal-paper-handdrawn.md)
- [丙烯画手绘](references/acrylic-handpainted.md)
- [极简抽象诗意](references/minimal-abstract-poetic.md)
- [极简拙趣手绘](references/naive-whimsical-handdrawn.md)
- [平绘绘本](references/flat-picture-book.md)
- [极简扁平矢量](references/minimal-flat-vector.md)
- [极简几何解构](references/minimal-geometric-deconstruction.md)
- [手工折纸风](references/handcrafted-origami.md)
- [油墨印章图章](references/ink-stamp-print.md)
- [手帐拼贴与旅行纪念贴纸](references/journal-collage-sticker.md)
- [写意毛笔水墨](references/expressive-brush-ink.md)
- [极简渐变插画](references/minimal-gradient.md)
- [极简国风山水](references/minimal-chinese-landscape.md)
