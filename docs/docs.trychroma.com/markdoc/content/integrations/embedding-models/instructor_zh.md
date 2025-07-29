---
id: instructor
name: Instructor
---

# Instructor

[instructor-embeddings](https://github.com/HKUNLP/instructor-embedding) 库是另一个可选方案，尤其是在配备支持 CUDA 的 GPU 的机器上运行时。它们是 OpenAI 的良好本地替代方案（请参阅 [Massive Text Embedding Benchmark](https://huggingface.co/blog/mteb) 排名）。该嵌入函数需要安装 InstructorEmbedding 包。要安装它，请运行 ```pip install InstructorEmbedding```。

目前有三个模型可供使用。默认模型是 `hkunlp/instructor-base`，如果需要更好的性能，可以使用 `hkunlp/instructor-large` 或 `hkunlp/instructor-xl`。你也可以指定使用 `cpu`（默认）还是 `cuda`。例如：

```python
# 使用 base 模型和 cpu
import chromadb.utils.embedding_functions as embedding_functions
ef = embedding_functions.InstructorEmbeddingFunction()
```
或者
```python
import chromadb.utils.embedding_functions as embedding_functions
ef = embedding_functions.InstructorEmbeddingFunction(
model_name="hkunlp/instructor-xl", device="cuda")
```
请注意，large 和 xl 模型的大小分别为 1.5GB 和 5GB，最适合在 GPU 上运行。