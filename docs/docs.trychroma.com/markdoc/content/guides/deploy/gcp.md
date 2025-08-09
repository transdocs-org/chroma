# GCP 部署

{% Banner type="tip" %}

**Chroma Cloud**

我们完全托管的 Chroma Cloud 服务现已上线。[点击此处](https://trychroma.com/signup) 免费注册。

{% /Banner %}

## 一个简单的 GCP 部署

你可以在一个长期运行的服务器上部署 Chroma，并远程连接到它。

为了方便起见，我们提供了一个非常简单的 Terraform 配置，用于在 Google Compute Engine 上部署 Chroma 的实验。

{% Banner type="warn" %}

Chroma 及其底层数据库[至少需要 2GB 的内存](./performance#results-summary)，
这意味着它无法在 GCP “始终免费”层级提供的实例上运行。该模板使用的是 [`e2-small`](https://cloud.google.com/compute/docs/general-purpose-machines#e2_machine_types) 实例，每小时大约花费两美分，或者每月约 15 美元，并提供 2GiB 内存。如果你按照这些说明操作，GCP 将根据此标准对你进行计费。

{% /Banner %}

{% Banner type="warn" %}

在本指南中，我们将向你展示如何使用 [Chroma 的原生身份验证支持](./gcp#authentication-with-gcp) 来保护你的端点。或者，你也可以将其置于 [GCP API 网关](https://cloud.google.com/api-gateway/docs) 后面，或添加你自己的身份验证代理。这个基本堆栈不支持任何形式的身份验证；任何知道你的服务器 IP 的人都可以添加和查询嵌入数据。

{% /Banner %}

{% Banner type="warn" %}

默认情况下，该模板将所有数据保存在一个卷上。当你删除或替换该卷时，数据将会消失。对于严肃的生产使用（包括高可用性、备份等），请阅读并理解 Terraform 模板，并以此作为你所需配置的基础，或者联系 Chroma 团队寻求帮助。

{% /Banner %}

### 步骤 1：设置你的 GCP 凭据

在你的 GCP 项目中，创建一个用于部署 Chroma 的服务账户。它需要以下角色：
* Service Account User
* Compute Admin
* Compute Network Admin
* Storage Admin

为该服务账户创建一个 JSON 密钥文件并下载。将 `GOOGLE_APPLICATION_CREDENTIALS` 环境变量设置为你下载的 JSON 密钥文件路径：

```terminal
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
```

### 步骤 2：安装 Terraform

下载 [Terraform](https://developer.hashicorp.com/terraform/install?product_intent=terraform) 并按照你的操作系统的安装说明进行安装。

### 步骤 3：配置你的 GCP 设置

创建一个 `chroma.tfvars` 文件。使用它来定义以下变量：你的 GCP 项目 ID、区域和可用区：

```text
project_id="<your project ID>"
region="<your region>"
zone="<your zone>"
```

### 步骤 4：使用 Terraform 初始化并部署

将我们的 [GCP Terraform 配置](https://github.com/chroma-core/chroma/blob/main/deployments/gcp/main.tf) 下载到与你的 `chroma.tfvars` 文件相同的目录中。然后运行以下命令来部署你的 Chroma 堆栈。

初始化 Terraform：
```terminal
terraform init
```

规划部署，并查看计划是否符合你的预期：
```terminal
terraform plan -var-file chroma.tfvars
```
如果你没有自定义我们的配置，你应该部署的是一个 `e2-small` 实例。

最后，应用部署：
```terminal
terraform apply -var-file chroma.tfvars
```

#### 自定义堆栈（可选）

如果你想使用不同于默认 `e2-small` 的机器类型，在你的 `chroma.tfvars` 文件中添加 `machine_type` 变量并将其设置为你想要的机器类型：

```text
machine_type = "e2-medium"
```

几分钟后，你可以使用以下命令获取你的实例的 IP 地址：
```terminal
terraform output -raw chroma_instance_ip
```

### 步骤 5：Chroma 客户端设置
{% Tabs %}

{% Tab label="python" %}
一旦你的 Compute Engine 实例上成功运行了 Chroma，你只需要将 `HttpClient` 配置为使用服务器的 IP 地址和端口 `8000`。由于你是在 Azure 上运行 Chroma 服务器，我们的 [轻量客户端包](./python-thin-client) 可能已满足你的应用需求。

```python
import chromadb

chroma_client = chromadb.HttpClient(
    host="<Your Chroma instance IP>",
    port=8000
)
chroma_client.heartbeat()
```
{% /Tab %}

{% Tab label="typescript" %}
一旦你的 Compute Engine 实例上成功运行了 Chroma，你只需要将 `ChromaClient` 配置为使用服务器的 IP 地址和端口 `8000`。

```typescript
import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({
    host: "<Your Chroma instance IP>",
    port: 8000
})
chromaClient.heartbeat()
```
{% /Tab %}

{% /Tabs %}

### 步骤 6：清理（可选）

要销毁堆栈并删除所有 GCP 资源，请使用 `terraform destroy` 命令。

{% note type="warning" title="注意" %}
除非你已进行快照或以其他方式备份了数据，否则这将销毁你的 Chroma 数据库中的所有数据。
{% /note %}

```terminal
terraform destroy -var-file chroma.tfvars
```

## GCP 上的可观测性

Chroma 使用 [OpenTelemetry](https://opentelemetry.io/) 钩子实现可观测性。我们目前仅导出 OpenTelemetry [追踪数据](https://opentelemetry.io/docs/concepts/signals/traces/)。这些数据应能帮助你了解请求在系统中的流转路径，并快速识别瓶颈。有关可用参数的完整说明，请参阅 [可观测性文档](../administration/observability)。

要启用 Chroma 服务器上的追踪功能，只需在你的 `chroma.tfvars` 文件中定义以下变量：

```text
chroma_otel_collection_endpoint          = "api.honeycomb.com"
chroma_otel_service_name                 = "chromadb"
chroma_otel_collection_headers           = "{'x-honeycomb-team': 'abc'}"
```