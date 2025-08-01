# 类：Collection

## 属性

* `id: string`
* `metadata: CollectionMetadata`
* `name: string`

## 方法

### add

* `add(params): Promise<void>`

向集合中添加条目。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `AddRecordsParams` | 查询的参数。 |

#### 返回值

`Promise<void>`

- 来自API的响应。

**示例**

```typescript
const response = await collection.add({
  ids: ["id1", "id2"],
  embeddings: [[1, 2, 3], [4, 5, 6]],
  metadatas: [{ "key": "value" }, { "key": "value" }],
  documents: ["document1", "document2"]
});
```

### count

* `count(): Promise<number>`

统计集合中的条目数量。

#### 返回值

`Promise<number>`

- 集合中的条目数量。

**示例**

```typescript
const count = await collection.count();
```

### delete

* `delete(params?): Promise<string[]>`

从集合中删除条目。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `DeleteParams` | 从集合中删除条目的参数。 |

#### 返回值

`Promise<string[]>`

一个解析为被删除条目ID的Promise。

**抛出**

如果从集合中删除条目时出现问题。

**示例**

```typescript
const results = await collection.delete({
  ids: "some_id",
  where: {"name": {"$eq": "John Doe"}},
  whereDocument: {"$contains":"search_string"}
});
```

### get

* `get(params?): Promise<MultiGetResponse>`

从集合中获取条目。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `BaseGetParams` | 查询的参数。 |

#### 返回值

`Promise<MultiGetResponse>`

服务器的响应。

**示例**

```typescript
const response = await collection.get({
  ids: ["id1", "id2"],
  where: { "key": "value" },
  limit: 10,
  offset: 0,
  include: ["embeddings", "metadatas", "documents"],
  whereDocument: { "$contains": "value" },
});
```

### modify

* `modify(params): Promise<CollectionParams>`

修改集合的名称或元数据。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `Object` | 查询的参数。 |
| `params.metadata?` | `CollectionMetadata` | 可选的新集合元数据。 |
| `params.name?` | `string` | 可选的新集合名称。 |

#### 返回值

`Promise<CollectionParams>`

来自API的响应。

**示例**

```typescript
const response = await client.updateCollection({
  name: "new name",
  metadata: { "key": "value" },
});
```

### peek

* `peek(params?): Promise<MultiGetResponse>`

窥探集合内部。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `PeekParams` | 查询的参数。 |

#### 返回值

`Promise<MultiGetResponse>`

一个解析为查询结果的Promise。

**抛出**

如果执行查询时出现问题。

**示例**

```typescript
const results = await collection.peek({
  limit: 10
});
```

### query

* `query(params): Promise<MultiQueryResponse>`

使用指定参数对集合执行查询。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `QueryRecordsParams` | 查询的参数。 |

#### 返回值

`Promise<MultiQueryResponse>`

一个解析为查询结果的Promise。

**抛出**

如果执行查询时出现问题。

**示例**

```typescript
// 使用嵌入向量查询集合
const embeddingsResults = await collection.query({
  queryEmbeddings: [[0.1, 0.2, ...], ...],
  ids: ["id1", "id2", ...],
  nResults: 10,
  where: {"name": {"$eq": "John Doe"}},
  include: ["metadata", "document"]
});

// 使用查询文本查询集合
const textResults = await collection.query({
    queryTexts: "some text",
    ids: ["id1", "id2", ...],
    nResults: 10,
    where: {"name": {"$eq": "John Doe"}},
    include: ["metadata", "document"]
});
```

### update

* `update(params): Promise<void>`

更新集合中的条目。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `UpdateRecordsParams` | 查询的参数。 |

#### 返回值

`Promise<void>`

**示例**

```typescript
const response = await collection.update({
  ids: ["id1", "id2"],
  embeddings: [[1, 2, 3], [4, 5, 6]],
  metadatas: [{ "key": "value" }, { "key": "value" }],
  documents: ["document1", "document2"],
});
```

### upsert

* `upsert(params): Promise<void>`

将条目插入或更新到集合中。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `AddRecordsParams` | 查询的参数。 |

#### 返回值

`Promise<void>`

**示例**

```typescript
const response = await collection.upsert({
  ids: ["id1", "id2"],
  embeddings: [[1, 2, 3], [4, 5, 6]],
  metadatas: [{ "key": "value" }, { "key": "value" }],
  documents: ["document1", "document2"],
});
```