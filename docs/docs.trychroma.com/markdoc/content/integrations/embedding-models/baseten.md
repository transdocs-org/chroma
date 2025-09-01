---
name: Baseten
id: baseten
---

# Baseten

Baseten 是一个模型推理服务提供商，支持任何开源、微调或自定义模型（包括嵌入模型）的专用部署。Baseten 专注于使用 Baseten Embedding Inference（BEI）进行低延迟、高吞吐量的部署，BEI 是目前市场上嵌入模型最快的运行时。

Chroma 提供了与部署在 Baseten 上的任何兼容 OpenAI 的嵌入模型的便捷集成。每个使用 BEI 部署的嵌入模型都兼容 OpenAI SDK。

{% Banner type="tip" %}
可以从 Baseten 模型库中轻松开始使用嵌入模型，例如 [Mixedbread Embed Large](https://www.baseten.co/library/mixedbread-embed-large-v1/)。
{% /Banner %}

## 在 Chroma 中使用 Baseten 模型

此嵌入函数依赖于 `openai` Python 包，你可以通过 `pip install openai` 安装它。

你必须设置 `api_key` 和 `api_base`，并将 `api_base` 替换为你在 Baseten 账户中部署的模型的 URL。

```python
import os
import chromadb.utils.embedding_functions as embedding_functions

baseten_ef = embedding_functions.BasetenEmbeddingFunction(
                api_key=os.environ["BASETEN_API_KEY"],
                api_base="https://model-xxxxxxxx.api.baseten.co/environments/production/sync/v1",
            )

baseten_ef(input=["这是我要嵌入的第一段文本", "这是我的第二段文档"])
```