# 嵌入函数

嵌入是表示任何类型数据的方式，这使它们非常适合与各种基于AI的工具和算法一起使用。它们可以表示文本、图像，以及即将支持的音频和视频。Chroma 集合通过索引嵌入来实现对所表示数据的高效相似性搜索。创建嵌入有多种选项，无论是通过使用本地安装的库还是调用API。

Chroma 为流行的嵌入提供程序提供了轻量级封装，使您可以在应用程序中轻松使用它们。当您[创建](../collections/manage-collections) Chroma 集合时，可以设置一个嵌入函数，在添加和查询数据时自动使用，或者您可以直接调用它们。

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
| [Morph](../../integrations/embedding-models/morph)                                    | ✓      | ✓          |

我们欢迎社区贡献新的嵌入函数。

***

## 默认：all-MiniLM-L6-v2

Chroma 的默认嵌入函数使用 [Sentence Transformers](https://www.sbert.net/) 的 `all-MiniLM-L6-v2` 模型来创建嵌入。这个嵌入模型可以创建可用于各种任务的句子和文档嵌入。此嵌入函数在您的本地机器上运行，可能需要您下载模型文件（下载会自动进行）。

如果您在创建集合时未指定嵌入函数，Chroma 将默认设置为 `DefaultEmbeddingFunction`：

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

创建集合时不提供嵌入函数。它将自动设置为 `DefaultEmbeddingFunction`：

```typescript
const collection = await client.createCollection({ name: "my-collection" });
```

{% /Tab %}

{% /Tabs %}

## 使用嵌入函数

嵌入函数可以链接到集合，并在调用 `add`、`update`、`upsert` 或 `query` 时使用。

{% Tabs %}

{% Tab label="python" %}
```python
# 设置您的 OPENAI_API_KEY 环境变量
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

collection = client.create_collection(
    name="my_collection",
    embedding_function=OpenAIEmbeddingFunction(
        model_name="text-embedding-3-small"
    )
)

# Chroma 将使用 OpenAIEmbeddingFunction 来嵌入您的文档
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
``%
```
{% /Tab %}

{% Tab label="bun" %}
```terminal
bun add @chroma-core/openai
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

创建带有 `OpenAIEmbeddingFunction` 的集合：

```typescript
// 设置您的 OPENAI_API_KEY 环境变量
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

collection = await client.createCollection({
    name: "my_collection",
    embedding_function: new OpenAIEmbeddingFunction({
        model_name: "text-embedding-3-small"
    })
});

// Chroma 将使用 OpenAIEmbeddingFunction 来嵌入您的文档
await collection.add({
    ids: ["id1", "id2"],
    documents: ["doc1", "doc2"]
})
```
{% /Tab %}

{% /Tabs %}

您也可以直接使用嵌入函数，这在调试时非常方便。

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

您可以创建自己的嵌入函数与 Chroma 一起使用；它只需实现 `EmbeddingFunction` 接口即可。

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
        // 使用 api_key 将文本转换为嵌入
        return embeddings;
    }
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

我们欢迎您的贡献！如果您创建了一个对他人有用的嵌入函数，请考虑[提交拉取请求](https://github.com/chroma-core/chroma)。