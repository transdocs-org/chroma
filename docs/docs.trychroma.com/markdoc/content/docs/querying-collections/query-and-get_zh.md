# 从 Chroma 集合中查询和获取数据

{% Tabs %}

{% Tab label="python" %}
你可以使用 `.query` 方法对一个 Chroma 集合进行相似性搜索：

```python
collection.query(
    query_texts=["thus spake zarathustra", "the oracle speaks"]
)
```

Chroma 会使用集合的 [嵌入函数](../embeddings/embedding-functions) 对你的文本查询进行嵌入处理，并使用输出结果在集合中进行向量相似性搜索。

除了提供 `query_texts`，你也可以直接提供查询的嵌入向量。如果你之前是直接添加的嵌入向量到集合中（而不是使用其嵌入函数），则必须使用此方式。如果提供的查询嵌入向量的维度与集合中的不一致，则会抛出异常。

```python
collection.query(
    query_embeddings=[[11.1, 12.1, 13.1],[1.1, 2.3, 3.2], ...]
)
```

默认情况下，Chroma 会为每个输入查询返回 10 个结果。你可以使用 `n_results` 参数修改这个数量：

```python
collection.query(
    query_embeddings=[[11.1, 12.1, 13.1],[1.1, 2.3, 3.2], ...],
    n_results=5
)
```

通过 `ids` 参数，你可以将搜索限制在指定 ID 列表中的记录：

```python
collection.query(
    query_embeddings=[[11.1, 12.1, 13.1],[1.1, 2.3, 3.2], ...],
    n_results=5,
    ids=["id1", "id2"]
)
```

你也可以使用 `.get` 方法从集合中检索记录。它支持以下参数：
* `ids` - 获取具有指定 ID 列表的记录。如果没有提供，则按添加顺序返回前 100 条记录。
* `limit` - 要获取的记录数量。默认值为 100。
* `offset` - 开始返回结果的偏移量。用于与 limit 一起进行分页。默认值为 0。

```python
collection.get(ids=["id1", "ids2", ...])
```
{% endTab %}

{% endTabs %}

`query` 和 `get` 方法都支持使用 `where` 参数进行[元数据过滤](./metadata-filtering)，以及使用 `where_document` 进行[全文搜索和正则表达式匹配](./full-text-search)：

```python
collection.query(
    query_embeddings=[[11.1, 12.1, 13.1],[1.1, 2.3, 3.2], ...],
    n_results=5,
    where={"page": 10}, # 查询元数据字段 'page' 等于 10 的记录
    where_document={"$contains": "search string"} # 查询文档中包含指定搜索字符串的记录
)
```

## 返回结果的结构

Chroma 以列式格式返回 `.query` 和 `.get` 的结果。你将获得一个包含匹配记录的 `ids`、`embeddings`、`documents` 和 `metadatas` 列表的结果对象。Embeddings 以二维 numpy 数组的形式返回。

```python
class QueryResult(TypedDict):
    ids: List[IDs]
    embeddings: Optional[List[Embeddings]],
    documents: Optional[List[List[Document]]]
    metadatas: Optional[List[List[Metadata]]]
    distances: Optional[List[List[float]]]
    included: Include

class GetResult(TypedDict):
    ids: List[ID]
    embeddings: Optional[Embeddings],
    documents: Optional[List[Document]],
    metadatas: Optional[List[Metadata]]
    included: Include
```

`.query` 的结果还包含一个 `distances` 列表，表示每个结果与输入查询之间的距离。`.query` 的结果是按每个输入查询进行索引的。例如，`results["ids"][0]` 包含第一个输入查询结果的记录 ID 列表。

```python
results = collection.query(query_texts=["first query", "second query"])
```

## 选择返回的数据

默认情况下，`.query` 和 `.get` 总是返回 `documents` 和 `metadatas`。你可以使用 `include` 参数来修改返回的内容，但 `ids` 始终会被返回：

```python
collection.query(query_texts=["my query"]) # 返回 'ids'、'documents' 和 'metadatas'

collection.get(include=["documents"]) # 仅返回 'ids' 和 'documents'

collection.query(
    query_texts=["my query"],
    include=["documents", "metadatas", "embeddings"]
) # 返回 'ids'、'documents'、'metadatas' 和 'embeddings'
```

{% /Tab %}

{% Tab label="typescript" %}
你可以使用 `.query` 方法对 Chroma 集合执行相似性搜索：

```typescript
await collection.query({
    queryTexts: ["thus spake zarathustra", "the oracle speaks"]
})
```

Chroma 将使用集合的[嵌入函数](../embeddings/embedding-functions)将你的文本查询转换为嵌入向量，并使用该向量在集合中执行向量相似性搜索。

除了提供 `queryTexts`，你也可以直接提供查询的嵌入向量。如果你之前是直接添加的嵌入向量（而不是使用集合的嵌入函数），那么你也必须这么做。如果提供的查询嵌入向量与集合中的向量维度不一致，将会抛出异常。

```typescript
await collection.query({
    queryEmbeddings: [[11.1, 12.1, 13.1],[1.1, 2.3, 3.2], ...]
})
```

默认情况下，Chroma 会为每个输入查询返回 10 个结果。你可以通过 `nResults` 参数修改这个数量：

```typescript
await collection.query({
    queryEmbeddings: [[11.1, 12.1, 13.1], [1.1, 2.3, 3.2], ...],
    nResults: 5
})
```

`ids` 参数允许你将搜索限制在 ID 位于给定列表中的记录：

```typescript
await collection.query({
    queryEmbeddings: [[11.1, 12.1, 13.1], [1.1, 2.3, 3.2], ...],
    nResults: 5,
    ids: ["id1", "id2"]
})
```

你也可以使用 `.get` 方法从集合中检索记录。它支持以下参数：

* `ids` - 获取 ID 存在于此列表中的记录。如果没有提供，则会按添加到集合中的顺序获取前 100 条记录。
* `limit` - 要获取的记录数量。默认值为 100。
* `offset` - 开始返回结果的偏移量。对于与 limit 一起进行分页非常有用。默认值为 0。

```typescript
await collection.get({ids: ["id1", "ids2", ...]})
```

`query` 和 `get` 都有 `where` 参数用于 [元数据过滤](./metadata-filtering)，以及 `whereDocument` 用于 [全文搜索和正则表达式](./full-text-search)：

```typescript
await collection.query({
    queryEmbeddings: [[11.1, 12.1, 13.1], [1.1, 2.3, 3.2], ...],
    nResults: 5,
    where: { page: 10 }, // 查询元数据字段 'page' 等于 10 的记录
    whereDocument: { "$contains": "搜索字符串" } // 查询记录文档中包含指定搜索字符串的记录
})
```

## 结果结构

Chroma 以列式形式返回 `.query` 和 `.get` 的结果。你会得到一个结果对象，其中包含匹配你 `.query` 或 `.get` 请求的记录的 `ids`、`embeddings`、`documents` 和 `metadatas` 列表。

```typescript
class QueryResult {
    public readonly distances: (number | null)[][];
    public readonly documents: (string | null)[][];
    public readonly embeddings: (number[] | null)[][];
    public readonly ids: string[][];
    public readonly include: Include[];
    public readonly metadatas: (Record<string, string | number | boolean> | null)[][];
}

class GetResult {
    public readonly documents: (string | null)[];
    public readonly embeddings: number[][];
    public readonly ids: string[];
    public readonly include: Include[];
    public readonly metadatas: (Record<string, string | number | boolean> | null)[];
}
```

`.query` 的结果还包含一个 `distances` 列表，表示每个结果与你的输入查询之间的距离。`.query` 的结果还会根据你的每个输入查询进行索引。例如，`results.ids[0]` 包含第一个输入查询结果的记录 ID 列表。

```typescript
const results = await collection.query({ queryTexts: ["第一个查询", "第二个查询"] })
```

对于 `.query` 和 `.get` 的结果，你可以使用 `.rows()` 方法以行式格式获取结果。也就是说，你将得到一个记录数组，每条记录都包含其 `id`、`document`、`metadata`（等）字段。

```typescript
const results = await collection.get({ ids: ["id1", "id2", ...]});
const records = results.rows();
records.forEach((record) => {
    console.log(record.id, record.document);
})
```

你还可以向 `.get` 和 `.query` 方法传递类型参数，用于指定你的元数据结构。这样可以为你的元数据对象提供类型推断：

```typescript
const results = await collection.get<{page: number; title: string}>({
    ids: ["id1", "id2", ...]
});

```javascript
const records = results.rows();
records.forEach((record) => {
    console.log(record.id, record.metadata?.page);
});
```

## 选择返回的数据

默认情况下，`.query` 和 `.get` 总是返回 `documents` 和 `metadatas`。你可以使用 `include` 参数来修改返回的内容。`ids` 始终会被返回：

```typescript
await collection.query({ queryTexts: ["my query"] }); // 返回 'ids'、'documents' 和 'metadatas'

await collection.get({ include: ["documents"] }); // 仅返回 'ids' 和 'documents'

await collection.query({
    queryTexts: ["my query"],
    include: ["documents", "metadatas", "embeddings"]
}); // 返回 'ids'、'documents'、'metadatas' 和 'embeddings'
```

{% /Tab %}

{% /Tabs %}