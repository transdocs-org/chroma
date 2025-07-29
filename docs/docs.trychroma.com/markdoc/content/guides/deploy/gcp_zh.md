# GCP 部署

{% Banner type="tip" %}

**Chroma Cloud**

我们完全托管的云服务 Chroma Cloud 已经上线。[点击此处](https://trychroma.com/signup)免费注册。

{% /Banner %}

## 简单的 GCP 部署

你可以在一个长期运行的服务器上部署 Chroma，并远程连接它。

为了方便起见，我们提供了一个非常简单的 Terraform 配置，用于在 Google Compute Engine 上部署 Chroma 的实验。

{% Banner type="warn" %}

Chroma 及其底层数据库[至少需要 2GB 的内存](./performance#results-summary)，这意味着它无法运行在 GCP "永久免费" 套餐提供的实例上。该模板使用了一个 [`e2-small`](https://cloud.google.com/compute/docs/general-purpose-machines#e2_machine_types) 实例，每小时大约花费两美分，或者整个月约 15 美元，并提供 2GiB 的内存。如果你按照这些说明操作，GCP 将根据此配置对你收费。

{% /Banner %}

{% Banner type="warn" %}

在本指南中，我们将向你展示如何使用 [Chroma 的本地身份验证支持](./gcp#authentication-with-gcp) 来保护你的端点。你也可以选择将其部署在 [GCP API Gateway](https://cloud.google.com/api-gateway/docs) 后面，或者添加自己的身份验证代理。这个基础架构不支持任何类型的身份验证；任何知道你的服务器 IP 地址的人都可以添加和查询嵌入数据。

{% /Banner %}

{% Banner type="warn" %}

默认情况下，该模板将所有数据保存在一个卷上。当你删除或替换该卷时，数据将会丢失。对于正式的生产环境使用（包括高可用性、备份等），请阅读并理解 Terraform 模板，并以其为基础进行定制，或者联系 Chroma 团队以获取帮助。

{% /Banner %}

### 步骤 1: 设置您的 GCP 凭据

在您的 GCP 项目中，创建一个用于部署 Chroma 的服务账号。该账号需要具备以下角色：
* Service Account User
* Compute Admin
* Compute Network Admin
* Storage Admin

为这个服务账号创建一个 JSON 格式的密钥文件，并下载该文件。然后将 `GOOGLE_APPLICATION_CREDENTIALS` 环境变量设置为该 JSON 文件的路径：

```terminal
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
```

### 步骤 2: 安装 Terraform

请前往 [Terraform官网](https://developer.hashicorp.com/terraform/install?product_intent=terraform) 下载 Terraform，并根据您的操作系统完成安装步骤。

### 步骤 3: 配置您的 GCP 设置

创建一个 `chroma.tfvars` 文件，并在其中定义以下变量以指定您的 GCP 项目 ID、区域和可用区：

```text
project_id="<your project ID>"
region="<your region>"
zone="<your zone>"
```

### 步骤 4: 初始化并使用 Terraform 部署

将我们的 [GCP Terraform 配置文件](https://github.com/chroma-core/chroma/blob/main/deployments/gcp/main.tf) 下载到与 `chroma.tfvars` 文件相同的目录中。然后运行以下命令来部署您的 Chroma 环境。

初始化 Terraform：
```terminal
terraform init
```

规划部署并进行检查，确保符合您的预期：
```terminal
terraform plan -var-file chroma.tfvars
```
如果您未对我们的配置进行自定义修改，则默认将部署一个 `e2-small` 实例。

最后，执行部署：
```terminal
terraform apply -var-file chroma.tfvars
```

#### 自定义实例配置（可选）

如果您希望使用的机器类型不同于默认的 `e2-small`，请在您的 `chroma.tfvars` 文件中添加 `machine_type` 变量，并将其设置为所需的机器类型：

```text
machine_type = "e2-medium"
```

数分钟后，您可以使用以下命令获取实例的 IP 地址：

```terminal
terraform output -raw chroma_instance_ip
```

### 步骤 5：Chroma 客户端设置
{% Tabs %}

{% Tab label="python" %}
一旦您的 Compute Engine 实例成功运行了 Chroma，您只需将 `HttpClient` 配置为使用服务器的 IP 地址和端口 `8000` 即可。由于您是在 Azure 上运行 Chroma 服务，我们的[轻量客户端包](./python-thin-client) 可能满足您的应用需求。

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
一旦您的 Compute Engine 实例成功运行了 Chroma，您只需将 `ChromaClient` 配置为使用服务器的 IP 地址和端口 `8000` 即可。

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

### 步骤 5：清理（可选）

要销毁堆栈并删除所有 GCP 资源，请使用 `terraform destroy` 命令。

{% note type="warning" title="注意" %}
除非你已经进行了快照或备份，否则这将销毁你的 Chroma 数据库中的所有数据。
{% /note %}

```terminal
terraform destroy -var-file chroma.tfvars
```

## 使用 GCP 进行可观察性

Chroma 集成了 [OpenTelemetry](https://opentelemetry.io/) 钩子以实现可观察性。目前我们仅导出 OpenTelemetry [追踪数据](https://opentelemetry.io/docs/concepts/signals/traces/)。这些数据可以帮助你了解请求在系统中的流动情况，并快速识别瓶颈。有关可用参数的完整说明，请参阅[可观察性文档](../administration/observability)。

要在你的 Chroma 服务器上启用追踪功能，只需在 `chroma.tfvars` 中定义以下变量：

```text
chroma_otel_collection_endpoint          = "api.honeycomb.com"
chroma_otel_service_name                 = "chromadb"
chroma_otel_collection_headers           = "{'x-honeycomb-team': 'abc'}"
```