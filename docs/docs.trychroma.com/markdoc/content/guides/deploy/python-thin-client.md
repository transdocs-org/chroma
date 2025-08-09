# Chroma的轻量客户端

如果你在一个Python应用程序中以客户端-服务器模式运行Chroma，可能不需要完整的Chroma库。你可以仅使用轻量级的客户端库。

在这种情况下，你可以安装 `chromadb-client` 包，而不是我们的 `chromadb` 包。

`chromadb-client` 包是一个轻量级的HTTP客户端，用于与服务器通信，其依赖项极少。

{% TabbedUseCaseCodeBlock language="终端" %}

{% Tab label="pip" %}
```terminal
pip install chromadb-client
```
{% /Tab %}

{% Tab label="poetry" %}
```terminal
poetry add chromadb-client
```
{% /Tab %}

{% Tab label="uv" %}
```terminal
uv pip install chromadb-client
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

```python
# Python
import chromadb
# 示例：设置客户端以连接到你的Chroma服务器
client = chromadb.HttpClient(host='localhost', port=8000)

# 或者用于异步使用：
async def main():
    client = await chromadb.AsyncHttpClient(host='localhost', port=8000)
```

请注意，`chromadb-client` 包是完整Chroma库的一个子集，不包含所有的依赖项。如果你想使用完整的Chroma库，可以改而安装 `chromadb` 包。

最重要的是，轻量客户端包没有默认的嵌入函数。如果你在没有嵌入向量的情况下调用 `add()` 方法添加文档，则必须手动指定一个嵌入函数，并安装对应的依赖项。