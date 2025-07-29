# GCP 部署

{% Banner type="tip" %}

**Chroma Cloud**

我们完全托管的托管服务 Chroma Cloud 已经上线。[点击此处](https://trychroma.com/signup)免费注册。

{% /Banner %}

## 一个简单的 GCP 部署

你可以在一个长期运行的服务器上部署 Chroma，并远程连接它。

为了方便起见，我们提供了一个非常简单的 Terraform 配置，用于在 Google Compute Engine 上部署 Chroma 的实验。

{% Banner type="warn" %}

Chroma 及其底层数据库[至少需要 2GB 的内存](./performance#results-summary)，
这意味着它无法在 GCP “始终免费”套餐提供的实例上运行。此模板使用的是 [`e2-small`](https://cloud.google.com/compute/docs/general-purpose-machines#e2_machine_types) 实例，
每小时大约花费两美分，或者每月满负荷运行约 15 美元，并提供 2GiB 内存。如果你按照这些说明操作，GCP 将根据此收费。

{% /Banner %}

{% Banner type="warn" %}

在本指南中，我们将展示如何使用 [Chroma 的原生身份验证支持](./gcp#authentication-with-gcp)来保护你的端点。或者，你也可以将其放在 [GCP API Gateway](https://cloud.google.com/api-gateway/docs) 后面，或添加你自己的身份验证代理。此基本堆栈不支持任何形式的身份验证；
任何知道你服务器 IP 地址的人都可以添加并查询嵌入数据。

{% /Banner %}

{% Banner type="warn" %}

默认情况下，此模板将所有数据保存在单个卷上。当你删除或替换该卷时，数据将会丢失。对于正式生产使用（包括高可用性、备份等），请阅读并理解该 Terraform 模板，并将其作为你需要的基础，或联系 Chroma 团队以获取帮助。

{% /Banner %}

### 步骤 1：设置你的 GCP 凭证

在你的 GCP 项目中，为部署 Chroma 创建一个服务账户。它需要以下角色：
* Service Account User
* Compute Admin
* Compute Network Admin
* Storage Admin

为此服务账户创建一个 JSON 密钥文件并下载。将 `GOOGLE_APPLICATION_CREDENTIALS` 环境变量设置为你 JSON 密钥文件的路径：

```terminal
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
```

### 步骤 2：安装 Terraform

下载 [Terraform](https://developer.hashicorp.com/terraform/install?product_intent=terraform) 并按照你操作系统对应的安装说明进行操作。

### 步骤 3：配置你的 GCP 设置

创建一个 `chroma.tfvars` 文件。使用它来定义以下 GCP 项目 ID、区域和可用区变量：

```text
project_id="<你的项目ID>"
region="<你的区域>"
zone="<你的可用区>"
```

### 步骤 4：使用 Terraform 初始化并部署

将我们的 [GCP Terraform 配置](https://github.com/chroma-core/chroma/blob/main/deployments/gcp/main.tf) 下载到与你的 `chroma.tfvars` 文件相同的目录中。然后运行以下命令来部署你的 Chroma 堆栈。

初始化 Terraform：
```terminal
terraform init
```

规划部署，并审查计划以确保符合你的预期：
```terminal
terraform plan -var-file chroma.tfvars
```
如果你没有自定义我们的配置，你应该会部署一个 `e2-small` 实例。

最后，应用部署：
```terminal
terraform apply -var-file chroma.tfvars
```

#### 自定义堆栈（可选）

如果你想使用不同于默认 `e2-small` 的机器类型，在你的 `chroma.tfvars` 文件中添加 `machine_type` 变量并将其设置为你想要的机器类型：

```text
machine_type = "e2-medium"
```

几分钟后，你可以使用以下命令获取实例的 IP 地址：
```terminal
terraform output -raw chroma_instance_ip
```

### 步骤 5：Chroma 客户端设置
{% Tabs %}

{% Tab label="python" %}
一旦你的 Compute Engine 实例成功运行了 Chroma，你只需要将 `HttpClient` 配置为使用服务器的 IP 地址和端口 `8000`。由于你正在 Azure 上运行 Chroma 服务器，我们的 [轻量级客户端包](./python-thin-client) 可能满足你的应用需求。

```python
import chromadb

chroma_client = chromadb.HttpClient(
    host="<你的 Chroma 实例 IP>",
    port=8000
)
chroma_client.heartbeat()
```
{% /Tab %}

{% Tab label="typescript" %}
一旦你的 Compute Engine 实例成功运行了 Chroma，你只需要将 `ChromaClient` 配置为使用服务器的 IP 地址和端口 `8000`。

```typescript
import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({
    host: "<你的 Chroma 实例 IP>",
    port: 8000
})
chromaClient.heartbeat()
```
{% /Tab %}

{% /Tabs %}

### 步骤 6：清理（可选）

要销毁堆栈并删除所有 GCP 资源，请使用 `terraform destroy` 命令。

{% note type="warning" title="注意" %}
除非你已经创建了快照或以其他方式备份了数据，否则这将销毁你的 Chroma 数据库中的所有数据。
{% /note %}

```terminal
terraform destroy -var-file chroma.tfvars
```

## 使用 GCP 进行可观测性

Chroma 使用 [OpenTelemetry](https://opentelemetry.io/) 钩子进行可观测性。我们目前只导出 OpenTelemetry [追踪](https://opentelemetry.io/docs/concepts/signals/traces/)。这些功能可以帮助你了解请求在系统中的流动方式，并快速识别瓶颈。有关可用参数的完整说明，请参阅 [可观测性文档](../administration/observability)。

要在你的 Chroma 服务器上启用追踪，只需在你的 `chroma.tfvars` 中定义以下变量：

```text
chroma_otel_collection_endpoint          = "api.honeycomb.com"
chroma_otel_service_name                 = "chromadb"
chroma_otel_collection_headers           = "{'x-honeycomb-team': 'abc'}"
```