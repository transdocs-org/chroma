# 管理 Chroma 集合

Chroma 允许你使用 **collection（集合）** 原语来管理嵌入向量的集合。集合是 Chroma 中存储和查询的基本单位。

## 创建集合

Chroma 集合通过名称创建。集合名称会用于 URL，因此有一些限制：

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

请注意，集合名称在 Chroma 数据库中必须是 **唯一的**。如果你尝试创建一个与已有集合同名的集合，你会看到一个异常。

### 嵌入函数

当你向集合中添加文档时，Chroma 将使用集合的 **嵌入函数** 为你生成嵌入向量。默认情况下，Chroma 会使用 [sentence transformer](https://www.sbert.net/index.html) 嵌入函数。

Chroma 也提供了多种嵌入函数，你可以在创建集合时指定它们。例如，你可以使用 `OpenAIEmbeddingFunction` 创建一个集合：

{% Tabs %}

{% Tab label="python" %}

安装 `openai` 包：

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

使用 `OpenAIEmbeddingFunction` 创建你的集合：

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

除了让 Chroma 为你生成嵌入向量，你也可以在[添加数据](./add-data)到集合时直接提供嵌入向量。在这种情况下，你的集合将不会设置嵌入函数，你将需要在添加数据和进行查询时自行提供嵌入向量。

```python
collection = client.create_collection(
    name="my_collection",
    embedding_function=None
)
```

{% /Tab %}

{% Tab label="typescript" %}

安装 `@chroma-core/openai` 包以使用 `OpenAIEmbeddingFunction`：

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

除了让 Chroma 为你生成嵌入向量，你也可以在[添加数据](./add-data)到集合时直接提供嵌入向量。在这种情况下，你的集合将不会设置嵌入函数，你将需要在添加数据和进行查询时自行提供嵌入向量。

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
        description: "my first Chroma collection",
        created: (new Date()).toString()
    }
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 集合元数据

创建集合时，你可以通过可选的 `metadata` 参数为你的集合添加一组元数据键值对。这对于添加关于集合的一般信息很有用，例如创建时间、集合中存储数据的描述等。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
from datetime import datetime

collection = client.create_collection(
    name="my_collection",
    embedding_function=emb_fn,
    metadata={
        "description": "my first Chroma collection",
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
        description: "my first Chroma collection",
        created: (new Date()).toString()
    }
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 获取集合

{% Tabs %}

{% Tab label="python" %}
集合创建后，有几种方式可以获取它。

`get_collection` 函数将通过名称从 Chroma 获取集合。它返回一个包含 `name`、`metadata`、`configuration` 和 `embedding_function` 的 `Collection` 对象。

```python
collection = client.get_collection(name="my-collection")
```

`get_or_create_collection` 函数行为类似，但如果集合不存在则会创建它。你可以传入与 `create_collection` 相同的参数，如果集合已存在，客户端将忽略这些参数。

```python
collection = client.get_or_create_collection(
    name="my-collection",
    metadata={"description": "..."}
)
```

`list_collections` 函数返回你在 Chroma 数据库中拥有的所有集合。这些集合将按照创建时间从旧到新的顺序排列。

```python
collections = client.list_collections()
```

默认情况下，`list_collections` 返回最多 100 个集合。如果你有超过 100 个集合，或者只需要获取集合的一个子集，可以使用 `limit` 和 `offset` 参数：

```python
first_collections_batch = client.list_collections(limit=100) # 获取前 100 个集合
second_collections_batch = client.list_collections(limit=100, offset=100) # 获取第 100 个之后的 100 个集合
collections_subset = client.list_collections(limit=20, offset=50) # 从第 50 个开始获取 20 个集合
```

当前版本的 Chroma 将你在创建集合时使用的嵌入函数存储在服务器上，因此客户端可以在后续的“get”操作中自动解析它。如果你使用的是旧版本的 Chroma 客户端或服务器（<1.1.13），你需要在使用 `get_collection` 时提供创建集合时使用的相同嵌入函数：

```python
collection = client.get_collection(
    name='my-collection',
    embedding_function=ef
)
```

{% /Tab %}

{% Tab label="typescript" %}
集合创建后，有几种方式可以获取它。

`getCollection` 函数将通过名称从 Chroma 获取集合。它返回一个包含 `name`、`metadata`、`configuration` 和 `embeddingFunction` 的集合对象。如果你在 `createCollection` 中未提供嵌入函数，你可以在 `getCollection` 中提供它。

```typescript
const collection = await client.getCollection({ name: 'my-collection '})
```

`getOrCreate` 函数行为类似，但如果集合不存在则会创建它。你可以传入与 `createCollection` 相同的参数，如果集合已存在，客户端将忽略这些参数。

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

`listCollections` 函数返回你在 Chroma 数据库中拥有的所有集合。这些集合将按照创建时间从旧到新的顺序排列。

```typescript
const collections = await client.listCollections()
```

默认情况下，`listCollections` 返回最多 100 个集合。如果你有超过 100 个集合，或者只需要获取集合的一个子集，可以使用 `limit` 和 `offset` 参数：

```typescript
const firstCollectionsBatch = await client.listCollections({ limit: 100 }) // 获取前 100 个集合
const secondCollectionsBatch = await client.listCollections({ limit: 100, offset: 100 }) // 获取第 100 个之后的 100 个集合
const collectionsSubset = await client.listCollections({ limit: 20, offset: 50 }) // 从第 50 个开始获取 20 个集合
```

当前版本的 Chroma 将你在创建集合时使用的嵌入函数存储在服务器上，因此客户端可以在后续的“get”操作中自动解析它。如果你使用的是旧版本的 Chroma JS/TS 客户端（<3.04）或服务器（<1.1.13），你需要在使用 `getCollection` 和 `getCollections` 时提供创建集合时使用的相同嵌入函数：

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

集合创建后，你可以使用 `modify` 方法修改其名称、元数据和索引配置中的元素：

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

你可以通过名称删除一个集合。此操作将删除该集合及其所有嵌入向量、相关文档和记录的元数据。

{% Banner type="warn" %}
删除集合是破坏性的且不可逆
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

集合还提供了一些有用的便捷方法：
* `count` - 返回集合中的记录数。
* `peek` - 返回集合中的前 10 条记录。

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