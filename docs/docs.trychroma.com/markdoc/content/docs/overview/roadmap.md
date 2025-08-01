# 路线图

本文档的目标是协调 *核心团队* 和 *社区* 的努力方向，并分享今年即将推出的内容！

## 目前 Chroma 核心团队正在做什么？

- 扩展 [Chroma Cloud](https://trychroma.com/signup) 的搜索与检索能力。[发送反馈和想法给我们](mailto:support@trychroma.com)。

## Chroma 团队最近完成了哪些工作？

包括以下功能：
- *新增* - [Chroma 1.0.0](https://trychroma.com/project/1.0.0) - 使用 Rust 完全重写了 Chroma，使用户获得高达 4 倍的性能提升。
- 重写了我们的 [JS/TS 客户端](https://www.youtube.com/watch?v=Hq3Rk84eGiY)，提供更好的开发体验和诸多便利性改进。
- 在服务器端实现了 [持久化集合配置](https://www.youtube.com/watch?v=zQg5peYd7b0)，解锁了许多新功能。例如，现在你无需在每次调用 `get_collection` 时都提供 embedding 函数。
- 新的 [Chroma CLI](https://www.youtube.com/watch?v=lHassGpmvK8)，让你可以在本地浏览集合、管理 Chroma Cloud 数据库等！

## 接下来 6 个月内 Chroma 将优先推进哪些内容？

**下一个里程碑： ☁️ 发布 Chroma Cloud**

**我们将重点投入的方向**

以下并非详尽列表，但都是核心团队未来几个月的核心优先事项。如果你打算在这些领域进行贡献，请谨慎推进，并请先与核心团队沟通确认。

- **工作流**：构建工具以回答以下问题：我应该使用哪种 embedding 模型？我的文档应该如何分块？
- **可视化**：构建可视化工具，帮助开发者更直观地理解 embedding 空间
- **查询规划器**：构建工具以支持查询时和查询后的转换操作
- **开发体验**：为 CLI 添加更多功能
- **更简单的数据共享**：研究用于序列化和更便捷共享 embedding 集合的数据格式
- **提升召回率**：通过人工反馈微调 embedding 转换
- **分析能力**：聚类、去重、分类等功能

## 社区可以重点贡献的方向有哪些？

这些领域你可以更自由地进行贡献（无需事先与我们同步确认）！

如果你对某个贡献想法不确定，欢迎随时在 [我们的 Discord](https://discord.gg/rahcMUU5XV) 的 `#general` 频道中与我们（@chroma）交流！我们非常乐意为你提供支持。

### 示例模板

我们始终欢迎与 AI 生态系统其他部分的 [更多集成](../../integrations/chroma-integrations)。如果你正在开发某个集成并需要帮助，请随时告诉我们！

其他不错的 Chroma 入门点包括：
- [Google Colab](https://colab.research.google.com/drive/1QEzFyqnoFxq7LUGyP1vzR4iLt9PpCDXv?usp=sharing)

对于我们已有的集成，如 LangChain 和 LlamaIndex，我们始终欢迎更多教程、演示、工作坊、视频和播客（我们已经在 [博客](https://trychroma.com/interviews) 上发布了一些播客）。

### 示例数据集

开发者反复使用相同的 embedding 模型对相同的数据进行 embedding 是没有意义的。

我们欢迎你提出以下规模的数据集建议：

- "小型"（<100 行）
- "中型"（<5MB）
- "大型"（>1GB）

用于在不同场景下对 Chroma 进行压力测试。

### Embedding 模型对比

Chroma 默认使用 Sentence Transformers 进行 embedding，但我们不对你使用的 embedding 模型做限制。如果存在一个包含多种模型 embedding 的信息库，同时提供示例查询集，那么将能更方便地在不同领域对模型效果进行实证研究。

- [关于 Embedding 的初步阅读材料](https://towardsdatascience.com/neural-network-embeddings-explained-4d028e6f0526?gi=ee46baab0d8f)
- [Huggingface 的多种 Embedding 模型基准测试](https://huggingface.co/blog/mteb)
- [GPT3 Embedding 的显著问题](https://twitter.com/Nils_Reimers/status/1487014195568775173) 以及可替代的选项

### 实验性算法

如果你有研究背景，我们欢迎你在以下领域进行贡献：

- 投影（t-sne、UMAP、新潮的技术、你自己刚开发的）和轻量级可视化
- 聚类（HDBSCAN、PCA）
- 去重
- 多模态（CLIP）
- 通过人工反馈微调 manifold [例如](https://github.com/openai/openai-cookbook/blob/main/examples/Customizing_embeddings.ipynb)
- 扩展向量搜索（MMR、Polytope）
- 你的研究成果

在你的项目深入之前，请先 [联系我们](https://discord.gg/MMeYNTmh3x)，以便我们提供技术指导并协调路线图方向。