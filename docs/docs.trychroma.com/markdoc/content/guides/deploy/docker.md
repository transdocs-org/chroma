# Docker

{% Banner type="tip" %}

**Chroma Cloud**

Chroma Cloud 是我们推出的完全托管服务现已上线。[免费注册](https://trychroma.com/signup)。

{% /Banner %}

## 在 Docker 容器中运行 Chroma

{% Tabs %}

{% Tab label="python" %}
你可以在 Docker 容器中运行一个 Chroma 服务器，并使用 `HttpClient` 来访问它。我们在 [docker.com](https://hub.docker.com/r/chromadb/chroma) 和 [ghcr.io](https://github.com/chroma-core/chroma/pkgs/container/chroma) 上提供了镜像。

要启动服务器，请运行：

```terminal
docker run -v ./chroma-data:/data -p 8000:8000 chromadb/chroma
```

这将以默认配置启动服务器，并将数据存储在 `./chroma-data` 中（位于你当前的工作目录下）。

然后，你可以配置 Chroma 客户端以连接运行在 Docker 容器中的服务器。

```python
import chromadb

chroma_client = chromadb.HttpClient(host='localhost', port=8000)
chroma_client.heartbeat()
```

{% Banner type="tip" %}

**仅客户端包**

如果你使用的是 Python，可以考虑使用[仅客户端包](/production/chroma-server/python-thin-client)，以获得更小的安装体积。
{% /Banner %}
{% /Tab %}

{% Tab label="typescript" %}
你可以在 Docker 容器中运行一个 Chroma 服务器，并使用 `ChromaClient` 来访问它。我们提供了 [docker.com](https://hub.docker.com/r/chromadb/chroma) 和 [ghcr.io](https://github.com/chroma-core/chroma/pkgs/container/chroma) 上的镜像。

要启动服务器，请运行：

```terminal
docker run -v ./chroma-data:/data -p 8000:8000 chromadb/chroma
```

这将以默认配置启动服务器，并将数据存储在 `./chroma-data` 中（位于你当前的工作目录下）。

然后，你可以配置 Chroma 客户端以连接运行在 Docker 容器中的服务器。

```typescript
import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({
    host: "localhost",
    port: 8000
});
chromaClient.heartbeat()
```
{% /Tab %}

{% /Tabs %}

## 配置

Chroma 使用 YAML 文件进行配置。请查看 [此配置文件](https://github.com/chroma-core/chroma/blob/main/rust/frontend/sample_configs/single_node_full.yaml) 了解所有可用选项的详细信息。

要使用自定义配置文件，请将其挂载到容器中的 `/config.yaml` 路径，如下所示：

```terminal
echo "allow_reset: true" > config.yaml # 服务器现在允许客户端重置其状态
docker run -v ./chroma-data:/data -v ./config.yaml:/config.yaml -p 8000:8000 chromadb/chroma
```

## 使用 Docker 进行可观测性

Chroma 集成了 [OpenTelemetry](https://opentelemetry.io/) 钩子以实现可观测性。OpenTelemetry 追踪功能可以让你了解请求在系统中的流转方式，并快速识别瓶颈。有关可用参数的完整说明，请参阅 [可观测性文档](../administration/observability)。

以下是一个使用 Docker Compose 创建可观测性栈的示例。该栈包括：

- 一个 Chroma 服务器
- [OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector)
- [Zipkin](https://zipkin.io/)

首先，将以下内容粘贴到一个名为 `otel-collector-config.yaml` 的新文件中：

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  debug:
  zipkin:
    endpoint: "http://zipkin:9411/api/v2/spans"

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [zipkin, debug]
```

这是 OpenTelemetry Collector 的配置文件：
* `receivers` 部分指定了通过 GRPC 和 HTTP 使用 OpenTelemetry 协议（OTLP）来接收数据。
* `exporters` 定义了遥测数据将记录到控制台（`debug`），并发送到下面在 `docker-compose.yml` 中定义的 `zipkin` 服务器。
* `service` 部分将所有内容整合在一起，定义了一个 `traces` 管道，通过我们的 `otlp` 接收器接收数据，并通过 `zipkin` 和日志导出数据。

接下来，将以下内容粘贴到一个名为 `docker-compose.yml` 的新文件中：

```yaml
services:
  zipkin:
    image: openzipkin/zipkin
    ports:
      - "9411:9411"
    depends_on: [otel-collector]
    networks:
      - internal
  otel-collector:
    image: otel/opentelemetry-collector-contrib:0.111.0
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ${PWD}/otel-collector-config.yaml:/etc/otel-collector-config.yaml
    networks:
      - internal
  server:
    image: chromadb/chroma
    volumes:
      - chroma_data:/data
    ports:
      - "8000:8000"
    networks:
      - internal
    environment:
      - CHROMA_OPEN_TELEMETRY__ENDPOINT=http://otel-collector:4317/
      - CHROMA_OPEN_TELEMETRY__SERVICE_NAME=chroma
    depends_on:
      - otel-collector
      - zipkin

networks:
  internal:

volumes:
  chroma_data:
```

要启动该栈，请运行：

```terminal
docker compose up --build -d
```

一旦栈启动完成，你可以在本地运行时访问 [http://localhost:9411](http://localhost:9411) 查看 Zipkin 上的追踪信息。

Zipkin 刚开始时会显示空白界面，因为在启动期间没有创建追踪信息。你可以调用心跳端点来快速创建一个示例追踪：

```terminal
curl http://localhost:8000/api/v2/heartbeat
```

然后，在 Zipkin 中点击 "Run Query" 查看追踪结果。