# 开始使用

Chroma 是一个面向 AI 的开源向量数据库。它内置了你开始使用所需的一切功能，并且可以在你的本地机器上运行。

对于生产环境，Chroma 提供了 [Chroma Cloud](https://trychroma.com/signup) —— 一个快速、可扩展且无服务器的数据库即服务（DBaaS）。只需30秒即可开始使用 —— 注册即送5美元免费额度。

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

### 2. 创建一个 Chroma 客户端

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

集合是你存储嵌入向量（embeddings）、文档以及附加元数据的地方。集合会对你存储的嵌入向量和文档建立索引，从而实现高效的检索和过滤。你可以通过指定名称来创建一个集合：

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

### 4. 向集合中添加一些文本文档

Chroma 会自动存储你的文本并进行嵌入（embedding）和索引（indexing）。你也可以自定义嵌入模型。你需要为文档提供唯一的字符串 ID。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.add(
    ids=["id1", "id2"],
    documents=[
        "这是一篇关于菠萝的文档",
        "这是一篇关于橙子的文档"
    ]
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.add({
    ids: ["id1", "id2"],
    documents: [
        "这是一篇关于菠萝的文档",
        "这是一篇关于橙子的文档",
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
    query_texts=["这是一篇关于夏威夷的查询文档"], # Chroma 会自动为你进行嵌入
    n_results=2 # 返回多少个结果
)
print(results)
```

{% /Tab %}

{% Tab label="typescript" %}
```typescript
const results = await collection.query({
    queryTexts: "这是一篇关于夏威夷的查询文档", // Chroma 会自动为你进行嵌入
    nResults: 2, // 返回多少个结果
});

console.log(results);
```
{% /Tab %}

{% /TabbedCodeBlock %}

如果未提供 `n_results`，Chroma 默认会返回 10 个结果。这里我们只添加了 2 篇文档，因此设置 `n_results=2`。

### 6. 检查结果

从上面的结果可以看出，我们关于 `hawaii` 的查询在语义上与关于 `pineapple` 的文档最为相似。

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

### 7. 自己动手尝试

如果我们使用 `"This is a document about florida"` 进行查询会怎么样？以下是一个完整的示例。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import chromadb
chroma_client = chromadb.Client()

# 将 `create_collection` 替换为 `get_or_create_collection` 以避免每次都创建新的集合
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
    query_texts=["This is a query document about florida"], # Chroma 会自动嵌入该查询
    n_results=2 # 返回的结果数量
)

print(results)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import { ChromaClient } from "chromadb";
const client = new ChromaClient();

// 将 `createCollection` 改为 `getOrCreateCollection` 以避免每次运行都创建新集合
const collection = await client.getOrCreateCollection({
    name: "my_collection",
});

// 将 `addRecords` 改为 `upsertRecords` 以避免重复添加相同的文档
await collection.upsert({
    documents: [
        "这是一篇关于菠萝的文档",
        "这是一篇关于橙子的文档",
    ],
    ids: ["id1", "id2"],
});

const results = await collection.query({
    queryTexts: "这是一篇关于佛罗里达的查询文档", // Chroma 会自动为你嵌入该文本
    nResults: 2, // 返回多少个结果
});

console.log(results);

```
{% /Tab %}

{% /TabbedCodeBlock %}

## 下一步

本指南中，为了简单起见，我们使用了 Chroma 的 [临时客户端](../run-chroma/ephemeral-client)。它会在内存中启动一个 Chroma 服务器，因此当程序终止时，您引入的任何数据都将丢失。如果您需要数据持久化，可以使用 [持久化客户端](../run-chroma/persistent-client)，或者以 [客户端-服务器模式](../run-chroma/client-server) 运行 Chroma。

- 学习如何将 Chroma [部署到服务器](../../guides/deploy/client-server-mode)
- 加入 Chroma 的 [Discord 社区](https://discord.com/invite/MMeYNTmh3x) 提问并获取帮助
- 在 [X（@trychroma）](https://twitter.com/trychroma) 上关注 Chroma 获取最新动态