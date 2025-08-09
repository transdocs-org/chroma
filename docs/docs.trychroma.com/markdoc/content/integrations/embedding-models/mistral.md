---
id: 'mistral'
name: 'Mistral'
---

# Mistral

Chroma 为 Mistral 的嵌入 API 提供了一个便捷的封装。此嵌入函数在 Mistral 的服务器上远程运行，并且需要一个 API 密钥。您可以通过访问 [Mistral](https://mistral.ai/) 网站注册账户获取 API 密钥。

{% Tabs %}
{% Tab label="python" %}

此嵌入函数依赖于 `mistralai` Python 包，您可以通过 `pip install mistralai` 命令进行安装。

```python
from chromadb.utils.embedding_functions import MistralEmbeddingFunction
import os

os.environ["MISTRAL_API_KEY"] = "************"
mistral_ef  = MistralEmbeddingFunction(model="mistral-embed")
mistral_ef(input=["document1","document2"])
```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
// npm install @chroma-core/mistral

import { MistralEmbeddingFunction } from '@chroma-core/mistral';

const embedder = new MistralEmbeddingFunction({
    apiKey: 'your-api-key', // 或者设置 MISTRAL_API_KEY 环境变量
    model: 'mistral-embed',
});
```

{% /Tab %}
{% /Tabs %}

您必须传入一个 `model` 参数，以选择要使用的 Mistral 嵌入模型。您可以在 Mistral 的文档中查看支持的嵌入类型和模型：[这里](https://docs.mistral.ai/capabilities/embeddings/overview/)