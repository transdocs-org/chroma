# 迁移指南

Schema 和数据格式的变化是软件演进过程中的必要之恶。我们非常重视这些变化，并且只有在必要时才会进行，且频率极低。

Chroma 承诺：每当 schema 或数据格式发生变化时，我们将提供一个无缝且易于使用的迁移工具，帮助您迁移到新的 schema/格式。

具体来说，我们会在以下渠道宣布 schema 的变更：

- Discord ([#migrations 频道](https://discord.com/channels/1073293645303795742/1129286514845691975))
- Github ([链接](https://github.com/chroma-core/chroma/issues))
- 邮件列表 [订阅](https://airtable.com/shrHaErIs1j9F97BE)

我们力求提供以下内容：

- 对变更的描述及其背后的原因
- 一个可以运行的 CLI 迁移工具
- 使用该工具的视频演示

## 迁移日志

### v1.0.0

在本次发布中，我们用 Rust 重写了 Chroma 的大部分代码。整体性能显著提升。

**重大变更**

Chroma 不再提供内置的身份验证实现。

`list_collections` 现在恢复为返回 `Collection` 对象。

**Chroma 内部使用变更**

如果您通过以下方式使用 Chroma：

```python
import chromadb

client = chromadb.Client()
# 或者
client = chromadb.EphemeralClient()
# 或者
client = chromadb.PersistentClient()
```

则需要注意：新的 Rust 实现将忽略以下设置：

- `chroma_server_nofile`
- `chroma_server_thread_pool_size`
- `chroma_memory_limit_bytes`
- `chroma_segment_cache_policy`

**Chroma CLI 变更**

如果您通过 CLI (`chroma run`) 运行 Chroma 服务器，则需要注意：之前通过环境变量（如 `CHROMA_SERVER_CORS_ALLOW_ORIGINS` 或 `CHROMA_OTEL_COLLECTION_ENDPOINT`）提供的设置，现在需要通过配置文件提供。例如：

```terminal
chroma run --config ./config.yaml
```

完整的配置文件示例请参见 [这里](https://github.com/chroma-core/chroma/blob/main/rust/frontend/sample_configs/single_node_full.yaml)。

**Chroma Docker 变更**

如果您通过 Docker 容器运行 Chroma，则需要注意：之前通过环境变量（如 `CHROMA_SERVER_CORS_ALLOW_ORIGINS` 或 `CHROMA_OTEL_COLLECTION_ENDPOINT`）提供的设置，现在需要通过配置文件提供。更多信息请参见 [Docker 文档](../production/containers/docker#configuration)。

容器内的默认数据位置从 `/chroma/chroma` 更改为 `/data`。例如，如果您之前启动容器的命令是：

```terminal
docker run -p 8000:8000 -v ./chroma:/chroma/chroma chroma-core/chroma
```

现在应更改为：

```terminal
docker run -p 8000:8000 -v ./chroma:/data chroma-core/chroma
```

---

### v0.6.0

之前，`list_collections` 返回的是 `Collection` 对象列表。这可能导致使用自定义嵌入函数（即非默认函数）创建集合时出现错误。因此，从现在开始，`list_collections` 只返回集合名称。

例如，如果您所有的集合都是通过 `OpenAIEmbeddingFunction` 创建的，则应按如下方式使用 `list_collections` 和 `get_collection`：

```python
collection_names = client.list_collections()
ef = OpenAIEmbeddingFunction(...)
collections = [
	client.get_collection(name=name, embedding_function=ef)
	for name in collection_names
]
```

未来我们计划支持嵌入函数的持久化，这样 `list_collections` 可以返回正确配置的 `Collection` 对象，您将无需再为 `get_collection` 提供嵌入函数。

此外，我们已不再支持 Python 3.8。

---

### v0.5.17

我们不再支持在元数据过滤、ID 过滤等场景中使用空列表或空字典。例如：

```python
collection.get(
	ids=["id1", "id2", "id3", ...],
	where={}
)
```

这种写法不再支持。请改用：

```python
collection.get(ids=["id1", "id2", "id3", ...])
```

---

### v0.5.12

`where` 子句中的 `$ne`（不等于）和 `$nin`（不在其中）操作符已更新：
* 之前：它们仅匹配具有指定键的记录。
* 现在：它们也匹配根本没有指定键的记录。

换句话说，`$ne` 和 `$nin` 现在分别匹配 `$eq`（等于）和 `$in`（包含）所匹配记录的补集。

`where_document` 子句中的 `$not_contains` 操作符也进行了更新：
* 之前：它仅匹配具有文档字段的记录。
* 现在：它也匹配根本没有文档字段的记录。

换句话说，`$not_contains` 现在匹配的是 `$contains` 所匹配记录的完全相反集合。

`RateLimitingProvider` 已被弃用，取而代之的是 `RateLimitEnforcer`。这个新接口允许您将服务器调用包裹在限流逻辑中。默认的 `SimpleRateLimitEnforcer` 实现允许所有请求，但您可以创建自定义实现以支持更高级的限流策略。

---

### v0.5.11

`collection.get()` 返回的结果现在按内部 ID 排序。而此前是按用户提供的 ID 排序，尽管该行为并未明确记录。我们希望进行这一更改，因为使用用户提供的 ID 在托管版 Chroma 中可能对性能不利，并且我们希望将这一行为同步到本地版本以保持一致性。通常，Chroma 中较新的文档具有更大的内部 ID。

随之而来的行为变化是 `limit` 和 `offset` 的使用方式。例如，如果您有一个名为 `coll` 的集合，其中包含按 `["3", "2", "1", "0"]` 顺序插入的文档，则之前 `coll.get(limit=2, offset=2)["ids"]` 返回的是 `["2", "3"]`，而现在将返回 `["1", "0"]`。

我们还修改了 `client.get_or_create` 的行为。之前，如果集合已存在且提供了 `metadata` 参数，则现有集合的元数据将被新值覆盖。现在这一行为已改变。如果集合已存在，`get_or_create` 将简单地返回具有指定名称的现有集合，所有额外参数（包括 `metadata`）都将被忽略。

最后，`collection.get()`、`collection.query()` 和 `collection.peek()` 返回的嵌入现在表示为二维 NumPy 数组，而不是 Python 列表。添加嵌入时仍可使用 Python 列表或 NumPy 数组。如果请求返回多个嵌入，则结果将是一个包含二维 NumPy 数组的 Python 列表。此更改是我们为通过使用 NumPy 数组优化本地 Chroma 性能所做努力的一部分。

---

### v0.5.6

Chroma 内部使用写前日志（write-ahead log）。在 v0.5.6 之前的所有版本中，该日志从未被修剪，这导致数据目录比实际需要的要大得多，并且在删除集合后目录大小也不会按预期减少。

在 v0.5.6 中，写前日志会自动修剪，但默认情况下不会对现有数据库启用。升级后，您应运行一次 `chroma utils vacuum` 以减小数据库大小并启用持续修剪。更多详情请参见 [CLI 参考文档](/reference/cli#vacuuming)。

此命令不需要定期运行，也不需要在 v0.5.6 或更高版本创建的新数据库上运行。

---

### v0.5.1

在 Python 客户端中，`max_batch_size` 属性已被移除。虽然此前并未文档化，但如果您之前使用过该属性，则应改用 `get_max_batch_size()`。

首次调用该方法时会发起 HTTP 请求。我们将其改为方法形式是为了更清晰地表明这是一个潜在的阻塞操作。

---

### 认证系统重构 - 2024年4月20日

**如果您未使用 Chroma 的 [内置认证系统](https://docs.trychroma.com/deployment/auth)，则无需采取任何操作。**

本次发布重构并简化了我们的认证和授权系统。
如果您正在使用 Chroma 的内置认证系统，则需要更新您的配置以及任何用于实现自定义认证或授权提供者的代码。
此次更改主要是为了减少 Chroma 的技术债务并简化未来更改，但它也简化了用户配置。
如果您未使用 Chroma 的内置认证系统，则无需采取任何操作。

此前，Chroma 的认证和授权依赖于多个对象和多个配置选项，包括：

- `chroma_server_auth_provider`
- `chroma_server_auth_configuration_provider`
- `chroma_server_auth_credentials_provider`
- `chroma_client_auth_credentials_provider`
- `chroma_client_auth_protocol_adapter`

等等。

我们已将其整合为三个类：

- `ClientAuthProvider`
- `ServerAuthenticationProvider`
- `ServerAuthorizationProvider`

`ClientAuthProvider` 现在负责自身的配置和凭证管理。可以通过 `chroma_client_auth_credentials` 设置提供凭证。`chroma_client_auth_credentials` 的值取决于 `ServerAuthenticationProvider`；对于 `TokenAuthenticationServerProvider`，其值应仅为 token；对于 `BasicAuthenticationServerProvider`，其值应为 `username:password`。

`ServerAuthenticationProvider` 负责将请求的授权信息转换为包含授权决策所需信息的 `UserIdentity`。它们现在也负责自身的配置和凭证管理。配置通过 `chroma_server_authn_credentials` 和 `chroma_server_authn_credentials_file` 设置完成。

`ServerAuthorizationProvider` 负责将请求信息和发出请求的 `UserIdentity` 转换为授权决策。配置通过 `chroma_server_authz_config` 和 `chroma_server_authz_config_file` 设置完成。

_注意：`_authn_credentials` 或 `authn_credentials_file` 只能设置其一，不能同时设置。`authz_config` 和 `authz_config_file` 同理。配置的值（或配置文件中的数据）取决于您的认证和授权提供者。更多信息请参见 [这里](https://github.com/chroma-core/chroma/tree/main/examples/basic_functionality/authz)。_

Chroma 自带的两种认证系统是 `Basic` 和 `Token`。我们分别为其提供了迁移指南。

#### Basic

如果您使用的是 `Token` 认证，您的服务器配置可能如下所示：

```yaml
CHROMA_SERVER_AUTH_CREDENTIALS="admin:admin"
CHROMA_SERVER_AUTH_CREDENTIALS_FILE="./example_file"
CHROMA_SERVER_AUTH_CREDENTIALS_PROVIDER="chromadb.auth.providers.HtpasswdConfigurationServerAuthCredentialsProvider"
CHROMA_SERVER_AUTH_PROVIDER="chromadb.auth.basic.BasicAuthServerProvider"
```

_注意：`AUTH_CREDENTIALS` 和 `AUTH_CREDENTIALS_FILE` 只能设置其一，但本指南展示了两者如何迁移。_

对应的客户端配置可能是：

```yaml
CHROMA_CLIENT_AUTH_PROVIDER="chromadb.auth.token.TokenAuthClientProvider"
CHROMA_CLIENT_AUTH_CREDENTIALS="admin:admin"
```

要迁移到新配置，只需将其更改为：

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

#### Token

如果您使用的是 `Token` 认证，您的服务器配置可能如下所示：

```yaml
CHROMA_SERVER_AUTH_CREDENTIALS="test-token"
CHROMA_SERVER_AUTH_CREDENTIALS_FILE="./example_file"
CHROMA_SERVER_AUTH_CREDENTIALS_PROVIDER="chromadb.auth.token.TokenConfigServerAuthCredentialsProvider"
CHROMA_SERVER_AUTH_PROVIDER="chromadb.auth.token.TokenAuthServerProvider"
CHROMA_SERVER_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

_注意：`AUTH_CREDENTIALS` 和 `AUTH_CREDENTIALS_FILE` 只能设置其一，但本指南展示了两者如何迁移。_

对应的客户端配置可能是：

```yaml
CHROMA_CLIENT_AUTH_PROVIDER="chromadb.auth.token.TokenAuthClientProvider"
CHROMA_CLIENT_AUTH_CREDENTIALS="test-token"
CHROMA_CLIENT_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

要迁移到新配置，只需将其更改为：

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

- 全局配置
    - `chroma_client_auth_token_transport_header`：重命名为 `chroma_auth_token_transport_header`。
    - `chroma_server_auth_token_transport_header`：重命名为 `chroma_auth_token_transport_header`。
- 客户端配置
    - `chroma_client_auth_credentials_provider`：已删除。功能已合并到 `chroma_client_auth_provider`。
    - `chroma_client_auth_protocol_adapter`：已删除。功能已合并到 `chroma_client_auth_provider`。
    - `chroma_client_auth_credentials_file`：已删除。功能已合并到 `chroma_client_auth_credentials`。
    - 这些更改也适用于 Typescript 客户端。
- 服务器认证
    - `chroma_server_auth_provider`：重命名为 `chroma_server_authn_provider`。
    - `chroma_server_auth_configuration_provider`：已删除。功能已合并到 `chroma_server_authn_provider`。
    - `chroma_server_auth_credentials_provider`：已删除。功能已合并到 `chroma_server_authn_provider`。
    - `chroma_server_auth_credentials_file`：重命名为 `chroma_server_authn_credentials_file`。
    - `chroma_server_auth_credentials`：重命名为 `chroma_server_authn_credentials`。
    - `chroma_server_auth_configuration_file`：重命名为 `chroma_server_authn_configuration_file`。
- 服务器授权
    - `chroma_server_authz_ignore_paths`：已删除。功能已合并到 `chroma_server_auth_ignore_paths`。

要查看完整更改，请参见 [PR](https://github.com/chroma-core/chroma/pull/1970/files) 或在 [Discord](https://discord.gg/MMeYNTmh3x) 上联系 Chroma 团队。

---

### 迁移到 0.4.16 - 2023年11月7日

本次发布增加了对多模态嵌入的支持，并相应地更改了 `EmbeddingFunction` 的定义。
此更改主要影响实现了自定义 `EmbeddingFunction` 类的用户。如果您使用的是 Chroma 的内置嵌入函数，则无需采取任何操作。

**EmbeddingFunction**

此前，`EmbeddingFunction` 定义如下：

```python
class EmbeddingFunction(Protocol):
    def __call__(self, texts: Documents) -> Embeddings:
        ...
```

更新后，`EmbeddingFunction` 定义如下：

```python
Embeddable = Union[Documents, Images]
D = TypeVar("D", bound=Embeddable, contravariant=True)

class EmbeddingFunction(Protocol[D]):
    def __call__(self, input: D) -> Embeddings:
        ...
```

关键区别在于：

- `EmbeddingFunction` 现在是泛型的，接受类型参数 `D`，其为 `Embeddable` 的子类型。这允许我们定义能够嵌入多种模态的 `EmbeddingFunction`。
- `__call__` 现在接受单个参数 `input`，以支持任意类型 `D` 的数据。`texts` 参数已被移除。

---

### 从 >0.4.0 迁移到 0.4.0 - 2023年7月17日

本版本有哪些新特性？

- 新的客户端创建方式
- 存储方式变更
- 移除了 `.persist()`，`.reset()` 默认关闭

**新客户端**

```python
### 内存临时客户端

# 旧写法
import chromadb
client = chromadb.Client()

# 新写法
import chromadb
client = chromadb.EphemeralClient()


### 持久化客户端

# 旧写法
import chromadb
from chromadb.config import Settings
client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="/path/to/persist/directory" # 可选，默认为当前目录下的 .chromadb/
))

# 新写法
import chromadb
client = chromadb.PersistentClient(path="/path/to/persist/directory")


### HTTP 客户端（用于与服务端通信）

# 旧写法
import chromadb
from chromadb.config import Settings
client = chromadb.Client(Settings(chroma_api_impl="rest",
                                        chroma_server_host="localhost",
                                        chroma_server_http_port="8000"
                                    ))

# 新写法
import chromadb
client = chromadb.HttpClient(host="localhost", port="8000")

```

您仍然可以访问底层的 `.Client()` 方法。如果您想关闭遥测功能，所有客户端都支持自定义设置：

```python
import chromadb
from chromadb.config import Settings
client = chromadb.PersistentClient(
    path="/path/to/persist/directory",
    settings=Settings(anonymized_telemetry=False))
```

**新的数据布局**

本版本的 Chroma 放弃了 `duckdb` 和 `clickhouse`，改用 `sqlite` 进行元数据存储。这意味着需要迁移数据。我们已创建了一个迁移 CLI 工具来完成此任务。

如果您升级到 `0.4.0` 并尝试访问旧方式存储的数据，将会看到如下错误信息：

> 您正在使用一个已弃用的 Chroma 配置。请运行 `pip install chroma-migrate` 并执行 `chroma-migrate` 来升级您的配置。更多信息请参见 https://docs.trychroma.com/deployment/migration 或加入我们的 Discord 频道 https://discord.gg/MMeYNTmh3x 获取帮助！

以下是安装和使用 CLI 的方法：

```terminal
pip install chroma-migrate
chroma-migrate
```

![](/chroma-migrate.png)

如果在迁移过程中遇到任何问题，请随时联系！我们随时在 [Discord](https://discord.com/channels/1073293645303795742/1129286514845691975) 上为您提供帮助。

**持久化与重置**

`.persist()` 在旧版 Chroma 中存在，因为写入只有在强制刷新时才会落盘。而在 Chroma `0.4.0` 中，所有写入都会立即保存到磁盘，因此不再需要 `.persist()`。

`.reset()`（用于重置整个数据库）此前默认启用，这被认为不合理。在 `0.4.0` 中，默认禁用。您可以通过向 Settings 对象传入 `allow_reset=True` 来重新启用它。例如：

```python
import chromadb
from chromadb.config import Settings
client = chromadb.PersistentClient(path="./path/to/chroma", settings=Settings(allow_reset=True))
```