# 路线图

本文档的目标是协调项目中 *核心团队* 和 *社区* 的努力方向，并分享今年的计划！

## 核心 Chroma 团队目前在做什么？

- 为 [Chroma Cloud](https://trychroma.com/signup) 扩展搜索和检索能力。[通过邮件分享你的反馈和想法](mailto:support@trychroma.com)。

## Chroma 团队最近完成了哪些工作？

包括以下功能：
- *新增* - [Chroma 1.0.0](https://trychroma.com/project/1.0.0) - 用 Rust 完全重写了 Chroma，为用户带来最高达 x4 的性能提升。
- 重写了我们的 [JS/TS 客户端](https://www.youtube.com/watch?v=Hq3Rk84eGiY)，提供更好的开发体验和多项实用改进。
- 在服务端支持 [持久化集合配置](https://www.youtube.com/watch?v=zQg5peYd7b0)，解锁了许多新功能。例如，你不再需要在每次调用 `get_collection` 时提供嵌入函数。
- 新的 [Chroma CLI](https://www.youtube.com/watch?v=lHassGpmvK8)，让你可以在本地浏览集合，管理 Chroma Cloud 数据库等！

## Chroma 未来 6 个月的重点方向是什么？

**下一个里程碑： ☁️ 发布 Chroma Cloud**

**我们将重点投入的方向**

以下并非完整列表，但是一些核心团队在未来几个月内的主要优先事项。在这些领域进行贡献时请谨慎，建议先与核心团队沟通确认。

- **工作流程**：构建工具来解答一些问题，例如：我应该使用哪个嵌入模型？我应该如何对文档进行分块？
- **可视化**：构建可视化工具，帮助开发者更好地理解嵌入空间。
- **查询规划器**：构建工具以支持查询时和查询后的转换操作。
- **开发体验**：在 CLI 中添加更多功能。
- **更简单的数据共享**：开发用于序列化和共享嵌入集合的格式。
- **提升召回率**：通过人工反馈微调嵌入转换。
- **分析能力**：聚类、去重、分类等更多功能。

## 哪些领域适合社区贡献？

这些领域你可以更自由地贡献代码（无需事先与我们同步）！

如果你对某个贡献想法不确定，欢迎在 [我们的 Discord](https://discord.gg/rahcMUU5XV) 的 `#general` 频道中与我们（@chroma）交流！我们将很乐意为你提供支持。

### 示例模板

我们始终欢迎与 AI 生态系统中其他工具的 [更多集成](../../integrations/chroma-integrations)。如果你正在开发某个集成，请告诉我们并寻求帮助！

Chroma 的其他良好起点包括：
- [Google Colab](https://colab.research.google.com/drive/1QEzFyqnoFxq7LUGyP1vzR4iLt9PpCDXv?usp=sharing)

对于我们已经支持的集成（如 LangChain 和 LlamaIndex），我们始终欢迎更多教程、演示、研讨会、视频和播客内容（我们已经在 [博客](https://trychroma.com/interviews) 上发布了一些播客）。

### 示例数据集

开发者反复使用相同嵌入模型对相同信息进行嵌入是没有意义的。

我们希望收到以下规模的数据集建议：

- "小规模"（<100 行）
- "中等规模"（<5MB）
- "大规模"（>1GB）

这些数据集将帮助人们在各种场景下对 Chroma 进行压力测试。

### 嵌入对比

Chroma 默认使用 Sentence Transformers 进行嵌入，但我们对其它嵌入模型没有偏好。如果有一个信息库，其中的数据被多种模型嵌入过，并且还包含示例查询集，这将大大方便在不同领域对各种模型效果进行实证研究。

- [关于嵌入的初步阅读](https://towardsdatascience.com/neural-network-embeddings-explained-4d028e6f0526?gi=ee46baab0d8f)
- [Huggingface 对多种嵌入模型的基准测试](https://huggingface.co/blog/mteb)
- [GPT3 嵌入的一些显著问题](https://twitter.com/Nils_Reimers/status/1487014195568775173) 以及替代方案

### 实验性算法

如果你有研究背景，我们欢迎你在以下领域做出贡献：

- 投影（t-sne、UMAP、新方法、你刚实现的方法）和轻量级可视化
- 聚类（HDBSCAN、PCA）
- 去重
- 多模态（CLIP）
- 使用人工反馈微调流形 [示例](https://github.com/openai/openai-cookbook/blob/main/examples/Customizing_embeddings.ipynb)
- 扩展向量搜索（MMR、Polytope）
- 你的研究成果

请在项目进展前 [联系我们](https://discord.gg/MMeYNTmh3x)，以便我们能提供技术指导并与你协调路线图。