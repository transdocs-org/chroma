# 配置文件管理

在 Chroma CLI 中，一个 **profile（配置文件）** 会持久化存储用于认证 Chroma Cloud 的凭证（API 密钥和租户 ID）。

每次使用 [`login`](./login) 命令时，CLI 都会为你登录的团队创建一个配置文件。所有配置文件都保存在你的主目录下的 `.chroma/credentials` 文件中。

CLI 还会在 `.chroma/config.json` 中记录你的“活动”配置文件。这是所有 CLI 命令与 Chroma Cloud 交互时所使用的配置文件。例如，如果你通过 `login` 命令登录了 Chroma Cloud 上的 "staging" 团队，并将其设为活动配置文件，那么当你执行 `chroma db create my-db` 命令时，你将在 "staging" 团队下看到创建的 `my-db` 数据库。

`profile` 命令允许你管理这些配置文件。

### 删除配置文件

删除指定的配置文件。如果你尝试删除当前活动的配置文件，CLI 会要求你确认。如果是这种情况，请务必使用 `profile use` 命令设置一个新的活动配置文件，否则所有后续的 Chroma Cloud CLI 命令将会失败。

```terminal
chroma profile delete [profile_name]
```

### 列出

列出所有可用的配置文件

```terminal
chroma profile list
```

### 显示

输出当前激活的配置文件名称

```terminal
chroma profile show
```

### 重命名

重命名一个配置文件

```terminal
chroma profile rename [旧名称] [新名称]
```

### 使用

将一个配置文件设置为当前激活的配置文件

```terminal
chroma profile use [配置文件名称]
```