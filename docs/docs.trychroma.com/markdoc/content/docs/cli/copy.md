# 复制 Chroma 集合

使用 Chroma CLI，你可以将集合从本地 Chroma 服务器复制到 Chroma Cloud，反之亦然。

```terminal
chroma copy --from-local collections [collection names] 
```

### 参数

* `collections` - 要复制的集合名称的以空格分隔的列表。与 `all` 冲突。
* `all` - 指示 CLI 复制源数据库中的所有集合。
* `from-local` - 将复制源设置为本地 Chroma 服务器。默认情况下，CLI 会在 `localhost:8000` 处查找它。如果你有不同的设置，请使用 `path` 或 `host`。
* `from-cloud` - 将复制源设置为 Chroma Cloud 上的数据库。
* `to-local` - 将复制目标设置为本地 Chroma 服务器。默认情况下，CLI 会在 `localhost:8000` 处查找它。如果你有不同的设置，请使用 `path` 或 `host`。
* `to-cloud` - 将复制目标设置为 Chroma Cloud 上的数据库。
* `db` - 包含你要复制的集合的 Chroma Cloud 数据库的名称。如果没有提供，CLI 将提示你从当前[配置文件](./profile)可用的数据库中选择一个。
* `host` - 你的本地 Chroma 服务器的主机。此参数与 `path` 冲突。
* `path` - 你的本地 Chroma 数据的路径。如果提供，CLI 将使用数据路径在可用端口上启动一个本地 Chroma 服务器以供浏览。此参数与 `host` 冲突。

### 从本地复制到 Chroma Cloud

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="简单" %}
```terminal
chroma copy --from-local collections col-1 col-2 
```
{% /Tab %}

{% Tab label="带数据库" %}
```terminal
chroma copy --from-local --all --db my-db
```

{% /Tab %}

{% Tab label="主机" %}
```terminal
chroma copy --from-local --all --host http://localhost:8050 
```
{% /Tab %}

{% Tab label="路径" %}
```terminal
chroma copy --from-local --all --path ~/Developer/my-app/chroma 
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

### 从 Chroma Cloud 复制到本地

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="简单" %}
```terminal
chroma copy --from-cloud collections col-1 col-2 
```
{% /Tab %}

{% Tab label="带数据库" %}
```terminal
chroma copy --from-cloud --all --db my-db
```

{% /Tab %}

{% Tab label="主机" %}
```terminal
chroma copy --from-cloud --all --host http://localhost:8050 
```
{% /Tab %}

{% Tab label="路径" %}
```terminal
chroma copy --from-cloud --all --path ~/Developer/my-app/chroma 
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

### 配额

将本地集合复制到 Chroma Cloud 时，可能会遇到配额限制，例如如果记录上的元数据值大小过大。如果 CLI 通知你已超出配额，你可以在 Chroma Cloud 仪表板上申请增加配额。点击你当前配置文件所在团队的 "Settings"，然后选择 "Quotas" 标签页。