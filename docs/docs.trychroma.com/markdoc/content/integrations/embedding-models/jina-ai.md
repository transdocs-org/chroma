---
id: jina-ai
name: Jina AI
---

# JinaAI

Chroma 为 JinaAI 的嵌入 API 提供了一个便捷的封装。该嵌入函数在 JinaAI 的服务器上远程运行，需要提供一个 API 密钥。您可以通过访问 [JinaAI](https://jina.ai/embeddings/) 注册账户获取 API 密钥。

{% TabbedCodeBlock %}

{% Tab label="python" %}

```python
from chromadb.utils.embedding_functions import JinaEmbeddingFunction
jinaai_ef = JinaEmbeddingFunction(
                api_key="YOUR_API_KEY",
                model_name="jina-embeddings-v2-base-en",
            )
jinaai_ef(input=["This is my first text to embed", "This is my second document"])
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

// use directly
const embeddings = embedder.generate(['document1', 'document2']);

// pass documents to query for .add and .query
const collection = await client.createCollection({name: "name", embeddingFunction: embedder})
const collectionGet = await client.getCollection({name:"name", embeddingFunction: embedder})
```

{% /Tab %}

{% /TabbedCodeBlock %}

您可以选择性地传入 `model_name` 参数，以指定使用哪个 Jina 模型。默认情况下，Chroma 使用的是 `jina-embedding-v2-base-en`。

{% note type="tip" title="" %}

Jina 在嵌入函数中新增了以下属性：`task`、`late_chunking`、`truncate`、`dimensions`、`embedding_type` 和 `normalized`。有关支持这些属性的模型，请参考 [JinaAI](https://jina.ai/embeddings/)。

{% /note %}

### Late Chunking 示例

jina-embeddings-v3 支持 [Late Chunking](https://jina.ai/news/late-chunking-in-long-context-embedding-models/)，这是一种利用模型长上下文能力生成上下文分块嵌入的技术。在请求中包含 `late_chunking=True` 即可启用上下文分块表示。当设置为 `True` 时，Jina AI API 将会把输入字段中的所有句子进行拼接，然后作为单个字符串传入模型。模型内部会对这个长字符串进行嵌入处理，然后执行 late chunking，返回一个与输入列表大小匹配的嵌入列表。

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
    'Berlin is the capital and largest city of Germany.',
    'The city has a rich history dating back centuries.',
    'It was founded in the 13th century and has been a significant cultural and political center throughout European history.',
]

ids = [str(i+1) for i in range(len(documents))]

collection.add(ids=ids, documents=documents)

results = normal_collection.query(
    query_texts=["What is Berlin's population?", "When was Berlin founded?"],
    n_results=1,
)

print(results)
```
{% /Tab %}
{% /tabs %}

### Task 参数
`jina-embeddings-v3` 使用了 5 个针对不同嵌入用途的任务专用适配器进行训练。在请求中指定 `task` 参数可以优化您的下游应用效果：
- `retrieval.query`：用于检索任务中的用户查询或问题的编码。
- `retrieval.passage`：用于检索任务中对大型文档在索引阶段进行编码。
- `classification`：用于文本分类任务中的文本编码。
- `text-matching`：用于相似性匹配任务，例如衡量两个句子之间的相似性。
- `separation`：用于聚类或重新排序任务。