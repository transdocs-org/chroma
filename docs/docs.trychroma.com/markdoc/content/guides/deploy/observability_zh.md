# 可观测性


## 后端可观测性

Chroma 使用 [OpenTelemetry](https://opentelemetry.io/) 钩子实现可观测性。

{% note type="default" title="遥测与可观测性" %}
“[遥测](../../docs/overview/telemetry)” 指的是我们收集的匿名产品使用统计信息。“可观测性” 指的是指标、日志和追踪，任何运行 Chroma 部署的人都可以使用这些信息。此页面上列出的可观测性功能 **绝不会** 发送回 Chroma；它们是为了帮助终端用户更好地了解其 Chroma 部署的运行状况。
{% /note %}

### 可用的可观测性

Chroma 当前仅导出 OpenTelemetry [追踪](https://opentelemetry.io/docs/concepts/signals/traces/)。追踪功能允许 Chroma 运维人员了解请求如何在系统中流动，并快速识别瓶颈。

### 配置

追踪功能通过三个环境变量进行配置：

- `CHROMA_OPEN_TELEMETRY__ENDPOINT`：可观测性数据的发送地址。示例：`api.honeycomb.com`。
- `CHROMA_OPEN_TELEMETRY__SERVICE_NAME`：OTel 追踪的服务名称。默认值：`chromadb`。
- `OTEL_EXPORTER_OTLP_HEADERS`：发送可观测性数据时使用的请求头。通常用于发送 API 密钥和应用密钥。例如：`{"x-honeycomb-team": "abc"}`。

我们还针对不同部署方式提供了专门的可观测性指南：
* [Docker](./docker#observability-with-docker)
* [AWS](./aws#observability-with-AWS)
* [GCP](./gcp#observability-with-GCP)
* [Azure](./azure#observability-with-Azure)

## 客户端（SDK）可观察性

多个可观察性平台为 Chroma 提供了内置集成，使您可以监控应用程序与 Chroma 服务器之间的交互：
- [OpenLLMetry 集成](../../integrations/frameworks/openllmetry)
- [OpenLIT 集成](../../integrations/frameworks/openlit)