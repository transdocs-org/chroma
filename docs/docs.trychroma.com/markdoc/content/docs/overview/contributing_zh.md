# 贡献指南

我们欢迎所有形式的贡献，包括错误报告、修复 bug、改进文档、功能增强以及新想法。

## 入门指南

以下是一些有用的链接，帮助你开始为 Chroma 做出贡献：

- Chroma 的代码库托管在 [Github](https://github.com/chroma-core/chroma) 上。
- 问题跟踪使用 [Github Issues](https://github.com/chroma-core/chroma/issues)。如果你发现了问题，请在该页面报告，并确保填写正确的 [问题类型表单](https://github.com/chroma-core/chroma/issues/new/choose)。
- 如果你想在本地运行 Chroma，请参考 [开发指南](https://github.com/chroma-core/chroma/blob/main/DEVELOP.md)。
- 如果你想要贡献代码但不确定从哪里开始，可以搜索带有 [Good first issue](https://github.com/chroma-core/chroma/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 标签的问题，或者查看我们的 [路线图](https://docs.trychroma.com/roadmap)。
- Chroma 的文档（包括本页面！）也托管在 [Github](https://github.com/chroma-core/chroma/tree/main/docs) 上。如果你发现文档中有任何问题，请在文档对应的问题页面 [这里](https://github.com/chroma-core/chroma/issues) 提交反馈。

## 贡献代码和想法

### 拉取请求（Pull Requests）

如需向 Chroma 提交更改，请针对 Chroma 或文档提交一个 [拉取请求（Pull Request）](https://github.com/chroma-core/chroma/compare)。该请求将由 Chroma 团队审核，若通过审核，将合并到仓库中。我们会尽力及时审核拉取请求，但由于团队规模较小，请您耐心等待。如果您的更改提议与项目目标一致，我们将尽快将其整合。我们建议您在拉取请求的标题前加上表示更改类型的前缀标签。以下是可用的前缀：

```
ENH: 增强功能，新增功能
BUG: 修复 Bug
DOC: 文档的新增/更新
TST: 测试的新增/更新
BLD: 构建流程/脚本的更新
PERF: 性能优化
TYP: 类型注解
CLN: 代码清理
CHORE: 不修改源代码或测试文件的维护和其他任务
```

### CIPs

Chroma 增强提案（Chroma Improvement Proposals，简称 CIPs，发音为 "Chips"）是提出 Chroma 新功能或重大变更的方式。如果您计划对 Chroma 进行重大更改，请先提交一份 CIP，以便 Chroma 核心团队和社区可以讨论该提议并提供反馈。CIP 应提供该功能的简明技术规范以及其必要性的合理解释。CIP 应以拉取请求的形式提交至 [CIPs 文件夹](https://github.com/chroma-core/chroma/tree/main/docs/cip)。CIP 将由 Chroma 团队审核，若通过审核，则会合并到仓库中。如需了解更多关于撰写 CIP 的信息，请阅读 [指南](https://github.com/chroma-core/chroma/blob/main/docs/cip/CIP_Chroma_Improvment_Proposals.md)。对于诸如修复 Bug 或更新文档等小更改，不需要提交 CIP。

一个CIP（变更提案）首先处于“提议”（Proposed）状态，一旦Chroma团队对其进行审核并考虑实施，则会进入“审核中”（Under Review）状态。当CIP获得批准后，其状态将变为“已接受”（Accepted），随后即可开始实施。在实施完成后，CIP的状态将变为“已实施”（Implemented）。如果该CIP未被批准，则会进入“已拒绝”（Rejected）状态。如果CIP由作者主动撤回，则其状态将变为“已撤回”（Withdrawn）。

### Discord

如果你有一些尚不成熟的想法，想要与社区进行讨论，可以加入我们的 [Discord](https://discord.gg/MMeYNTmh3x)，并在 [#feature-ideas](https://discord.com/channels/1073293645303795742/1131592310786887700) 频道中与我们交流。我们始终欢迎与社区讨论新的想法和功能。