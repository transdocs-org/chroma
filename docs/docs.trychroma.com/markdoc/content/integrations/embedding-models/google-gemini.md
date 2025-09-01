---
id: google-gemini
name: "Google Gemini"
---

# Google Gemini

Chroma 为 Google 的生成式 AI 嵌入 API 提供了一个便捷的封装。该嵌入函数在 Google 的服务器上远程运行，需要一个 API 密钥。

您可以在 [Google MakerSuite](https://makersuite.google.com/) 注册账号以获取 API 密钥。

{% Tabs %}

{% Tab label="python" %}

该嵌入函数依赖 `google-generativeai` Python 包，可通过 `pip install google-generativeai` 安装。
```python
# 导入
import chromadb.utils.embedding_functions as embedding_functions

# 直接使用
google_ef  = embedding_functions.GoogleGenerativeAiEmbeddingFunction(api_key="YOUR_API_KEY")
google_ef(["document1","document2"])

# 在 .add 和 .query 时传入文档
collection = client.create_collection(name="name", embedding_function=google_ef)
collection = client.get_collection(name="name", embedding_function=google_ef)
```
你可以查看一个更[完整的示例](https://github.com/chroma-core/chroma/tree/main/examples/gemini)，使用 Gemini 嵌入和语言模型对文档进行对话。

更多信息请访问[官方 Google Python 文档](https://ai.google.dev/tutorials/python_quickstart)。

{% /Tab %}

{% Tab label="typescript" %}
```typescript
// npm install @chroma-core/google-gemini

import { ChromaClient } from "chromadb";
import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";

const embedder = new GoogleGeminiEmbeddingFunction({
  apiKey: "<YOUR API KEY>",
});

// 直接使用
const embeddings = await embedder.generate(["document1", "document2"]);

// 将文档传递给 .add 和 .query
const collection = await client.createCollection({
  name: "name",
  embeddingFunction: embedder,
});
const collectionGet = await client.getCollection({
  name: "name",
  embeddingFunction: embedder,
});
```
你可以查看一个更 [完整的 Node 示例](https://github.com/chroma-core/chroma/blob/main/clients/js/examples/node/app.js)。

更多信息，请访问 [Google JS 官方文档](https://ai.google.dev/tutorials/node_quickstart)。

{% /Tab %}

{% /Tabs %}