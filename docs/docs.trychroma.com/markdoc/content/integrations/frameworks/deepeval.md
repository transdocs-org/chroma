---
id: deepeval
name: DeepEval
---

# DeepEval

[DeepEval](https://www.deepeval.com/integrations/vector-databases/chroma) 是一个开源的 LLM 评估框架。它提供了 20 多个基于研究的评估指标，帮助您评估并选择最适合您 LLM 系统的超参数。

在构建 RAG 系统时，您可以使用 DeepEval 为您的 **Chroma 检索器**选择最佳参数，以实现最优的检索性能和准确性：如 `n_results`、`distance_function`、`embedding_model`、`chunk_size` 等。

{% Banner type="tip" %}
有关如何使用 DeepEval 的更多信息，请参阅 [DeepEval 文档](https://www.deepeval.com/docs/getting-started)。
{% /Banner %}

## 快速开始

### 步骤 1：安装

```CLI
pip install deepeval
```

### 步骤 2：准备测试用例

准备一个查询语句，使用您的 RAG 流程生成响应，并从 Chroma 检索器中存储检索上下文，以创建一个用于评估的 `LLMTestCase`。

```python
...

def chroma_retriever(query):
    query_embedding = model.encode(query).tolist() # 替换为您的嵌入模型
    res = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )
    return res["metadatas"][0][0]["text"]

query = "Chroma 是如何工作的？"
retrieval_context = search(query)
actual_output = generate(query, retrieval_context)  # 替换为您的 LLM 函数

test_case = LLMTestCase(
    input=query,
    retrieval_context=retrieval_context,
    actual_output=actual_output
)
```

### 步骤 3：评估

定义检索器指标，如 `Contextual Precision`（上下文精确度）、`Contextual Recall`（上下文召回率）和 `Contextual Relevancy`（上下文相关性），以评估测试用例。召回率确保检索到足够的向量，而相关性通过过滤不相关的内容减少噪声。

{% Banner type="tip" %}
平衡召回率和相关性是关键。`distance_function` 和 `embedding_model` 影响召回率，而 `n_results` 和 `chunk_size` 影响相关性。
{% /Banner %}

```python
from deepeval.metrics import (
    ContextualPrecisionMetric,
    ContextualRecallMetric,
    ContextualRelevancyMetric
)
from deepeval import evaluate
...

evaluate(
    [test_case],
    [
        ContextualPrecisionMetric(),
        ContextualRecallMetric(),
        ContextualRelevancyMetric(),
    ],
)
```

### 步骤 4：可视化与优化

要可视化评估结果，请运行以下命令登录到 [Confident AI（DeepEval 平台）](https://www.confident-ai.com/)：

```
deepeval login
```

登录后，运行 `evaluate` 将自动把评估结果发送到 Confident AI，在那里您可以可视化和分析性能指标，识别导致检索器失败的超参数，并优化您的 Chroma 检索器以提高准确性。

![](https://github.com/confident-ai/deepeval/raw/main/assets/demo.gif)

{% Banner type="tip" %}
如需了解更多如何使用该平台的信息，请参阅 [快速入门指南](https://documentation.confident-ai.com/)。
{% /Banner %}

## 支持

如有关于集成的任何问题或疑问，请通过 [Discord](https://discord.com/invite/a3K9c8GRGt) 联系 DeepEval 团队。