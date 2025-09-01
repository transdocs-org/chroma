# 在 Chroma Cloud 上管理数据库

Chroma CLI 允许你通过当前的[配置文件](./profile)与 Chroma Cloud 数据库进行交互。

### 连接

`connect` 命令会输出一段用于在 Python 或 JS/TS 中连接你的 Chroma Cloud 数据库的代码片段。如果你没有提供 `name` 或 `language` 参数，CLI 会提示你选择偏好设置。`name` 参数默认是第一个参数，因此你无需使用 `--name` 标志。

输出的代码片段中已经包含了用于客户端初始化的 API 密钥。

```terminal
chroma db connect [db_name] [--language python/JS/TS]
```

`connect` 命令还可以将 Chroma 环境变量（`CHROMA_API_KEY`、`CHROMA_TENANT` 和 `CHROMA_DATABASE`）添加到当前工作目录下的 `.env` 文件中。如果 `.env` 文件不存在，CLI 会自动为你创建一个：

```terminal
chroma db connect [db_name] --env-file
```

如果你只是想将这些变量输出到终端，请使用：

```terminal
chroma db connect [db_name] --env-vars
```

设置这些环境变量后，你可以无需参数简洁地初始化 `CloudClient`。

### 创建

`create` 命令用于在 Chroma Cloud 上创建数据库。它接受一个 `name` 参数，即你要创建的数据库名称。如果没有提供该参数，CLI 会提示你输入名称。

如果已存在同名数据库，CLI 将报错。

```terminal
chroma db create my-new-db
```

### 删除

`delete` 命令用于删除 Chroma Cloud 上的数据库。请谨慎使用此命令，因为删除数据库的操作无法撤销。CLI 会要求你确认是否要删除指定名称的数据库。

```terminal
chroma db delete my-db
```

### 列出

`list` 命令列出当前配置文件下所有的数据库。

```terminal
chroma db list
```