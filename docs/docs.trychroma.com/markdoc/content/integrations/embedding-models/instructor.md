---
id: instructor
name: Instructor
---

# Instructor

[instructor-embeddings](https://github.com/HKUNLP/instructor-embedding) 库是另一种选择，尤其是在配备支持 CUDA 的 GPU 的机器上运行时。它们是 OpenAI 的良好本地替代方案（请参阅 [Massive Text Embedding Benchmark](https://huggingface.co/blog/mteb) 排名）。嵌入函数需要 InstructorEmbedding 包。要安装它，请运行 ```pip install InstructorEmbedding```。

目前有三个模型可用。默认模型是 `hkunlp/instructor-base`，为了获得更好的性能，您可以使用 `hkunlp/instructor-large` 或 `hkunlp/instructor-xl`。您还可以指定使用 `cpu`（默认）还是 `cuda`。例如：

```python
# 使用基础模型和 CPU
import chromadb.utils.embedding_functions as embedding_functions
ef = embedding_functions.InstructorEmbeddingFunction()
```
或
```python
import chromadb.utils.embedding_functions as embedding_functions
ef = embedding_functions.InstructorEmbeddingFunction(
model_name="hkunlp/instructor-xl", device="cuda")
```
请注意，large 和 xl 模型分别占用 1.5GB 和 5GB 内存，最适合在 GPU 上运行。