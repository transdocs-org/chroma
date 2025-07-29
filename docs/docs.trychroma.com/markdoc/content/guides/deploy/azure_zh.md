# Azure 部署

{% Banner type="tip" %}

**Chroma Cloud**

我们完全托管的云服务 Chroma Cloud 已经上线。[立即免费注册](https://trychroma.com/signup)。

{% /Banner %}

## 一个简单的 Azure 部署

你可以在一个长期运行的服务器上部署 Chroma，并通过远程方式连接它。

为了方便使用，我们提供了一个非常简单的 Terraform 配置，用于在 Azure 上尝试部署 Chroma。

{% Banner type="warn" %}
Chroma 及其底层数据库[至少需要 2GB 的内存](./performance#results-summary)。在本示例的模板中定义虚拟机大小时，请确保满足此要求。
{% /Banner %}

{% Banner type="warn" %}
默认情况下，此模板将所有数据保存在单个卷上。当你删除或替换该卷时，数据将会丢失。对于正式的生产环境（包括高可用性、备份等），请仔细阅读并理解该 Terraform 模板，并以其为基础进行定制，或联系 Chroma 团队以获得帮助。
{% /Banner %}

### 步骤 1: 安装 Terraform

下载 [Terraform](https://developer.hashicorp.com/terraform/install?product_intent=terraform) 并根据你的操作系统按照安装说明进行安装。

### 步骤 2: 使用 Azure 身份验证

```terminal
az login
```

### 步骤 3: 配置你的 Azure 设置

创建一个 `chroma.tfvars` 文件，并在其中定义以下变量：你的 Azure 资源组名称、虚拟机大小和位置。请注意，此模板会为你的 Chroma 部署创建一个新的资源组。

```text
resource_group_name = "your-azure-resource-group-name"
location            = "your-location"
machine_type        = "Standard_B1s"
```

### 步骤 4: 使用 Terraform 初始化并部署

将我们的 [Azure Terraform 配置](https://github.com/chroma-core/chroma/blob/main/deployments/azure/main.tf) 下载到与 `chroma.tfvars` 文件相同的目录中。然后运行以下命令来部署你的 Chroma 堆栈。

初始化 Terraform：
```terminal
terraform init
```

预览部署计划，并检查是否符合你的预期：
```terminal
terraform plan -var-file chroma.tfvars
```

最后，执行部署：
```terminal
terraform apply -var-file chroma.tfvars
```

几分钟后，你可以使用以下命令获取实例的 IP 地址：
```terminal
terraform output -raw public_ip_address
```

### 步骤5：Chroma 客户端设置

{% Tabs %}

{% Tab label="python" %}
一旦你的 Azure 虚拟机实例已启动并运行 Chroma，你只需将 `HttpClient` 配置为使用服务器的 IP 地址和端口 `8000`。由于你在 Azure 上运行的是 Chroma 服务，我们的 [轻量客户端包](./python-thin-client) 可能满足你的应用需求。

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
一旦你的 Azure 虚拟机实例已启动并运行 Chroma，你只需将 `ChromaClient` 配置为使用服务器的 IP 地址和端口 `8000`。

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

### 步骤5：清理（可选）

要销毁整个资源栈并删除所有 Azure 资源，请使用 `terraform destroy` 命令。

```shell
terraform destroy -var-file chroma.tfvars
```

{% Banner type="warn" %}
除非你已经对数据库进行了快照或备份，否则此操作将会永久删除 Chroma 数据库中的所有数据。
{% /Banner %}

## 使用 Azure 进行可观察性

Chroma 通过 [OpenTelemetry](https://opentelemetry.io/) 钩子实现了可观察性功能。目前我们仅导出 OpenTelemetry 的[追踪数据（traces）](https://opentelemetry.io/docs/concepts/signals/traces/)。这些追踪数据可以帮助你了解请求在系统中的流动方式，并快速识别性能瓶颈。有关可用参数的完整说明，请参阅[可观察性文档](../administration/observability)。

要在你的 Chroma 服务器上启用追踪功能，只需在 `chroma.tfvars` 文件中定义以下变量：

```text
chroma_otel_collection_endpoint          = "api.honeycomb.com"
chroma_otel_service_name                 = "chromadb"
chroma_otel_collection_headers           = "{'x-honeycomb-team': 'abc'}"
```