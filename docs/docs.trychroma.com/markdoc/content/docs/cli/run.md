# 运行一个 Chroma 服务器

Chroma 命令行工具允许你通过 `chroma run` 命令在本地运行一个 Chroma 服务器：

```terminal
chroma run --path [/path/to/persist/data]
```

你的 Chroma 服务器会将数据持久化保存在 `path` 参数指定的路径中。默认情况下，它会将数据保存到 `chroma` 目录中。

你还可以通过以下参数进一步自定义 Chroma 服务器的运行方式：
* `host` - 定义服务器运行的主机名。默认为 `localhost`。
* `port` - Chroma 服务器用于监听客户端请求的端口。默认端口为 `8000`。
* `config_path` - 除了提供 `path`、`host` 和 `port` 参数外，你还可以提供一个包含这些定义以及更多配置的配置文件。你可以 [在这里](https://github.com/chroma-core/chroma/blob/main/rust/frontend/sample_configs/single_node_full.yaml) 找到示例。

## 连接到你的 Chroma 服务器

当你的 Chroma 服务器运行后，你可以使用 `HttpClient` 连接到它：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import chromadb

chroma_client = chromadb.HttpClient(host='localhost', port=8000)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient();
```
{% /Tab %}

{% /TabbedCodeBlock %}