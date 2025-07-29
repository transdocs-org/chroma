# 快速入门

Chroma 是一个原生于 AI 的开源向量数据库。它内置了你快速开始所需的一切功能，并且可以在你的机器上运行。

对于生产环境，Chroma 提供了 [Chroma Cloud](https://trychroma.com/signup) —— 一种快速、可扩展且无服务器的数据库即服务。30 秒内即可上手 —— 还包含 5 美元的免费额度。

{% Video link="https://www.youtube.com/embed/yvsmkx-Jaj0" title="Getting Started Video" / %}

### 1. 安装

{% Tabs %}

{% Tab label="python" %}

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="pip" %}
```terminal
pip install chromadb
```
{% /Tab %}

{% Tab label="poetry" %}
```terminal
poetry add chromadb
```
{% /Tab %}

{% Tab label="uv" %}
```terminal
uv pip install chromadb
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

{% /Tab %}

{% Tab label="typescript" %}

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="npm" %}
```terminal
npm install chromadb @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="pnpm" %}
```terminal
pnpm add chromadb @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="yarn" %}
```terminal
yarn add chromadb @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="bun" %}
```terminal
bun add chromadb @chroma-core/default-embed
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

{% /Tab %}

{% /Tabs %}

### 2. 创建 Chroma 客户端

{% Tabs %}

{% Tab label="python" %}
```python
import chromadb
chroma_client = chromadb.Client()
```
{% /Tab %}
{% Tab label="typescript" %}

运行 Chroma 后端：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="CLI" %}
```terminal
chroma run --path ./getting-started
```
{% /Tab %}

{% Tab label="Docker" %}
```terminal
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

然后创建一个连接到它的客户端：

{% TabbedUseCaseCodeBlock language="typescript" %}

{% Tab label="ESM" %}
```typescript
import { ChromaClient } from "chromadb";
const client = new ChromaClient();
```
{% /Tab %}

{% Tab label="CJS" %}
```typescript
const { ChromaClient } = require("chromadb");
const client = new ChromaClient();
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

{% /Tab %}

{% /Tabs %}

### 3. 创建一个集合

集合是你存储嵌入向量、文档以及任何附加元数据的地方。集合会对你存储的嵌入向量和文档进行索引，从而实现高效的检索和过滤。你可以通过指定名称来创建一个集合：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection = chroma_client.create_collection(name="my_collection")
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

### 4. 将一些文本文档添加到集合中

Chroma 会自动存储你的文本并处理嵌入和索引。你也可以自定义嵌入模型。你必须为文档提供唯一的字符串 ID。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.add(
    ids=["id1", "id2"],
    documents=[
        "This is a document about pineapple",
        "This is a document about oranges"
    ]
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.add({
    ids: ["id1", "id2"],
    documents: [
        "This is a document about pineapple",
        "This is a document about oranges",
    ]
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 5. 查询集合

你可以使用一组查询文本对集合进行查询，Chroma 会返回 `n` 个最相似的结果。就是这么简单！

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
results = collection.query(
    query_texts=["This is a query document about hawaii"], # Chroma 会自动为你嵌入这个文本
    n_results=2 # 返回多少个结果
)
print(results)
```

{% /Tab %}

{% Tab label="typescript" %}
```typescript
const results = await collection.query({
    queryTexts: "This is a query document about hawaii", // Chroma 会自动为你嵌入这个文本
    nResults: 2, // 返回多少个结果
});

console.log(results);
```
{% /Tab %}

{% /TabbedCodeBlock %}

如果未提供 `n_results`，Chroma 默认会返回 10 个结果。这里我们只添加了 2 个文档，因此设置 `n_results=2`。

### 6. 检查查询结果

从上面的结果可以看出，我们关于 `hawaii` 的查询在语义上与关于 `pineapple` 的文档最相似。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
{
  'documents': [[
      'This is a document about pineapple',
      'This is a document about oranges'
  ]],
  'ids': [['id1', 'id2']],
  'distances': [[1.0404009819030762, 1.243080496788025]],
  'uris': None,
  'data': None,
  'metadatas': [[None, None]],
  'embeddings': None,
}
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
{
    documents: [
        [
            'This is a document about pineapple',
            'This is a document about oranges'
        ]
    ],
    ids: [
        ['id1', 'id2']
    ],
    distances: [[1.0404009819030762, 1.243080496788025]],
    uris: null,
    data: null,
    metadatas: [[null, null]],
    embeddings: null
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 7. 亲自尝试一下

如果我们尝试用 `"This is a document about florida"` 进行查询会怎么样？下面是一个完整的示例。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import chromadb
chroma_client = chromadb.Client()

# 将 `create_collection` 替换为 `get_or_create_collection` 以避免每次都创建新集合
collection = chroma_client.get_or_create_collection(name="my_collection")

# 将 `add` 替换为 `upsert` 以避免每次都添加相同的文档
collection.upsert(
    documents=[
        "This is a document about pineapple",
        "This is a document about oranges"
    ],
    ids=["id1", "id2"]
)

results = collection.query(
    query_texts=["This is a query document about florida"], # Chroma 会自动为你嵌入该文本
    n_results=2 # 返回多少个结果
)

print(results)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import { ChromaClient } from "chromadb";
const client = new ChromaClient();

// 将 `createCollection` 替换为 `getOrCreateCollection` 以避免每次都创建新集合
const collection = await client.getOrCreateCollection({
    name: "my_collection",
});

// 将 `addRecords` 替换为 `upsertRecords` 以避免每次都添加相同的文档
await collection.upsert({
    documents: [
        "This is a document about pineapple",
        "This is a document about oranges",
    ],
    ids: ["id1", "id2"],
});

const results = await collection.query({
    queryTexts: "This is a query document about florida", // Chroma 会自动为你嵌入该文本
    nResults: 2, // 返回多少个结果
});

console.log(results);
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 下一步

在本指南中，我们为了简便使用了 Chroma 的 [临时客户端（ephemeral client）](../run-chroma/ephemeral-client)。它会在内存中启动一个 Chroma 服务器，因此当你的程序终止时，所有摄入的数据都会丢失。如果你需要数据持久化，可以使用 [持久化客户端（persistent client）](../run-chroma/persistent-client)，或者以 [客户端-服务器模式（client-server mode）](../run-chroma/client-server) 运行 Chroma。

- 学习如何将 Chroma [部署到服务器](../../guides/deploy/client-server-mode)
- 加入 Chroma 的 [Discord 社区](https://discord.com/invite/MMeYNTmh3x) 提问和获取帮助
- 在 X 平台关注 Chroma 的官方账号 [X (@trychroma)](https://twitter.com/trychroma) 获取最新动态