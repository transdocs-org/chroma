---
id: 'voyageai'
name: 'VoyageAI'
---

# VoyageAI

Chroma 同样为 VoyageAI 的嵌入接口提供了便捷的封装。该嵌入函数在 VoyageAI 的服务器上远程运行，因此需要 API 密钥。你可以通过访问 [VoyageAI](https://dash.voyageai.com/) 注册账户来获取 API 密钥。

{% Tabs %}
{% Tab label="python" %}

此嵌入函数依赖于 `voyageai` Python 包，你可以使用 `pip install voyageai` 进行安装。

```python
import chromadb.utils.embedding_functions as embedding_functions
voyageai_ef  = embedding_functions.VoyageAIEmbeddingFunction(api_key="YOUR_API_KEY",  model_name="voyage-3-large")
voyageai_ef(input=["document1","document2"])
```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
// npm install @chroma-core/voyageai

import { VoyageAIEmbeddingFunction } from '@chroma-core/voyageai';

const embedder = new VoyageAIEmbeddingFunction({
    apiKey: "apiKey", 
    modelName: "model_name"
})

// 直接使用
const embeddings = embedder.generate(["document1","document2"])

// 传递文档用于 .add 和 .query
const collection = await client.createCollection({name: "name", embeddingFunction: embedder})
const collectionGet = await client.getCollection({name: "name", embeddingFunction: embedder})
```

{% /Tab %}

{% /Tabs %}

### 多语言模型示例

{% TabbedCodeBlock %}

{% Tab label="python" %}

```python
voyageai_ef  = embedding_functions.VoyageAIEmbeddingFunction(
        api_key="YOUR_API_KEY",
        model_name="voyage-3-large")

multilingual_texts  = [ 'Hello from VoyageAI!', 'مرحباً من VoyageAI!!',
        'Hallo von VoyageAI!', 'Bonjour de VoyageAI!',
        '¡Hola desde VoyageAI!', 'Olá do VoyageAI!',
        'Ciao da VoyageAI!', '您好，来自 VoyageAI！',
        'कोहिअर से VoyageAI!'  ]

voyageai_ef(input=multilingual_texts)

```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
import { VoyageAIEmbeddingFunction } from 'chromadb';

const embedder = new VoyageAIEmbeddingFunction("apiKey", "voyage-3-large")

multilingual_texts  = [ 'Hello from VoyageAI!', 'مرحباً من VoyageAI!!',
        'Hallo von VoyageAI!', 'Bonjour de VoyageAI!',
        '¡Hola desde VoyageAI!', 'Olá do VoyageAI!',
        'Ciao da VoyageAI!', '您好，来自 VoyageAI！',
        'कोहिअर से VoyageAI!'  ]

const embeddings = embedder.generate(multilingual_texts)

```

{% /Tab %}

{% /TabbedCodeBlock %}

如需了解 VoyageAI 模型的更多细节，请查看 [文档](https://docs.voyageai.com/docs/introduction) 和 [博客](https://blog.voyageai.com/)。