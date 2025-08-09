---
id: google-gemini
name: "Google Gemini"
---

# Google Gemini

Chroma 为 Google 的生成式 AI 嵌入 API 提供了一个便捷的封装。该嵌入函数在 Google 的服务器上远程运行，需要一个 API 密钥。

您可以通过访问 [Google MakerSuite](https://makersuite.google.com/) 网站注册账号获取 API 密钥。

{% Tabs %}

{% Tab label="python" %}

此嵌入函数依赖于 `google-generativeai` Python 包，您可以通过 `pip install google-generativeai` 安装。

```python
# 导入
import chromadb.utils.embedding_functions as embedding_functions

# 直接使用
google_ef  = embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key="YOUR_API_KEY")
google_ef(["document1","document2"])

# 传递文档以用于 .add 和 .query 方法
collection = client.create_collection(name="name", embedding_function=google_ef)
collection = client.get_collection(name="name", embedding_function=google_ef)
```

您可以在 [完整示例](https://github.com/chroma-core/chroma/tree/main/examples/gemini) 中查看使用 Gemini 嵌入和语言模型进行文档对话的更多细节。

如需更多信息，请访问 [Google 官方 Python 文档](https://ai.google.dev/tutorials/python_quickstart)。

{% /Tab %}

{% Tab label="typescript" %}

```typescript
// npm install @chroma-core/google-gemini

import { ChromaClient } from "chromadb";
import { GoogleGenerativeAiEmbeddingFunction } from "@chroma-core/google-gemini";

const embedder = new GoogleGenerativeAiEmbeddingFunction({
  apiKey: "<YOUR API KEY>",
});

// 直接使用
const embeddings = await embedder.generate(["document1", "document2"]);

// 传递文档以用于 .add 和 .query 方法
const collection = await client.createCollection({
  name: "name",
  embeddingFunction: embedder,
});
const collectionGet = await client.getCollection({
  name: "name",
  embeddingFunction: embedder,
});
```

您可以查看 [Node 完整示例](https://github.com/chroma-core/chroma/blob/main/clients/js/examples/node/app.js) 了解更多详细信息。

如需更多信息，请访问 [Google 官方 JS 文档](https://ai.google.dev/tutorials/node_quickstart)。

{% /Tab %}

{% /Tabs %}