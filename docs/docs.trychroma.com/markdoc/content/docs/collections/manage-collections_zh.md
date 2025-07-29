# 管理 Chroma 集合

Chroma 允许你使用 **collection（集合）** 原语来管理嵌入（embeddings）的集合。集合是 Chroma 中存储和查询的基本单位。

## 创建集合

Chroma 的集合通过一个名称创建。集合名称会用于 URL，因此有一些命名限制：

- 名称长度必须在 3 到 512 个字符之间。
- 名称必须以小写字母或数字开头和结尾，中间可以包含点、短横线和下划线。
- 名称中不能包含两个连续的点。
- 名称不能是一个有效的 IP 地址。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection = client.create_collection(name="my_collection")
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
const collection = await client.createCollection({
    name: "my_collection",
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

请注意，在同一个 Chroma 数据库中，集合名称必须是 **唯一的**。如果你尝试创建一个已经存在的集合名称，将会抛出异常。

### 嵌入函数（Embedding Functions）

当你向集合中添加文档时，Chroma 会使用集合的 **嵌入函数（embedding function）** 自动为你嵌入这些文档。默认情况下，Chroma 会使用 [sentence transformer](https://www.sbert.net/index.html) 的嵌入函数。

Chroma 也提供了多种嵌入函数，你可以在创建集合时指定使用哪一个。例如，你可以使用 `OpenAIEmbeddingFunction` 创建一个集合：

{% Tabs %}

{% Tab label="python" %}

首先安装 `openai` 包：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="pip" %}
```terminal
pip install openai
```
{% /Tab %}

{% Tab label="poetry" %}
```terminal
poetry add openai
```
{% /Tab %}

{% Tab label="uv" %}
```terminal
uv pip install openai
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

然后使用 `OpenAIEmbeddingFunction` 创建集合：

```python
import os
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

collection = client.create_collection(
    name="my_collection",
    embedding_function=OpenAIEmbeddingFunction(
        api_key=os.getenv("OPENAI_API_KEY"),
        model_name="text-embedding-3-small"
    )
)
```

你也可以不使用 Chroma 自动嵌入文档，而是在向集合中[添加数据](./add-data)时直接提供嵌入向量。在这种情况下，你的集合将不设置嵌入函数，你需要在添加数据和执行查询时自行提供嵌入向量。

```python
collection = client.create_collection(
    name="my_collection",
    embedding_function=None
)
```

{% /Tab %}

{% Tab label="typescript" %}

请安装 `@chroma-core/openai` 包以使用 `OpenAIEmbeddingFunction`：

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

{% /TabbedUseCaseCodeBlock %}

{% /Tab %}

{% /Tabs %}

{% Tab label="bun" %}
```terminal
bun add @chroma-core/openai
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

使用 `OpenAIEmbeddingFunction` 创建你的集合：

```typescript
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

const collection = await client.createCollection({
    name: "my_collection",
    embeddingFunction: new OpenAIEmbeddingFunction({
        apiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-3-small"
    })
});
```

除了让 Chroma 来嵌入文档，您也可以在向集合中[添加数据](./add-data)时直接提供嵌入向量。在这种情况下，您的集合将不设置嵌入函数，添加数据和进行查询时都需要您自己负责提供嵌入向量。

```typescript
const collection = await client.createCollection({
    name: "my_collection",
    embeddingFunction: null
})
```

{% /Tab %}

{% /Tabs %}

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection = client.create_collection(
    name="my_collection",
    embedding_function=None
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
let collection = await client.createCollection({
    name: "my_collection",
    embeddingFunction: emb_fn,
    metadata: {
        description: "我的第一个 Chroma 集合",
        created: (new Date()).toString()
    }
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 集合元数据

在创建集合时，你可以传入可选的 `metadata` 参数，将元数据键值对映射添加到你的集合中。这对于添加有关集合的一般信息非常有用，例如创建时间、集合中存储数据的描述等。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
from datetime import datetime

collection = client.create_collection(
    name="my_collection",
    embedding_function=emb_fn,
    metadata={
        "description": "我的第一个 Chroma 集合",
        "created": str(datetime.now())
    }
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
let collection = await client.createCollection({
    name: "my_collection",
    embeddingFunction: emb_fn,
    metadata: {
        description: "我的第一个 Chroma 集合",
        created: (new Date()).toString()
    }
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 获取集合

{% Tabs %}

{% Tab label="python" %}
在创建集合之后，有几种方法可以获取它。

`get_collection` 函数将通过名称从 Chroma 获取一个集合。它返回一个包含 `name`、`metadata`、`configuration` 和 `embedding_function` 的 `Collection` 对象。

```python
collection = client.get_collection(name="my-collection")
```

`get_or_create_collection` 函数的行为类似，但如果集合不存在，则会创建该集合。你可以传入与 `create_collection` 相同的参数，如果集合已经存在，客户端将忽略这些参数。

```python
collection = client.get_or_create_collection(
    name="my-collection",
    metadata={"description": "..."}
)
```

`list_collections` 函数返回你 Chroma 数据库中的集合。集合将按创建时间从最旧到最新排序。

```python
collections = client.list_collections()
```

默认情况下，`list_collections` 会返回最多 100 个集合。如果你的集合数量超过 100 个，或者只需要获取其中的一部分集合，可以使用 `limit` 和 `offset` 参数：

```python
first_collections_batch = client.list_collections(limit=100) # 获取前100个集合
second_collections_batch = client.list_collections(limit=100, offset=100) # 获取第101到200个集合
collections_subset = client.list_collections(limit=20, offset=50) # 从第50个开始获取20个集合
```

Chroma 的当前版本会将你用来创建集合的嵌入函数存储在服务器上，因此客户端在后续的“get”操作中可以自动解析它。如果你使用的是较旧版本的 Chroma 客户端或服务端（<1.1.13），则需要在使用 `get_collection` 时提供与创建集合时相同的嵌入函数：

```python
collection = client.get_collection(
    name='my-collection',
    embedding_function=ef
)
```

{% /Tab %}

{% Tab label="typescript" %}
创建集合后有多种方式可以获取它。

`getCollection` 函数可以通过名称从 Chroma 中获取集合。它返回一个包含 `name`、`metadata`、`configuration` 和 `embeddingFunction` 的集合对象。如果你在调用 `createCollection` 时没有提供嵌入函数，则可以在调用 `getCollection` 时提供：

```typescript
const collection = await client.getCollection({ name: 'my-collection' })
```

`getOrCreateCollection` 函数的行为类似，但如果集合不存在则会创建它。你可以传入与 `createCollection` 相同的参数，如果集合已经存在，客户端将忽略这些参数。

```typescript
const collection = await client.getOrCreateCollection({
    name: 'my-collection',
    metadata: { 'description': '...' }
});
```

如果你需要一次获取多个集合，可以使用 `getCollections()`：

```typescript
const [col1, col2] = client.getCollections(["col1", "col2"]);
```

`listCollections` 函数会返回你在 Chroma 数据库中拥有的所有集合。这些集合会按照创建时间从旧到新进行排序。

```typescript
const collections = await client.listCollections()
```

默认情况下，`listCollections` 最多返回 100 个集合。如果你拥有超过 100 个集合，或者只需要获取集合的一个子集，可以使用 `limit` 和 `offset` 参数：

```typescript
const firstCollectionsBatch = await client.listCollections({ limit: 100 }) // 获取前 100 个集合
const secondCollectionsBatch = await client.listCollections({ limit: 100, offset: 100 }) // 获取从第 100 个开始的接下来的 100 个集合
const collectionsSubset = await client.listCollections({ limit: 20, offset: 50 }) // 从第 50 个开始获取 20 个集合作为子集
```

目前版本的 Chroma 会将你用于创建集合的嵌入函数（embedding function）存储在服务器端，因此客户端在后续的“get”操作中可以自动为你解析。如果你运行的是旧版本的 Chroma JS/TS 客户端（<3.04）或服务器端（<1.1.13），则在使用 `getCollection` 和 `getCollections` 时，需要手动提供与创建集合时相同的嵌入函数：

```typescript
const collection = await client.getCollection({
    name: 'my-collection',
    embeddingFunction: ef
})

const [col1, col2] = client.getCollections([
    { name: 'col1', embeddingFunction: openaiEF },
    { name: 'col2', embeddingFunction: defaultEF },
]);
```

{% /Tab %}

{% /Tabs %}

## 修改集合

创建集合后，你可以使用 `modify` 方法修改其名称、元数据以及其 [索引配置](./configure) 中的元素：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.modify(
   name="new-name",
   metadata={"description": "new description"}
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.modify({
    name: "new-name",
    metadata: {description: "new description"}
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 删除集合

你可以通过名称删除集合。此操作将删除该集合、其所有嵌入数据以及相关文档和记录的元数据。

{% Banner type="warn" %}
删除集合是破坏性操作，且不可逆
{% /Banner %}

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
client.delete_collection(name="my-collection")
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await client.deleteCollection({ name: "my-collection" });
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 便捷方法

集合还提供了一些实用的便捷方法：

* `count` - 返回集合中记录的数量。
* `peek` - 返回集合中的前10条记录。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.count()
collection.peek()
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.count();
await collection.peek();
```
{% /Tab %}

{% /TabbedCodeBlock %}