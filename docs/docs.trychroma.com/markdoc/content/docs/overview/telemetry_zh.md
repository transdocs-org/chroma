# 遥测功能（Telemetry）

Chroma 包含一项遥测功能，用于收集**匿名**的使用信息。

### 为什么使用遥测？

我们使用这些信息来了解 Chroma 的使用方式，帮助我们优先开发新功能、修复漏洞，并改进 Chroma 的性能和稳定性。

### 选择退出（Opting out）

如果您不希望使用遥测功能，可以通过以下两种方式之一来禁用。

#### 在客户端代码中

{% Tabs %}

{% Tab label="python" %}

在客户端的设置中将 `anonymized_telemetry` 设为 `False`：

```python
from chromadb.config import Settings
client = chromadb.Client(Settings(anonymized_telemetry=False))
# 或者如果使用 PersistentClient
client = chromadb.PersistentClient(path="/path/to/save/to", settings=Settings(anonymized_telemetry=False))
```

{% /Tab %}

{% Tab label="typescript" %}

在 Chroma 服务器中禁用遥测功能（见下一节）。

{% /Tab %}

{% /Tabs %}

#### 在 Chroma 后端服务器中使用环境变量

在您的 shell 或服务器环境中将 `ANONYMIZED_TELEMETRY` 设置为 `False`。

如果您使用 `docker-compose` 在本地运行 Chroma，则可以在与 `docker-compose.yml` 文件同目录下的 `.env` 文件中设置该值：

```
ANONYMIZED_TELEMETRY=False
```

### 你跟踪哪些内容？

我们仅跟踪有助于我们进行产品决策的使用情况信息，具体包括：

- Chroma 版本及环境信息（例如操作系统、Python 版本、是否在容器或 Jupyter Notebook 中运行）
- 随 Chroma 提供的嵌入函数使用情况，以及自定义嵌入函数的聚合使用情况（我们不会收集有关自定义嵌入函数本身的具体信息）
- 客户端与我们托管的 Chroma Cloud 服务之间的交互
- 集合（Collection）操作命令。我们跟踪集合的匿名化 UUID 以及项目数量，包括以下操作：
  - `add`
  - `update`
  - `query`
  - `get`
  - `delete`

我们 **不会** 收集任何个人身份识别信息或敏感信息，例如：用户名、主机名、文件名、环境变量或被测试系统的主机名。

如需查看我们跟踪的事件列表，可以参考我们的 **[代码](https://github.com/chroma-core/chroma/blob/main/chromadb/telemetry/product/events.py)**

### 遥测信息存储在哪里？

我们使用 **[Posthog](https://posthog.com/)** 来存储和可视化遥测数据。

{% Banner type="tip" %}

Posthog 是一个开源的产品分析平台。你可以在 **[posthog.com](https://posthog.com/)** 或 **[github.com/posthog](https://github.com/posthog/posthog)** 上了解更多关于 Posthog 的信息。

{% /Banner %}