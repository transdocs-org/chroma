# 浏览集合

你可以使用 Chroma CLI 在终端内通过 UI 来查看你的集合。CLI 支持从 Chroma Cloud 或本地 Chroma 服务器浏览集合。

```terminal
chroma browse [collection_name] [--local]
```

### 参数

* `collection_name` - 你要浏览的集合的名称。这是必填参数。
* `db_name` - 包含你要浏览的集合的 Chroma Cloud 数据库名称。如果未提供，CLI 会提示你从当前 [profile](./profile) 的可用数据库中选择一个。对于本地 Chroma，CLI 使用 `default_database`。
* `local` - 指示 CLI 在 `http://localhost:8000` 上的本地 Chroma 服务器中查找你的集合。如果你的本地 Chroma 服务器位于其他主机名，请改用 `host` 参数。
* `host` - 你的本地 Chroma 服务器的主机地址。此参数与 `path` 参数冲突。
* `path` - 你的本地 Chroma 数据的路径。如果提供此参数，CLI 将使用该数据路径在可用端口上启动一个本地 Chroma 服务器以供浏览。此参数与 `host` 参数冲突。
* `theme` - 你的终端主题（`light` 或 `dark`）。优化 UI 颜色以适配你的终端主题。你只需提供一次此参数，CLI 会将其持久化保存在 `~/.chroma/config.json` 中。

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="cloud" %}
```terminal
chroma browse my-collection 
```
{% /Tab %}

{% Tab label="cloud with DB" %}
```terminal
chroma browse my-collection --db my-db
```
{% /Tab %}

{% Tab label="local default" %}
```terminal
chroma browse my-local-collection --local 
```
{% /Tab %}

{% Tab label="local with host" %}
```terminal
chroma browse my-local-collection --host http://localhost:8050 
```
{% /Tab %}

{% Tab label="local with path" %}
```terminal
chroma browse my-local-collection --path ~/Developer/my-app/chroma 
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

### 集合浏览器 UI

#### 主视图

集合浏览器的主视图以表格形式显示你的数据，包括记录 ID、文档和元数据。你可以使用方向键在表格中导航，并通过 `Return` 键展开每个单元格。默认仅加载前 100 条记录，当你向下滚动表格时会继续加载下一批数据。

{% CenteredContent %}
![cli-browse](/cli/cli-browse.png)
{% /CenteredContent %}

#### 搜索

你可以通过在主视图中按下 `s` 进入查询编辑器。此表单允许你对集合提交 `.get()` 查询。你可以通过按下 `e` 进入编辑模式，使用 `space` 键切换元数据操作符，按下 `Esc` 键退出编辑模式。要提交查询，请按下 `Return` 键。

提交后，查询编辑器会保留你的修改。你可以通过按下 `c` 键来清除编辑内容。在查看结果时，你可以按下 `s` 键返回查询编辑器，或按下 `Esc` 键返回主视图。

{% CenteredContent %}
![cli-browse](/cli/cli-browse-query.png)
{% /CenteredContent %}