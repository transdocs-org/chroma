---
id: deepeval
name: DeepEval
---

# DeepEval

[DeepEval](https://www.deepeval.com/integrations/vector-databases/chroma) 是一个开源的LLM评估框架。它提供了20多个基于研究的评估指标，帮助您评估并选择最适合您LLM系统的超参数。

在构建RAG系统时，您可以使用DeepEval为您的**Chroma检索器**选择最佳参数，以获得最佳的检索性能和准确性：`n_results`、`distance_function`、`embedding_model`、`chunk_size`等。

{% Banner type="tip" %}
如需了解更多关于如何使用DeepEval的信息，请参阅 [DeepEval文档](https://www.deepeval.com/docs/getting-started)。
{% /Banner %}

## 开始使用

### 步骤 1：安装

```CLI
pip install deepeval
```

### 步骤 2：准备测试用例

准备一个查询语句，使用您的RAG流程生成一个响应，并从您的Chroma检索器中存储检索上下文，以创建一个用于评估的 `LLMTestCase`。

```python
...

def chroma_retriever(query):
    query_embedding = model.encode(query).tolist() # 替换为您的嵌入模型
    res = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )
    return res["metadatas"][0][0]["text"]

query = "Chroma是如何工作的？"
retrieval_context = search(query)
actual_output = generate(query, retrieval_context)  # 替换为您的LLM函数

test_case = LLMTestCase(
    input=query,
    retrieval_context=retrieval_context,
    actual_output=actual_output
)
```

### 第三步：评估

定义检索器指标，如 `Contextual Precision`（上下文精确度）、`Contextual Recall`（上下文召回率）和 `Contextual Relevancy`（上下文相关性），用于评估测试用例。召回率确保检索到足够的向量，而相关性则通过过滤不相关的内容来减少噪声。

{% Banner type="tip" %}
平衡召回率和相关性是关键。`distance_function` 和 `embedding_model` 会影响召回率，而 `n_results` 和 `chunk_size` 则影响相关性。
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

### 第四步：可视化与优化

要可视化评估结果，请运行以下命令登录 [Confident AI（DeepEval 平台）](https://www.confident-ai.com/)：

```
deepeval login
```

登录后，运行 `evaluate` 命令会自动将评估结果发送到 Confident AI，在这里你可以可视化和分析性能指标，识别导致检索失败的超参数，并优化你的 Chroma 检索器以提高准确性。

![](https://github.com/confident-ai/deepeval/raw/main/assets/demo.gif)

{% Banner type="tip" %}
要了解更多关于平台的使用方法，请参阅 [快速入门指南](https://documentation.confident-ai.com/)。
{% /Banner %}

## 支持

如在集成过程中遇到任何问题或疑问，您可以通过 [Discord](https://discord.com/invite/a3K9c8GRGt) 联系 DeepEval 团队。