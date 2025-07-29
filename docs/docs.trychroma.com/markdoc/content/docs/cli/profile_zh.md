# 配置管理

在 Chroma CLI 中，一个 **profile（配置）** 用于持久化存储用于认证 Chroma Cloud 的凭据（API 密钥和租户 ID）。

每次使用 [`login`](./login) 命令时，CLI 都会为你登录的团队创建一个配置。所有配置都保存在你的主目录下的 `.chroma/credentials` 文件中。

CLI 还会在 `.chroma/config.json` 中记录你的“活动”配置。这是所有 CLI 命令与 Chroma Cloud 交互时使用的配置。例如，如果你通过 [登录](./login) 进入了 Chroma Cloud 上的 "staging" 团队，并将其设置为活动配置。之后当你使用 `chroma db create my-db` 命令时，你会在 "staging" 团队下看到 `my-db` 被创建。

`profile` 命令允许你管理你的配置文件。

### 删除

删除一个配置。如果你尝试删除当前活动的配置，CLI 会提示你确认。如果是这种情况，请务必使用 `profile use` 命令设置一个新的活动配置，否则所有后续的 Chroma Cloud CLI 命令将会失败。

```terminal
chroma profile delete [profile_name]
```

### 列出

列出你所有的配置

```terminal
chroma profile list
```

### 显示

输出当前活动配置的名称

```terminal
chroma profile show
```

### 重命名

重命名一个配置

```terminal
chroma profile rename [old_name] [new_name]
```

### 设置活动配置

将一个新的配置设置为活动配置

```terminal
chroma profile use [profile_name]
```