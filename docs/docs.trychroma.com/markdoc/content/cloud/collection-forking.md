# 集合分叉（Collection Forking）

**Chroma Cloud 中的即时写时复制集合分叉功能。**

分叉功能可让你从现有集合中即时创建一个新集合，其底层使用的是写时复制（copy-on-write）机制。分叉的集合最初与其源集合共享数据，只有在你进行增量修改后才会产生额外的存储开销。

{% Banner type="tip" %}
**分叉功能仅在 Chroma Cloud 中可用。** 单节点 Chroma 的文件系统不支持分叉。
{% /Banner %}

## 工作原理

- **写时复制（Copy-on-write）**：分叉共享源集合的数据块。向任意一个分支写入新数据时，系统会分配新的数据块；未更改的数据继续保持共享状态。
- **即时性**：无论集合大小，分叉操作都能快速完成。
- **隔离性**：对分叉集合的修改不会影响源集合，反之亦然。

## 尝试使用

- **云控制台 UI**：打开任意集合并点击 "Fork" 按钮。
- **SDK**：使用 Python 或 JavaScript 的分叉 API。

### 示例

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
source_collection = client.get_collection(name="main-repo-index")

# 创建一个分叉集合。名称在数据库中必须唯一。
forked_collection = source_collection.fork(name="main-repo-index-pr-1234")

# 分叉集合可立即查询；修改是隔离的
forked_collection.add(documents=["new content"], ids=["doc-pr-1"])  # 按增量存储计费
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
const sourceCollection = await client.getCollection({ name: "main-repo-index" });

// 创建一个分叉集合。名称在数据库中必须唯一。
const forkedCollection = await sourceCollection.fork({ name: "main-repo-index-pr-1234" });

await forkedCollection.add({
  ids: ["doc-pr-1"],
  documents: ["new content"], // 按增量存储计费
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

[在此笔记本](https://github.com/chroma-core/chroma/blob/main/examples/advanced/forking.ipynb) 中，你可以找到一个完整的演示。我们将代码库索引到 Chroma 集合中，并通过分叉高效地为新分支创建集合。

## 定价

- **每次分叉调用 $0.03**
- **存储费用**：仅对分叉后写入的增量数据块收费（基于写时复制）。未更改的数据在各个分支之间保持共享。

## 配额与错误

Chroma 会对你的分叉树中的分叉边数进行限制。每次调用 "fork" 方法时，都会从父集合到子集合创建一条新的边。该限制包括根集合及其所有后代所创建的边；见下图。当前默认限制为每个树 **4,096 条边**。如果你删除了一个集合，它的边仍然保留在树中并计入总数。

如果你超出该限制，请求将返回针对 `NUM_FORKS` 规则的配额错误。此时，你可以创建一个完整拷贝的新集合，以开始一个新的根集合。

{% MarkdocImage lightSrc="/fork-edges-light.png" darkSrc="/fork-edges-dark.png" alt="Fork edges diagram" /%}

## 使用分叉的场景

- **数据版本控制/快照保存**：在数据演化过程中维护一致的快照。
- **类似 Git 的工作流**：例如，通过从分支的分叉点进行分叉，然后将差异应用到该分叉上。这比重新摄入整个数据集，在写入和存储成本上都更加节省。

## 注意事项

- 所有分叉集合将属于与源集合相同的数据库。