# 定价

Chroma Cloud 采用简单透明的按使用量计费模式。您只需为您的 **写入**、**读取** 和 **存储** 付费，无隐藏费用，也无功能分级限制。

需要估算费用？请试用我们的 [定价计算器](https://trychroma.com/pricing)。

## 写入（Writes）

Chroma Cloud 按每次写入的逻辑 GiB 收费 **2.50 美元**，包括添加（add）、更新（update）或插入并更新（upsert）操作。

- 一个 *逻辑 GiB* 是指你发送给 Chroma 的数据的原始、未压缩大小，无论其内部如何存储或索引。
- 每次写入仅收费一次，后台的压缩（compaction）或重新索引（reindexing）不会产生额外费用。

## 读取（Reads）

读取费用基于扫描的数据量和返回的数据量：

- **每 TiB 扫描收费 0.0075 美元**
- **每 GiB 返回数据收费 0.09 美元**

**查询计费方式：**

- 一次向量相似性查询计为 1 次查询。
- 查询中的每个元数据或全文搜索谓词计为额外的一次查询。
- 全文搜索和正则表达式过滤器按 *(N – 2)* 次查询计费，其中 *N* 是搜索字符串中的字符数。

**示例：**

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.query(
   query_embeddings=[[1.0, 2.3, 1.1, ...]],
   where_document={"$contains": "hello world"}
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.query(
   queryEmbeddings=[[1.0, 2.3, 1.1, ...]], 
   whereDocument={"$contains": "hello world"}
)
```
{% /Tab %}

{% /TabbedCodeBlock %}

对于上述查询（一次向量搜索和一个 10 个字符的全文搜索），在 10 GiB 数据中查询产生的费用为：

- 10,000 次查询 × 10 个单位（1 个向量 + 9 个全文搜索）= 100,000 查询单位
- 10 GiB = 0.01 TiB 扫描 → 100,000 × 0.01 TiB × $0.0075 = **7.50 美元**

## 存储（Storage）

存储按 **每月每 GiB 0.33 美元** 计费，并按小时分摊：

- 存储使用量以 **GiB 小时** 为单位计算，以反映时间上的波动。
- 存储费用基于写入的逻辑数据量计费。
- 所有缓存（包括 Chroma 内部使用的 SSD 缓存）不向您收费。

## 常见问题

**是否有免费额度？**

我们为新用户提供 5 美元的信用额度。

**多租户情况下如何计费？**

计费基于账户。您 Chroma Cloud 账户内所有集合（collection）和租户（tenant）的数据将统一计费。

**是否可以在我自己的 VPC 中部署 Chroma？**

可以。我们提供 BYOC（Bring Your Own Cloud）选项用于单租户部署。[联系我们](mailto:support@trychroma.com) 获取更多信息。

**后台索引是否收费？**

不收费。您仅需为写入的逻辑数据和使用的存储付费。后台任务（如压缩或重新索引）不会产生额外的写入或读取费用。