# 持久化客户端

{% Tabs %}

{% Tab label="python" %}

你可以通过使用 `PersistentClient` 将 Chroma 配置为在本地保存和加载数据库。

数据会自动持久化，并在启动时自动加载（如果存在）。

```python
import chromadb

client = chromadb.PersistentClient(path="/path/to/save/to")
```

`path` 是 Chroma 在磁盘上存储数据库文件的位置，并在启动时加载这些文件。如果你没有提供路径，默认使用 `.chroma`。

{% /Tab %}

{% Tab label="typescript" %}

若要使用 JS/TS 客户端进行连接，你必须连接到一个 Chroma 服务端。

要运行一个本地持久化数据的 Chroma 服务，请通过 `pip` 安装 Chroma：

```terminal
pip install chromadb
```

然后使用我们的 CLI 启动服务：

```terminal
chroma run --path ./getting-started 
```

`path` 是 Chroma 在磁盘上存储数据库文件的位置，并在启动时加载这些文件。默认路径是 `.chroma`。

或者，你也可以使用我们官方的 Docker 镜像：

```terminal
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma
```

在本地运行 Chroma 服务后，你可以通过实例化一个新的 `ChromaClient` 来连接它：

```typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient();
```

默认情况下，`ChromaClient` 会尝试连接到运行在 `http://localhost:8000` 上的 Chroma 服务，并使用 `default_tenant` 和 `default_database`。如果你有不同的设置，可以在构造 `ChromaClient` 时传入：

```typescript
const client = new ChromaClient({
    ssl: false,
    host: 'localhost',
    port: 9000,
    database: 'my-db',
    headers: {}
});
```

更多信息请参阅 [以客户端-服务端模式运行 Chroma](../client-server-mode)。

{% /Tab %}

{% /Tabs %}

客户端对象有一些有用的便捷方法。

* `heartbeat()` - 返回一个纳秒级的心跳时间戳，可用于确保客户端保持连接状态。

* `reset()` - 清空并完全重置数据库。⚠️ 此操作具有破坏性，且不可逆。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
client.heartbeat()
client.reset()
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await client.heartbeat();
await client.reset();
```
{% /Tab %}

{% /TabbedCodeBlock %}