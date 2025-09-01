# 从 Chroma 集合中删除数据

Chroma 支持通过 `.delete` 方法按 `id` 删除集合中的条目。与每个条目相关的嵌入向量、文档和元数据也将一并被删除。

{% Banner type="warn" %}
请注意，这是一项具有破坏性的操作，且无法撤销。
{% /Banner %}

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.delete(
    ids=["id1", "id2", "id3",...],
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.delete({
    ids: ["id1", "id2", "id3",...],
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

`.delete` 方法也支持使用 `where` 过滤条件。如果没有提供 `ids`，则会删除集合中符合 `where` 过滤条件的所有条目。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.delete(
    ids=["id1", "id2", "id3",...],
	where={"chapter": "20"}
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.delete({
    ids: ["id1", "id2", "id3",...], //ids
    where: {"chapter": "20"} //where
})
```
{% /Tab %}

{% /TabbedCodeBlock %}