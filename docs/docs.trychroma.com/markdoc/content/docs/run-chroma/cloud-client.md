# 云客户端

你可以使用 `CloudClient` 创建一个连接到 Chroma 云服务的客户端。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
client = CloudClient(
    tenant='租户 ID',
    database='数据库名称',
    api_key='Chroma 云服务 API 密钥'
)
```
{% /Tab %}

{% Tab label="typescript" %}

```typescript
const client = new CloudClient({
    tenant: '租户 ID',
    database: '数据库名称',
    apiKey: 'Chroma 云服务 API 密钥',
});
```

{% /Tab %}

{% /TabbedCodeBlock %}

`CloudClient` 也可以仅通过 API 密钥参数进行实例化。在这种情况下，我们将从 Chroma 云服务中解析租户和数据库信息。请注意，我们的自动解析仅在提供的 API 密钥限定于单个数据库时有效。

如果你设置了 `CHROMA_API_KEY`、`CHROMA_TENANT` 和 `CHROMA_DATABASE` 环境变量，则可以直接实例化一个不带参数的 `CloudClient`：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
client = CloudClient()
```
{% /Tab %}

{% Tab label="typescript" %}

```typescript
const client = new CloudClient();
```

{% /Tab %}

{% /TabbedCodeBlock %}