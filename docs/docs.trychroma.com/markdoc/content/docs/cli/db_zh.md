# 在 Chroma Cloud 上管理数据库

Chroma CLI 允许你通过当前的 [profile](./profile) 与你的 Chroma Cloud 数据库进行交互。

### 连接

`connect` 命令将输出用于在 Python 或 JS/TS 中连接 Chroma Cloud 数据库的代码片段。如果你未提供 `name` 或 `language` 参数，CLI 将提示你选择偏好设置。`name` 参数始终假定为第一个参数，因此你无需包含 `--name` 标志。

输出的代码片段将已经包含你的 profile 的 API 密钥，并用于客户端初始化。

```terminal
chroma db connect [db_name] [--language python/JS/TS]
```

`connect` 命令还可以将 Chroma 环境变量（`CHROMA_API_KEY`、`CHROMA_TENANT` 和 `CHROMA_DATABASE`）添加到你当前工作目录下的 `.env` 文件中。如果该文件不存在，CLI 会自动为你创建：

```terminal
chroma db connect [db_name] --env-file
```

如果你只是想将这些变量输出到终端，请使用以下命令：

```terminal
chroma db connect [db_name] --env-vars
```

设置这些环境变量后，你可以无需参数简洁地实例化 `CloudClient`。

### 创建

`create` 命令允许你在 Chroma Cloud 上创建一个数据库。它包含一个 `name` 参数，用于指定你要创建的数据库名称。如果你未提供该参数，CLI 会提示你选择一个名称。

如果已存在同名的数据库，CLI 将报错。

```terminal
chroma db create my-new-db
```

### 删除

`delete` 命令用于删除一个 Chroma Cloud 数据库。请谨慎使用此命令，因为删除数据库的操作无法撤销。CLI 会要求你确认是否删除你提供的名称对应的数据库。

```terminal
chroma db delete my-db
```

### 列出

`list` 命令用于列出当前配置文件下所有的数据库。

```terminal
chroma db list
```