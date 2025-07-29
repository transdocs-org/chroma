# 集成

### 嵌入集成

嵌入是人工智能原生表示各种数据的方式，这使它们非常适合与各种人工智能驱动的工具和算法一起使用。它们可以表示文本、图像，很快还将支持音频和视频。创建嵌入的方式有很多种，无论是通过本地安装的库还是通过调用API。

Chroma为流行的嵌入提供者提供了轻量级封装，使得在应用程序中使用它们变得简单。您可以在创建Chroma集合时设置一个嵌入函数，该函数将被自动调用，或者您也可以直接手动调用它们。

{% special_table %}
{% /special_table %}

|                                                                         | Python | Typescript |
| ----------------------------------------------------------------------- | ------ | ---------- |
| [OpenAI](./embedding-models/openai)                                     | ✓      | ✓          |
| [Google Gemini](./embedding-models/google-gemini)                       | ✓      | ✓          |
| [Cohere](./embedding-models/cohere)                                     | ✓      | ✓          |
| [Baseten](./embedding-models/baseten)                                   | ✓      | -          |
| [Hugging Face](./embedding-models/hugging-face)                         | ✓      | -          |
| [Instructor](./embedding-models/instructor)                             | ✓      | -          |
| [Hugging Face Embedding Server](./embedding-models/hugging-face-server) | ✓      | ✓          |
| [Jina AI](./embedding-models/jina-ai)                                   | ✓      | ✓          |
| [Roboflow](./embedding-models/roboflow)                                 | ✓      | -          |
| [Ollama Embeddings](./embedding-models/ollama)                          | ✓      | ✓          |
| [Cloudflare Workers AI](./embedding-models/cloudflare-workers-ai.md)    | ✓      | ✓          |

| [Together AI](./embedding-models/together-ai.md)                        | ✓      | ✓          |
| [Mistral](./embedding-models/mistral.md)                                | ✓      | -          |

---

### 框架集成

Chroma 与许多流行的工具保持集成。这些工具可用于定义 AI 原生应用程序的业务逻辑、整理数据、微调嵌入空间等。

我们欢迎社区通过 Pull Request 添加新的集成。

{% special_table %}
{% /special_table %}

|                                             | Python | JS           |
| ------------------------------------------- | ------ | ------------ |
| [DeepEval](./frameworks/deepeval)           | ✓      | -            |
| [Langchain](./frameworks/langchain)         | ✓      | ✓            |
| [LlamaIndex](./frameworks/llamaindex)       | ✓      | ✓            |
| [Braintrust](./frameworks/braintrust)       | ✓      | ✓            |
| [OpenLLMetry](./frameworks/openllmetry)     | ✓      | 即将推出！   |
| [Streamlit](./frameworks/streamlit)         | ✓      | -            |
| [Haystack](./frameworks/haystack)           | ✓      | -            |
| [OpenLIT](./frameworks/openlit)             | ✓      | 即将推出！   |
| [Anthropic MCP](./frameworks/anthropic-mcp) | ✓      | 即将推出！   |
| [VoltAgent](./frameworks/voltagent)         | -      | ✓            |