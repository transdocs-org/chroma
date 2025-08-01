# 在 Chroma Cloud 上进行数据库管理

Chroma CLI 可让你与 Chroma Cloud 数据库进行交互，适用于你的当前[用户配置](./profile)。

### 连接

`connect` 命令会为你的 Chroma Cloud 数据库生成 Python 或 JS/TS 的连接代码片段。如果你没有提供 `name` 或 `language` 参数，CLI 会提示你选择偏好设置。`name` 参数始终被认为是第一个参数，因此你无需添加 `--name` 标志。

输出的代码片段已经包含了用于客户端初始化的 profile 的 API 密钥。

```terminal
chroma db connect [db_name] [--language python/JS/TS]
```

`connect` 命令还可以将 Chroma 环境变量（`CHROMA_API_KEY`、`CHROMA_TENANT` 和 `CHROMA_DATABASE`）添加到当前工作目录下的 `.env` 文件中。如果文件不存在，CLI 会自动为你创建：

```terminal
chroma db connect [db_name] --env-file
```

如果你只是想将这些变量输出到终端，请使用：

```terminal
chroma db connect [db_name] --env-vars
```

设置这些环境变量后，你就可以无需参数地简洁地实例化 `CloudClient`。

### 创建

`create` 命令用于在 Chroma Cloud 上创建数据库。它接受 `name` 参数，即你要创建的数据库名称。如果不提供该参数，CLI 会提示你输入一个名称。

如果已存在同名数据库，CLI 将报错。

```terminal
chroma db create my-new-db
```

### 删除

`delete` 命令用于删除 Chroma Cloud 上的数据库。请谨慎使用此命令，因为删除数据库是不可逆操作。CLI 会要求你确认是否删除指定名称的数据库。

```terminal
chroma db delete my-db
```

### 列出

`list` 命令会列出当前用户配置下的所有数据库。

```terminal
chroma db list
```