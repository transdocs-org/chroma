---
id: ollama
name: Ollama
---

# Ollama

Chroma 提供了一个便捷的封装，用于 [Ollama](https://github.com/ollama/ollama) 的 [embeddings API](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-embeddings)。您可以使用 `OllamaEmbeddingFunction` 来为文档生成嵌入向量，同时可以选择自己喜欢的 [模型](https://github.com/ollama/ollama?tab=readme-ov-file#model-library)。

{% TabbedCodeBlock  %}

{% Tab label="python" %}

```python
from chromadb.utils.embedding_functions.ollama_embedding_function import (
    OllamaEmbeddingFunction,
)

ollama_ef = OllamaEmbeddingFunction(
    url="http://localhost:11434",
    model_name="llama2",
)

embeddings = ollama_ef(["This is my first text to embed",
                        "This is my second document"])
```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
// npm install @chroma-core/ollama

import { OllamaEmbeddingFunction } from "@chroma-core/ollama";
const embedder = new OllamaEmbeddingFunction({
    url: "http://127.0.0.1:11434/",
    model: "llama2"
})

// 直接使用
const embeddings = embedder.generate(["document1", "document2"])

// 传递文档用于 .add 和 .query
let collection = await client.createCollection({
    name: "name",
    embeddingFunction: embedder
})
collection = await client.getCollection({
    name: "name",
    embeddingFunction: embedder
})
```

{% /Tab %}

{% /TabbedCodeBlock %}