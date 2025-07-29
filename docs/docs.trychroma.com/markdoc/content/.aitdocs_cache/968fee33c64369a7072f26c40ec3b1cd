# 临时客户端

在 Python 中，你可以运行一个内存中的 Chroma 服务器，并通过临时客户端连接到它：

```python
import chromadb

client = chromadb.EphemeralClient()
```

`EphemeralClient()` 方法会在内存中启动一个 Chroma 服务器，并返回一个可用于连接该服务器的客户端。

例如，这是一个在 Python 笔记本中尝试不同嵌入函数和检索技术的绝佳工具。如果你不需要数据持久化，临时客户端是一个快速上手 Chroma 的理想选择。