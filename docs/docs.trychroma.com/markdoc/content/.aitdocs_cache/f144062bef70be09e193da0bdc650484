# 嵌入函数（Embedding Functions）

嵌入（Embeddings）是一种表示任何类型数据的方式，因此它们非常适合与各种 AI 工具和算法一起使用。它们可以表示文本、图像，以及即将支持的音频和视频。Chroma 的集合（collections）通过索引嵌入来实现对数据的高效相似性搜索。创建嵌入的方式有很多，既可以通过本地安装的库生成，也可以通过调用 API。

Chroma 为流行的嵌入服务提供者提供了轻量级封装，使你可以在应用中轻松使用它们。你可以在[创建](../collections/manage-collections) Chroma 集合时设置一个嵌入函数，它将在添加和查询数据时自动使用，或者你也可以直接调用它们。

|                                                                                          | Python | Typescript |
|------------------------------------------------------------------------------------------|--------|------------|
| [OpenAI](../../integrations/embedding-models/openai)                                     | ✓      | ✓          |
| [Google Generative AI](../../integrations/embedding-models/google-gemini)                | ✓      | ✓          |
| [Cohere](../../integrations/embedding-models/cohere)                                     | ✓      | ✓          |
| [Hugging Face](../../integrations/embedding-models/hugging-face)                         | ✓      | -          |
| [Instructor](../../integrations/embedding-models/instructor)                             | ✓      | -          |
| [Hugging Face Embedding Server](../../integrations/embedding-models/hugging-face-server) | ✓      | ✓          |
| [Jina AI](../../integrations/embedding-models/jina-ai)                                   | ✓      | ✓          |
| [Cloudflare Workers AI](../../integrations/embedding-models/cloudflare-workers-ai)    | ✓      | ✓          |
| [Together AI](../../integrations/embedding-models/together-ai)                        | ✓      | ✓          |
| [Mistral](../../integrations/embedding-models/mistral)                                | ✓      | ✓          |

我们欢迎社区贡献新的嵌入函数。

***

## 默认：all-MiniLM-L6-v2

Chroma 的默认嵌入函数使用 [Sentence Transformers](https://www.sbert.net/) 提供的 `all-MiniLM-L6-v2` 模型来生成嵌入向量。该嵌入模型可以创建用于多种任务的句子和文档嵌入。该嵌入函数在你的本地机器上运行，可能需要你下载模型文件（下载会自动进行）。

如果你在创建集合时没有指定嵌入函数，Chroma 会将其设置为 `DefaultEmbeddingFunction`：

{% Tabs %}

{% Tab label="python" %}
```python
collection = client.create_collection(name="my_collection")
```
{% /Tab %}

{% Tab label="typescript" %}
安装 `@chroma-core/default-embed` 包：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="npm" %}
```terminal
npm install @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="pnpm" %}
```terminal
pnpm add @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="yarn" %}
```terminal
yarn add @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="bun" %}
```terminal
bun add @chroma-core/default-embed
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

创建集合时不提供嵌入函数，它将自动使用 `DefaultEmbeddingFunction`：

```typescript
const collection = await client.createCollection({ name: "my-collection" });
```

{% /Tab %}

{% /Tabs %}

## 使用嵌入函数

嵌入函数可以链接到集合，并在调用 `add`、`update`、`upsert` 或 `query` 时自动使用。

{% Tabs %}

{% Tab label="python" %}
```python
# 设置你的 OPENAI_API_KEY 环境变量
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

collection = client.create_collection(
    name="my_collection",
    embedding_function=OpenAIEmbeddingFunction(
        model_name="text-embedding-3-small"
    )
)

# Chroma 会使用 OpenAIEmbeddingFunction 来嵌入你的文档
collection.add(
    ids=["id1", "id2"],
    documents=["doc1", "doc2"]
)
```
{% /Tab %}

{% Tab label="typescript" %}
安装 `@chroma-core/openai` 包：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="npm" %}
```terminal
npm install @chroma-core/openai
```
{% /Tab %}

{% Tab label="pnpm" %}
```terminal
pnpm add @chroma-core/openai
```
{% /Tab %}

{% Tab label="yarn" %}
```terminal
yarn add @chroma-core/openai
```
{% /Tab %}

{% Tab label="bun" %}
```terminal
bun add @chroma-core/openai
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

创建一个使用 `OpenAIEmbeddingFunction` 的集合：

```typescript
// 设置你的 OPENAI_API_KEY 环境变量
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

collection = await client.createCollection({
    name: "my_collection",
    embedding_function: new OpenAIEmbeddingFunction({
        model_name: "text-embedding-3-small"
    })
});

// Chroma 会使用 OpenAIEmbeddingFunction 来嵌入你的文档
await collection.add({
    ids: ["id1", "id2"],
    documents: ["doc1", "doc2"]
})
```
{% /Tab %}

{% /Tabs %}

你也可以直接使用嵌入函数，这在调试时非常方便。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

default_ef = DefaultEmbeddingFunction()
embeddings = default_ef(["foo"])
print(embeddings) # [[0.05035809800028801, 0.0626462921500206, -0.061827320605516434...]]

collection.query(query_embeddings=embeddings)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";

const defaultEF = new DefaultEmbeddingFunction();
const embeddings = await defaultEF.generate(["foo"]);
console.log(embeddings); // [[0.05035809800028801, 0.0626462921500206, -0.061827320605516434...]]

await collection.query({ queryEmbeddings: embeddings })
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 自定义嵌入函数

你可以创建自己的嵌入函数以在 Chroma 中使用，只需实现 `EmbeddingFunction` 接口即可。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
from chromadb import Documents, EmbeddingFunction, Embeddings

class MyEmbeddingFunction(EmbeddingFunction):
    def __call__(self, input: Documents) -> Embeddings:
        # 以某种方式嵌入文档
        return embeddings
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import { EmbeddingFunction } from  "chromadb";

class MyEmbeddingFunction implements EmbeddingFunction {
    private api_key: string;

    constructor(api_key: string) {
        this.api_key = api_key;
    }

    public async generate(texts: string[]): Promise<number[][]> {
        // 用 api_key 之类的方式将文本转换为嵌入向量
        return embeddings;
    }
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

我们欢迎任何贡献！如果你创建了一个对其他人可能有用的嵌入函数，请考虑[提交 Pull Request](https://github.com/chroma-core/chroma)。