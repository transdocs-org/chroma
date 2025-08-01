# 以客户端-服务器模式运行 Chroma

{% Tabs %}

{% Tab label="python" %}
Chroma 也可以配置为以客户端/服务器模式运行。在这种模式下，Chroma 客户端会连接到一个单独进程中运行的 Chroma 服务器。

这意味着你可以将单节点的 Chroma 部署到 [Docker 容器](./docker)，或者部署到由 [AWS](./aws)、[GCP](./gcp)、[Azure](./azure) 等云服务商提供的主机上。然后，你可以通过我们的 `HttpClient` 从你的应用程序访问 Chroma 服务器。

你可以通过我们的 CLI 快速在本地试验客户端/服务器模式下的 Chroma：

```terminal
chroma run --path /db_path
```

然后使用 Chroma 的 `HttpClient` 连接到服务器：

```python
import chromadb
chroma_client = chromadb.HttpClient(host='localhost', port=8000)
```

Chroma 同样提供了 `AsyncHttpClient`。其行为和方法签名与同步客户端相同，但所有可能阻塞的方法现在都是异步的：

```python
import asyncio
import chromadb

async def main():
    client = await chromadb.AsyncHttpClient()
    collection = await client.create_collection(name="my_collection")
    await collection.add(
        documents=["hello world"],
        ids=["id1"]
    )

asyncio.run(main())
```

如果你打算部署你的 Chroma 服务器，建议使用我们的 [轻量客户端包](/production/chroma-server/python-thin-client) 来进行客户端交互。

{% /Tab %}

{% Tab label="typescript" %}
Chroma 也可以配置为以客户端/服务器模式运行。在这种模式下，Chroma 客户端会连接到一个单独进程中运行的 Chroma 服务器。

这意味着你可以将单节点的 Chroma 部署到 [Docker 容器](./docker)，或者部署到由 [AWS](./aws)、[GCP](./gcp)、[Azure](./azure) 等云服务商提供的主机上。然后，你可以通过我们的 `ChromaClient` 从你的应用程序访问 Chroma 服务器。

你可以通过我们的 CLI 快速在本地试验客户端/服务器模式下的 Chroma：

```terminal
chroma run --path /db_path
```

然后从你的程序中连接到 Chroma 服务器：

```typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient();
```
{% /Tab %}

{% /Tabs %}