# 迁移指南

模式和数据格式的变更对于软件的演进来说是不可避免的。我们非常重视这些变更，并承诺仅在必要时才进行此类变更，且频率极低。

Chroma 承诺：每当发生模式或数据格式变更时，我们将提供一个无缝且易于使用的迁移工具，帮助您迁移到新的模式或格式。

具体来说，我们会在以下渠道公告模式变更：

- Discord ([#migrations 频道](https://discord.com/channels/1073293645303795742/1129286514845691975))
- Github ([公告页面](https://github.com/chroma-core/chroma/issues))
- Email 邮件列表 [订阅地址](https://airtable.com/shrHaErIs1j9F97BE)

我们力求提供以下内容：

- 变更的描述及其背后的理由
- 可运行的 CLI 迁移工具
- 使用该工具的操作视频演示

## 迁移日志

### v1.0.0

在本次发布中，我们使用 Rust 语言重写了 Chroma 的大部分代码。整体性能得到了显著提升。

**重大变更**

Chroma 不再提供内置的身份验证实现。

`list_collections` 方法现在恢复为返回 `Collection` 对象。

**Chroma 本地模式变更**

如果您通过以下方式使用 Chroma：

```python
import chromadb

client = chromadb.Client()
# 或者
client = chromadb.EphemeralClient()
# 或者
client = chromadb.PersistentClient()
```

新的 Rust 实现将忽略以下设置：

- `chroma_server_nofile`
- `chroma_server_thread_pool_size`
- `chroma_memory_limit_bytes`
- `chroma_segment_cache_policy`

**Chroma CLI 变更**

如果您通过 CLI (`chroma run`) 启动 Chroma 服务，那么之前通过环境变量设置的参数（如 `CHROMA_SERVER_CORS_ALLOW_ORIGINS` 或 `CHROMA_OTEL_COLLECTION_ENDPOINT`）现在需通过配置文件设置。例如：

```terminal
chroma run --config ./config.yaml
```

完整的配置文件示例请参阅 [此处](https://github.com/chroma-core/chroma/blob/main/rust/frontend/sample_configs/single_node_full.yaml)。

**Docker 中的 Chroma 变更**

如果您通过 Docker 容器运行 Chroma，之前通过环境变量设置的参数（如 `CHROMA_SERVER_CORS_ALLOW_ORIGINS` 或 `CHROMA_OTEL_COLLECTION_ENDPOINT`）现在也需要通过配置文件传入。更多信息请参阅 [Docker 文档](../production/containers/docker#configuration)。

容器内的默认数据路径已从 `/chroma/chroma` 更改为 `/data`。例如，如果您之前以如下方式启动容器：

```terminal
docker run -p 8000:8000 -v ./chroma:/chroma/chroma chroma-core/chroma
```

现在应改为：

```terminal
docker run -p 8000:8000 -v ./chroma:/data chroma-core/chroma
```

### v0.6.0

此前，`list_collections` 方法会返回一个 `Collection` 对象列表。如果您的某些集合是使用自定义嵌入函数（非默认函数）创建的，这可能会导致一些错误。因此，从现在开始，`list_collections` 将只返回集合名称。

例如，如果您所有的集合都是使用 `OpenAIEmbeddingFunction` 创建的，您可以按如下方式正确使用 `list_collections` 和 `get_collection`：

```python
collection_names = client.list_collections()
ef = OpenAIEmbeddingFunction(...)
collections = [
	client.get_collection(name=name, embedding_function=ef)
	for name in collection_names
]
```

未来我们计划支持嵌入函数的持久化，这样 `list_collections` 就可以返回正确配置的 `Collection` 对象，而无需在调用 `get_collection` 时手动传入嵌入函数。

此外，我们已停止支持 Python 3.8。

### v0.5.17

我们现在不再支持在元数据过滤、ID 过滤等场景中使用空列表或空字典。例如：

```python
collection.get(
	ids=["id1", "id2", "id3", ...],
	where={}
)
```

现在应改为：

```python
collection.get(ids=["id1", "id2", "id3", ...])
```

### v0.5.12

`where` 子句中的 `$ne`（不等于）和 `$nin`（不在）操作符已更新：
* 之前：仅匹配具有指定键的记录。
* 现在：也匹配完全不包含该指定键的记录。

换句话说，`$ne` 和 `$nin` 现在分别匹配 `$eq`（等于）和 `$in`（包含）所匹配记录的补集（完全相反的结果集）。

`where_document` 子句中的 `$not_contains` 操作符也进行了更新：
* 之前：仅匹配包含文档字段的记录。
* 现在：也匹配完全不包含文档字段的记录。

换句话说，`$not_contains` 现在匹配的是 `$contains` 所匹配记录的完全相反的结果集。

`RateLimitingProvider` 现已被弃用，取而代之的是 `RateLimitEnforcer`。这个新接口允许您将服务器调用包裹在速率限制逻辑中。默认的 `SimpleRateLimitEnforcer` 实现允许所有请求通过，但您也可以创建自定义实现以支持更复杂的速率限制策略。

### v0.5.11

`collection.get()` 返回的结果现在是根据内部 ID 排序的。之前的结果是根据用户提供的 ID 排序的，尽管这一行为并未在文档中明确说明。我们希望进行这一更改，是因为在托管的 Chroma 中使用用户提供的 ID 可能不是最佳性能选择，我们希望将这种更改推广到本地 Chroma，以保持行为的一致性。通常，Chroma 中较新的文档具有更大的内部 ID。

与之相关的行为变化还包括 `limit` 和 `offset` 的使用，因为它们依赖于返回结果的顺序。例如，如果你有一个名为 `coll` 的集合，其中文档的 ID 为 `["3", "2", "1", "0"]`，并且按此顺序插入，则之前调用 `coll.get(limit=2, offset=2)["ids"]` 会返回 `["2", "3"]`，而现在会返回 `["1", "0"]`。

我们还修改了 `client.get_or_create` 的行为。之前，如果集合已经存在并且提供了 `metadata` 参数，现有集合的元数据将被新值覆盖。现在这一行为已改变。如果集合已经存在，`get_or_create` 将简单地返回具有指定名称的现有集合，任何附加参数（包括 `metadata`）都将被忽略。

最后，`collection.get()`、`collection.query()` 和 `collection.peek()` 返回的嵌入向量现在以二维 NumPy 数组形式表示，而不是 Python 列表。在添加嵌入向量时，你仍然可以使用 Python 列表或 NumPy 数组。如果请求返回多个嵌入向量，结果将是一个包含二维 NumPy 数组的 Python 列表。这一更改是我们为了提升本地 Chroma 的性能，使用 NumPy 数组作为嵌入向量内部表示的一部分努力。

### v0.5.6

Chroma 内部使用了预写日志（Write-Ahead Log）。在 v0.5.6 之前的所有版本中，该日志从未被修剪。这导致数据目录的大小远大于实际需要，并且在删除集合后目录的大小也不会按预期减少。

在 v0.5.6 中，预写日志将自动被修剪。但此功能在现有数据库中默认未启用。升级后，你应该运行一次 `chroma utils vacuum` 命令以减小数据库大小并启用持续修剪。有关更多详细信息，请参阅 [CLI 参考](/reference/cli#vacuuming)。

此命令不需要定期运行，也不需要在 v0.5.6 或更高版本创建的新数据库上运行。

### v0.5.1

在 Python 客户端中，`max_batch_size` 属性已被移除。该属性之前并未被文档记录，但如果你曾使用过它，你现在应改用 `get_max_batch_size()`。

首次调用时，它会发起一个 HTTP 请求。我们将其改为一个方法，是为了更清晰地表明它可能是一个阻塞操作。

### 认证系统重构 - 2024 年 4 月 20 日

**如果你未使用 Chroma 的[内置认证系统](https://docs.trychroma.com/deployment/auth)，则无需采取任何操作。**

本次发布重构并简化了我们的认证和授权系统。
如果你正在使用 Chroma 的内置认证系统，则需要更新你的配置以及任何用于实现自定义认证或授权提供者的代码。
此次更改主要是为了减少 Chroma 的技术债务并使未来的更改更容易，
但它也改变了用户配置的方式并使其更加简洁。
如果你未使用 Chroma 的内置认证系统，则无需采取任何操作。

之前，Chroma 的认证和授权依赖于许多具有多种配置选项的对象，包括：

- `chroma_server_auth_provider`
- `chroma_server_auth_configuration_provider`
- `chroma_server_auth_credentials_provider`
- `chroma_client_auth_credentials_provider`
- `chroma_client_auth_protocol_adapter`

以及其他。

我们已将这些整合为三个类：

- `ClientAuthProvider`
- `ServerAuthenticationProvider`
- `ServerAuthorizationProvider`

`ClientAuthProvider` 现在负责自身的配置和凭证管理。可以通过 `chroma_client_auth_credentials` 设置向其提供凭证。`chroma_client_auth_credentials` 的值取决于 `ServerAuthenticationProvider`；对于 `TokenAuthenticationServerProvider`，它应该只是一个令牌；对于 `BasicAuthenticationServerProvider`，它应该为 `username:password`。

`ServerAuthenticationProvider` 负责将请求的授权信息转换为 `UserIdentity`，其中包含做出授权决策所需的任何信息。它们现在也负责自身的配置和凭证管理。通过 `chroma_server_authn_credentials` 和 `chroma_server_authn_credentials_file` 设置进行配置。

`ServerAuthorizationProvider` 负责将请求的信息和发出请求的 `UserIdentity` 转换为授权决策。通过 `chroma_server_authz_config` 和 `chroma_server_authz_config_file` 设置进行配置。

> `_authn_credentials` 或 `authn_credentials_file` 可以设置其中一个，但不能同时设置。`authz_config` 和 `authz_config_file` 同理。配置的值（或配置文件中的数据）将取决于你的认证和授权提供者。更多信息请参见[此处](https://github.com/chroma-core/chroma/tree/main/examples/basic_functionality/authz)。

Chroma 自带的两个认证系统是 `Basic` 和 `Token`。我们分别为它们提供了简要的迁移指南。

#### 基础认证（Basic）

如果你使用的是 `Token` 认证方式，你的服务器配置可能如下所示：

```yaml
CHROMA_SERVER_AUTH_CREDENTIALS="admin:admin"
CHROMA_SERVER_AUTH_CREDENTIALS_FILE="./example_file"
CHROMA_SERVER_AUTH_CREDENTIALS_PROVIDER="chromadb.auth.providers.HtpasswdConfigurationServerAuthCredentialsProvider"
CHROMA_SERVER_AUTH_PROVIDER="chromadb.auth.basic.BasicAuthServerProvider"
```

_注意：`AUTH_CREDENTIALS` 和 `AUTH_CREDENTIALS_FILE` 只能设置其中一个，但本指南展示了如何同时迁移两者。_

对应的客户端配置如下：

```yaml
CHROMA_CLIENT_AUTH_PROVIDER="chromadb.auth.token.TokenAuthClientProvider"
CHROMA_CLIENT_AUTH_CREDENTIALS="admin:admin"
```

要迁移到新的服务器配置，只需将其更改为：

```yaml
CHROMA_SERVER_AUTHN_PROVIDER="chromadb.auth.token_authn.TokenAuthenticationServerProvider"
CHROMA_SERVER_AUTHN_CREDENTIALS="test-token"
CHROMA_SERVER_AUTHN_CREDENTIALS_FILE="./example_file"
```

新的客户端配置：

```yaml
CHROMA_CLIENT_AUTH_CREDENTIALS="test-token"
CHROMA_CLIENT_AUTH_PROVIDER="chromadb.auth.basic_authn.BasicAuthClientProvider"
```

#### Token 认证（Token）

如果你使用的是 `Token` 认证方式，你的服务器配置可能如下所示：

```yaml
CHROMA_SERVER_AUTH_CREDENTIALS="test-token"
CHROMA_SERVER_AUTH_CREDENTIALS_FILE="./example_file"
CHROMA_SERVER_AUTH_CREDENTIALS_PROVIDER="chromadb.auth.token.TokenConfigServerAuthCredentialsProvider"
CHROMA_SERVER_AUTH_PROVIDER="chromadb.auth.token.TokenAuthServerProvider"
CHROMA_SERVER_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

_注意：`AUTH_CREDENTIALS` 和 `AUTH_CREDENTIALS_FILE` 只能设置其中一个，但本指南展示了如何同时迁移两者。_

对应的客户端配置如下：

```yaml
CHROMA_CLIENT_AUTH_PROVIDER="chromadb.auth.token.TokenAuthClientProvider"
CHROMA_CLIENT_AUTH_CREDENTIALS="test-token"
CHROMA_CLIENT_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

要迁移到新的服务器配置，只需将其更改为：

```yaml
CHROMA_SERVER_AUTHN_PROVIDER="chromadb.auth.token_authn.TokenAuthenticationServerProvider"
CHROMA_SERVER_AUTHN_CREDENTIALS="test-token"
CHROMA_SERVER_AUTHN_CREDENTIALS_FILE="./example_file"
CHROMA_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

新的客户端配置：

```yaml
CHROMA_CLIENT_AUTH_CREDENTIALS="test-token"
CHROMA_CLIENT_AUTH_PROVIDER="chromadb.auth.token_authn.TokenAuthClientProvider"
CHROMA_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

#### 配置项变更参考

- **整体配置**
    - `chroma_client_auth_token_transport_header`：重命名为 `chroma_auth_token_transport_header`。
    - `chroma_server_auth_token_transport_header`：重命名为 `chroma_auth_token_transport_header`。
- **客户端配置**
    - `chroma_client_auth_credentials_provider`：已删除。功能已合并到 `chroma_client_auth_provider`。
    - `chroma_client_auth_protocol_adapter`：已删除。功能已合并到 `chroma_client_auth_provider`。
    - `chroma_client_auth_credentials_file`：已删除。功能已合并到 `chroma_client_auth_credentials`。
    - 这些更改同样适用于 Typescript 客户端。
- **服务器端认证（authn）**
    - `chroma_server_auth_provider`：重命名为 `chroma_server_authn_provider`。
    - `chroma_server_auth_configuration_provider`：已删除。功能已合并到 `chroma_server_authn_provider`。
    - `chroma_server_auth_credentials_provider`：已删除。功能已合并到 `chroma_server_authn_provider`。
    - `chroma_server_auth_credentials_file`：重命名为 `chroma_server_authn_credentials_file`。
    - `chroma_server_auth_credentials`：重命名为 `chroma_server_authn_credentials`。
    - `chroma_server_auth_configuration_file`：重命名为 `chroma_server_authn_configuration_file`。
- **服务器端授权（authz）**
    - `chroma_server_authz_ignore_paths`：已删除。功能已合并到 `chroma_server_auth_ignore_paths`。

如需查看完整变更内容，请查阅 [PR](https://github.com/chroma-core/chroma/pull/1970/files) 或在 [Discord](https://discord.gg/MMeYNTmh3x) 上联系 Chroma 团队。

### 迁移到 0.4.16 - 2023年11月7日

本次发布新增了对多模态嵌入（multi-modal embeddings）的支持，并对 `EmbeddingFunction` 的定义进行了相应更改。  
此次更改主要影响那些实现了自定义 `EmbeddingFunction` 类的用户。如果你使用的是 Chroma 提供的内置嵌入函数，则无需进行任何操作。

**EmbeddingFunction**

此前，`EmbeddingFunction` 的定义如下：

```python
class EmbeddingFunction(Protocol):
    def __call__(self, texts: Documents) -> Embeddings:
        ...
```

更新后，其定义如下：

```python
Embeddable = Union[Documents, Images]
D = TypeVar("D", bound=Embeddable, contravariant=True)

class EmbeddingFunction(Protocol[D]):
    def __call__(self, input: D) -> Embeddings:
        ...
```

主要差异如下：

- `EmbeddingFunction` 现在是泛型的，并接受一个类型参数 `D`，该参数是 `Embeddable` 的子类型。这使得我们可以定义支持多种模态嵌入的 `EmbeddingFunction`。
- `__call__` 方法现在接受一个名为 `input` 的单一参数，以支持任意类型 `D` 的数据输入。原有的 `texts` 参数已被移除。

### 从 >0.4.0 到 0.4.0 的迁移指南 - 2023年7月17日

这个版本有什么新功能？

- 新的更简便的客户端创建方式
- 存储方式变更
- 移除了 `.persist()`，默认不再启用 `.reset()`

**新客户端**

```python
### 内存中临时客户端

# 旧方式
import chromadb
client = chromadb.Client()

# 新方式
import chromadb
client = chromadb.EphemeralClient()


### 持久化客户端

# 旧方式
import chromadb
from chromadb.config import Settings
client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="/path/to/persist/directory" # 可选，默认为当前目录下的 .chromadb/
))

# 新方式
import chromadb
client = chromadb.PersistentClient(path="/path/to/persist/directory")


### HTTP 客户端（用于与服务端通信）

# 旧方式
import chromadb
from chromadb.config import Settings
client = chromadb.Client(Settings(chroma_api_impl="rest",
                                        chroma_server_host="localhost",
                                        chroma_server_http_port="8000"
                                    ))

# 新方式
import chromadb
client = chromadb.HttpClient(host="localhost", port="8000")

```

你仍然可以访问底层的 `.Client()` 方法。如果你想关闭遥测功能，所有客户端都支持自定义设置：

```python
import chromadb
from chromadb.config import Settings
client = chromadb.PersistentClient(
    path="/path/to/persist/directory",
    settings=Settings(anonymized_telemetry=False))
```

**新的数据布局**

本版本的 Chroma 放弃使用 `duckdb` 和 `clickhouse`，改用 `sqlite` 来进行元数据存储。这意味着需要迁移旧数据。我们为此创建了一个迁移 CLI 工具来完成此任务。

如果你升级到 `0.4.0` 并尝试访问旧格式存储的数据，会看到如下错误信息：

> You are using a deprecated configuration of Chroma. Please pip install chroma-migrate and run `chroma-migrate` to upgrade your configuration. See https://docs.trychroma.com/deployment/migration for more information or join our discord at https://discord.gg/MMeYNTmh3x for help!

以下是 CLI 工具的安装和使用方法：

```terminal
pip install chroma-migrate
chroma-migrate
```

![](/chroma-migrate.png)

如果你在迁移过程中遇到任何问题，请随时联系我们！我们随时在 [Discord](https://discord.com/channels/1073293645303795742/1129286514845691975) 提供帮助。

**Persist 与 Reset**

在旧版本中存在 `.persist()` 是因为写入操作只有在被强制刷新时才会落盘。而在 Chroma `0.4.0` 中，所有的写入都会即时保存到磁盘，因此不再需要 `.persist()`。

`.reset()` 用于重置整个数据库，之前默认是启用的，但这并不合理。在 `0.4.0` 中默认将其禁用。你可以通过向 Settings 对象传入 `allow_reset=True` 来重新启用它。例如：

```python
import chromadb
from chromadb.config import Settings
client = chromadb.PersistentClient(path="./path/to/chroma", settings=Settings(allow_reset=True))
```