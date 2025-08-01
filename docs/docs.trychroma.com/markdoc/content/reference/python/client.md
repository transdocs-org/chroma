# Python 客户端

## configure

```python
def configure(**kwargs) -> None
```

覆盖 Chroma 的默认设置、环境变量或 .env 文件。

## EphemeralClient

```python
def EphemeralClient(settings: Optional[Settings] = None,
                    tenant: str = DEFAULT_TENANT,
                    database: str = DEFAULT_DATABASE) -> ClientAPI
```

创建一个内存中的 Chroma 实例。这适用于测试和开发，但不建议用于生产环境。

**参数**:

- `tenant` - 为此客户端使用的租户。默认为默认租户。
- `database` - 为此客户端使用的数据库。默认为默认数据库。

## PersistentClient

```python
def PersistentClient(path: str = "./chroma",
                     settings: Optional[Settings] = None,
                     tenant: str = DEFAULT_TENANT,
                     database: str = DEFAULT_DATABASE) -> ClientAPI
```

创建一个持久化的 Chroma 实例，该实例会将数据保存到磁盘。这适用于测试和开发，但不建议用于生产环境。

**参数**:

- `path` - 保存 Chroma 数据的目录。默认为 "./chroma"。
- `tenant` - 为此客户端使用的租户。默认为默认租户。
- `database` - 为此客户端使用的数据库。默认为默认数据库。

## HttpClient

```python
def HttpClient(host: str = "localhost",
               port: int = 8000,
               ssl: bool = False,
               headers: Optional[Dict[str, str]] = None,
               settings: Optional[Settings] = None,
               tenant: str = DEFAULT_TENANT,
               database: str = DEFAULT_DATABASE) -> ClientAPI
```

创建一个连接到远程 Chroma 服务器的客户端。这支持多个客户端连接到同一台服务器，是生产环境中推荐使用的 Chroma 使用方式。

**参数**:

- `host` - Chroma 服务器的主机名。默认为 "localhost"。
- `port` - Chroma 服务器的端口。默认为 8000。
- `ssl` - 是否使用 SSL 连接到 Chroma 服务器。默认为 False。
- `headers` - 发送到 Chroma 服务器的请求头字典。默认为空字典 {}。
- `settings` - 与 Chroma 服务器通信的设置字典。
- `tenant` - 为此客户端使用的租户。默认为默认租户。
- `database` - 为此客户端使用的数据库。默认为默认数据库。

## AsyncHttpClient

```python
async def AsyncHttpClient(host: str = "localhost",
                          port: int = 8000,
                          ssl: bool = False,
                          headers: Optional[Dict[str, str]] = None,
                          settings: Optional[Settings] = None,
                          tenant: str = DEFAULT_TENANT,
                          database: str = DEFAULT_DATABASE) -> AsyncClientAPI
```

创建一个异步客户端，连接到远程 Chroma 服务器。这支持多个客户端连接到同一台服务器，是生产环境中推荐使用的 Chroma 使用方式。

**参数**:

- `host` - Chroma 服务器的主机名。默认为 "localhost"。
- `port` - Chroma 服务器的端口。默认为 8000。
- `ssl` - 是否使用 SSL 连接到 Chroma 服务器。默认为 False。
- `headers` - 发送到 Chroma 服务器的请求头字典。默认为空字典 {}。
- `settings` - 与 Chroma 服务器通信的设置字典。
- `tenant` - 为此客户端使用的租户。默认为默认租户。
- `database` - 为此客户端使用的数据库。默认为默认数据库。

## CloudClient

```python
def CloudClient(tenant: str,
                database: str,
                api_key: Optional[str] = None,
                settings: Optional[Settings] = None,
                *,
                cloud_host: str = "api.trychroma.com",
                cloud_port: int = 8000,
                enable_ssl: bool = True) -> ClientAPI
```

创建一个客户端以连接到 Chroma 云端的租户和数据库。

**参数**:

- `tenant` - 为此客户端使用的租户。
- `database` - 为此客户端使用的数据库。
- `api_key` - 为此客户端使用的 API 密钥。

## Client

```python
def Client(settings: Settings = __settings,
           tenant: str = DEFAULT_TENANT,
           database: str = DEFAULT_DATABASE) -> ClientAPI
```

返回一个正在运行的 `chroma.API` 实例。

**参数**:

- `tenant` - 为此客户端使用的租户。默认为 `default` 租户。
- `database` - 为此客户端使用的数据库。默认为 `default` 数据库。

## AdminClient

```python
def AdminClient(settings: Settings = Settings()) -> AdminAPI
```

创建一个管理员客户端，可用于创建租户和数据库。

***

# BaseClient 方法

```python
class BaseAPI(ABC)
```

## heartbeat

```python
def heartbeat() -> int
```

获取自纪元以来当前时间的纳秒数。
用于检查服务器是否处于运行状态。

**返回**:

- `int` - 自纪元以来当前时间的纳秒数

## count_collections

```python
def count_collections() -> int
```

统计集合的数量。

**返回**:

- `int` - 集合的数量。


**示例**:

```python
client.count_collections()
# 1
```

## delete_collection

```python
def delete_collection(name: str) -> None
```

删除具有指定名称的集合。

**参数**:

- `name` - 要删除的集合的名称。


**抛出异常**:

- `chromadb.errors.NotFoundError` - 如果集合不存在。


**示例**:

```python
client.delete_collection("my_collection")
```

## reset

```python
def reset() -> bool
```

重置数据库。这将删除所有集合和条目。

**返回**:

- `bool` - 如果数据库重置成功则返回 `True`。

## get_version

```python
def get_version() -> str
```

获取 Chroma 的版本。

**返回**:

- `str` - Chroma 的版本。

## get_settings

```python
def get_settings() -> Settings
```

获取用于初始化的设置。

**返回**:

- `Settings` - 用于初始化的设置。

## get_max_batch_size

```python
def get_max_batch_size() -> int
```

返回在单次调用中可以创建或修改的最大记录数。

***

# ClientClient 方法

```python
class ClientAPI(BaseAPI, ABC)
```

## list_collections

```python
def list_collections(limit: Optional[int] = None,
                     offset: Optional[int] = None) -> Sequence[Collection]
```

列出所有集合。

**参数**:

- `limit` - 要返回的最大条目数。默认为 None。
- `offset` - 在返回条目之前要跳过的条目数。默认为 None。


**返回**:

- `Sequence[Collection]` - 集合对象的列表。


**示例**:

```python
client.list_collections()
# ['my_collection']
```

## create_collection

```python
def create_collection(name: str,
                      configuration: Optional[CollectionConfiguration] = None,
                      metadata: Optional[CollectionMetadata] = None,
                      embedding_function: Optional[EmbeddingFunction[
                          Embeddable]] = ef.DefaultEmbeddingFunction(),
                      data_loader: Optional[DataLoader[Loadable]] = None,
                      get_or_create: bool = False) -> Collection
```

使用指定的名称和元数据创建一个新集合。

**参数**:

- `name` - 要创建的集合的名称。
- `metadata` - 可选的元数据，用于与集合关联。
- `embedding_function` - 可选的用于嵌入文档的函数。如果未提供，则使用默认的嵌入函数。
- `get_or_create` - 如果为 True，则在集合已存在时返回现有集合。
- `data_loader` - 可选的用于加载记录（文档、图片等）的函数。


**返回**:

- `Collection` - 新创建的集合。


**抛出异常**:

- `ValueError` - 如果集合已存在且 `get_or_create` 为 False。
- `ValueError` - 如果集合名称无效。


**示例**:

```python
client.create_collection("my_collection")
# collection(name="my_collection", metadata={})

client.create_collection("my_collection", metadata={"foo": "bar"})
# collection(name="my_collection", metadata={"foo": "bar"})
```

## get_collection

```python
def get_collection(
        name: str,
        id: Optional[UUID] = None,
        embedding_function: Optional[
            EmbeddingFunction[Embeddable]] = ef.DefaultEmbeddingFunction(),
        data_loader: Optional[DataLoader[Loadable]] = None) -> Collection
```

获取具有指定名称的集合。

**参数**:

- `id` - 要获取的集合的 UUID。如果提供了 `id` 和 `name`，则同时使用它们进行查找。
- `name` - 要获取的集合的名称。
- `embedding_function` - 可选的用于嵌入文档的函数。如果未提供，则使用默认的嵌入函数。
- `data_loader` - 可选的用于加载记录（文档、图片等）的函数。


**返回**:

- `Collection` - 所获取的集合。


**抛出异常**:

- `chromadb.errors.NotFoundError` - 如果集合不存在。


**示例**:

```python
client.get_collection("my_collection")
# collection(name="my_collection", metadata={})
```

## get_or_create_collection

```python
def get_or_create_collection(
        name: str,
        configuration: Optional[CollectionConfiguration] = None,
        metadata: Optional[CollectionMetadata] = None,
        embedding_function: Optional[
            EmbeddingFunction[Embeddable]] = ef.DefaultEmbeddingFunction(),
        data_loader: Optional[DataLoader[Loadable]] = None) -> Collection
```

获取或创建具有指定名称和元数据的集合。

**参数**:

- `name` - 要获取或创建的集合的名称。
- `metadata` - 可选的元数据，用于与集合关联。如果集合已存在，该元数据将被忽略。如果集合不存在，则使用提供的元数据创建新集合。
- `embedding_function` - 可选的用于嵌入文档的函数。
- `data_loader` - 可选的用于加载记录（文档、图片等）的函数。


**返回**:

- `Collection` - 获取或创建的集合。


**示例**:

```python
client.get_or_create_collection("my_collection")
# collection(name="my_collection", metadata={})
```

## set_tenant

```python
def set_tenant(tenant: str, database: str = DEFAULT_DATABASE) -> None
```

为客户端设置租户和数据库。如果租户或数据库不存在，则会引发错误。

**参数**:

- `tenant` - 要设置的租户。
- `database` - 要设置的数据库。

## set_database

```python
def set_database(database: str) -> None
```

为客户端设置数据库。如果数据库不存在，则会引发错误。

**参数**:

- `database` - 要设置的数据库。

## clear_system_cache

```python
@staticmethod
def clear_system_cache() -> None
```

清除系统缓存，以便可以为现有路径创建新系统。这仅应用于测试目的。

***

# AdminClient 方法

```python
class AdminAPI(ABC)
```

## create_database

```python
def create_database(name: str, tenant: str = DEFAULT_TENANT) -> None
```

创建一个新数据库。如果数据库已存在，则会引发错误。

**参数**:

- `name` - 要创建的数据库的名称。

## get_database

```python
def get_database(name: str, tenant: str = DEFAULT_TENANT) -> Database
```

获取一个数据库。如果数据库不存在，则会引发错误。

**参数**:

- `name` - 要获取的数据库的名称。
- `tenant` - 要获取的数据库的租户。

## delete_database

```python
def delete_database(name: str, tenant: str = DEFAULT_TENANT) -> None
```

删除数据库及其所有关联的集合。如果数据库不存在，则会引发错误。

**参数**:

- `name` - 要删除的数据库的名称。
- `tenant` - 要删除的数据库的租户。

## list_databases

```python
def list_databases(limit: Optional[int] = None, offset: Optional[int] = None, tenant: str = DEFAULT_TENANT) -> Sequence[Database]
```

列出某个租户的数据库。

**参数**:

- `limit` - 要返回的最大条目数。默认为 None。
- `offset` - 在返回条目之前要跳过的条目数。默认为 None。
- `tenant` - 要列出数据库的租户。

## create_tenant

```python
def create_tenant(name: str) -> None
```

创建一个新租户。如果租户已存在，则会引发错误。

**参数**:

- `name` - 要创建的租户的名称。

## get_tenant

```python
def get_tenant(name: str) -> Tenant
```

获取一个租户。如果租户不存在，则会引发错误。

**参数**:

- `name` - 要获取的租户的名称。

***

# ServerClient 方法

```python
class ServerAPI(BaseAPI, AdminAPI, Component)
```

一个 API 实例，通过传入租户和数据库来扩展相关的基础 API 方法。这是 Chroma 系统的根组件。