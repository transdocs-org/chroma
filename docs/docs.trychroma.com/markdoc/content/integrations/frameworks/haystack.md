---
id: haystack
name: Haystack
---

# Haystack

[Haystack](https://github.com/deepset-ai/haystack) 是一个开源的 Python LLM 框架。它通过多个 LLM 提供商提供 [嵌入器（embedders）](https://docs.haystack.deepset.ai/v2.0/docs/embedders)、[生成器（generators）](https://docs.haystack.deepset.ai/v2.0/docs/generators) 和 [排序器（rankers）](https://docs.haystack.deepset.ai/v2.0/docs/rankers)，还提供了用于 [预处理（preprocessing）](https://docs.haystack.deepset.ai/v2.0/docs/preprocessors) 和数据准备的工具，以及连接到多个向量数据库（包括 Chroma 等）的连接器。Haystack 允许您使用 Haystack 中现成的组件以及 [自定义组件](https://docs.haystack.deepset.ai/v2.0/docs/custom-components) 构建自定义的 LLM 应用程序。使用 Haystack 可以构建的一些最常见应用包括检索增强生成流水线（RAG）、问答系统和语义搜索。

![](https://img.shields.io/github/stars/deepset-ai/haystack.svg?style=social&label=Star&maxAge=2400)

|[文档](https://docs.haystack.deepset.ai/v2.0/docs) | [Github](https://github.com/deepset-ai/haystack) | [Haystack 集成](https://haystack.deepset.ai/integrations) | [教程](https://haystack.deepset.ai/tutorials) |

您可以通过安装集成包并使用 `ChromaDocumentStore` 将 Chroma 与 Haystack 一起使用。

### 安装

```terminal
pip install chroma-haystack
```

### 使用

- [Chroma 集成页面](https://haystack.deepset.ai/integrations/chroma-documentstore)
- [Chroma + Haystack 示例](https://colab.research.google.com/drive/1YpDetI8BRbObPDEVdfqUcwhEX9UUXP-m?usp=sharing)

#### 将文档写入 ChromaDocumentStore

```python
import os
from pathlib import Path

from haystack import Pipeline
from haystack.components.converters import TextFileToDocument
from haystack.components.writers import DocumentWriter
from chroma_haystack import ChromaDocumentStore

file_paths = ["data" / Path(name) for name in os.listdir("data")]

document_store = ChromaDocumentStore()

indexing = Pipeline()
indexing.add_component("converter", TextFileToDocument())
indexing.add_component("writer", DocumentWriter(document_store))

indexing.connect("converter", "writer")
indexing.run({"converter": {"sources": file_paths}})
```

#### 在 Chroma 上构建 RAG

```python
from chroma_haystack.retriever import ChromaQueryRetriever
from haystack.components.generators import HuggingFaceTGIGenerator
from haystack.components.builders import PromptBuilder

prompt = """
根据提供的上下文回答问题。
如果上下文中不包含答案，请说“未找到答案”。
上下文：
{% for doc in documents %}
  {{ doc.content }}
{% endfor %}
问题: {{query}}
答案:
"""
prompt_builder = PromptBuilder(template=prompt)

llm = HuggingFaceTGIGenerator(model="mistralai/Mixtral-8x7B-Instruct-v0.1", token='YOUR_HF_TOKEN')
llm.warm_up()
retriever = ChromaQueryRetriever(document_store)

querying = Pipeline()
querying.add_component("retriever", retriever)
querying.add_component("prompt_builder", prompt_builder)
querying.add_component("llm", llm)

querying.connect("retriever.documents", "prompt_builder.documents")
querying.connect("prompt_builder", "llm")

results = querying.run({"retriever": {"queries": [query], "top_k": 3},
                        "prompt_builder": {"query": query}})
```