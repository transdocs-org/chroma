---
id: cloudflare-workers-ai
name: Cloudflare Workers AI
---

# Cloudflare Workers AI

Chroma 提供了对 Cloudflare Workers AI 嵌入模型的封装。该嵌入函数会在远程的 Cloudflare Workers AI 服务器上运行，因此需要 API 密钥和 Cloudflare 账户。你可以在 [Cloudflare Workers AI 文档](https://developers.cloudflare.com/workers-ai/) 中找到更多信息。

你也可以选择使用 Cloudflare AI 网关来实现更定制化的解决方案，只需设置 `gateway_id` 参数。更多信息请参考 [Cloudflare AI 网关文档](https://developers.cloudflare.com/ai-gateway/providers/workersai/)。

{% TabbedCodeBlock %}

{% Tab label="python" %}

```python
from chromadb.utils.embedding_functions import CloudflareWorkersAIEmbeddingFunction

os.environ["CHROMA_CLOUDFLARE_API_KEY"] = "<INSERT API KEY HERE>"

ef = CloudflareWorkersAIEmbeddingFunction(
                account_id="<INSERT ACCOUNTID HERE>",
                model_name="@cf/baai/bge-m3",
            )
ef(input=["This is my first text to embed", "This is my second document"])
```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
// npm install @chroma-core/cloudflare-worker-ai

import { CloudflareWorkersAIEmbeddingFunction } from '@chroma-core/cloudflare-worker-ai';

process.env.CLOUDFLARE_API_KEY = "<INSERT API KEY HERE>"

const embedder = new CloudflareWorkersAIEmbeddingFunction({
    account_id="<INSERT ACCOUNT ID HERE>",
    model_name="@cf/baai/bge-m3",
});

// use directly
embedder.generate(['This is my first text to embed', 'This is my second document']);
```

{% /Tab %}

{% /TabbedCodeBlock %}

你必须向嵌入函数传入 `account_id` 和 `model_name` 参数。建议通过设置 `CHROMA_CLOUDFLARE_API_KEY` 来提供 API 密钥，但嵌入函数也支持通过可选的 `api_key` 参数传入 API 密钥。