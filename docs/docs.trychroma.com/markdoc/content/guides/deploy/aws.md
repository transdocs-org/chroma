# AWS 部署

{% Banner type="tip" %}

**Chroma Cloud**

我们全托管的云服务 Chroma Cloud 已经上线。[免费注册](https://trychroma.com/signup)。

{% /Banner %}

## 一个简单的 AWS 部署

你可以在一台长期运行的服务器上部署 Chroma，并远程连接它。

虽然有多种可能的配置方式，但为了方便起见，我们提供了一个非常简单的 AWS CloudFormation 模板，用于在 AWS 上将 Chroma 部署到 EC2。

{% Banner type="warn" %}

Chroma 及其底层数据库[至少需要 2GB 内存](./performance#results-summary)，
这意味着它无法在 AWS 免费套餐提供的 1GB 实例上运行。此模板使用了 [`t3.small`](https://aws.amazon.com/ec2/instance-types/t3/#Product%20Details) EC2 实例，
每小时约花费两美分，整月约花费 15 美元，并提供 2GiB 内存。如果你按照这些说明操作，AWS 将相应地向你收费。

{% /Banner %}

{% Banner type="warn"  %}

默认情况下，此模板将所有数据保存在单个卷上。当你删除或替换它时，数据将消失。对于正式的生产使用（包括高可用性、备份等），请阅读并理解 CloudFormation 模板，并将其作为你需要的基础，或联系 Chroma 团队寻求帮助。

{% /Banner %}

### 步骤 1：获取 AWS 账户

你需要一个 AWS 账户。你可以使用已有的账户，或者
[创建一个新账户](https://aws.amazon.com)。

### 步骤 2：获取凭证

在此示例中，我们将使用 AWS 命令行界面。有
[多种方式](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-prereqs.html)
可以配置 AWS CLI，但为了方便示例，我们假设你已经
[获取了 AWS 访问密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
并打算使用环境变量进行配置。

在你的 shell 中导出 `AWS_ACCESS_KEY_ID` 和 `AWS_SECRET_ACCESS_KEY` 环境变量：

```terminal
export AWS_ACCESS_KEY_ID=**\*\***\*\*\*\***\*\***
export AWS_SECRET_ACCESS_KEY=****\*\*****\*\*****\*\*****
```

你还可以使用 `AWS_REGION` 环境变量配置 AWS 使用你选择的区域：

```terminal
export AWS_REGION=us-east-1
```

### 步骤 3：运行 CloudFormation

Chroma 会为每个版本在 S3 上发布一个 [CloudFormation 模板](https://s3.amazonaws.com/public.trychroma.com/cloudformation/latest/chroma.cf.json)。

要使用 AWS CloudFormation 启动该模板，请运行以下命令。

如果你愿意，可以将 `--stack-name my-chroma-stack` 替换为其他堆栈名称。

```terminal
aws cloudformation create-stack --stack-name my-chroma-stack --template-url https://s3.amazonaws.com/public.trychroma.com/cloudformation/latest/chroma.cf.json
```

等待几分钟，服务器启动后 Chroma 就可以使用了！你可以通过 AWS 控制台获取新 Chroma 服务器的公网 IP 地址，或者使用以下命令：

```terminal
aws cloudformation describe-stacks --stack-name my-chroma-stack --query 'Stacks[0].Outputs'
```

请注意，即使实例的 IP 地址已经可用，Chroma 仍可能需要几分钟才能完全启动。

#### 自定义堆栈（可选）

CloudFormation 模板允许你传递特定的键/值对以覆盖堆栈的某些部分。可用的键包括：

- `InstanceType` - 要运行的 AWS 实例类型（默认：`t3.small`）
- `KeyName` - 要使用的 AWS EC2 密钥对，用于通过 SSH 访问实例（默认：无）

要使用 AWS CLI 设置 CloudFormation 堆栈的参数，请使用 `--parameters` 命令行选项。参数必须使用 `ParameterName={parameter},ParameterValue={value}` 的格式指定。

例如，以下命令启动一个与上述类似的新堆栈，但使用 `m5.4xlarge` EC2 实例，并添加名为 `mykey` 的密钥对，以便拥有相关私钥的任何人都可以 SSH 登录该机器：

```terminal
aws cloudformation create-stack --stack-name my-chroma-stack --template-url https://s3.amazonaws.com/public.trychroma.com/cloudformation/latest/chroma.cf.json \
 --parameters ParameterKey=KeyName,ParameterValue=mykey \
 ParameterKey=InstanceType,ParameterValue=m5.4xlarge
```

### 步骤 4：Chroma 客户端设置

{% Tabs %}

{% Tab label="python" %}
一旦你的 EC2 实例成功运行了 Chroma，你只需要将 `HttpClient` 配置为使用服务器的 IP 地址和端口 `8000` 即可。由于你是在 AWS 上运行 Chroma 服务器，我们的 [轻量客户端包](./python-thin-client) 可能满足你的需求。

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
一旦你的 EC2 实例成功运行了 Chroma，你只需要将 `ChromaClient` 配置为使用服务器的 IP 地址和端口 `8000` 即可。

```typescript
import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({
    host: "<Your Chroma instance IP>",
    port: 8000
})
chroma_client.heartbeat()
```
{% /Tab %}

{% /Tabs %}

### 步骤 5：清理（可选）

要销毁堆栈并删除所有 AWS 资源，请使用 AWS CLI 的 `delete-stack` 命令。

{% note type="warning" title="注意" %}
除非你已进行快照或备份，否则这将删除你的 Chroma 数据库中的所有数据。
{% /note %}

```terminal
aws cloudformation delete-stack --stack-name my-chroma-stack
```

## 使用 AWS 进行可观测性

Chroma 使用 [OpenTelemetry](https://opentelemetry.io/) 钩子实现可观测性。目前我们仅导出 OpenTelemetry [追踪数据](https://opentelemetry.io/docs/concepts/signals/traces/)。这些数据应能帮助你了解请求在系统中的流动情况，并快速识别瓶颈。有关可用参数的完整说明，请参阅[可观测性文档](../administration/observability)。

要在你的 Chroma 服务器上启用追踪，只需在创建 CloudFormation 堆栈时将所需的值作为参数传递：

```terminal
aws cloudformation create-stack --stack-name my-chroma-stack --template-url https://s3.amazonaws.com/public.trychroma.com/cloudformation/latest/chroma.cf.json \
 --parameters ParameterKey=ChromaOtelCollectionEndpoint,ParameterValue="api.honeycomb.com" \
 ParameterKey=ChromaOtelServiceName,ParameterValue="chromadb" \
 ParameterKey=ChromaOtelCollectionHeaders,ParameterValue="{'x-honeycomb-team': 'abc'}"
```

## 故障排查

#### 错误：此用户没有默认 VPC

如果你在创建 `ChromaInstanceSecurityGroup` 时收到错误提示 `No default VPC for this user`，请前往 [AWS VPC 页面](https://us-east-1.console.aws.amazon.com/vpc/home?region=us-east-1#vpcs) 为你的用户创建一个默认 VPC。