# Chroma 参考文档

## 客户端 API

Chroma 当前为 Python 和 JavaScript 提供官方客户端。对于其他语言的客户端，请参考它们的代码仓库以获取文档。

`Client` - 是封装与 Chroma DB 后端连接的对象。

`Collection` - 是封装一个集合的对象。


{% special_table %}
{% /special_table %}

|              | 客户端                | 集合                              |
|--------------|-----------------------|-----------------------------------|
| Python | [客户端](./python/client) | [集合](./python/collection)       |
| JavaScript | [客户端](./js/client) | [集合](./js/collection)           |

***

## 后端 API

Chroma 的后端 Swagger REST API 文档可以在运行 Chroma 后通过访问 `http://localhost:8000/docs` 查看。

```bash
pip install chromadb
chroma run
open http://localhost:8000/docs
```