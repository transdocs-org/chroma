# 遥测

Chroma 包含一个遥测功能，用于收集**匿名**的使用信息。

### 为什么？

我们使用这些信息帮助理解 Chroma 的使用方式，以便更好地决定新功能开发和缺陷修复的优先级，并提升 Chroma 的性能和稳定性。

### 选择退出

如果您不希望启用遥测，可以通过以下两种方式选择退出。

#### 在客户端代码中

{% Tabs %}

{% Tab label="python" %}

在客户端的设置中将 `anonymized_telemetry` 设置为 `False`：

```python
from chromadb.config import Settings
client = chromadb.Client(Settings(anonymized_telemetry=False))
# 或者如果使用 PersistentClient
client = chromadb.PersistentClient(path="/path/to/save/to", settings=Settings(anonymized_telemetry=False))
```

{% /Tab %}

{% Tab label="typescript" %}

在 Chroma 服务器中禁用遥测（见下一节）。

{% /Tab %}

{% /Tabs %}

#### 在 Chroma 后端服务器中使用环境变量

在您的 shell 或服务器环境中将 `ANONYMIZED_TELEMETRY` 设置为 `False`。

如果您使用 `docker-compose` 在本地运行 Chroma，则可以在与 `docker-compose.yml` 文件同一目录下的 `.env` 文件中设置此值：

```
ANONYMIZED_TELEMETRY=False
```

### 我们追踪了哪些内容？

我们只会追踪有助于我们进行产品决策的使用信息，具体包括：

- Chroma 的版本和环境信息（例如操作系统、Python 版本、是否运行在容器中或 Jupyter Notebook 中）
- 随 Chroma 一起发布的嵌入函数的使用情况，以及自定义嵌入函数的汇总使用情况（我们不会收集任何关于自定义嵌入函数本身的详细信息）
- 与我们托管的 Chroma Cloud 服务的交互
- 集合操作命令。我们记录集合的匿名 UUID 以及操作的数量
  - `add`
  - `update`
  - `query`
  - `get`
  - `delete`

我们**不会**收集任何个人身份信息或敏感信息，例如：用户名、主机名、文件名、环境变量或正在测试的系统主机名。

如需查看我们追踪的事件列表，请参考我们的 **[代码](https://github.com/chroma-core/chroma/blob/main/chromadb/telemetry/product/events.py)**

### 遥测信息存储在哪里？

我们使用 **[Posthog](https://posthog.com/)** 来存储和可视化遥测数据。

{% Banner type="tip" %}

Posthog 是一个用于产品分析的开源平台。您可以在 **[posthog.com](https://posthog.com/)** 或 **[github.com/posthog](https://github.com/posthog/posthog)** 上了解更多关于 Posthog 的信息。

{% /Banner %}