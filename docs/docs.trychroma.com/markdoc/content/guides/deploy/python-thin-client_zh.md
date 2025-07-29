# Chroma 的轻量客户端

如果你在一个 Python 应用程序中以客户端-服务器模式运行 Chroma，则可能不需要完整的 Chroma 库。在这种情况下，你可以使用轻量级的仅客户端库。

此时，你可以安装 `chromadb-client` 包，**而不是**我们的 `chromadb` 包。

`chromadb-client` 包是一个轻量的 HTTP 客户端，用于连接服务器，且依赖项非常少。

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

# 示例：设置客户端以连接到你的 Chroma 服务器
client = chromadb.HttpClient(host='localhost', port=8000)

# 或者用于异步使用：
async def main():
    client = await chromadb.AsyncHttpClient(host='localhost', port=8000)
```

请注意，`chromadb-client` 包是完整 Chroma 库的一个子集，不包含所有的依赖项。如果你希望使用完整的 Chroma 库，可以安装 `chromadb` 包。

最重要的是，轻量客户端包没有默认的嵌入（embedding）函数。如果你在添加文档时没有提供嵌入向量，则必须手动指定一个嵌入函数，并安装其所需的依赖项。