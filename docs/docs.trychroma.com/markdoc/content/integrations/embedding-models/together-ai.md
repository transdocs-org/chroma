---
id: together-ai
name: Together AI
---

# Together AI

Chroma 为 [Together AI](https://www.together.ai/) 的嵌入模型提供了一个封装。该嵌入函数将在远程运行于 Together AI 的服务器上，因此需要一个 API 密钥和一个 Together AI 账户。你可以在 [Together AI 嵌入文档](https://docs.together.ai/docs/embeddings-overview) 和 [支持的模型](https://docs.together.ai/docs/serverless-models#embedding-models) 中找到更多信息。

{% TabbedCodeBlock %}

{% Tab label="python" %}

```python
from chromadb.utils.embedding_functions import TogetherAIEmbeddingFunction

os.environ["CHROMA_TOGETHER_AI_API_KEY"] = "<在此插入API密钥>"

ef = TogetherAIEmbeddingFunction(
                model_name="togethercomputer/m2-bert-80M-32k-retrieval",
            )
ef(input=["这是我要嵌入的第一个文本", "这是我的第二个文档"])
```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
// npm install @chroma-core/together-ai

import { TogetherAIEmbeddingFunction } from '@chroma-core/together-ai';

process.env.TOGETHER_AI_API_KEY = "<在此插入API密钥>"

const embedder = new TogetherAIEmbeddingFunction({
    model_name: "togethercomputer/m2-bert-80M-32k-retrieval",
});

// 直接使用
embedder.generate(['这是我要嵌入的第一个文本', '这是我的第二个文档']);
```

{% /Tab %}

{% /TabbedCodeBlock %}

你必须将 `model_name` 传入嵌入函数。建议通过设置 `CHROMA_TOGETHER_AI_API_KEY` 环境变量来提供 API 密钥，但嵌入函数也支持直接通过 `api_key` 参数传入。