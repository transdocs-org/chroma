---
name: OpenAI
id: openai
---

# OpenAI

Chroma 为 OpenAI 的嵌入 API 提供了一个便捷的封装。此嵌入函数在 OpenAI 的服务器上远程运行，并需要一个 API 密钥。您可以通过访问 [OpenAI](https://openai.com/api/) 网站注册账户获取 API 密钥。

以下 OpenAI 嵌入模型受支持：

- `text-embedding-ada-002`
- `text-embedding-3-small`
- `text-embedding-3-large`

{% Banner type="tip" %}
如需更多信息，请访问 OpenAI 嵌入[文档](https://platform.openai.com/docs/guides/embeddings)。
{% /Banner %}

{% Tabs %}

{% Tab label="python" %}

此嵌入函数依赖于 `openai` Python 包，您可以通过 `pip install openai` 安装它。

您可以传入一个可选的 `model_name` 参数，以选择使用哪个 OpenAI 嵌入模型。默认情况下，Chroma 使用 `text-embedding-ada-002`。

```python
import chromadb.utils.embedding_functions as embedding_functions
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
                api_key="YOUR_API_KEY",
                model_name="text-embedding-3-small"
            )
```

若要在 Azure 等其他平台上使用 OpenAI 嵌入模型，您可以使用 `api_base` 和 `api_type` 参数：

```python
import chromadb.utils.embedding_functions as embedding_functions
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
                api_key="YOUR_API_KEY",
                api_base="YOUR_API_BASE_PATH",
                api_type="azure",
                api_version="YOUR_API_VERSION",
                model_name="text-embedding-3-small"
            )
```

{% /Tab %}

{% Tab label="typescript" %}

您可以传入一个可选的 `model` 参数，以选择使用哪个 OpenAI 嵌入模型。默认情况下，Chroma 使用 `text-embedding-3-small`。

```typescript
// npm install @chroma-core/openai

import { OpenAIEmbeddingFunction } from '@chroma-core/openai';

const embeddingFunction = new OpenAIEmbeddingFunction({
    openai_api_key: "apiKey",
    openai_model: "text-embedding-3-small"
})

// 直接使用
const embeddings = embeddingFunction.generate(["document1","document2"])

// 传递文档用于 .add 和 .query
let collection = await client.createCollection({
    name: "name",
    embeddingFunction: embeddingFunction
})
collection = await client.getCollection({
    name: "name",
    embeddingFunction: embeddingFunction
})
```

{% /Tab %}

{% /Tabs %}