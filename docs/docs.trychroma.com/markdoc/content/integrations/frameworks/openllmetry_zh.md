---
id: openLLMetry
name: OpenLLMetry
---

# OpenLLMetry

[OpenLLMetry](https://www.traceloop.com/openllmetry) 为使用 Chroma 的系统提供可观测性功能。它能够追踪对 Chroma、OpenAI 和其他服务的调用，  
并可以观察查询和索引调用，以及 LLM 的提示词（prompt）和生成结果（completions）。  
有关如何使用 OpenLLMetry 的更多信息，请参阅 [OpenLLMetry 文档](https://www.traceloop.com/docs/openllmetry)。

![](/openllmetry.png)

### 示例

通过运行以下命令安装 OpenLLMetry SDK：

```terminal
pip install traceloop-sdk
```

然后在你的应用程序中初始化 SDK：

```python
from traceloop.sdk import Traceloop

Traceloop.init()
```

### 配置

OpenLLMetry 可以配置为将追踪数据发送到任何支持 OpenTelemetry 的可观测性平台，例如 Datadog、Honeycomb、Dynatrace、New Relic 等。  
更多信息请参阅 [OpenLLMetry 文档](https://www.traceloop.com/openllmetry/provider/chroma)。