# 配置 Chroma 集合

Chroma 集合具有一个 `configuration`（配置），它决定了其嵌入索引的构建和使用方式。我们为这些索引配置使用了默认值，这些默认值在大多数使用场景下可以为您带来出色的性能表现。

您在集合中选择使用的[嵌入函数](../embeddings/embedding-functions)也会影响其索引的构建方式，并且该函数也包含在配置中。

当您创建一个集合时，可以根据不同的数据、准确性和性能需求自定义这些索引配置值。一些查询时的配置还可以在集合创建后通过 `.modify` 函数进行修改。

{% CustomTabs %}

{% Tab label="单节点" %}

## HNSW 索引配置

在单节点 Chroma 集合中，我们使用 HNSW（Hierarchical Navigable Small World，层次化可导航小世界）索引来执行近似最近邻（ANN）搜索。

{% Accordion %}

{% AccordionItem label="什么是 HNSW 索引？" %}

HNSW（Hierarchical Navigable Small World）索引是一种基于图的数据结构，专为在高维向量空间中高效执行近似最近邻搜索而设计。它通过构建一个多层级图，每一层包含数据点的一个子集，高层级的数据更稀疏，作为“高速公路”以实现更快的导航。算法在每一层中构建邻近点之间的连接，形成“小世界”特性，从而实现高效的搜索复杂度。在搜索过程中，算法从顶层开始，朝着嵌入空间中的查询点导航，然后逐层向下移动，在每一层逐步优化搜索，直到找到最终的最近邻。

{% /AccordionItem %}

{% /Accordion %}

HNSW 索引参数包括：

* `space` 定义了嵌入空间的距离函数，从而决定了相似性的计算方式。默认值为 `l2`（平方 L2 范数），其他可选值包括 `cosine`（余弦相似度）和 `ip`（内积）。

| 距离度量方式      | 参数      |                                                                                                                                                   公式 |                                                                          使用场景说明                                                                     |
| ----------------- | :-------: |-----------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| 平方 L2 距离      |   `l2`    |                                                                                                {% Latex %} d =  \\sum\\left(A_i-B_i\\right)^2 {% /Latex %} |                         衡量向量之间的绝对几何距离，适用于需要真实空间接近度的场景。                                                                  |
| 内积              |   `ip`    |                                                                                     {% Latex %} d = 1.0 - \\sum\\left(A_i \\times B_i\\right) {% /Latex %} |              强调向量的方向和幅值，常用于推荐系统，其中较大的值表示更强的偏好。                                                                            |
| 余弦相似度        | `cosine`  | {% Latex %} d = 1.0 - \\frac{\\sum\\left(A_i \\times B_i\\right)}{\\sqrt{\\sum\\left(A_i^2\\right)} \\cdot \\sqrt{\\sum\\left(B_i^2\\right)}} {% /Latex %} | 仅衡量向量之间的夹角（忽略幅值），非常适合文本嵌入或关心方向而非尺度的场景。                                                                           |

{% Banner type="note" %}

你需要确保所选择的 `space` 被你的集合（collection）的嵌入函数（embedding function）所支持。每个 Chroma 嵌入函数都会指定其默认的 space 以及支持的 space 列表。
{% /Banner %}

* `ef_construction` 决定了在索引创建过程中用于选择邻居的候选列表大小。更高的值可以提升索引质量，但会消耗更多内存和时间；而较低的值则会加快构建速度，但可能导致准确性下降。默认值为 `100`。
* `ef_search` 决定了在搜索最近邻时使用的动态候选列表的大小。更高的值通过探索更多潜在邻居来提高召回率和准确性，但会增加查询时间和计算开销；而较低的值则会导致更快但准确性较低的搜索。默认值为 `100`。该字段可在创建后修改。
* `max_neighbors` 是图中每个节点在构建索引时所能拥有的最大邻居（连接）数。更高的值会产生更密集的图，从而在搜索期间带来更好的召回率和准确性，但会增加内存使用和构建时间；而较低的值则会生成更稀疏的图，减少内存使用和构建时间，但会降低搜索准确性和召回率。默认值为 `16`。
* `num_threads` 指定在索引构建或搜索操作期间使用的线程数。默认值为 `multiprocessing.cpu_count()`（即可用的 CPU 核心数）。该字段可在创建后修改。
* `batch_size` 控制在索引操作过程中每个批次处理的向量数量。默认值为 `100`。该字段可在创建后修改。
* `sync_threshold` 决定何时将索引与持久化存储进行同步。默认值为 `1000`。该字段可在创建后修改。

* `resize_factor` 控制索引需要调整大小时的增长幅度。默认值为 `1.2`。此字段在创建后可以修改。

例如，我们在这里创建了一个自定义了 `space` 和 `ef_construction` 值的集合：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection = client.create_collection(
    name="my-collection",
    embedding_function=OpenAIEmbeddingFunction(model_name="text-embedding-3-small"),
    configuration={
        "hnsw": {
            "space": "cosine",
            ef_construction": 200
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

在近似最近邻搜索的上下文中，**召回率（recall）** 指的是检索到了多少真正的最近邻。

通常，提高 `ef_search` 会改善召回率，但会减慢查询速度。同样，提高 `ef_construction` 也会改善召回率，但会增加创建索引时的内存使用和运行时间。

选择合适的 HNSW 参数值取决于你的数据、嵌入函数以及对召回率和性能的要求。你可能需要尝试不同的构建和搜索值，以找到满足你需求的最佳参数。

例如，对于一个包含 50,000 个 2048 维嵌入向量的数据集，其生成代码为：
```python
embeddings = np.random.randn(50000, 2048).astype(np.float32).tolist()
```

我们设置了两个 Chroma 集合：
* 第一个集合配置了 `ef_search: 10`。使用集合中的一个特定嵌入向量（`id = 1`）进行查询时，查询耗时 `0.00529` 秒，返回的嵌入向量的距离为：

```
[3629.019775390625, 3666.576904296875, 3684.57080078125]
```

* 第二个集合配置为 `ef_search: 100` 和 `ef_construction: 1000`。在发出相同查询时，这次耗时 `0.00753` 秒（大约慢了 42%），但通过距离衡量，结果更优：

```
[0.0, 3620.593994140625, 3623.275390625]
```
在这个例子中，当使用测试嵌入向量（`id=1`）进行查询时，第一个集合未能找到其自身，尽管它确实存在于集合中（此时它应该作为一个距离为 `0.0` 的结果出现）。而第二个集合虽然速度稍慢，却成功找到了查询嵌入向量本身（由距离 `0.0` 表示），并整体返回了更接近的邻居，从而在性能代价下展现了更好的准确性。


{% /Tab %}

{% Tab label="分布式和 Chroma Cloud" %}

## SPANN 索引配置

在分布式 Chroma 和 Chroma Cloud 集合中，我们使用 SPANN（空间近似最近邻，Spacial Approximate Nearest Neighbors）索引来执行近似最近邻（ANN）搜索。

{% Video link="https://www.youtube.com/embed/1QdwYWd3S1g" title="SPANN 视频" / %}

{% Accordion %}

{% AccordionItem label="什么是 SPANN 索引？" %}

SPANN 索引是一种用于在大规模高维向量集合中高效查找近似最近邻的数据结构。它通过将数据集划分为广泛的簇（这样在搜索过程中可以忽略大部分数据），然后在每个簇内构建高效的小型索引以实现快速的局部查找。这种双层方法有助于减少内存使用和搜索时间，使得在硬盘甚至分布式系统中的机器上存储和搜索数十亿向量变得实际可行。

{% /AccordionItem %}

{% /Accordion %}

{% Banner type="note" %}
目前我们不允许自定义或修改 SPANN 的配置。如果您设置了这些值，服务器将会忽略。
{% /Banner %}

SPANN 索引的参数包括：

* `space` 定义了嵌入空间的距离函数，从而决定了相似性的定义方式。默认值是 `l2`（平方 L2 范数），其他可能的取值包括 `cosine`（余弦相似度）和 `ip`（内积）。

| 距离类型          | 参数  |                                                                                                                                                   公式 |                                                                          直观解释                                                                          |
| ----------------- | :---: |-----------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| 平方 L2 距离      | `l2`  |                                                                                                {% Latex %} d =  \\sum\\left(A_i-B_i\\right)^2 {% /Latex %} |                       衡量向量之间的绝对几何距离，适用于需要真实空间接近度的场景。                        |
| 内积              | `ip`  |                                                                                     {% Latex %} d = 1.0 - \\sum\\left(A_i \\times B_i\\right) {% /Latex %} |             关注向量的方向和大小，常用于推荐系统，其中较大的值表示更强的偏好。              |
| 余弦相似度        | `cosine`  | {% Latex %} d = 1.0 - \\frac{\\sum\\left(A_i \\times B_i\\right)}{\\sqrt{\\sum\\left(A_i^2\\right)} \\cdot \\sqrt{\\sum\\left(B_i^2\\right)}} {% /Latex %} | 仅衡量向量之间的夹角（忽略大小），适用于文本嵌入或关注方向而非尺度的场景。 |

* `search_nprobe` 是指针对一个查询所探测的中心点数量。该值越高，结果越准确，但查询响应时间也会随之增加。推荐值为 64/128。目前我们不允许设置超过 128 的值，默认值为 64。
* `write_nprobe` 与 `search_nprobe` 类似，但用于索引构建阶段。它表示在追加或重新分配点时所搜索的中心点数量。它与 `search_nprobe` 具有相同的限制，默认值为 64。
* `ef_construction` 决定了在索引创建期间选择邻居时使用的候选列表大小。该值越高，索引质量越好，但会消耗更多内存和时间；该值越低，构建速度越快，但准确性降低。默认值为 200。
* `ef_search` 决定在搜索最近邻时使用的动态候选列表的大小。较高的值通过探索更多潜在邻居来提高召回率和准确性，但会增加查询时间和计算成本；较低的值则实现更快但准确性较低的搜索。默认值为 200。
* `max_neighbors` 定义了一个节点的最大邻居数，默认值为 64。
* `reassign_neighbor_count` 是指一个被分裂的簇的最近邻簇数量，这些簇中的点将被考虑重新分配。默认值为 64。

{% /Tab %}

{% /CustomTabs %}

## 嵌入函数配置

在创建集合时选择的嵌入函数以及用于实例化的参数，都会持久化在集合的配置中。这使得在不同客户端中使用集合时，能够正确地重建嵌入函数。

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

**注意：** 许多嵌入（embedding）函数需要 API 密钥才能与第三方嵌入服务提供商进行交互。Chroma 的嵌入函数会自动查找用于存储提供商 API 密钥的标准环境变量。例如，如果设置了环境变量 `OPENAI_API_KEY`，Chroma 的 `OpenAIEmbeddingFunction` 会将其 `api_key` 参数设置为该变量的值。

如果你的 API 密钥存储在一个非标准名称的环境变量中，则可以通过设置 `api_key_env_var` 参数，将嵌入函数配置为使用你自定义的环境变量名称。为了确保嵌入函数正常运行，你需要在使用集合的每个环境中都设置这个变量。

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
```

// 在集合的 `configuration` 中设置 `embedding_function`
cohereCollection = client.getOrCreateCollection({
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

**注意：** 许多嵌入函数需要 API 密钥来与第三方嵌入服务提供商进行交互。Chroma 的嵌入函数会自动查找用于存储提供商 API 密钥的标准环境变量。例如，如果设置了环境变量 `OPENAI_API_KEY`，Chroma 的 `OpenAIEmbeddingFunction` 会将其 `api_key` 参数设置为该变量的值。

如果你的 API 密钥存储在名称非标准的环境变量中，你可以通过设置 `apiKeyEnvVar` 参数，将嵌入函数配置为使用你自定义的环境变量。为了使嵌入函数正常运行，你需要在所有使用该集合的环境中设置这个变量。

```typescript
cohere_ef = CohereEmbeddingFunction({
    apiKeyEnvVar: "MY_CUSTOM_COHERE_API_KEY",
    modelName: "embed-english-light-v2.0",
    truncate: "NONE",
})
```

{% /Tab %}

{% /Tabs %}
```