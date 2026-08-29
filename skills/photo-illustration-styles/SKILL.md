---
name: photo-illustration-styles
description: Transform an uploaded or local photograph into one of eight curated illustration styles with built-in image generation while preserving the source subjects, counts, poses, spatial relationships, and recognizable features. Support standalone illustrations or optional 3:4 vertical photo-and-illustration composites with user-selected text. Use when the user asks to turn a photo into a minimal paper hand-drawn, acrylic hand-painted, minimal abstract poetic, naive whimsical hand-drawn, flat picture-book, minimal geometric deconstruction, handcrafted origami, or asks Codex to recommend two or three fitting styles before generation.
---

# 照片插画风格转换

把照片作为唯一内容来源生成插画。用户未指定风格时，先推荐 2–3 个候选并等待选择；风格确定后，继续确认输出方式和文字设置，所有选择完成后再生成。

## 默认规则

- 风格确定后、生成前，同时确认是否拼接原图和是否添加文字。用户已经明确的选项不得重复询问，只询问缺失项。
- 不拼接时输出纯插画，并默认沿用原照片方向与宽高比；用户指定其他比例时遵从用户要求。
- 拼接时输出严格 3:4 的垂直构图，上下部分高度严格 1:1，各占画面 50%。
- 未指定风格时不得调用 `image_gen`、不得替用户选定风格，也不得直接转换照片。
- 保留主体类别与数量、人物或动物的关键特征、姿态、动作、朝向、遮挡和相对位置。只删减细节，不虚构主体、道具或场景。
- 不添加文字时禁止生成画面文字、Logo、水印或签名。用户提供确切文案时逐字使用；用户选择添加文字但未提供文案时，先推荐英文标题并等待选择。
- 不把本技能的来源截图、示例界面或历史版式当作生成参考。

## 工作流

1. **检查输入照片。** 若照片仅以本地路径提供，先用 `view_image` 检查原图。识别主体、数量、关键外观、姿态、前后层级、空间关系、代表性环境、主色和宽高比，并形成不可改变项。
2. **处理风格选择。** 优先识别用户明确指定的中文名、英文名或常见别名；已指定时直接进入下一步。未指定时按下方规则推荐适配度最高且视觉方向有差异的 2–3 个风格，说明每个候选的照片依据与预期效果，然后请用户选择。此时停止工作流，不加载完整风格参考，不组装最终提示词，也不调用 `image_gen`；用户选定后再从第 3 步继续。
3. **确认输出设置。** 风格确定后，使用下方格式在同一条消息中确认是否拼接原图和是否添加文字。用户此前已明确某项时保留其选择，只询问缺失项。若用户选择添加文字但未提供确切文案，推荐 2–3 个英文诗意标题并等待选择。所有输出设置确定前停止工作流，不调用 `image_gen`。
4. **加载一份风格参考。** 只读取用户已指定或已选定风格对应的参考文件，将其中的正向提示、构图、媒介、配色和负面约束与照片分析合并。
5. **组装生成提示词。** 使用下方结构，写清输入照片的角色、必须保留的内容、输出模式和选定文字。不要添加照片或用户请求中没有的创意元素。
6. **生成已选风格。** 仅在风格、拼接方式和文字内容全部确定后，使用内置 `image_gen` 工具执行 `style-transfer`。所有目标图都有本地路径时使用 `referenced_image_paths`；否则使用能覆盖目标附件的最小 `num_last_images_to_include`，最多包含五张最近图片。两者不得同时使用；若任一方式都无法包含全部目标照片，请用户重新附加缺失图片。
7. **检查结果。** 核对主体识别度、数量、姿态、空间关系、构图、色彩、媒介质感、文字规则和禁用项。拼接时额外检查整体 3:4、上下各占 50%、原图未被重绘或拉伸。若出现明显偏差，只做一次针对该偏差的定向迭代并再次检查。
8. **交付结果。** 展示最终图片，说明所用风格，并附上最终生成提示词。若用户指定项目保存位置，按非覆盖方式保存并报告路径。

## 风格推荐

根据照片的主导特征对风格进行匹配和排序。推荐 2–3 个候选，不直接确定最终风格；优先保留照片核心叙事与识别度，并避免候选之间只有细微差异。若一个风格明显最合适，把它列为首选，同时补充 1–2 个具有合理取舍的替代方向。

| 照片的主导特征 | 选择风格 | 参考文件 |
| --- | --- | --- |
| 单一人物、宠物、日常小物或轻松片段 | 极简拙趣手绘 / naive whimsical hand-drawn | [naive-whimsical-handdrawn.md](references/naive-whimsical-handdrawn.md) |
| 多主体、自然环境或完整叙事场景 | 平绘绘本 / flat picture-book | [flat-picture-book.md](references/flat-picture-book.md) |
| 主体轮廓清晰、原图色彩关系强，适合用不透明色块和刷痕概括 | 丙烯画手绘 / acrylic hand-painted | [acrylic-handpainted.md](references/acrylic-handpainted.md) |
| 地点、建筑、物件或生活场景具有明确主视觉和地方感，适合编辑旅行海报 | 极简扁平矢量 / minimal flat-vector | [minimal-flat-vector.md](references/minimal-flat-vector.md) |
| 重复、网格、排列、前后层级或结构关系突出 | 极简几何解构 / minimal geometric deconstruction | [minimal-geometric-deconstruction.md](references/minimal-geometric-deconstruction.md) |
| 地标、建筑、山水或适合折面分层的轮廓 | 手工折纸风 / handcrafted origami | [handcrafted-origami.md](references/handcrafted-origami.md) |
| 氛围、旅行记忆、方向与色彩关系重于具体轮廓 | 极简抽象诗意 / minimal abstract poetic | [minimal-abstract-poetic.md](references/minimal-abstract-poetic.md) |
| 艺术书封、小主体大留白或无法明确归类 | 极简纸感手绘 / minimal paper hand-drawn | [minimal-paper-handdrawn.md](references/minimal-paper-handdrawn.md) |

使用以下格式回复推荐结果，然后等待用户选择：

```text
根据这张照片，我推荐：
1. <风格名>（首选）— <与主体、构图、色彩或氛围相关的适配理由>；<预期视觉重点>
2. <风格名> — <适配理由>；<与首选不同的视觉取舍>
3. <可选风格名> — <仅在确有第三个合理方向时加入>

请选择其中一个风格名，我再确认拼接与文字设置。
```

## 拼接与文字确认

风格确定后，使用以下格式一次性确认尚未明确的选项：

```text
风格已确定：<风格名>。生成前请确认：
1. 是否拼接原图？
   - 不拼接：输出纯插画
   - 拼接：输出 3:4 竖版，上半原图、下半插画，上下各占 50%
2. 是否添加文字？
   - 不添加
   - 添加：我会先推荐 2–3 个英文诗意标题供你选择
```

选择拼接时遵守以下规则：

- 整体宽高比严格为 3:4，以水平中线分割；上下区域高度严格 1:1，各占画面 50%，每个区域的宽高比为 3:2。
- 上半部分忠实保留原照片，只允许以核心主体为中心进行等比缩放或必要的轻微裁切。禁止拉伸、重画、扩图、换景、添加滤镜或改变原有光线与颜色。
- 下半部分放所选风格插画，并在 3:2 区域内重新安排主体、留白和文字。
- 若裁切会移除任一关键主体或破坏核心空间关系，先说明问题并请用户确认，不得自行牺牲关键内容。

用户选择添加文字但未提供确切文案时，推荐 2–3 个每条 2–5 个英文单词的诗意标题。只依据照片可见内容与所选风格，不虚构地点、年份、事件或身份。使用以下格式并等待选择：

```text
请选择标题：
1. <English Title>
2. <English Title>
3. <可选的第三个标题>
```

用户直接提供文案时逐字使用并跳过标题推荐。文字只放在插画区域的留白中，不覆盖上半原图或关键主体。

## 提示词结构

```text
Use case: style-transfer
Asset type: <standalone illustration | 3:4 vertical photo-and-illustration composite>
Primary request: 将输入照片转换为“<所选风格>”的插画成品
Input image: <纯插画时作为内容与构图的唯一来源；拼接时同时作为上半原图和下半插画的内容来源>
Subject and invariants: <主体、数量、识别特征、姿态、动作、朝向、遮挡与相对位置>
Scene/backdrop: <保留哪些环境线索、删减哪些非关键细节>
Style/medium: <所选风格参考中的正向提示与媒介规则>
Composition/framing: <纯插画时使用确认的比例；拼接时严格 3:4 竖版、上下各占 50%、单区 3:2>
Color palette: <从原图提取的颜色与所选风格的限制>
Materials/textures: <纸张、颜料、印刷或折纸质感>
Text: <none | 用户直接提供或选定的确切英文标题及其在下半插画留白中的位置>
Composite rules: <不拼接时省略；拼接时要求上半原图只等比缩放或轻微裁切，禁止拉伸、重绘、扩图、换景或加滤镜>
Constraints: 照片是唯一内容来源；保留所有不可改变项；遵守已确认的拼接和文字选择；不添加无关元素、Logo、水印或签名
Avoid: <公共禁用项 + 所选风格的负面约束>
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
