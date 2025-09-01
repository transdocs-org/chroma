---
id: 'voyageai'
name: 'VoyageAI'
---

# VoyageAI

Chroma 也为 VoyageAI 的嵌入 API 提供了一个便捷的封装。该嵌入函数在 VoyageAI 的服务器上远程运行，需要提供 API 密钥。您可以通过访问 [VoyageAI](https://dash.voyageai.com/) 网站注册账户获取 API 密钥。

{% Tabs %}
{% Tab label="python" %}

此嵌入函数依赖于 `voyageai` Python 包，您可以通过 `pip install voyageai` 命令安装。

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

// 传递文档用于 .add 和 .query 方法
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

如需了解更多关于 VoyageAI 模型的信息，请查阅 [文档](https://docs.voyageai.com/docs/introduction) 和 [博客](https://blog.voyageai.com/)。