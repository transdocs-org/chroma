# Azure 部署

{% Banner type="tip" %}

**Chroma Cloud**

我们完全托管的托管服务 Chroma Cloud 已经上线。[免费注册](https://trychroma.com/signup)。

{% /Banner %}

## 一个简单的 Azure 部署

你可以在一个长期运行的服务器上部署 Chroma，并远程连接它。

为了方便使用，我们提供了一个非常简单的 Terraform 配置，用于实验将 Chroma 部署到 Azure。

{% Banner type="warn" %}
Chroma 及其底层数据库[至少需要 2GB 的内存](./performance#results-summary)。在此示例的模板中定义你的虚拟机大小时，请确保满足此要求。
{% /Banner %}

{% Banner type="warn" %}
默认情况下，此模板将所有数据保存在单个卷上。当你删除或替换它时，数据将会丢失。对于正式的生产环境使用（包括高可用性、备份等），请阅读并理解该 Terraform 模板，并以其作为基础进行定制，或者联系 Chroma 团队以获得帮助。
{% /Banner %}

### 步骤 1：安装 Terraform

下载 [Terraform](https://developer.hashicorp.com/terraform/install?product_intent=terraform)，并按照你操作系统的安装说明进行安装。

### 步骤 2：通过 Azure 认证

```terminal
az login
```

### 步骤 3：配置你的 Azure 设置

创建一个 `chroma.tfvars` 文件。使用它来定义 Azure 资源组名称、虚拟机大小和位置等变量。请注意，此模板将为你的 Chroma 部署创建一个新的资源组。

```text
resource_group_name = "your-azure-resource-group-name"
location            = "your-location"
machine_type        = "Standard_B1s"
```

### 步骤 4：初始化并使用 Terraform 进行部署

将我们的 [Azure Terraform 配置](https://github.com/chroma-core/chroma/blob/main/deployments/azure/main.tf) 下载到与 `chroma.tfvars` 文件相同的目录中。然后运行以下命令来部署你的 Chroma 堆栈。

初始化 Terraform：
```terminal
terraform init
```

规划部署，并查看计划以确保符合你的预期：
```terminal
terraform plan -var-file chroma.tfvars
```

最后，应用部署：
```terminal
terraform apply -var-file chroma.tfvars
```

几分钟后，你可以通过以下命令获取实例的 IP 地址：
```terminal
terraform output -raw public_ip_address
```

### 步骤 5：Chroma 客户端设置

{% Tabs %}

{% Tab label="python" %}
一旦你的 Azure VM 实例成功运行 Chroma，你只需配置 `HttpClient` 使用服务器的 IP 地址和端口 `8000`。由于你正在 Azure 上运行 Chroma 服务，我们的 [轻量级客户端包](./python-thin-client) 可能满足你的应用需求。

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
一旦你的 Azure VM 实例成功运行 Chroma，你只需配置 `ChromaClient` 使用服务器的 IP 地址和端口 `8000`。

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

要销毁堆栈并删除所有 Azure 资源，请使用 `terraform destroy` 命令。

```shell
terraform destroy -var-file chroma.tfvars
```

{% Banner type="warn" %}
除非你已进行快照或备份，否则这将删除你的 Chroma 数据库中的所有数据。
{% /Banner %}

## 使用 Azure 进行可观测性

Chroma 使用 [OpenTelemetry](https://opentelemetry.io/) 钩子进行可观测性。目前我们仅导出 OpenTelemetry 的 [追踪](https://opentelemetry.io/docs/concepts/signals/traces/)。这些信息应能帮助你了解请求在系统中的流动情况，并快速识别瓶颈。有关可用参数的完整说明，请参阅 [可观测性文档](../administration/observability)。

要在你的 Chroma 服务器上启用追踪，只需在 `chroma.tfvars` 中定义以下变量：

```text
chroma_otel_collection_endpoint          = "api.honeycomb.com"
chroma_otel_service_name                 = "chromadb"
chroma_otel_collection_headers           = "{'x-honeycomb-team': 'abc'}"
```