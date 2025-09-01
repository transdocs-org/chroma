# 贡献指南

我们欢迎所有形式的贡献，包括问题报告、错误修复、文档改进、功能增强以及新想法。

## 开始贡献

以下是一些帮助你开始为 Chroma 做贡献的有用链接：

- Chroma 的代码库托管在 [Github](https://github.com/chroma-core/chroma) 上。
- 问题跟踪使用 [Github Issues](https://github.com/chroma-core/chroma/issues)。如果你发现了问题，请在该页面报告，并确保填写正确的 [问题类型表单](https://github.com/chroma-core/chroma/issues/new/choose)。
- 想要在本地运行 Chroma，请参考 [开发指南](https://github.com/chroma-core/chroma/blob/main/DEVELOP.md)。
- 如果你想贡献代码但不确定从哪里开始，可以搜索带有 [Good first issue](https://github.com/chroma-core/chroma/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 标签的问题，或者查看我们的 [路线图](https://docs.trychroma.com/roadmap)。
- Chroma 的文档（包括本页面！）也托管在 [Github](https://github.com/chroma-core/chroma/tree/main/docs) 上。如果你发现文档有问题，请在文档对应的问题页面 [这里](https://github.com/chroma-core/chroma/issues) 报告。

## 贡献代码和想法

### 拉取请求（Pull Requests）

如果你想向 Chroma 提交更改，请提交一个 [拉取请求](https://github.com/chroma-core/chroma/compare)，针对 Chroma 或文档。拉取请求将由 Chroma 团队审核，如果通过，将被合并到仓库中。我们会尽力及时审核拉取请求，但由于我们是一个小团队，请保持耐心。如果您的更改与项目目标一致，我们将尽快将其集成。我们要求您在拉取请求的标题前加上表示更改类型的前缀标签。以下是可用的前缀：

```
ENH: 功能增强或新增功能
BUG: 错误修复
DOC: 文档添加或更新
TST: 测试添加或更新
BLD: 构建流程或脚本更新
PERF: 性能优化
TYP: 类型注解
CLN: 代码清理
CHORE: 不修改源代码或测试文件的维护任务
```

### CIPs（Chroma 改进提案）

Chroma 改进提案（CIPs，发音为 "Chips"）是提出 Chroma 新功能或重大变更的方式。如果您计划对 Chroma 进行重大更改，请先提交一个 CIP，以便 Chroma 核心团队和社区讨论并提供反馈。CIP 应当提供功能的技术规范以及实现的理由。CIP 应作为拉取请求提交到 [CIPs 文件夹](https://github.com/chroma-core/chroma/tree/main/docs/cip)。Chroma 团队将审核该 CIP，如果通过，将合并到仓库中。如需了解更多关于编写 CIP 的内容，请阅读 [指南](https://github.com/chroma-core/chroma/blob/main/docs/cip/CIP_Chroma_Improvment_Proposals.md)。对于小的更改，如错误修复或文档更新，不需要提交 CIP。

一个 CIP 最初处于 "Proposed（提议）" 状态，一旦 Chroma 团队审核并考虑实现，状态将变为 "Under Review（审核中）"。当 CIP 被批准后，状态变为 "Accepted（已接受）"，并开始实施。实施完成后，状态变为 "Implemented（已实现）"。如果 CIP 未被批准，状态将变为 "Rejected（拒绝）"。如果 CIP 被作者撤销，状态将变为 "Withdrawn（撤回）"。

### Discord

对于尚未完全成型的想法，你可以加入我们的 [Discord](https://discord.gg/MMeYNTmh3x)，并在 [#feature-ideas](https://discord.com/channels/1073293645303795742/1131592310786887700) 频道中与我们交流。我们始终欢迎与社区讨论新想法和功能。