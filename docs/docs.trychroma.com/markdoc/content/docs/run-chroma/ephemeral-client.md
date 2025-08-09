# 临时客户端

在 Python 中，你可以运行一个内存中的 Chroma 服务器，并使用临时客户端连接到它：

```python
import chromadb

client = chromadb.EphemeralClient()
```

`EphemeralClient()` 方法会启动一个内存中的 Chroma 服务器，并返回一个可用于连接该服务器的客户端。

例如，在 Python 笔记本中尝试不同的嵌入函数和检索技术时，这是一个非常有用的工具。如果你不需要数据持久化，临时客户端是快速上手 Chroma 的一个良好选择。