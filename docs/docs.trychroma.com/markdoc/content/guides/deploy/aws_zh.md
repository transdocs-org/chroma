# AWS 部署

{% Banner type="tip" %}

**Chroma Cloud**

我们完全托管的云服务 Chroma Cloud 已经上线。[立即免费注册](https://trychroma.com/signup)。

{% /Banner %}

## 一个简单的 AWS 部署方案

你可以将 Chroma 部署在一台长期运行的服务器上，并通过远程方式连接它。

虽然有多种可能的配置方式，但为了方便起见，我们提供了一个非常简单的 AWS CloudFormation 模板，用于在 AWS 上尝试将 Chroma 部署到 EC2 实例。

{% Banner type="warn" %}

Chroma 及其底层数据库[至少需要 2GB 的内存](./performance#results-summary)，
这意味着它无法在 AWS 免费套餐所提供的 1GB 内存实例上运行。本模板使用的是 [`t3.small`](https://aws.amazon.com/ec2/instance-types/t3/#Product%20Details) EC2 实例，
每小时约需花费两美分，整月运行大约需要 15 美元，并提供 2GiB 的内存。如果你按照本指南操作，AWS 将根据此标准进行计费。

{% /Banner %}

{% Banner type="warn"  %}

默认情况下，此模板将所有数据存储在一个卷上。
当你删除或替换该卷时，数据将会丢失。对于正式的生产用途（需要高可用性、备份等功能），请仔细阅读并理解 CloudFormation 模板，
并以此为基础进行调整，或联系 Chroma 团队以获取协助。

{% /Banner %}

### 步骤 1: 获取一个 AWS 账户

你需要一个 AWS 账户。你可以使用已有的账户，或者[创建一个新的账户](https://aws.amazon.com)。

### 步骤 2: 获取凭证

在本示例中，我们将使用 AWS 命令行接口。有[多种方式](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-prereqs.html)可以配置 AWS CLI。为了便于演示，我们假定你已经[获取了 AWS 访问密钥](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)，并准备使用环境变量来配置 AWS。

在你的 Shell 中导出 `AWS_ACCESS_KEY_ID` 和 `AWS_SECRET_ACCESS_KEY` 环境变量：

```terminal
export AWS_ACCESS_KEY_ID=**\*\***\*\*\*\***\*\***
export AWS_SECRET_ACCESS_KEY=****\*\*****\*\*****\*\*****
```

你也可以通过 `AWS_REGION` 环境变量配置 AWS 使用指定的区域：

```terminal
export AWS_REGION=us-east-1
```

### 步骤 3: 运行 CloudFormation

Chroma 会在每次发布时将一个 [CloudFormation 模板](https://s3.amazonaws.com/public.trychroma.com/cloudformation/latest/chroma.cf.json) 发布到 S3。

要使用 AWS CloudFormation 启动该模板，请运行以下命令：

如果你希望使用不同的堆栈名称，请替换 `--stack-name my-chroma-stack` 部分。

```terminal
aws cloudformation create-stack --stack-name my-chroma-stack --template-url https://s3.amazonaws.com/public.trychroma.com/cloudformation/latest/chroma.cf.json
```

等待几分钟，让服务器启动，之后 Chroma 就可以使用了！你可以通过 AWS 控制台获取新 Chroma 服务器的公网 IP 地址，也可以使用以下命令：

```terminal
aws cloudformation describe-stacks --stack-name my-chroma-stack --query 'Stacks[0].Outputs'
```

请注意，即使实例的 IP 地址已经可用，Chroma 仍可能需要几分钟时间才能完全启动并运行。

#### 自定义堆栈（可选）

CloudFormation 模板允许您传递特定的键/值对，以覆盖堆栈的某些配置。可用的键包括：

- `InstanceType` - 要运行的 AWS 实例类型（默认值：`t3.small`）
- `KeyName` - 要使用的 AWS EC2 密钥对，用于通过 SSH 访问实例（默认值：无）

要使用 AWS CLI 设置 CloudFormation 堆栈的参数，请使用 `--parameters` 命令行选项。参数必须使用 `ParameterName={参数名},ParameterValue={值}` 的格式指定。

例如，以下命令将启动一个新的堆栈，与之前的配置类似，但使用的是 `m5.4xlarge` EC2 实例，并添加了一个名为 `mykey` 的密钥对，这样拥有对应私钥的任何人都可以通过 SSH 登录该实例：

```terminal
aws cloudformation create-stack --stack-name my-chroma-stack --template-url https://s3.amazonaws.com/public.trychroma.com/cloudformation/latest/chroma.cf.json \
 --parameters ParameterKey=KeyName,ParameterValue=mykey \
 ParameterKey=InstanceType,ParameterValue=m5.4xlarge
```

### 步骤 4: Chroma 客户端设置

{% Tabs %}

{% Tab label="python" %}
一旦你的 EC2 实例已经启动并运行了 Chroma，你只需要将 `HttpClient` 配置为使用服务器的 IP 地址和端口 `8000`。由于你是在 AWS 上运行 Chroma 服务，我们推荐使用[轻量客户端包](./python-thin-client)，这可能已经满足你的需求。

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
一旦你的 EC2 实例已经启动并运行了 Chroma，你只需要将 `ChromaClient` 配置为使用服务器的 IP 地址和端口 `8000`。

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

### 步骤 5：清理（可选）

要销毁整个资源栈并删除所有 AWS 资源，可以使用 AWS CLI 的 `delete-stack` 命令。

{% note type="warning" title="注意" %}
除非你已经对数据库进行了快照或备份，否则此操作会删除 Chroma 数据库中的所有数据。
{% /note %}

```terminal
aws cloudformation delete-stack --stack-name my-chroma-stack
```

## 使用 AWS 进行可观察性监控

Chroma 通过 [OpenTelemetry](https://opentelemetry.io/) 钩子实现了可观察性功能。目前我们仅导出 OpenTelemetry 的 [追踪数据（traces）](https://opentelemetry.io/docs/concepts/signals/traces/)。这些追踪数据可以帮助您了解请求在系统中的流转路径，并快速识别性能瓶颈。关于可用参数的完整说明，请参阅[可观察性文档](../administration/observability)。

要启用 Chroma 服务器的追踪功能，只需在创建 CloudFormation 堆栈时，将所需的值作为参数传入即可：

```terminal
aws cloudformation create-stack --stack-name my-chroma-stack --template-url https://s3.amazonaws.com/public.trychroma.com/cloudformation/latest/chroma.cf.json \
 --parameters ParameterKey=ChromaOtelCollectionEndpoint,ParameterValue="api.honeycomb.com" \
 ParameterKey=ChromaOtelServiceName,ParameterValue="chromadb" \
 ParameterKey=ChromaOtelCollectionHeaders,ParameterValue="{'x-honeycomb-team': 'abc'}"
```

## 故障排除

#### 错误：此用户没有默认的 VPC

如果在创建 `ChromaInstanceSecurityGroup` 时收到错误提示 `No default VPC for this user`，请前往 [AWS VPC 界面](https://us-east-1.console.aws.amazon.com/vpc/home?region=us-east-1#vpcs) 为您的用户创建一个默认的 VPC。