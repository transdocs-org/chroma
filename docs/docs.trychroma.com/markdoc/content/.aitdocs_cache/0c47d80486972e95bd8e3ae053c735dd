# 向 Chroma 集合中添加数据

使用 `.add` 方法可以将数据添加到 Chroma 集合中。该方法接受一个唯一的字符串 `ids` 列表和一个 `documents` 列表。Chroma 将使用集合的[嵌入函数](../embeddings/embedding-functions)自动对这些文档进行嵌入，并存储文档本身。你还可以选择性地为每个添加的文档提供一个元数据字典。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.add(
    ids=["id1", "id2", "id3", ...],
    documents=["lorem ipsum...", "doc2", "doc3", ...],
    metadatas=[{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.add({
    ids: ["id1", "id2", "id3", ...],
    documents: ["lorem ipsum...", "doc2", "doc3", ...],
    metadatas: [{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

如果你添加的记录 ID 已经存在于集合中，则该记录将被忽略，且不会抛出异常。这意味着如果批量添加操作失败，你可以安全地再次运行该操作。

另外，你也可以直接提供一个与文档关联的 `embeddings` 列表，Chroma 将存储这些文档而不自行进行嵌入。请注意，在这种情况下，无法保证嵌入向量与其关联文档之间存在正确映射。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.add(
    ids=["id1", "id2", "id3", ...],
    embeddings=[[1.1, 2.3, 3.2], [4.5, 6.9, 4.4], [1.1, 2.3, 3.2], ...],
    documents=["doc1", "doc2", "doc3", ...],
    metadatas=[{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.add({
    ids: ["id1", "id2", "id3", ...],
    embeddings: [[1.1, 2.3, 3.2], [4.5, 6.9, 4.4], [1.1, 2.3, 3.2], ...],
    documents: ["lorem ipsum...", "doc2", "doc3", ...],
    metadatas: [{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

如果提供的 `embeddings` 的维度与集合中已索引的嵌入向量不一致，则会抛出异常。

你还可以将文档存储在其他地方，仅向 Chroma 提供 `embeddings` 和 `metadata` 列表。你可以使用 `ids` 来将嵌入向量与你存储在别处的文档进行关联。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.add(
    embeddings=[[1.1, 2.3, 3.2], [4.5, 6.9, 4.4], [1.1, 2.3, 3.2], ...],
    metadatas=[{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
    ids=["id1", "id2", "id3", ...]
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.add({
    ids: ["id1", "id2", "id3", ...],
    embeddings: [[1.1, 2.3, 3.2], [4.5, 6.9, 4.4], [1.1, 2.3, 3.2], ...],
    metadatas: [{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
});
```
{% /Tab %}

{% /TabbedCodeBlock %}