# 迁移指南

模式（schema）和数据格式的变更，是软件演化过程中不可避免的挑战。我们非常重视这些变更，仅在必要时才会进行，并尽量减少变更的频率。

Chroma 的承诺是：每当发生模式或数据格式变更时，我们将提供一个无缝且易于使用的迁移工具，帮助用户顺利过渡到新的模式/格式。

具体来说，我们将在以下渠道公告模式变更：

- Discord ([#migrations 频道](https://discord.com/channels/1073293645303795742/1129286514845691975))
- Github ([公告地址](https://github.com/chroma-core/chroma/issues))
- 邮件列表 [订阅链接](https://airtable.com/shrHaErIs1j9F97BE)

我们会尽量提供以下内容：

- 变更描述及其背后的原因
- 可运行的 CLI 迁移工具
- 工具使用的视频演示

## 迁移日志

### v1.0.0

在本次发布中，我们用 Rust 重写了 Chroma 的大部分代码。整体性能得到了显著提升。

**重大变更**

Chroma 不再提供内置的身份验证实现。

`list_collections` 方法现在恢复为返回 `Collection` 对象。

**Chroma 内嵌模式变更**

如果你通过以下方式使用 Chroma：

```python
import chromadb

client = chromadb.Client()
# 或
client = chromadb.EphemeralClient()
# 或
client = chromadb.PersistentClient()
```

那么你将受到影响。新的 Rust 实现将忽略以下设置：

- `chroma_server_nofile`
- `chroma_server_thread_pool_size`
- `chroma_memory_limit_bytes`
- `chroma_segment_cache_policy`

**Chroma CLI 变更**

如果你通过 CLI 运行 Chroma 服务（`chroma run`），则此部分适用于你。

以前通过环境变量传递的配置参数，如 `CHROMA_SERVER_CORS_ALLOW_ORIGINS` 或 `CHROMA_OTEL_COLLECTION_ENDPOINT`，现在需要通过配置文件提供。例如：

```terminal
chroma run --config ./config.yaml
```

查看一个完整的示例配置文件，请点击[此处](https://github.com/chroma-core/chroma/blob/main/rust/frontend/sample_configs/single_node_full.yaml)。


**Docker 中的 Chroma 变更**

如果您使用 Docker 容器运行 Chroma，则以下信息适用于您。

以前通过环境变量提供给容器的设置（例如 `CHROMA_SERVER_CORS_ALLOW_ORIGINS` 或 `CHROMA_OTEL_COLLECTION_ENDPOINT`）现在需要通过配置文件提供。更多信息请参阅 [Docker 文档](../production/containers/docker#configuration)。

容器内的默认数据存储位置已从 `/chroma/chroma` 更改为 `/data`。例如，如果您之前使用以下命令启动容器：

```terminal
docker run -p 8000:8000 -v ./chroma:/chroma/chroma chroma-core/chroma
```

那么现在您应使用以下命令启动：

```terminal
docker run -p 8000:8000 -v ./chroma:/data chroma-core/chroma
```


### v0.6.0

以前，`list_collections` 返回的是一个 `Collection` 对象列表。如果您使用了自定义嵌入函数（即非默认嵌入函数）创建了某些集合，则可能会导致一些错误。因此，从现在起，`list_collections` 将只返回集合的名称。

例如，如果您使用 `OpenAIEmbeddingFunction` 创建了所有集合，则应如下正确使用 `list_collections` 和 `get_collection`：

```python
collection_names = client.list_collections()
ef = OpenAIEmbeddingFunction(...)
collections = [
	client.get_collection(name=name, embedding_function=ef)
	for name in collection_names
]
```

未来我们计划支持嵌入函数的持久化，这样 `list_collections` 就可以返回配置正确的 `Collection` 对象，您也无需再为 `get_collection` 提供嵌入函数。

此外，我们已不再支持 Python 3.8。

### v0.5.17

我们不再支持为元数据过滤、ID过滤等发送空列表或空字典。例如，以下写法将不再被支持：

```python
collection.get(
	ids=["id1", "id2", "id3", ...],
	where={}
)
```

请改用以下方式：

```python
collection.get(ids=["id1", "id2", "id3", ...])
```

### v0.5.12

`where` 子句中的 `$ne`（不等于）和 `$nin`（不在其中）操作符已更新：
* 之前：仅匹配包含指定键的记录。
* 现在：也匹配完全不包含指定键的记录。

换句话说，现在 `$ne` 和 `$nin` 将分别匹配 `$eq`（等于）和 `$in` 所匹配记录的补集（完全相反的集合）。

`where_document` 子句中的 `$not_contains` 操作符也进行了更新：
* 之前：仅匹配包含文档字段的记录。
* 现在：也匹配完全不包含文档字段的记录。

换句话说，现在 `$not_contains` 将匹配 `$contains` 所匹配记录的完全相反集合。

`RateLimitingProvider` 现已被弃用，取而代之的是 `RateLimitEnforcer`。新的接口允许你使用限流逻辑包装服务器调用。默认的 `SimpleRateLimitEnforcer` 实现允许所有请求通过，但你可以创建自定义实现以支持更高级的限流策略。

### v0.5.11

`collection.get()` 返回的结果现在是根据内部 ID 进行排序的。而在此之前，结果的排序依据是用户提供的 ID，尽管这种行为并未在文档中明确说明。我们希望进行这一更改，是因为在托管版 Chroma（Hosted Chroma）中使用用户提供的 ID 可能不利于性能表现，同时我们希望将这一行为变更同步到本地版 Chroma（Local Chroma）以保持行为的一致性。通常情况下，Chroma 中较新的文档具有较大的内部 ID。

随之而来的一个行为变化是与结果排序相关的 `limit` 和 `offset` 参数。例如，如果你有一个名为 `coll` 的集合，其中包含以 `["3", "2", "1", "0"]` 顺序插入的文档，之前调用 `coll.get(limit=2, offset=2)["ids"]` 会返回 `["2", "3"]`，而目前这将返回 `["1", "0"]`。

我们还修改了 `client.get_or_create` 的行为。此前，如果集合已经存在，并且提供了 `metadata` 参数，那么现有集合的元数据将被新值覆盖。这一行为现已改变。如果集合已存在，`get_or_create` 将仅返回具有指定名称的现有集合，所有额外的参数（包括 `metadata`）都将被忽略。

最后，`collection.get()`、`collection.query()` 和 `collection.peek()` 返回的嵌入向量现在以二维 NumPy 数组的形式表示，而不是 Python 列表。在添加嵌入向量时，你仍然可以使用 Python 列表或 NumPy 数组。如果请求返回多个嵌入向量，结果将是一个包含二维 NumPy 数组的 Python 列表。这一更改是我们提升本地 Chroma 性能的一部分努力，通过使用 NumPy 数组作为嵌入向量的内部表示形式来实现。

### v0.5.6

Chroma 内部使用了一个预写日志（write-ahead log）。在 v0.5.6 之前的所有版本中，该日志从未被清理，这导致数据目录的大小远大于实际所需，并且在删除集合后，目录大小也不会按预期减少。

在 v0.5.6 中，预写日志会自动被清理。但是，此功能默认不会为已有的数据库启用。升级后，你应该运行一次 `chroma utils vacuum` 来减小数据库体积并启用持续的日志清理。更多详情请参阅 [CLI 参考文档](/reference/cli#vacuuming)。

这个命令不需要定期运行，也不需要在 v0.5.6 或更高版本创建的新数据库上运行。

### v0.5.1

在 Python 客户端中，`max_batch_size` 属性已被移除。虽然该属性在此前并未被文档记录，但如果你曾使用过它，请改用 `get_max_batch_size()` 方法。

该方法首次调用时会发起一个 HTTP 请求。我们将其改为方法形式，以更清晰地表明它是一个可能阻塞的操作。

### 认证系统重构 - 2024年4月20日

**如果你没有使用 Chroma 的[内置认证系统](https://docs.trychroma.com/deployment/auth)，则无需采取任何操作。**

本次发布重构并简化了我们的认证和授权系统。  
如果你正在使用 Chroma 的内置认证系统，则需要更新你的配置以及你为实现自定义认证或授权提供者所编写的任何代码。  
此次变更主要是为了减少 Chroma 的技术债务并使未来的更改更加容易，但它也改变了用户配置的方式并使其更加简化。  
如果你没有使用 Chroma 的内置认证系统，则无需采取任何操作。

之前，Chroma 的认证和授权依赖于多个对象和多种配置选项，包括：

- `chroma_server_auth_provider`
- `chroma_server_auth_configuration_provider`
- `chroma_server_auth_credentials_provider`
- `chroma_client_auth_credentials_provider`
- `chroma_client_auth_protocol_adapter`

以及其他一些配置项。

我们已将这些整合为三个类：

- `ClientAuthProvider`
- `ServerAuthenticationProvider`
- `ServerAuthorizationProvider`

现在，`ClientAuthProvider` 负责自身的配置和凭证管理。可以通过 `chroma_client_auth_credentials` 设置向其提供凭证。`chroma_client_auth_credentials` 的值取决于 `ServerAuthenticationProvider`；对于 `TokenAuthenticationServerProvider`，它应该只是一个令牌；而对于 `BasicAuthenticationServerProvider`，它应该是 `username:password` 格式。

`ServerAuthenticationProvider` 负责将请求的授权信息转换为 `UserIdentity`，其中包含做出授权决策所需的任何信息。它们现在也负责自身的配置和凭证管理。可通过 `chroma_server_authn_credentials` 和 `chroma_server_authn_credentials_file` 设置进行配置。

`ServerAuthorizationProvider` 负责将有关请求的信息以及发起请求的 `UserIdentity` 转换为授权决策。可以通过 `chroma_server_authz_config` 和 `chroma_server_authz_config_file` 设置进行配置。

_注意：`_authn_credentials` 和 `authn_credentials_file` 只能设置其中一个，不能同时设置。同样地，`authz_config` 和 `authz_config_file` 也只能设置其中一个。配置的值（或配置文件中的数据）取决于你使用的认证（authn）和授权（authz）提供者。更多信息请参见[此处](https://github.com/chroma-core/chroma/tree/main/examples/basic_functionality/authz)。_

Chroma 自带的两种认证系统是 `Basic` 和 `Token`。我们为每种提供了简要的迁移指南。

#### Basic

如果你正在使用 `Token` 认证，你的服务器配置可能如下所示：

```yaml
CHROMA_SERVER_AUTH_CREDENTIALS="admin:admin"
CHROMA_SERVER_AUTH_CREDENTIALS_FILE="./example_file"
CHROMA_SERVER_AUTH_CREDENTIALS_PROVIDER="chromadb.auth.providers.HtpasswdConfigurationServerAuthCredentialsProvider"
CHROMA_SERVER_AUTH_PROVIDER="chromadb.auth.basic.BasicAuthServerProvider"
```

_注意：`AUTH_CREDENTIALS` 和 `AUTH_CREDENTIALS_FILE` 只能设置其中一个，但本指南将展示如何同时迁移两者。_

相应的客户端配置如下：

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

新的客户端配置如下：

```yaml
CHROMA_CLIENT_AUTH_CREDENTIALS="test-token"
CHROMA_CLIENT_AUTH_PROVIDER="chromadb.auth.basic_authn.BasicAuthClientProvider"
```

#### Token

如果你使用的是 `Token` 认证方式，你的服务端配置可能如下所示：

```yaml
CHROMA_SERVER_AUTH_CREDENTIALS="test-token"
CHROMA_SERVER_AUTH_CREDENTIALS_FILE="./example_file"
CHROMA_SERVER_AUTH_CREDENTIALS_PROVIDER="chromadb.auth.token.TokenConfigServerAuthCredentialsProvider"
CHROMA_SERVER_AUTH_PROVIDER="chromadb.auth.token.TokenAuthServerProvider"
CHROMA_SERVER_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

_注意：`AUTH_CREDENTIALS` 和 `AUTH_CREDENTIALS_FILE` 只能设置其中一个，但本指南会展示如何迁移两者。_

相应的客户端配置如下：

```yaml
CHROMA_CLIENT_AUTH_PROVIDER="chromadb.auth.token.TokenAuthClientProvider"
CHROMA_CLIENT_AUTH_CREDENTIALS="test-token"
CHROMA_CLIENT_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

要迁移到新的服务端配置，只需将其更改为：

```yaml
CHROMA_SERVER_AUTHN_PROVIDER="chromadb.auth.token_authn.TokenAuthenticationServerProvider"
CHROMA_SERVER_AUTHN_CREDENTIALS="test-token"
CHROMA_SERVER_AUTHN_CREDENTIALS_FILE="./example_file"
CHROMA_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

新的客户端配置如下：

```yaml
CHROMA_CLIENT_AUTH_CREDENTIALS="test-token"
CHROMA_CLIENT_AUTH_PROVIDER="chromadb.auth.token_authn.TokenAuthClientProvider"
CHROMA_AUTH_TOKEN_TRANSPORT_HEADER="AUTHORIZATION"
```

#### 已更改配置值的参考

- 整体配置
    - `chroma_client_auth_token_transport_header`：重命名为 `chroma_auth_token_transport_header`。
    - `chroma_server_auth_token_transport_header`：重命名为 `chroma_auth_token_transport_header`。
- 客户端配置
    - `chroma_client_auth_credentials_provider`：已删除。功能现在包含在 `chroma_client_auth_provider` 中。
    - `chroma_client_auth_protocol_adapter`：已删除。功能现在包含在 `chroma_client_auth_provider` 中。
    - `chroma_client_auth_credentials_file`：已删除。功能现在包含在 `chroma_client_auth_credentials` 中。
    - 这些更改也适用于 Typescript 客户端。
- 服务端认证 (authn)
    - `chroma_server_auth_provider`：重命名为 `chroma_server_authn_provider`。
    - `chroma_server_auth_configuration_provider`：已删除。功能现在包含在 `chroma_server_authn_provider` 中。
    - `chroma_server_auth_credentials_provider`：已删除。功能现在包含在 `chroma_server_authn_provider` 中。
    - `chroma_server_auth_credentials_file`：重命名为 `chroma_server_authn_credentials_file`。
    - `chroma_server_auth_credentials`：重命名为 `chroma_server_authn_credentials`。
    - `chroma_server_auth_configuration_file`：重命名为 `chroma_server_authn_configuration_file`。
- 服务端授权 (authz)
    - `chroma_server_authz_ignore_paths`：已删除。功能现在包含在 `chroma_server_auth_ignore_paths` 中。

要查看完整更改，请阅读 [PR](https://github.com/chroma-core/chroma/pull/1970/files) 或在 [Discord](https://discord.gg/MMeYNTmh3x) 上联系 Chroma 团队。

### 迁移至 0.4.16 - 2023年11月7日

本次发布新增了对多模态嵌入（multi-modal embeddings）的支持，并对 `EmbeddingFunction` 的定义进行了相应的更改。  
此更改主要影响实现了自定义 `EmbeddingFunction` 类的用户。如果你使用的是 Chroma 内置的嵌入函数，则无需采取任何操作。

**EmbeddingFunction**

此前，`EmbeddingFunction` 定义如下：

```python
class EmbeddingFunction(Protocol):
    def __call__(self, texts: Documents) -> Embeddings:
        ...
```

更新后，`EmbeddingFunction` 的定义变更为：

```python
Embeddable = Union[Documents, Images]
D = TypeVar("D", bound=Embeddable, contravariant=True)

class EmbeddingFunction(Protocol[D]):
    def __call__(self, input: D) -> Embeddings:
        ...
```

主要差异如下：

- `EmbeddingFunction` 现在是泛型的，并接受一个类型参数 `D`，该类型是 `Embeddable` 的子类型。这使得我们可以定义能够处理多种模态数据的 `EmbeddingFunction`。
- `__call__` 方法现在只接受一个名为 `input` 的参数，用于支持任意类型 `D` 的输入数据。原来的 `texts` 参数已被移除。

### 从 >0.4.0 到 0.4.0 的迁移 - 2023年7月17日

这个版本有什么新功能？

- 新的、更简单的客户端创建方式
- 存储方式变更
- 移除了 `.persist()`，`.reset()` 不再默认启用

**新的客户端**

```python
### 内存临时客户端

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


### HTTP 客户端（用于连接服务端后端）

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

此版本的 Chroma 放弃了使用 `duckdb` 和 `clickhouse`，改用 `sqlite` 进行元数据存储。这意味着需要将旧数据迁移过来。我们为此创建了一个迁移命令行工具（CLI utility）来完成这项任务。

如果你升级到 `0.4.0` 并尝试访问以旧方式存储的数据，你会看到如下错误信息：

> 你正在使用 Chroma 的旧版配置。请运行 `pip install chroma-migrate` 并执行 `chroma-migrate` 来升级你的配置。更多信息请查看 https://docs.trychroma.com/deployment/migration，或者加入我们的 Discord 频道寻求帮助：https://discord.gg/MMeYNTmh3x！

以下是安装和使用 CLI 的方法：

```terminal
pip install chroma-migrate
chroma-migrate
```

![](/chroma-migrate.png)

如果你在迁移过程中遇到任何问题，请随时联系我们！我们会在 [Discord](https://discord.com/channels/1073293645303795742/1129286514845691975) 上为你提供帮助。

**持久化（Persist）与重置（Reset）**

在旧版 Chroma 中存在 `.persist()` 方法，是因为那时的写入操作只有在被强制时才会刷新到磁盘。而在 Chroma `0.4.0` 中，所有的写入操作都会立即保存到磁盘，因此 `.persist()` 已不再需要。

过去 `.reset()` 方法（用于重置整个数据库）默认是启用的，但这在设计上显得不太合理。在 `0.4.0` 版本中，该方法默认被禁用。你可以通过向 `Settings` 对象传入 `allow_reset=True` 来重新启用它。例如：

```python
import chromadb
from chromadb.config import Settings
client = chromadb.PersistentClient(path="./path/to/chroma", settings=Settings(allow_reset=True))
```