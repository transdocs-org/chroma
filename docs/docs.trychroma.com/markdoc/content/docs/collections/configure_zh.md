# 配置 Chroma 集合

Chroma 集合具有一个 `configuration`（配置），它决定了其嵌入索引是如何构建和使用的。我们为这些索引配置使用默认值，这些默认值在大多数使用场景下都可以提供出色的性能。

你选择在集合中使用的 [嵌入函数](../embeddings/embedding-functions) 也会影响其索引的构建，并且包含在配置中。

当你创建一个集合时，可以根据不同的数据、准确性和性能需求自定义这些索引配置值。一些查询时的配置也可以在集合创建后使用 `.modify` 函数进行修改。

{% CustomTabs %}

{% Tab label="单节点" %}

## HNSW 索引配置

在单节点 Chroma 集合中，我们使用 HNSW（Hierarchical Navigable Small World，分层可导航小世界）索引来执行近似最近邻（ANN）搜索。

{% Accordion %}

{% AccordionItem label="什么是 HNSW 索引？" %}

HNSW（Hierarchical Navigable Small World）索引是一种基于图的数据结构，专为在高维向量空间中高效执行近似最近邻搜索而设计。它通过构建多层图来工作，其中每一层都包含数据点的一个子集，上层更稀疏并作为“高速公路”以实现更快的导航。该算法在每一层中构建邻近点之间的连接，创建出“小世界”特性，从而实现高效的搜索复杂度。在搜索时，算法从顶层开始，朝着嵌入空间中的查询点导航，然后逐层向下移动，在每一层中逐步细化搜索，直到找到最终的最近邻。

{% /AccordionItem %}

{% /Accordion %}

HNSW 索引的参数包括：

* `space` 定义了嵌入空间的距离函数，从而决定了相似性的定义方式。默认值为 `l2`（平方 L2 范数），其他可能的值包括 `cosine`（余弦相似度）和 `ip`（内积）。

| 距离类型         | 参数     |                                                                                                                                                   公式 |                                                                          直观解释                                                                          |
| ---------------- | :------: |----------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| 平方 L2          |  `l2`   |                                                                                                {% Latex %} d =  \\sum\\left(A_i-B_i\\right)^2 {% /Latex %} |                       衡量向量之间的绝对几何距离，适合需要真实空间接近度的场景。                        |
| 内积             |  `ip`   |                                                                                     {% Latex %} d = 1.0 - \\sum\\left(A_i \\times B_i\\right) {% /Latex %} |             关注向量的方向和大小，常用于推荐系统，较大的值表示更强的偏好。              |
| 余弦相似度       | `cosine` | {% Latex %} d = 1.0 - \\frac{\\sum\\left(A_i \\times B_i\\right)}{\\sqrt{\\sum\\left(A_i^2\\right)} \\cdot \\sqrt{\\sum\\left(B_i^2\\right)}} {% /Latex %} | 仅衡量向量之间的夹角（忽略大小），非常适合文本嵌入或关心方向而非尺度的场景。 |

{% Banner type="note" %}
你应该确保你选择的 `space` 被集合的嵌入函数支持。每个 Chroma 嵌入函数都会指定其默认的 `space` 和支持的 `space` 列表。
{% /Banner %}

* `ef_construction` 确定了在索引创建期间用于选择邻居的候选列表的大小。较高的值会提高索引质量，但会消耗更多内存和时间；较低的值则加快构建速度，但准确性降低。默认值为 `100`。
* `ef_search` 确定了在搜索最近邻时使用的动态候选列表的大小。较高的值通过探索更多潜在邻居来提高召回率和准确性，但会增加查询时间和计算成本；较低的值则导致更快但不太准确的搜索。默认值为 `100`。此字段可在创建后修改。
* `max_neighbors` 是索引构建过程中图中每个节点可以拥有的最大邻居（连接）数。较高的值会导致更密集的图，从而在搜索期间提高召回率和准确性，但会增加内存使用和构建时间；较低的值则创建更稀疏的图，减少内存使用和构建时间，但会降低搜索的准确性和召回率。默认值为 `16`。
* `num_threads` 指定在索引构建或搜索操作期间使用的线程数。默认值为 `multiprocessing.cpu_count()`（可用 CPU 核心数）。此字段可在创建后修改。
* `batch_size` 控制在索引操作期间每个批次处理的向量数量。默认值为 `100`。此字段可在创建后修改。
* `sync_threshold` 确定何时将索引与持久化存储同步。默认值为 `1000`。此字段可在创建后修改。
* `resize_factor` 控制索引需要调整大小时的增长幅度。默认值为 `1.2`。此字段可在创建后修改。

例如，以下我们创建了一个集合，并自定义了 `space` 和 `ef_construction` 的值：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection = client.create_collection(
    name="my-collection",
    embedding_function=OpenAIEmbeddingFunction(model_name="text-embedding-3-small"),
    configuration={
        "hnsw": {
            "space": "cosine",
            "ef_construction": 200
        }
    }
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
collection = await client.createCollection({
    name: "my-collection",
    embeddingFunction: new OpenAIEmbeddingFunction({ modelName: "text-embedding-3-small" }),
    configuration: {
        hnsw: {
            space: "cosine",
            ef_construction: 200
        }
    }
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 微调 HNSW 参数

在近似最近邻搜索的上下文中，**召回率（recall）** 指的是检索到的真正最近邻的数量。

增加 `ef_search` 通常会提高召回率，但会减慢查询速度。同样，增加 `ef_construction` 也会提高召回率，但在创建索引时会增加内存使用和运行时间。

为 HNSW 参数选择合适的值取决于您的数据、嵌入函数以及对召回率和性能的要求。您可能需要尝试不同的构建和搜索值，以找到满足需求的参数。

例如，对于一个包含 50,000 个 2048 维嵌入的数据集，这些嵌入是通过以下代码生成的：

```python
embeddings = np.random.randn(50000, 2048).astype(np.float32).tolist()
```

我们设置了两个 Chroma 集合：
* 第一个集合配置了 `ef_search: 10`。当使用集合中的特定嵌入（`id = 1`）进行查询时，查询耗时 `0.00529` 秒，返回的嵌入距离如下：

```
[3629.019775390625, 3666.576904296875, 3684.57080078125]
```

* 第二个集合配置了 `ef_search: 100` 和 `ef_construction: 1000`。使用相同的查询时，这次耗时 `0.00753` 秒（大约慢了 42%），但结果更优，从距离上可以体现这一点：

```
[0.0, 3620.593994140625, 3623.275390625]
```

在这个例子中，当使用测试嵌入（`id=1`）进行查询时，第一个集合未能找到嵌入本身（尽管它存在于集合中，此时结果中应该有一个距离为 `0.0` 的项）。第二个集合虽然稍慢，但成功找到了查询嵌入（距离为 `0.0`），并且返回的邻居整体上更接近，展现了更好的准确性，但以性能为代价。


{% /Tab %}

{% Tab label="分布式和 Chroma Cloud" %}

## SPANN 索引配置

在分布式 Chroma 和 Chroma Cloud 集合中，我们使用 SPANN（空间近似最近邻）索引来执行近似最近邻（ANN）搜索。

{% Video link="https://www.youtube.com/embed/1QdwYWd3S1g" title="SPANN 视频" / %}

{% Accordion %}

{% AccordionItem label="什么是 SPANN 索引？" %}

SPANN 索引是一种用于在大型高维向量集中高效查找近似最近邻的数据结构。它通过将数据集划分为广泛的簇（这样在搜索时可以忽略大部分数据），然后在每个簇内构建高效的小型索引以实现快速的局部查找。这种双层方法有助于减少内存使用和搜索时间，使得在硬盘甚至分布式系统中的机器上存储数十亿向量的情况下进行搜索成为可能。

{% /AccordionItem %}

{% /Accordion %}

{% Banner type="note" %}
目前我们不允许自定义或修改 SPANN 配置。如果您设置了这些值，服务器将忽略它们。
{% /Banner %}

SPANN 索引的参数包括：

* `space` 定义了嵌入空间的距离函数，从而决定了相似度的定义方式。默认值为 `l2`（平方 L2 范数），其他可能的值包括 `cosine`（余弦相似度）和 `ip`（内积）。

| 距离              | 参数      |                                                                                                                                                   公式 |                                                                          含义                                                                          |
| ----------------- | :-------: |-----------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| 平方 L2           |   `l2`    |                                                                                                {% Latex %} d =  \\sum\\left(A_i-B_i\\right)^2 {% /Latex %} |                       衡量向量之间的绝对几何距离，适用于需要真实空间接近性的情况。                        |
| 内积              |   `ip`    |                                                                                     {% Latex %} d = 1.0 - \\sum\\left(A_i \\times B_i\\right) {% /Latex %} |             关注向量的方向和大小，常用于推荐系统，较大的值表示更强的偏好。              |
| 余弦相似度        | `cosine`  | {% Latex %} d = 1.0 - \\frac{\\sum\\left(A_i \\times B_i\\right)}{\\sqrt{\\sum\\left(A_i^2\\right)} \\cdot \\sqrt{\\sum\\left(B_i^2\\right)}} {% /Latex %} | 仅衡量向量之间的夹角（忽略大小），非常适合文本嵌入或关心方向而非尺度的场景。 |

* `search_nprobe` 是查询时探测的中心数。值越高结果越准确。随着 `search_nprobe` 的增加，查询响应时间也会增加。推荐值为 64/128。目前我们不允许设置高于 128 的值。默认值为 64。
* `write_nprobe` 与 `search_nprobe` 类似，但用于索引构建阶段。它是追加或重新分配点时搜索的中心数。它与 `search_nprobe` 有相同的限制。默认值为 64。
* `ef_construction` 决定了在索引创建期间选择邻居时使用的候选列表的大小。更高的值会提高索引质量，但会增加内存和时间开销，而较低的值则会加快构建速度但准确性降低。默认值为 200。
* `ef_search` 决定了在搜索最近邻时使用的动态候选列表的大小。更高的值通过探索更多潜在邻居来提高召回率和准确性，但会增加查询时间和计算成本，而较低的值则会导致更快但不太准确的搜索。默认值为 200。
* `max_neighbors` 定义了一个节点的最大邻居数。默认值为 64。
* `reassign_neighbor_count` 是拆分簇的最近邻簇数，这些簇的点将被考虑重新分配。默认值为 64。

{% /Tab %}

{% /CustomTabs %}

## 嵌入函数配置

在创建集合时选择的嵌入函数以及实例化时的参数，都会持久化保存在集合的配置中。这使得在跨不同客户端使用集合时，我们可以正确地重建它。

你可以将嵌入函数作为参数传递给“create”方法，或者直接在配置中设置：

{% Tabs %}

{% Tab label="python" %}

安装 `openai` 和 `cohere` 包：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="pip" %}
```terminal
pip install openai cohere
```
{% /Tab %}

{% Tab label="poetry" %}
```terminal
poetry add openai cohere
```
{% /Tab %}

{% Tab label="uv" %}
```terminal
uv pip install openai cohere
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

使用嵌入函数和自定义配置创建集合：

```python
import os
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction, CohereEmbeddingFunction

# 使用 `embedding_function` 参数
openai_collection = client.create_collection(
    name="my_openai_collection",
    embedding_function=OpenAIEmbeddingFunction(
        model_name="text-embedding-3-small"
    ),
    configuration={"hnsw": {"space": "cosine"}}
)

# 在集合的 `configuration` 中设置 `embedding_function`
cohere_collection = client.get_or_create_collection(
    name="my_cohere_collection",
    configuration={
        "embedding_function": CohereEmbeddingFunction(
            model_name="embed-english-light-v2.0",
            truncate="NONE"
        ),
        "hnsw": {"space": "cosine"}
    }
)
```

**注意：** 许多嵌入函数需要API密钥来与第三方嵌入服务提供商进行交互。Chroma的嵌入函数会自动查找用于存储提供商API密钥的标准环境变量。例如，如果设置了 `OPENAI_API_KEY` 环境变量，Chroma 的 `OpenAIEmbeddingFunction` 会将其 `api_key` 参数设置为该变量的值。

如果您的API密钥存储在非标准名称的环境变量中，则可以通过设置 `api_key_env_var` 参数来配置嵌入函数以使用自定义环境变量。为了确保嵌入函数正常运行，您需要在使用该集合的每个环境中设置此变量。

```python
cohere_ef = CohereEmbeddingFunction(
    api_key_env_var="MY_CUSTOM_COHERE_API_KEY",
    model_name="embed-english-light-v2.0",
    truncate="NONE",
)
```

{% /Tab %}

{% Tab label="typescript" %}

安装 `@chroma-core/openai` 和 `@chroma-core/cohere` 包：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="npm" %}
```terminal
npm install @chroma-core/openai @chroma-core/cohere
```
{% /Tab %}

{% Tab label="pnpm" %}
```terminal
pnpm add @chroma-core/openai @chroma-core/cohere
```
{% /Tab %}

{% Tab label="yarn" %}
```terminal
yarn add @chroma-core/openai @chroma-core/cohere
```
{% /Tab %}

{% Tab label="bun" %}
```terminal
bun add @chroma-core/openai @chroma-core/cohere
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

使用嵌入函数和自定义配置创建集合：

```typescript
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";
import { CohereEmbeddingFunction } from "@chroma-core/cohere"

// 使用 `embedding_function` 参数
openAICollection = client.createCollection({
    name: "my_openai_collection",
    embedding_function: new OpenAIEmbeddingFunction({
        model_name: "text-embedding-3-small"
    }),
    configuration: { hnsw: { space: "cosine" } }
});

// 在集合的 `configuration` 中设置 `embedding_function`
cohereCollection = client.getOrCreate_collection({
    name: "my_cohere_collection",
    configuration: {
        embeddingFunction: new CohereEmbeddingFunction({
            modelName: "embed-english-light-v2.0",
            truncate: "NONE"
        }),
        hnsw: { space: "cosine" }
    }
})
```

**注意：** 许多嵌入函数需要API密钥来与第三方嵌入服务提供商进行交互。Chroma的嵌入函数会自动查找用于存储提供商API密钥的标准环境变量。例如，如果设置了 `OPENAI_API_KEY` 环境变量，Chroma 的 `OpenAIEmbeddingFunction` 会将其 `api_key` 参数设置为该变量的值。

如果您的API密钥存储在非标准名称的环境变量中，则可以通过设置 `apiKeyEnvVar` 参数来配置嵌入函数以使用自定义环境变量。为了确保嵌入函数正常运行，您需要在使用该集合的每个环境中设置此变量。

```typescript
cohere_ef = CohereEmbeddingFunction({
    apiKeyEnvVar: "MY_CUSTOM_COHERE_API_KEY",
    modelName: "embed-english-light-v2.0",
    truncate: "NONE",
})
```

{% /Tab %}

{% /Tabs %}