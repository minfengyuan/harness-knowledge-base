---
name: photo-illustration-styles
description: Transform an uploaded or local photograph into one of seven curated illustration styles with built-in image generation while preserving the source subjects, counts, poses, spatial relationships, and recognizable features. Use when the user asks to turn a photo into a minimal paper hand-drawn, acrylic hand-painted, minimal abstract poetic, naive whimsical hand-drawn, flat picture-book, minimal geometric deconstruction, or handcrafted origami illustration, or asks Codex to choose a fitting illustration style automatically.
---

# 照片插画风格转换

把照片作为唯一内容来源，生成一张独立插画成品。默认直接生成图片，不先停下来确认提示词。

## 默认规则

- 输出纯插画，不嵌入原照片，不制作上下拼版。仅在用户明确要求时改变版式。
- 保留主体类别与数量、人物或动物的关键特征、姿态、动作、朝向、遮挡和相对位置。只删减细节，不虚构主体、道具或场景。
- 默认沿用原照片方向与宽高比。用户指定横版、竖版或方形时遵从用户要求。
- 默认不生成画面文字、Logo、水印或签名。用户明确要求文字时，逐字使用其文案；若未提供确切文案，先询问，不自行杜撰。
- 不把本技能的来源截图、示例界面或历史版式当作生成参考。

## 工作流

1. **检查输入照片。** 若照片仅以本地路径提供，先用 `view_image` 检查原图。识别主体、数量、关键外观、姿态、前后层级、空间关系、代表性环境、主色和宽高比，并形成不可改变项。
2. **选择一种风格。** 优先使用用户明确指定的中文名、英文名或常见别名。未指定时按下方规则自动匹配，并在生成前用一句话说明所选风格及原因；不要为风格选择阻塞用户。
3. **加载一份风格参考。** 只读取所选风格对应的参考文件，将其中的正向提示、构图、媒介、配色和负面约束与照片分析合并。
4. **组装生成提示词。** 使用下方结构，写清输入照片的角色和必须保留的内容。不要添加照片或用户请求中没有的创意元素。
5. **直接生成。** 使用内置 `image_gen` 工具执行 `style-transfer`。所有目标图都有本地路径时使用 `referenced_image_paths`；否则使用能覆盖目标附件的最小 `num_last_images_to_include`，最多包含五张最近图片。两者不得同时使用；若任一方式都无法包含全部目标照片，请用户重新附加缺失图片。
6. **检查结果。** 核对主体识别度、数量、姿态、空间关系、构图、色彩、媒介质感、文字规则和禁用项。若出现明显偏差，只做一次针对该偏差的定向迭代并再次检查。
7. **交付结果。** 展示最终图片，说明所用风格，并附上最终生成提示词。若用户指定项目保存位置，按非覆盖方式保存并报告路径。

## 自动匹配

让最强视觉信号决定风格；发生冲突时优先选择更能保留照片核心叙事与识别度的风格，仍无法判断时使用“极简纸感手绘”。

| 照片的主导特征 | 选择风格 | 参考文件 |
| --- | --- | --- |
| 单一人物、宠物、日常小物或轻松片段 | 极简拙趣手绘 / naive whimsical hand-drawn | [naive-whimsical-handdrawn.md](references/naive-whimsical-handdrawn.md) |
| 多主体、自然环境或完整叙事场景 | 平绘绘本 / flat picture-book | [flat-picture-book.md](references/flat-picture-book.md) |
| 主体轮廓清晰、原图色彩关系强，适合用不透明色块和刷痕概括 | 丙烯画手绘 / acrylic hand-painted | [acrylic-handpainted.md](references/acrylic-handpainted.md) |
| 重复、网格、排列、前后层级或结构关系突出 | 极简几何解构 / minimal geometric deconstruction | [minimal-geometric-deconstruction.md](references/minimal-geometric-deconstruction.md) |
| 地标、建筑、山水或适合折面分层的轮廓 | 手工折纸风 / handcrafted origami | [handcrafted-origami.md](references/handcrafted-origami.md) |
| 氛围、旅行记忆、方向与色彩关系重于具体轮廓 | 极简抽象诗意 / minimal abstract poetic | [minimal-abstract-poetic.md](references/minimal-abstract-poetic.md) |
| 艺术书封、小主体大留白或无法明确归类 | 极简纸感手绘 / minimal paper hand-drawn | [minimal-paper-handdrawn.md](references/minimal-paper-handdrawn.md) |

## 提示词结构

```text
Use case: style-transfer
Asset type: standalone illustration
Primary request: 将输入照片转换为“<所选风格>”的纯插画成品
Input image: 内容与构图的唯一来源；不是待嵌入成品的照片层
Subject and invariants: <主体、数量、识别特征、姿态、动作、朝向、遮挡与相对位置>
Scene/backdrop: <保留哪些环境线索、删减哪些非关键细节>
Style/medium: <所选风格参考中的正向提示与媒介规则>
Composition/framing: <原图方向与宽高比、主体比例、位置、留白和层级>
Color palette: <从原图提取的颜色与所选风格的限制>
Materials/textures: <纸张、颜料、印刷或折纸质感>
Text: none；仅在用户提供确切文案时改为逐字引用
Constraints: 照片是唯一内容来源；保留所有不可改变项；输出纯插画；不嵌入原照片；不添加无关元素、Logo、水印或签名
Avoid: <公共禁用项 + 所选风格的负面约束>
```

公共禁用项：写实摄影复刻、复杂细节堆砌、商业卡通感、电商感、模板感、光滑数字渲染、AI 式精致堆砌、无关装饰、虚构内容、Logo、水印和签名。

## 风格索引

- [极简纸感手绘](references/minimal-paper-handdrawn.md)
- [丙烯画手绘](references/acrylic-handpainted.md)
- [极简抽象诗意](references/minimal-abstract-poetic.md)
- [极简拙趣手绘](references/naive-whimsical-handdrawn.md)
- [平绘绘本](references/flat-picture-book.md)
- [极简几何解构](references/minimal-geometric-deconstruction.md)
- [手工折纸风](references/handcrafted-origami.md)
