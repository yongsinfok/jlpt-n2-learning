# 数据文件说明

本目录用于存放项目的 CSV 数据文件。

## 所需文件

### notes.csv (必需)

例句数据文件，包含以下字段：

| 字段名 | 说明 | 示例 |
|--------|------|------|
| id | 例句唯一标识 | sentence_001 |
| lessonNumber | 课程号 | 1 |
| grammarPoint | 语法点 | 〜わけにはいかない |
| japanese | 日语例句 | 試験に合格するために、勉強しないわけにはいかない。 |
| chinese | 中文翻译 | 为了考试合格，必须学习。 |
| audioFile | 音频文件名 | sentence_001.mp3 |

### 示例格式

```csv
id,lessonNumber,grammarPoint,japanese,chinese,audioFile
sentence_001,1,〜わけにはいかない,試験に合格するために、勉強しないわけにはいかない。,为了考试合格，必须学习。,sentence_001.mp3
sentence_002,1,〜わけにはいかない,大切な会議なので、遅れるわけにはいかない。,因为是很重要的会议，不能迟到。,sentence_002.mp3
sentence_003,2,〜ざるを得ない,雨が降ってきたので、帰らざるを得ない。,下起雨来了，不得不回去。,sentence_003.mp3
```

## 注意事项

1. **文件编码**: 请使用 UTF-8 编码保存 CSV 文件
2. **音频文件**: 将音频文件放置在 `public/audio/` 目录下
3. **文件命名**: audioFile 字段中的文件名需要与实际音频文件名一致

## 音频文件

音频文件应放置在 `public/audio/` 目录下，支持以下格式：
- MP3 (推荐)
- M4A
- WAV
- OGG

## 数据导入

应用启动时会自动检测并导入 CSV 数据到 IndexedDB。如果数据文件不存在，应用会显示占位数据。
