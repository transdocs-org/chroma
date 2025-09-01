# 可观测性


## 后端可观测性

Chroma 通过 [OpenTelemetry](https://opentelemetry.io/) 钩子实现了可观测性功能。

{% note type="default" title="遥测与可观测性" %}
“[遥测](../../docs/overview/telemetry)” 指的是我们收集的匿名产品使用统计数据。“可观测性” 指的是指标、日志和追踪，任何运行 Chroma 部署的人都可以使用这些功能。本页上列出的可观测性功能 **绝不会** 发送回 Chroma；它们是为了帮助终端用户更好地了解其 Chroma 部署的运行情况。
{% /note %}

### 可用的可观测性

目前，Chroma 仅导出 OpenTelemetry [追踪](https://opentelemetry.io/docs/concepts/signals/traces/)。追踪功能允许 Chroma 运维人员了解请求在系统中的流动方式，并快速识别瓶颈。

### 配置

追踪功能通过三个环境变量进行配置：

- `CHROMA_OPEN_TELEMETRY__ENDPOINT`：可观测性数据的发送目标。例如：`api.honeycomb.com`。
- `CHROMA_OPEN_TELEMETRY__SERVICE_NAME`：OTel 追踪的服务名称。默认值：`chromadb`。
- `OTEL_EXPORTER_OTLP_HEADERS`：发送可观测性数据时使用的请求头。通常用于发送 API 密钥和应用密钥。例如：`{"x-honeycomb-team": "abc"}`。

我们还为各种部署方式提供了专门的可观测性指南：
* [Docker](./docker#observability-with-docker)
* [AWS](./aws#observability-with-AWS)
* [GCP](./gcp#observability-with-GCP)
* [Azure](./azure#observability-with-Azure)

## 客户端（SDK）可观测性

多个可观测性平台为 Chroma 提供了内置集成，使您能够监控应用程序与 Chroma 服务器之间的交互：
- [OpenLLMetry 集成](../../integrations/frameworks/openllmetry)
- [OpenLIT 集成](../../integrations/frameworks/openlit)