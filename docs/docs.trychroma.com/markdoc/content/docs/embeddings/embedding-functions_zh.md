# 嵌入函数

嵌入（Embeddings）是一种表示各种类型数据的方式，使其非常适合与各种人工智能工具和算法一起使用。它们可以表示文本、图像，未来还将支持音频和视频。Chroma 集合（collections）通过索引嵌入来实现对其所表示数据的高效相似性搜索。创建嵌入的方式有很多，既可以使用本地安装的库，也可以通过调用 API。

Chroma 为流行的嵌入提供程序提供了轻量级封装，使它们在你的应用程序中更易于使用。你可以在[创建](../collections/manage-collections) Chroma 集合时设置嵌入函数，以便在添加和查询数据时自动使用；当然，你也可以直接手动调用它们。

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

我们欢迎提交 Pull Request 来为社区添加新的嵌入（Embedding）函数。

***

## 默认：all-MiniLM-L6-v2

Chroma 的默认嵌入函数使用 [Sentence Transformers](https://www.sbert.net/) 的 `all-MiniLM-L6-v2` 模型来生成嵌入向量。该嵌入模型可以创建可用于各种任务的句子和文档嵌入向量。该嵌入函数在你的本地机器上运行，并且可能需要你下载模型文件（这会自动完成）。

如果你在创建集合（collection）时没有指定嵌入函数，Chroma 会将其设置为 `DefaultEmbeddingFunction`：

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

创建集合时不提供嵌入函数。它将自动使用 `DefaultEmbeddingFunction`：

```typescript
const collection = await client.createCollection({ name: "my-collection" });
```

{% /Tab %}

{% /Tabs %}

## 使用嵌入函数

你可以将嵌入函数链接到一个集合上，并在调用 `add`、`update`、`upsert` 或 `query` 时使用它。

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

# Chroma 将使用 OpenAIEmbeddingFunction 来嵌入你的文档
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

使用 `OpenAIEmbeddingFunction` 创建一个集合：

```typescript
// 设置你的 OPENAI_API_KEY 环境变量
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

collection = await client.createCollection({
    name: "my_collection",
    embedding_function: new OpenAIEmbeddingFunction({
        model_name: "text-embedding-3-small"
    })
});

// Chroma 将使用 OpenAIEmbeddingFunction 来嵌入你的文档
await collection.add({
    ids: ["id1", "id2"],
    documents: ["doc1", "doc2"]
})
```
{% /Tab %}

{% /Tabs %}

你也可以直接使用嵌入函数，这对于调试非常方便。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

```python
default_ef = DefaultEmbeddingFunction()
embeddings = default_ef(["foo"])
print(embeddings) # [[0.05035809800028801, 0.0626462921500206, -0.061827320605516434...]]

collection.query(query_embeddings=embeddings)
```

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

您可以创建自己的嵌入函数与 Chroma 一起使用；只需要实现 `EmbeddingFunction` 接口即可。

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
        // 使用 api_key 以某种方式将文本转换为嵌入向量
        return embeddings;
    }
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

我们非常欢迎贡献！如果您创建了一个对其他人可能有用的嵌入函数，请考虑[提交 Pull Request](https://github.com/chroma-core/chroma)。