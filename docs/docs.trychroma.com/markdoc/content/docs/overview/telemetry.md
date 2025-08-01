# 遥测数据（Telemetry）

Chroma 包含一项遥测功能，用于收集**匿名**的使用信息。

### 为什么使用遥测？

我们通过这些信息了解 Chroma 的使用方式，以便帮助我们优先开发新功能、修复漏洞，并改进 Chroma 的性能和稳定性。

### 如何选择退出遥测？

如果您不希望启用遥测功能，可以通过以下两种方式来禁用它。

#### 在客户端代码中

{% Tabs %}

{% Tab label="python" %}

在客户端的设置中将 `anonymized_telemetry` 设置为 `False`：

```python
from chromadb.config import Settings
client = chromadb.Client(Settings(anonymized_telemetry=False))
# 或者如果使用的是 PersistentClient
client = chromadb.PersistentClient(path="/path/to/save/to", settings=Settings(anonymized_telemetry=False))
```

{% /Tab %}

{% Tab label="typescript" %}

在 Chroma 服务器上禁用遥测功能（见下一节）。

{% /Tab %}

{% /Tabs %}

#### 在 Chroma 后端服务器中通过环境变量禁用

在您的 shell 或服务器环境中将 `ANONYMIZED_TELEMETRY` 设置为 `False`。

如果您是通过 `docker-compose` 在本地运行 Chroma，可以将该值写入与 `docker-compose.yml` 文件同目录下的 `.env` 文件中：

```
ANONYMIZED_TELEMETRY=False
```

### 我们收集哪些信息？

我们仅收集有助于我们进行产品决策的使用数据，具体包括：

- Chroma 的版本和环境信息（例如操作系统、Python 版本、是否在容器中运行，或是在 Jupyter Notebook 中运行）
- Chroma 自带的嵌入函数（embedding functions）的使用情况，以及自定义嵌入函数的汇总使用情况（**不会**收集任何有关自定义嵌入函数本身的详细信息）
- 与我们托管的 Chroma Cloud 服务之间的客户端交互
- 集合（collection）的操作命令。我们跟踪集合的匿名 UUID 以及条目数量，包括：
    - `add`
    - `update`
    - `query`
    - `get`
    - `delete`

我们 **不会** 收集任何个人身份识别信息或敏感信息，例如：用户名、主机名、文件名、环境变量或正在测试的系统主机名。

如需查看我们跟踪的事件列表，请参考相关 **[代码](https://github.com/chroma-core/chroma/blob/main/chromadb/telemetry/product/events.py)**

### 遥测数据存储在哪里？

我们使用 **[Posthog](https://posthog.com/)** 来存储和可视化遥测数据。

{% Banner type="tip" %}

Posthog 是一个开源的产品分析平台。您可以通过访问 **[posthog.com](https://posthog.com/)** 或查看 GitHub 上的 **[posthog/posthog](https://github.com/posthog/posthog)** 了解更多关于 Posthog 的信息。

{% /Banner %}