# JS 客户端

## 类: ChromaClient

### 构造函数

* `new ChromaClient(params?)`

创建一个新的 ChromaClient 实例。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `ChromaClientParams` | 创建新客户端的参数 |

**示例**

```typescript
const client = new ChromaClient({
  path: "http://localhost:8000"
});
```

## 方法

### countCollections

* `countCollections(): Promise<number>`

统计所有集合的数量。

#### 返回值

`Promise<number>`

一个以集合数量为结果的 Promise。

**抛出异常**

如果统计集合时出现问题。

**示例**

```typescript
const collections = await client.countCollections();
```

### createCollection

* `createCollection(params): Promise<Collection>`

使用指定属性创建一个新集合。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `CreateCollectionParams` | 创建新集合的参数 |

#### 返回值

`Promise<Collection>`

一个以创建的集合为结果的 Promise。

**抛出异常**

* 如果客户端无法连接到服务器。
* 如果创建集合时出现问题。

**示例**

```typescript
const collection = await client.createCollection({
  name: "my_collection",
  metadata: {
    "description": "我的第一个集合"
  }
});
```

### deleteCollection

* `deleteCollection(params): Promise<void>`

删除指定名称的集合。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `DeleteCollectionParams` | 删除集合的参数 |

#### 返回值

`Promise<void>`

一个在集合删除后解析的 Promise。

**抛出异常**

如果删除集合时出现问题。

**示例**

```typescript
await client.deleteCollection({
 name: "my_collection"
});
```

### getCollection

`getCollection(params): Promise<Collection>`

获取指定名称的集合。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `GetCollectionParams` | 获取集合的参数 |

#### 返回值

`Promise<Collection>`

一个以集合为结果的 Promise。

**抛出异常**

如果获取集合时出现问题。

**示例**

```typescript
const collection = await client.getCollection({
  name: "my_collection"
});
```

### getOrCreateCollection

* `getOrCreateCollection(params): Promise<Collection>`

获取或创建具有指定属性的集合。

#### 参数

| 名称 | 类型 | 描述 |
| :------ | :------ | :------ |
| `params` | `CreateCollectionParams` | 创建新集合的参数 |

#### 返回值

`Promise<Collection>`

一个以获取或创建的集合为结果的 Promise。

**抛出异常**

如果获取或创建集合时出现问题。

**示例**

```typescript
const collection = await client.getOrCreateCollection({
  name: "my_collection",
  metadata: {
    "description": "我的第一个集合"
  }
});
```

### heartbeat

* `heartbeat(): Promise<number>`

返回来自 Chroma API 的心跳响应。

#### 返回值

`Promise<number>`

一个以心跳响应为结果的 Promise。

**抛出异常**

如果客户端无法连接到服务器。

**示例**

```typescript
const heartbeat = await client.heartbeat();
```

### listCollections

* `listCollections(params?): Promise<CollectionParams>`

列出所有集合。

#### 参数

| 名称 | 类型 |
| :--------- | :------ |
| `params` | `ListCollectionsParams` |

#### 返回值

`Promise<CollectionParams>`

一个以集合名称列表为结果的 Promise。

**抛出异常**

如果列出集合时出现问题。

**示例**

```typescript
const collections = await client.listCollections({
    limit: 10,
    offset: 0,
});
```

### reset

* `reset(): Promise<boolean>`

通过调用重置端点的 API 调用来重置对象状态。

#### 返回值

`Promise<boolean>`

一个在重置操作完成后解析的 Promise。

**抛出异常**

* 如果客户端无法连接到服务器。
* 如果服务器在重置状态时遇到错误。

**示例**

```typescript
await client.reset();
```

### version

* `version(): Promise<string>`

返回 Chroma API 的版本号。

#### 返回值

`Promise<string>`

一个以 Chroma API 版本为结果的 Promise。

**抛出异常**

如果客户端无法连接到服务器。

**示例**

```typescript
const version = await client.version();
```