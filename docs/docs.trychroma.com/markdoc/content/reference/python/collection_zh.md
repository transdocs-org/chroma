---
title: 集合
---

# Python 集合

```python
class Collection(BaseModel)
```

## count

```python
def count() -> int
```

添加到数据库中的嵌入向量总数。

**返回值**:

- `int` - 添加到数据库中的嵌入向量总数。

## add

```python
def add(ids: OneOrMany[ID],
        embeddings: Optional[OneOrMany[Embedding]] = None,
        metadatas: Optional[OneOrMany[Metadata]] = None,
        documents: Optional[OneOrMany[Document]] = None) -> None
```

向数据存储中添加嵌入向量。

**参数**:

- `ids` - 要添加的嵌入向量的 ID。
- `embeddings` - 要添加的嵌入向量。如果为 None，则将根据 documents 使用 Collection 中设置的 embedding_function 来计算嵌入向量。可选参数。
- `metadatas` - 要与嵌入向量关联的元数据。在查询时，可以基于此元数据进行过滤。可选参数。
- `documents` - 要与嵌入向量关联的文档。可选参数。

**返回值**:

  无

**异常**:

- `ValueError` - 如果你未提供 embeddings 或 documents 中的任意一个
- `ValueError` - 如果 ids、embeddings、metadatas 或 documents 的长度不一致
- `ValueError` - 如果你未提供嵌入函数且未提供 embeddings
- `DuplicateIDError` - 如果你提供的 ID 已经存在

## get

```python
def get(ids: Optional[OneOrMany[ID]] = None,
        where: Optional[Where] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None,
        where_document: Optional[WhereDocument] = None,
        include: Include = ["metadatas", "documents"]) -> GetResult
```

从数据存储中获取嵌入向量及其相关数据。如果没有提供 ids 或 where 过滤条件，则从 offset 开始返回最多 limit 个嵌入向量。

**参数**:

- `ids` - 要获取的嵌入向量的 ids。可选。
- `where` - 一个 Where 类型的字典，用于按元数据过滤结果。例如 `{$and: [{"color" : "red"}, {"price": 4.20}]}`。可选。
- `limit` - 返回的文档数量。可选。
- `offset` - 开始返回结果的偏移量。用于与 limit 一起进行分页。可选。
- `where_document` - 一个 WhereDocument 类型的字典，用于按文档内容过滤。例如 `{"$contains" : "hello"}`。可选。
- `include` - 指定结果中包含的内容列表，可以包含 `"embeddings"`、`"metadatas"`、`"documents"`。ids 始终包含在内。默认值为 `["metadatas", "documents"]`。可选。

**返回**:

- `GetResult` - 包含结果的 GetResult 对象。

## 预览（peek）

```python
def peek(limit: int = 10) -> GetResult
```

获取数据库中的前几条结果，最多返回 limit 条。

**参数**:

- `limit` - 要返回的结果数量。

**返回**:

- `GetResult` - 包含结果的 GetResult 对象。

## 查询（query）

```python
def query(
        query_embeddings: Optional[OneOrMany[Embedding]] = None,
        query_texts: Optional[OneOrMany[Document]] = None,
        ids: Optional[OneOrMany[ID]] = None,
        n_results: int = 10,
        where: Optional[Where] = None,
        where_document: Optional[WhereDocument] = None,
        include: Include = ["metadatas", "documents",
                            "distances"]) -> QueryResult
```

为提供的 query_embeddings 或 query_texts 获取 n_results 个最近邻的嵌入向量。

**参数**:

- `query_embeddings` - 要查找最近邻的嵌入向量。可选参数。
- `query_texts` - 要查找最近邻的文档文本。可选参数。
- `ids` - 用于限制搜索范围的 ID 列表。可选参数。
- `n_results` - 每个 query_embedding 或 query_texts 返回的邻居数量。可选参数。
- `where` - 用于过滤结果的 Where 类型字典。例如：`{$and: [{"color" : "red"}, {"price": 4.20}]}`。可选参数。
- `where_document` - 用于根据文档内容进行过滤的 WhereDocument 类型字典。例如：`{"$contains" : "hello"}`。可选参数。
- `include` - 结果中包含内容的列表，可以包含 `"embeddings"`、`"metadatas"`、`"documents"`、`"distances"`。ID 始终包含在内。默认值为 `["metadatas", "documents", "distances"]`。可选参数。

**返回**:

- `QueryResult` - 包含查询结果的 QueryResult 对象。

**抛出异常**:

- `ValueError` - 如果未提供 query_embeddings 或 query_texts 中的任意一个
- `ValueError` - 如果同时提供了 query_embeddings 和 query_texts

## 修改

```python
def modify(name: Optional[str] = None,
           metadata: Optional[CollectionMetadata] = None) -> None
```

修改集合的名称或元数据。

**参数**:

- `name` - 集合的更新名称。可选参数。
- `metadata` - 集合的更新元数据。可选参数。

**返回值**:

  无

## 更新

```python
def update(ids: OneOrMany[ID],
           embeddings: Optional[OneOrMany[Embedding]] = None,
           metadatas: Optional[OneOrMany[Metadata]] = None,
           documents: Optional[OneOrMany[Document]] = None) -> None
```

根据提供的 ID 更新嵌入向量、元数据或文档。

**参数**:

- `ids` - 要更新的嵌入向量的 ID。
- `embeddings` - 要添加的嵌入向量。如果为 None，则会根据文档使用集合中设置的 embedding_function 来计算嵌入向量。可选参数。
- `metadatas` - 与嵌入向量相关联的元数据。在进行查询时，可以基于此元数据进行过滤。可选参数。
- `documents` - 与嵌入向量相关联的文档。可选参数。

**返回值**:

  无

## upsert

```python
def upsert(ids: OneOrMany[ID],
           embeddings: Optional[OneOrMany[Embedding]] = None,
           metadatas: Optional[OneOrMany[Metadata]] = None,
           documents: Optional[OneOrMany[Document]] = None) -> None
```

更新提供的 ID 的 embeddings、metadatas 或 documents，如果它们不存在则创建。

**参数**:

- `ids` - 要更新的 embeddings 的 ID
- `embeddings` - 要添加的 embeddings。如果为 None，则会根据 documents 使用 Collection 中设置的 embedding_function 来计算 embeddings。可选。
- `metadatas` - 要与 embeddings 关联的元数据。在查询时，可以通过此元数据进行过滤。可选。
- `documents` - 要与 embeddings 关联的文档。可选。

**返回值**:

  无

## delete

```python
def delete(ids: Optional[IDs] = None,
           where: Optional[Where] = None,
           where_document: Optional[WhereDocument] = None) -> None
```

根据 ID 和/或过滤条件删除 embeddings

**参数**:

- `ids` - 要删除的 embeddings 的 ID
- `where` - 用于过滤删除操作的 Where 类型字典。例如 `{$and: [{"color" : "red"}, {"price": 4.20}]}`。可选。
- `where_document` - 用于通过文档内容过滤删除操作的 WhereDocument 类型字典。例如 `{"$contains" : "hello"}`。可选。

**返回值**:

  无