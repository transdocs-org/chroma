# 以客户端-服务器模式运行 Chroma

Chroma 也可以被配置为以客户端/服务器模式运行。在这种模式下，Chroma 客户端会连接到一个在独立进程中运行的 Chroma 服务器。

要启动 Chroma 服务器，请运行以下命令：

```terminal
chroma run --path /db_path
```

{% Tabs %}

{% Tab label="python" %}

然后使用 Chroma 的 `HttpClient` 连接到服务器：

```python
import chromadb

chroma_client = chromadb.HttpClient(host='localhost', port=8000)
```

完成了！只需这一处修改，Chroma 的 API 就将以 `客户端-服务器` 模式运行。

Chroma 还提供了异步 HTTP 客户端。其行为和方法签名与同步客户端完全相同，但所有可能阻塞的方法现在都是异步的。要使用异步客户端，请改用调用 `AsyncHttpClient`：

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

如果你[部署](../../guides/deploy/client-server-mode)了你的 Chroma 服务器，你还可以使用我们的 [仅 HTTP 客户端](../../guides/deploy/python-thin-client) 包。

{% /Tab %}

{% Tab label="typescript" %}

然后你可以通过实例化一个新的 `ChromaClient` 来连接它：

```typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient();
```

如果你使用不同的配置运行 Chroma 服务器，或者[部署](../../guides/deploy/client-server-mode)了你的 Chroma 服务器，则可以指定 `host`、`port` 以及客户端是否应通过 `ssl` 进行连接：

```typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient({
    host: "YOUR-HOST",
    port: "YOUR-PORT",
    ssl: true
});
```

{% /Tab %}

{% /Tabs %}