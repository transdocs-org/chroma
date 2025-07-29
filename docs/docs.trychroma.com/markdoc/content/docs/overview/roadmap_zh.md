# 路线图

本文档的目标是协调项目的 *核心团队* 和 *社区* 的努力方向，并分享我们今年的计划！

## 核心 Chroma 团队目前正在做什么？

- 扩展 [Chroma Cloud](https://trychroma.com/signup) 的搜索和检索能力。[通过邮件分享你的反馈和想法](mailto:support@trychroma.com)。

## Chroma 团队最近完成了哪些工作？

包括以下特性：
- *新增* - [Chroma 1.0.0](https://trychroma.com/project/1.0.0) - 用 Rust 完全重写了 Chroma，为用户带来最高达 4 倍的性能提升。
- 重写了我们的 [JS/TS 客户端](https://www.youtube.com/watch?v=Hq3Rk84eGiY)，拥有更好的开发体验（DX）以及许多使用体验上的改进。
- 服务端支持 [持久化集合配置](https://www.youtube.com/watch?v=zQg5peYd7b0)，解锁了许多新功能。例如，你不再需要在每次调用 `get_collection` 时提供自己的嵌入函数。
- 全新的 [Chroma CLI](https://www.youtube.com/watch?v=lHassGpmvK8)，让你可以本地浏览集合、管理 Chroma Cloud 数据库等！

## 未来6个月内 Chroma 将优先发展哪些方向？

**下一个里程碑： ☁️ 推出 Chroma Cloud**

**我们将重点投入的领域**

以下并非详尽列表，但这些是我们核心团队未来几个月最重要的优先事项。在参与这些领域开发时请格外小心，建议先与核心团队沟通确认。

- **工作流**：构建用于回答以下问题的工具：我应该使用哪种嵌入模型？我应该如何对文档进行分块？
- **可视化**：构建可视化工具，帮助开发者更好地理解嵌入空间
- **查询规划器**：构建支持单次查询和查询后转换的工具
- **开发者体验**：为我们的命令行工具（CLI）添加更多功能
- **更便捷的数据共享**：研究用于序列化以及更方便共享嵌入集合（embedding Collections）的格式
- **提升召回率**：通过人工反馈微调嵌入转换
- **分析能力**：聚类、去重、分类等功能的进一步优化

## 哪些领域适合社区贡献？

这些领域你可以更自由地参与贡献（无需事先与我们协调）！

如果你对自己的贡献想法还不确定，欢迎在 [我们的 Discord 频道](https://discord.gg/rahcMUU5XV) 的 `#general` 频道中与我们（@chroma）交流！我们将尽最大努力提供支持。

### 示例模板

我们始终欢迎更多与AI生态系统其余部分的[集成](../../integrations/chroma-integrations)。如果你正在开发某个集成并且需要帮助，请随时告诉我们！

以下是 Chroma 的其他良好起点：
- [Google Colab 示例](https://colab.research.google.com/drive/1QEzFyqnoFxq7LUGyP1vzR4iLt9PpCDXv?usp=sharing)

对于我们已经提供的集成（如 LangChain 和 LlamaIndex），我们也始终欢迎更多的教程、演示、研讨会、视频和播客内容。我们也已经在[我们的博客](https://trychroma.com/interviews)上发布了一些播客访谈。

### 示例数据集

开发者反复使用相同的嵌入模型对相同的信息进行嵌入是没有效率的。

我们希望收到以下规模的建议数据集，以便人们在各种场景下对 Chroma 进行压力测试：

- “小型”（<100 行）
- “中型”（<5MB）
- “大型”（>1GB）

### 嵌入模型对比

Chroma 默认使用 Sentence Transformers 进行嵌入，但我们不对用户使用的嵌入模型做具体限制。如果有一个由多种模型嵌入后形成的数据集合，并配套相应的查询示例集，就可以更方便地在不同领域中对各种模型的效果进行实证研究。

- [关于嵌入的初步阅读材料](https://towardsdatascience.com/neural-network-embeddings-explained-4d028e6f0526?gi=ee46baab0d8f)
- [Huggingface 的多个嵌入模型基准测试](https://huggingface.co/blog/mteb)
- [GPT3 嵌入模型的显著问题](https://twitter.com/Nils_Reimers/status/1487014195568775173)以及可替代方案

### 实验性算法

如果你有研究背景，我们欢迎你在以下领域做出贡献：

- 投影算法（t-sne、UMAP、新出现的热门算法、你自己开发的算法）和轻量级可视化  
- 聚类（HDBSCAN、PCA）  
- 去重  
- 多模态（CLIP）  
- 基于人类反馈的流形微调 [示例](https://github.com/openai/openai-cookbook/blob/main/examples/Customizing_embeddings.ipynb)  
- 扩展向量搜索（MMR、Polytope）  
- 你的研究成果  

在项目开展之前，请先[联系我们](https://discord.gg/MMeYNTmh3x)，以便我们提供技术指导并协调路线图。