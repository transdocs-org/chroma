---
id: openlit
name: OpenLIT
---

# OpenLIT

[OpenLIT](https://github.com/openlit/openlit) 是一个原生支持 OpenTelemetry 的 LLM 应用可观测性工具，它为 Chroma 提供了只需一行代码即可完成的 OpenTelemetry 自动插桩功能，帮助您确保应用程序得到无缝监控，提供改进性能、运维和可靠性的关键洞察。

有关如何使用 OpenLIT 的更多信息，请参阅 [OpenLIT 文档](https://docs.openlit.io/)。

## 入门指南

### 步骤 1：安装 OpenLIT

打开命令行或终端，运行以下命令：

```bash
pip install openlit
```

### 步骤 2：在应用程序中初始化 OpenLIT
将 OpenLIT 集成到 LLM 应用中非常简单。只需 **两行代码** 即可开始对您的 LLM 应用进行监控：

```python
import openlit

openlit.init()
```

若要将遥测数据转发到 HTTP OTLP 端点（如 OpenTelemetry Collector），请使用 `otlp_endpoint` 参数指定目标端点。或者，也可以按照 OpenTelemetry 文档中的建议，通过设置 `OTEL_EXPORTER_OTLP_ENDPOINT` 环境变量来配置端点。

> 💡 提示：如果您未提供 `otlp_endpoint` 函数参数或设置 `OTEL_EXPORTER_OTLP_ENDPOINT` 环境变量，OpenLIT 将会把追踪信息直接输出到控制台，这在开发过程中非常有用。
若要将遥测数据发送到需要身份验证的 OpenTelemetry 后端，请使用 `otlp_headers` 参数设置其所需值。或者，也可以通过设置 `OTEL_EXPORTER_OTLP_HEADERS` 环境变量来配置端点，具体请参阅 OpenTelemetry 文档中的建议。

### 步骤 3：可视化与优化！

![](https://github.com/openlit/.github/blob/main/profile/assets/openlit-client-1.png?raw=true)

现在，LLM 可观测性数据已由 OpenLIT 收集，下一步就是对这些数据进行可视化和分析，以了解您的 LLM 应用程序的性能、行为，并找出改进的方向。

如需开始在 OpenLIT UI 中探索您的 LLM 应用程序性能数据，请参阅 [快速入门指南](https://docs.openlit.io/latest/quickstart)。

如果您希望将指标和追踪数据集成并发送到现有的可观测性工具（例如 Promethues+Jaeger、Grafana 等），请参阅 [OpenLIT 连接官方文档](https://docs.openlit.io/latest/connections/intro) 获取详细指导。

## 支持

如在集成过程中遇到任何问题或疑问，您可以通过 [Slack](https://join.slack.com/t/openlit/shared_invite/zt-2etnfttwg-TjP_7BZXfYg84oAukY8QRQ) 或 [电子邮件](mailto:contact@openlit.io) 联系 OpenLIT 团队寻求帮助。