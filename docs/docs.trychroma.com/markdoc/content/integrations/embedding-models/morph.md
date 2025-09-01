---
name: Morph
id: morph
---

# Morph

Chroma 为 Morph 的嵌入 API 提供了一个便捷的封装。此嵌入函数在 Morph 的服务器上远程运行，并需要一个 API 密钥。您可以通过访问 [Morph](https://morphllm.com/?utm_source=docs.trychroma.com) 注册账户获取 API 密钥。

{% Tabs %}

{% Tab label="python" %}

此嵌入函数依赖于 `openai` Python 包，您可以通过 `pip install openai` 进行安装。

```python
import chromadb.utils.embedding_functions as embedding_functions
morph_ef = embedding_functions.MorphEmbeddingFunction(
    api_key="YOUR_API_KEY",  # 或设置 MORPH_API_KEY 环境变量
    model_name="morph-embedding-v2"
)
morph_ef(input=["def calculate_sum(a, b):\n    return a + b", "class User:\n    def __init__(self, name):\n        self.name = name"])
```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
// npm install @chroma-core/morph

import { MorphEmbeddingFunction } from '@chroma-core/morph';

const embedder = new MorphEmbeddingFunction({
    api_key: "apiKey",  // 或设置 MORPH_API_KEY 环境变量
    model_name: "morph-embedding-v2"
})

// 直接使用
const embeddings = embedder.generate(["function calculate(a, b) { return a + b; }", "class User { constructor(name) { this.name = name; } }"])

// 将文档传递给 .add 和 .query 方法
const collection = await client.createCollection({name: "name", embeddingFunction: embedder})
const collectionGet = await client.getCollection({name: "name", embeddingFunction: embedder})
```

{% /Tab %}

{% /Tabs %}

有关 Morph 模型的更多详情，请查看 [文档](https://docs.morphllm.com/api-reference/endpoint/embedding?utm_source=docs.trychroma.com)。