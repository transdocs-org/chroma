# 向 Chroma 集合中添加数据

使用 `.add` 方法向 Chroma 集合中添加数据。它接受一个唯一字符串 `ids` 的列表和一个 `documents` 的列表。Chroma 会使用集合的[嵌入函数](../embeddings/embedding-functions)为您嵌入这些文档，并且还会存储文档本身。您可以选择为每个添加的文档提供一个元数据字典。

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

如果您添加的记录 ID 已经存在于集合中，该记录将被忽略，且不会引发任何异常。这意味着如果一批添加操作失败，您可以安全地重新运行它。

另外，您也可以直接提供一个与文档相关的 `embeddings` 列表，Chroma 将存储相关文档而不自行进行嵌入。请注意在这种情况下，无法保证嵌入向量与其关联的文档之间存在映射关系。

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

如果提供的 `embeddings` 的维度与集合中已索引的嵌入向量维度不一致，则会引发异常。

您还可以将文档存储在其他位置，仅向 Chroma 提供 `embeddings` 和 `metadata` 的列表。您可以使用 `ids` 来将这些嵌入向量与存储在其他地方的文档进行关联。

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
})
```
{% /Tab %}

{% /TabbedCodeBlock %}