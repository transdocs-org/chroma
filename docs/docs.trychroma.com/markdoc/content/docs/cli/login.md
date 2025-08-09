# 使用 Chroma Cloud 进行身份验证

Chroma CLI 可以让你在 Chroma Cloud 账户中执行各种操作。包括 [数据库管理](./db)、[集合复制](./copy) 和 [浏览](./browse)，以及许多未来将添加的功能。

使用 `login` 命令，可以将 CLI 与你的 Chroma Cloud 账户进行身份验证，从而启用上述功能。

首先，在浏览器中 [创建](https://trychroma.com/signup) 一个 Chroma Cloud 账户或 [登录](https:trychroma.com/login) 到你已有的账户。

然后，在终端中运行以下命令：

```terminal
chroma login
```

CLI 将会打开一个浏览器窗口以验证身份验证是否成功。如果成功，你将看到如下界面：

{% CenteredContent %}
![cli-login-success](/cli/cli-login-success.png)
{% /CenteredContent %}

回到 CLI 后，系统会提示你选择想要进行身份验证的团队。每个团队登录都会在 CLI 中生成一个独立的 [profile（配置文件）](./profile)。配置文件会持久化保存你登录团队的 API 密钥和租户 ID。你可以在用户主目录下的 `.chroma/credentials` 文件中找到所有配置文件。默认情况下，配置文件的名称与你登录的团队名称相同。不过，CLI 允许你在登录过程中修改该名称，或者之后使用 `chroma profile rename` 命令进行修改。

首次登录时，创建的第一个配置文件将自动被设置为你的“活动”配置文件。

在后续登录时，CLI 将会指导你如何切换到新增的配置文件（使用 `chroma profile use` 命令）。