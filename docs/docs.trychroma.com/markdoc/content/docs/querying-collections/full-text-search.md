# 全文搜索和正则表达式

{% Tabs %}

{% Tab label="python" %}

`get` 和 `query` 中的 `where_document` 参数用于根据文档内容过滤记录。

我们支持使用 `$contains` 和 `$not_contains` 运算符进行全文搜索。我们也支持使用 `$regex` 和 `$not_regex` 运算符进行[正则表达式](https://regex101.com)模式匹配。

例如，这里我们获取文档中包含搜索字符串的所有记录：

```python
collection.get(
   where_document={"$contains": "search string"}
)
```

*注意*：全文搜索是区分大小写的。

在这里我们获取文档与电子邮件地址的正则表达式模式匹配的所有记录：

```python
collection.get(
   where_document={
       "$regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
   }
)
```

## 使用逻辑运算符

您还可以使用逻辑运算符 `$and` 和 `$or` 来组合多个过滤器。

`$and` 运算符将返回匹配列表中所有过滤器的结果：

```python
collection.query(
    query_texts=["query1", "query2"],
    where_document={
        "$and": [
            {"$contains": "search_string_1"},
            {"$regex": "[a-z]+"},
        ]
    }
)
```

`$or` 运算符将返回匹配列表中任意一个过滤器的结果：

```python
collection.query(
    query_texts=["query1", "query2"],
    where_document={
        "$or": [
            {"$contains": "search_string_1"},
            {"$not_contains": "search_string_2"},
        ]
    }
)
```

## 与元数据过滤结合使用

`.get` 和 `.query` 可以处理 `where_document` 搜索与 [元数据过滤](./metadata-filtering) 的结合：

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

`get` 和 `query` 中的 `whereDocument` 参数用于根据文档内容过滤记录。

我们支持使用 `$contains` 和 `$not_contains` 运算符进行全文搜索。我们也支持使用 `$regex` 和 `$not_regex` 运算符进行[正则表达式](https://regex101.com)模式匹配。

例如，这里我们获取文档中包含搜索字符串的所有记录：

```typescript
await collection.get({
    whereDocument: { "$contains": "search string" }
})
```

这里我们获取文档与电子邮件地址的正则表达式模式匹配的所有记录：

```typescript
await collection.get({
    whereDocument: {
        "$regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    }
})
```

## 使用逻辑运算符

您还可以使用逻辑运算符 `$and` 和 `$or` 来组合多个过滤器。

`$and` 运算符将返回匹配列表中所有过滤器的结果：

```typescript
await collection.query({
    queryTexts: ["query1", "query2"],
    whereDocument: {
        "$and": [
            { "$contains": "search_string_1" },
            { "$regex": "[a-z]+" },
        ]
    }
})
```

`$or` 运算符将返回匹配列表中任意一个过滤器的结果：

```typescript
await collection.query({
    queryTexts: ["query1", "query2"],
    whereDocument: {
        "$or": [
            { "$contains": "search_string_1" },
            { "$not_contains": "search_string_2" },
        ]
    }
})
```

## 与元数据过滤结合使用

`.get` 和 `.query` 可以处理 `whereDocument` 搜索与 [元数据过滤](./metadata-filtering) 的结合：

```typescript
await collection.query({
    queryTexts: ["doc10", "thus spake zarathustra", ...],
    nResults: 10,
    where: { metadata_field: "is_equal_to_this" },
    whereDocument: { "$contains": "search_string" }
})
```

{% /Tab %}

{% /Tabs %}