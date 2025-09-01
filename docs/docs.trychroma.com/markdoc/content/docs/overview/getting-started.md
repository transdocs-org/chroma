# 快速开始

Chroma 是一款面向 AI 的开源向量数据库。它内置了所有入门所需的功能，可直接在本地运行。

在生产环境中，Chroma 提供 [Chroma Cloud](https://trychroma.com/signup) —— 一个快速、可扩展的无服务器数据库即服务。30 秒即可启动，注册即送 5 美元免费额度。

{% Video link="https://www.youtube.com/embed/yvsmkx-Jaj0" title="快速开始视频" / %}

### 1. 安装

{% Tabs %}

{% Tab label="python" %}

{% TabbedUseCaseCodeBlock language="终端" %}

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

{% TabbedUseCaseCodeBlock language="终端" %}

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

### 3. 创建集合

集合是你存储嵌入、文档以及任何附加元数据的地方。集合会对你的嵌入和文档进行索引，并实现高效的检索与过滤。你可以通过指定一个名称来创建一个集合：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection = chroma_client.create_collection(name="my_collection")
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
const collection = await client.createCollection({
  name: "我的集合",
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 4. 向集合中添加一些文本文档

Chroma 将自动存储您的文本，并完成嵌入和索引。您也可以自定义嵌入模型。必须为每个文档提供唯一的字符串 ID。

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

您可以使用一组查询文本对集合进行查询，Chroma 将返回最相似的 `n` 个结果。就是这么简单！

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
results = collection.query(
    query_texts=["这是一份关于夏威夷的查询文档"], # Chroma 会为你进行嵌入
    n_results=2 # 返回多少条结果
)
print(results)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
const results = await collection.query({
    queryTexts: "这是一份关于夏威夷的查询文档", // Chroma 将为你嵌入此内容
    nResults: 2, // 返回的结果数量
});

console.log(results);
```
{% /Tab %}

{% /TabbedCodeBlock %}

如果未提供 `n_results`，Chroma 默认返回 10 条结果。这里我们仅添加了 2 个文档，因此设置 `n_results=2`。

### 6. 查看结果

从上面的结果可以看出，我们关于 `hawaii` 的查询在语义上与关于 `pineapple` 的文档最为相似。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
{
  'documents': [[
      '这是一篇关于菠萝的文档',
      '这是一篇关于橙子的文档'
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
            '这是一篇关于菠萝的文档',
            '这是一篇关于橙子的文档'
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

### 7. 亲自试一试

如果我们用 `"This is a document about florida"` 来查询会怎样？下面是一个完整的示例。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import chromadb
chroma_client = chromadb.Client()

# 将 `create_collection` 改为 `get_or_create_collection`，避免每次都创建新的集合
collection = chroma_client.get_or_create_collection(name="my_collection")

# 将 `add` 改为 `upsert`，避免每次都添加相同的文档
collection.upsert(
    documents=[
        "这是一篇关于菠萝的文档",
        "这是一篇关于橙子的文档"
    ],
    ids=["id1", "id2"]
)

results = collection.query(
    query_texts=["这是一篇关于佛罗里达的查询文档"],  # Chroma 会自动为你生成嵌入
    n_results=2  # 返回的结果数量
)

print(results)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import { ChromaClient } from "chromadb";
const client = new ChromaClient();

// 将 `createCollection` 改为 `getOrCreateCollection`，以避免每次都创建新集合
const collection = await client.getOrCreateCollection({
    name: "my_collection",
});

// 将 `addRecords` 改为 `upsertRecords`，以避免重复添加相同文档
await collection.upsert({
    documents: [
        "这是一篇关于菠萝的文档",
        "这是一篇关于橙子的文档",
    ],
    ids: ["id1", "id2"],
});

const results = await collection.query({
    queryTexts: ["这是一篇关于佛罗里达的查询文档"], // Chroma 会为你自动嵌入
    nResults: 2, // 返回结果数量
});

console.log(results);
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 后续步骤

在本指南中，为了简单起见，我们使用了 Chroma 的[临时客户端](../run-chroma/ephemeral-client)。它会在内存中启动一个 Chroma 服务器，因此当程序终止时，你摄取的所有数据都会丢失。如果需要数据持久化，可以使用[持久化客户端](../run-chroma/persistent-client)或以[客户端-服务器模式](../run-chroma/client-server)运行 Chroma。

- 了解如何[部署 Chroma](../../guides/deploy/client-server-mode) 到服务器
- 加入 Chroma 的 [Discord 社区](https://discord.com/invite/MMeYNTmh3x) 提问并获取帮助
- 在 [X (@trychroma)](https://twitter.com/trychroma) 上关注 Chroma 以获取最新动态