---
id: hugging-face
name: Hugging Face
---

# Hugging Face

Chroma 也提供了对 HuggingFace 嵌入 API 的便捷封装。该嵌入函数在 HuggingFace 的服务器上远程运行，并且需要一个 API 密钥。你可以通过访问 [HuggingFace](https://huggingface.co/) 注册账户获取 API 密钥。

{% tabs group="code-lang" hideTabs=true %}
{% tab label="Python" %}

```python
import chromadb.utils.embedding_functions as embedding_functions
huggingface_ef = embedding_functions.HuggingFaceEmbeddingFunction(
    api_key="YOUR_API_KEY",
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
```

你可以选择性地传入 `model_name` 参数，以指定使用的 HuggingFace 模型。默认情况下，Chroma 使用 `sentence-transformers/all-MiniLM-L6-v2`。你可以[在此](https://huggingface.co/models)查看所有可用模型的列表。