# 集成

### 嵌入集成

嵌入是以人工智能原生方式表示各种数据的方法，这使得它们非常适合与各种由人工智能驱动的工具和算法一起使用。它们可以表示文本、图像，以及即将支持的音频和视频。创建嵌入的方式有很多选择，无论是通过本地安装的库还是通过调用API。

Chroma为流行的嵌入提供者提供了轻量级封装，使它们在您的应用程序中易于使用。您可以在创建Chroma集合时设置嵌入函数，该函数将自动被使用，或者您也可以直接自行调用它们。

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
| [Mistral](./embedding-models/mistral.md)                                | ✓      | ✓          |
| [Morph](./embedding-models/morph.md)                                    | ✓      | ✓          |

---

### 框架集成

Chroma与许多流行的工具保持集成。这些工具可用于定义人工智能原生应用的业务逻辑、整理数据、微调嵌入空间等。

我们欢迎社区通过提交拉取请求来添加新的集成。

{% special_table %}
{% /special_table %}

|                                             | Python | JS           |
| ------------------------------------------- | ------ | ------------ |
| [DeepEval](./frameworks/deepeval)           | ✓      | -            |
| [Langchain](./frameworks/langchain)         | ✓      | ✓            |
| [LlamaIndex](./frameworks/llamaindex)       | ✓      | ✓            |
| [Braintrust](./frameworks/braintrust)       | ✓      | ✓            |
| [OpenLLMetry](./frameworks/openllmetry)     | ✓      | 即将推出!    |
| [Streamlit](./frameworks/streamlit)         | ✓      | -            |
| [Haystack](./frameworks/haystack)           | ✓      | -            |
| [OpenLIT](./frameworks/openlit)             | ✓      | 即将推出!    |
| [Anthropic MCP](./frameworks/anthropic-mcp) | ✓      | 即将推出!    |
| [VoltAgent](./frameworks/voltagent)         | -      | ✓            |