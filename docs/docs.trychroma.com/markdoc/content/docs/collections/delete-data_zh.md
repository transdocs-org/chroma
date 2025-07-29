# 从 Chroma 集合中删除数据

Chroma 支持通过 `.delete` 方法根据 `id` 删除集合中的条目。与每个条目关联的嵌入向量、文档和元数据都将被删除。

{% Banner type="warn" %}
请注意，这是一项具有破坏性的操作，且**无法撤销**。
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

`.delete` 方法还支持 `where` 过滤器。如果没有提供 `ids`，则会删除集合中所有符合 `where` 过滤条件的条目。

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