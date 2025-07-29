# 元数据过滤

在 `get` 和 `query` 中使用的 `where` 参数用于根据元数据过滤记录。例如，在以下 `query` 操作中，Chroma 仅会查询具有 `page` 元数据字段且值为 `10` 的记录：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.query(
    query_texts=["第一个查询", "第二个查询"],
    where={"page": 10}
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.query({
    queryTexts: ["第一个查询", "第二个查询"],
    where: { page: 10 }
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

为了过滤元数据，你必须向查询提供一个 `where` 过滤字典。该字典必须具有以下结构：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
{
    "metadata_field": {
        <操作符>: <值>
    }
}
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
{
    metadata_field: {
        <操作符>: <值>
    }
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

使用 `$eq` 操作符等价于在 `where` 过滤器中直接使用元数据字段。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
{
    "metadata_field": "搜索字符串"
}

# 等价于

{
    "metadata_field": {
        "$eq": "搜索字符串"
    }
}
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
{
    metadata_field: "搜索字符串"
}

// 等价于

{
    metadata_field: {
        "$eq":"搜索字符串"
    }
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

例如，这里我们查询所有 `page` 元数据字段大于 10 的记录：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.query(
    query_texts=["第一个查询", "第二个查询"],
    where={"page": { "$gt": 10 }}
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.query({
    queryTexts: ["第一个查询", "第二个查询"],
    where: { page: { "$gt": 10 } }
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 使用逻辑操作符

你还可以使用逻辑操作符 `$and` 和 `$or` 来组合多个过滤条件。

`$and` 操作符将返回匹配列表中所有过滤条件的结果。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
{
    "$and": [
        {
            "metadata_field": {
                <操作符>: <值>
            }
        },
        {
            "metadata_field": {
                <操作符>: <值>
            }
        }
    ]
}
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
{
    "$and": [
        {
            metadata_field: { <操作符>: <值> }
        },
        {
            metadata_field: { <操作符>: <值> }
        }
    ]
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

例如，这里我们查询所有 `page` 元数据字段在 5 到 10 之间的记录：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.query(
    query_texts=["第一个查询", "第二个查询"],
    where={
        "$and": [
            {"page": {"$gte": 5 }},
            {"page": {"$lte": 10 }},
        ]
    }
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.query({
    queryTexts: ["第一个查询", "第二个查询"],
    where: {
        "$and": [
            { page: {"$gte": 5 } },
            { page: {"$lte": 10 } },
        ]
    }
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

`$or` 操作符将返回匹配列表中任意一个过滤条件的结果。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
{
    "or": [
        {
            "metadata_field": {
                <操作符>: <值>
            }
        },
        {
            "metadata_field": {
                <操作符>: <值>
            }
        }
    ]
}
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
{
    "or": [
        {
            metadata_field: { <操作符>: <值> }
        },
        {
            metadata_field: { <操作符>: <值> }
        }
    ]
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

例如，这里我们获取所有 `color` 元数据字段是 `red` 或 `blue` 的记录：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.get(
    where={
        "or": [
            {"color": "red"},
            {"color": "blue"},
        ]
    }
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.get({
    where: {
        "or": [
            { color: "red" },
            { color: "blue" },
        ]
    }
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 使用包含操作符

支持以下包含操作符：

- `$in` - 值在预定义的列表中（字符串、整数、浮点数、布尔值）
- `$nin` - 值不在预定义的列表中（字符串、整数、浮点数、布尔值）

`$in` 操作符将返回元数据属性属于提供列表的结果：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
{
  "metadata_field": {
    "$in": ["值1", "值2", "值3"]
  }
}
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
{
    metadata_field: {
        "$in": ["值1", "值2", "值3"]
    }
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

`$nin` 操作符将返回元数据属性不属于提供列表的结果（或者属性的键不存在）：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
{
  "metadata_field": {
    "$nin": ["值1", "值2", "值3"]
  }
}
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
{
    metadata_field: {
        "$nin": ["值1", "值2", "值3"]
    }
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

例如，这里我们获取所有 `author` 元数据字段在可能值列表中的记录：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.get(
    where={
       "author": {"$in": ["Rowling", "Fitzgerald", "Herbert"]}
    }
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.get({
    where: {
        author: {"$in": ["Rowling", "Fitzgerald", "Herbert"]}
    }
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

## 与文档搜索结合使用

`.get` 和 `.query` 支持在[全文搜索](./full-text-search)的基础上进行元数据过滤：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.query(
    query_texts=["doc10", "thus spake zarathustra", ...],
    n_results=10,
    where={"metadata_field": "is_equal_to_this"},
    where_document={"$contains":"search_string"}
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.query({
    queryTexts: ["doc10", "thus spake zarathustra", ...],
    nResults: 10,
    where: { metadata_field: "is_equal_to_this" },
    whereDocument: { "$contains": "search_string" }
})
```
{% /Tab %}

{% /TabbedCodeBlock %}