---
id: jina-ai
name: Jina AI
---

# JinaAI

Chroma 为 JinaAI 的嵌入 API 提供了一个便捷的封装。该嵌入功能在 JinaAI 的服务器上远程运行，并且需要一个 API 密钥。您可以通过在 [JinaAI](https://jina.ai/embeddings/) 注册账户来获取 API 密钥。

{% TabbedCodeBlock %}

{% Tab label="python" %}

```python
from chromadb.utils.embedding_functions import JinaEmbeddingFunction
jinaai_ef = JinaEmbeddingFunction(
                api_key="YOUR_API_KEY",
                model_name="jina-embeddings-v2-base-en",
            )
jinaai_ef(input=["这是我要嵌入的第一段文本", "这是我的第二个文档"])
```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
// npm install @chroma-core/jina

import { JinaEmbeddingFunction } from '@chroma-core/jina';

const embedder = new JinaEmbeddingFunction({
  jinaai_api_key: 'jina_****',
  model_name: 'jina-embeddings-v2-base-en',
});

// 直接使用
const embeddings = embedder.generate(['文档1', '文档2']);

// 传递文档以进行 .add 和 .query
const collection = await client.createCollection({name: "name", embeddingFunction: embedder})
const collectionGet = await client.getCollection({name:"name", embeddingFunction: embedder})
```

{% /Tab %}

{% /TabbedCodeBlock %}

您可以选择性地传入 `model_name` 参数，这使您可以选择使用哪个 Jina 模型。默认情况下，Chroma 使用的是 `jina-embedding-v2-base-en`。

{% note type="tip" title="" %}

Jina 在嵌入函数中新增了几个属性，包括 `task`、`late_chunking`、`truncate`、`dimensions`、`embedding_type` 和 `normalized`。有关哪些模型支持这些属性，请参阅 [JinaAI](https://jina.ai/embeddings/) 文档。

{% /note %}

### Late Chunking 示例

jina-embeddings-v3 支持 [Late Chunking](https://jina.ai/news/late-chunking-in-long-context-embedding-models/)，这是一种利用模型长上下文能力来生成上下文分块嵌入的技术。在请求中包含 `late_chunking=True` 以启用上下文分块表示。当设置为 true 时，Jina AI API 会将输入字段中的所有句子连接起来，并将它们作为一个字符串传递给模型。在内部，模型会对这个长字符串进行嵌入，然后执行 Late Chunking，返回一个与输入列表大小匹配的嵌入列表。

{% tabs group="code-lang" hideTabs=true %}
{% Tab label="python" %}

```python
from chromadb.utils.embedding_functions import JinaEmbeddingFunction
jinaai_ef = JinaEmbeddingFunction(
                api_key="YOUR_API_KEY",
                model_name="jina-embeddings-v3",
                late_chunking=True,
                task="text-matching",
            )

collection = client.create_collection(name="late_chunking", embedding_function=jinaai_ef)

documents = [
    'Berlin 是德国的首都和最大城市。',
    '这座城市拥有几个世纪以来丰富的历史。',
    '它成立于 13 世纪，并在欧洲历史上一直是重要的文化和政治中心。',
]

ids = [str(i+1) for i in range(len(documents))]

collection.add(ids=ids, documents=documents)

results = normal_collection.query(
    query_texts=["柏林的人口是多少?", "柏林是何时建立的?"],
    n_results=1,
)

print(results)
```
{% /Tab %}
{% /tabs %}

### Task 参数
`jina-embeddings-v3` 使用了 5 个针对不同任务的适配器进行训练，以适应不同的嵌入需求。在请求中包含 `task` 参数可以优化您的下游应用表现：
- `retrieval.query`：用于检索任务中对用户查询或问题进行编码。
- `retrieval.passage`：用于检索任务中索引时对大型文档进行编码。
- `classification`：用于文本分类任务中的文本编码。
- `text-matching`：用于相似性匹配任务，如测量两个句子之间的相似性。
- `separation`：用于聚类或重新排序任务。