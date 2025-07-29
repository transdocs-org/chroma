---
id: streamlit
name: Streamlit
---

# Streamlit

Streamlit 是一个开源的 Python 库，可以轻松创建和共享用于机器学习和数据科学的美观、定制的网页应用。只需几分钟，您就可以构建和部署强大的数据应用。

![](https://img.shields.io/github/stars/streamlit/streamlit.svg?style=social&label=Star&maxAge=2400)

[Apache 2.0 License](https://github.com/streamlit/streamlit/blob/develop/LICENSE) &nbsp;&bull;&nbsp;[站点](https://streamlit.io/)

{% special_table %}
{% /special_table %}

| 语言 | 文档 | Github |
|--|--|--|
| Python | [文档](https://docs.streamlit.io/) | [代码](https://github.com/streamlit/streamlit)

### 安装

安装 Streamlit： {% br %}{% /br %}
`pip install streamlit`

安装 `streamlit-chromadb-connection`，它通过 [`st.connection`](https://docs.streamlit.io/1.11.0/library/api-reference/connections/st.connection) 将您的 Streamlit 应用连接到 Chroma： {% br %}{% /br %}
`pip install streamlit-chromadb-connection`

### 主要优势

- 使用 Streamlit 简洁的语法轻松上手
- 内置 [聊天机器人功能](https://docs.streamlit.io/library/api-reference/chat)
- 通过 `streamlit-chromadb-connection` 预置了与 Chroma 的集成
- 在 [Streamlit Community Cloud](https://share.streamlit.io/) 上免费部署应用

### 简单示例

#### Python

```python
import streamlit as st
from streamlit_chromadb_connection.chromadb_connection import ChromadbConnection

configuration = {
    "client": "PersistentClient",
    "path": "/tmp/.chroma"
}

collection_name = "documents_collection"

conn = st.connection("chromadb",
                     type=ChromadbConnection,
                     **configuration)
documents_collection_df = conn.get_collection_data(collection_name)
st.dataframe(documents_collection_df)
```

### 资源

- [`streamlit-chromadb-connection` 的使用说明，用于将您的 Streamlit 应用连接到 Chroma](https://github.com/Dev317/streamlit_chromadb_connection/blob/main/README.md)
- [`streamlit-chromadb-connection` 的演示应用](https://app-chromadbconnection-mfzxl3nzozmaxh3mrkd6zm.streamlit.app/)
- [Streamlit 的 `st.connection` 文档](https://docs.streamlit.io/library/api-reference/connections/st.connection)
- [关于在 Streamlit 中使用向量数据库的指南](https://pub.towardsai.net/vector-databases-for-your-streamlit-ai-apps-56cd0af7bbba)

#### 教程

- [使用 Chroma、Streamlit 和 LangChain 构建“问答文档”应用](https://blog.streamlit.io/langchain-tutorial-4-build-an-ask-the-doc-app/)
- [使用 Chroma、Streamlit 和 LangChain 摘要文档](https://alphasec.io/summarize-documents-with-langchain-and-chroma/)
- [使用 Chroma、Streamlit 和 LangChain 构建自定义聊天机器人](https://blog.streamlit.io/how-in-app-feedback-can-increase-your-chatbots-performance/)
- [使用 Chroma、Streamlit 和 LangChain 构建 RAG 机器人](https://levelup.gitconnected.com/building-a-generative-ai-app-with-streamlit-and-openai-95ec31fe8efd)
- [使用 Chroma、Streamlit 和 OpenAI 构建 PDF 问答聊天机器人](https://www.confident-ai.com/blog/how-to-build-a-pdf-qa-chatbot-using-openai-and-chromadb)