# 运行 Chroma 服务器

Chroma CLI 提供了使用 `chroma run` 命令在本地运行 Chroma 服务器的功能：

```terminal
chroma run --path [/path/to/persist/data]
```

你的 Chroma 服务器将在你提供给 `path` 参数的路径中持久化保存数据。默认情况下，数据会保存到 `chroma` 目录中。

你还可以通过以下参数进一步自定义 Chroma 服务器的运行方式：
* `host` - 定义服务器运行的主机名，默认为 `localhost`。
* `port` - Chroma 服务器使用的端口，用于监听客户端请求，默认端口为 `8000`。
* `config_path` - 你可以通过提供一个包含这些定义以及其他配置的配置文件来代替直接使用 `path`、`host` 和 `port` 参数。示例文件可以[在这里](https://github.com/chroma-core/chroma/blob/main/rust/frontend/sample_configs/single_node_full.yaml)找到。

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