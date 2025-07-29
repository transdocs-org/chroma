---
id: anthropic-mcp
name: Anthropic MCP
---

# Anthropic MCP 集成

## 什么是 MCP？

模型上下文协议（MCP）是一项开放协议，标准化了人工智能应用程序与数据源和工具之间的通信方式。可以将 MCP 想象成人工智能应用程序的 USB-C 接口——它为将 Claude 等 AI 模型连接到不同服务和数据源提供了一种通用方式。

MCP 遵循客户端-服务器架构：
- **MCP 主机**：如 Claude Desktop 这类想要通过 MCP 访问数据的应用程序
- **MCP 客户端**：与服务器保持连接的协议客户端
- **MCP 服务器**：轻量级程序，暴露特定功能（如 Chroma 的向量数据库）
- **数据源**：MCP 服务器可以安全访问的本地或远程数据

## 什么是 Chroma MCP 服务器？

Chroma MCP 服务器允许 Claude 通过此标准化协议直接与 Chroma 的向量数据库功能进行交互。这启用了以下强大功能：

- 跨对话的持久记忆
- 通过先前聊天记录的语义搜索
- 文档管理和检索
- 向量和关键词搜索功能
- 元数据管理和过滤

## 前提条件

在设置 Chroma MCP 服务器之前，请确保您已具备以下条件：

1. 已安装 Claude Desktop（Windows 或 macOS）
2. 已安装 Python 3.10+
3. 已安装 `uvx`（`curl -LsSf https://astral.sh/uv/install.sh | sh`）

## 设置指南

### 1. 配置 MCP 服务器

1. 打开 Claude Desktop
2. 点击 Claude 菜单并选择 "Settings..."
![mcp-settings](/mcp-settings.png)
3. 在左侧边栏点击 "Developer"
![mcp-developer](/mcp-developer.png)
4. 点击 "Edit Config" 打开配置文件

添加以下配置：

```json
{
  "mcpServers": {
    "chroma": {
      "command": "uvx",
      "args": [
        "chroma-mcp",
        "--client-type",
        "persistent",
        "--data-dir",
        "/path/to/your/data/directory"
      ]
    }
  }
}
```

将 `/path/to/your/data/directory` 替换为 Chroma 存储数据的目录，例如：
- macOS: `/Users/username/Documents/chroma-data`
- Windows: `C:\\Users\\username\\Documents\\chroma-data`

### 2. 重启并验证

1. 完全重启 Claude Desktop
2. 查找聊天输入框右下角的锤子 🔨 图标
![mcp-hammer](/mcp-hammer.png)
3. 点击它查看可用的 Chroma 工具
![mcp-tools](/mcp-tools.png)

如果看不到工具，请检查以下位置的日志：
- macOS: `~/Library/Logs/Claude/mcp*.log`
- Windows: `%APPDATA%\Claude\logs\mcp*.log`

## 客户端类型

Chroma MCP 服务器支持多种客户端类型以满足不同需求：

### 1. 临时客户端（默认）
默认情况下，服务器将使用临时客户端。
```json
{
  "mcpServers": {
    "chroma": {
      "command": "uvx",
      "args": [
        "chroma-mcp",
      ]
    }
  }
}
```
- 仅在内存中存储数据
- 服务器重启时数据会被清除
- 适用于临时会话或测试

### 2. 持久客户端
```json
{
  "mcpServers": {
    "chroma": {
      "command": "uvx",
      "args": [
        "chroma-mcp",
        "--client-type",
        "persistent",
        "--data-dir",
        "/path/to/your/data/directory"
      ]
    }
  }
}
```
- 在本地机器上持久存储数据
- 数据在重启后依然存在
- 最适合个人使用和长期记忆

### 3. 自托管客户端
```json
{
  "mcpServers": {
    "chroma": {
      "command": "uvx",
      "args": [
        "chroma-mcp",
        "--client-type",
        "http",
        "--host",
        "http://localhost:8000",
        "--port",
        "8000",
        "--custom-auth-credentials",
        "username:password",
        "--ssl",
        "true"
      ]
    }
  }
}
```
- 连接到您自己的 Chroma 服务器
- 完全控制数据和基础设施
- 适合团队环境

### 4. 云端客户端
```json
{
  "mcpServers": {
    "chroma": {
      "command": "uvx",
      "args": [
        "chroma-mcp",
        "--client-type",
        "cloud",
        "--tenant",
        "your-tenant-id",
        "--database",
        "your-database-name",
        "--api-key",
        "your-api-key"
      ]
    }
  }
}
```
- 连接到 Chroma Cloud 或其他托管实例
- 可扩展且受管理的基础设施
- 最适合生产部署

## 在 Claude 中使用 Chroma

### 团队知识库示例

假设您的团队维护着一份客户服务交互的知识库。通过将这些内容存储在 Chroma Cloud 中，团队成员可以使用 Claude 快速访问和学习以往的支持案例。

首先，设置您的共享知识库：

```python
import chromadb
from datetime import datetime

# 连接到 Chroma Cloud
client = chromadb.HttpClient(
    ssl=True,
    host='api.trychroma.com',
    tenant='your-tenant-id',
    database='support-kb',
    headers={
        'x-chroma-token': 'YOUR_API_KEY'
    }
)

# 创建支持案例的集合
collection = client.create_collection("support_cases")

# 添加一些示例支持案例
support_cases = [
    {
        "case": "客户报告连接其 IoT 设备到仪表板时遇到问题。",
        "resolution": "指导客户完成防火墙配置和端口转发设置。",
        "category": "connectivity",
        "date": "2024-03-15"
    },
    {
        "case": "用户在最近更新后无法访问管理员功能。",
        "resolution": "发现角色权限未正确迁移。应用修复并记录了流程。",
        "category": "permissions",
        "date": "2024-03-16"
    }
]

# 将文档添加到集合
collection.add(
    documents=[case["case"] + "\n" + case["resolution"] for case in support_cases],
    metadatas=[{
        "category": case["category"],
        "date": case["date"]
    } for case in support_cases],
    ids=[f"case_{i}" for i in range(len(support_cases))]
)
```

现在团队成员可以使用 Claude 访问这些知识。

在您的 claude 配置中添加以下内容：
```json
{
  "mcpServers": {
    "chroma": {
      "command": "uvx",
      "args": [
        "chroma-mcp",
        "--client-type",
        "cloud",
        "--tenant",
        "your-tenant-id",
        "--database",
        "support-kb",
        "--api-key",
        "YOUR_API_KEY"
      ]
    }
  }
}
```

现在您可以在聊天中使用知识库：
```
Claude，我正在帮助客户解决 IoT 设备连接问题时遇到了困难。
你能检查一下我们的支持知识库中是否有类似案例，并提出解决方案吗？
```

Claude 将：
1. 在共享知识库中搜索相关案例
2. 考虑类似过去问题的上下文和解决方案
3. 根据之前成功的解决方案提供建议

这种设置特别强大，因为：
- 所有支持团队成员都可以访问相同的知识库
- Claude 可以从整个团队的经验中学习
- 解决方案在整个组织中标准化
- 新团队成员可以快速掌握常见问题

### 项目记忆示例

Claude 的上下文窗口是有一定限制的——长时间的对话最终会被截断，并且会话之间不会保留聊天记录。使用 Chroma 作为外部记忆存储可以解决这些限制，使 Claude 能够引用过去的对话，并在多个会话之间保持上下文。

首先，在项目设置中告诉 Claude 使用 Chroma 作为记忆存储：
```
记住，你有访问 Chroma 工具的权限。
当用户提到之前的聊天或记忆时，请查询 Chroma 中的类似对话。
尽可能使用检索到的信息。
```

![mcp-instructions](/mcp-instructions.png)

该提示指示 Claude：
- 当涉及记忆相关话题时，主动查询 Chroma
- 搜索语义上相似的过往对话
- 将相关的历史上下文纳入回复中

要存储当前对话：
```
请将我们的对话拆分为小块并存储在 Chroma 中，以便将来参考。
```

Claude 将会：
1. 将对话拆分为较小的块（通常为 512-1024 个 token）
   - 拆分是必要的，因为：
   - 大段文本难以进行语义搜索
   - 更小的块有助于检索更精确的上下文
   - 可以避免未来检索时的 token 限制
2. 为每个块生成嵌入（embeddings）
3. 添加元数据，如时间戳和检测到的主题
4. 将所有内容存储在你的 Chroma 集合中

![mcp-store](/mcp-store.png)

之后，你可以自然地访问过去的对话：
```
我们之前讨论过关于认证系统的内容吗？
```

Claude 将会：
1. 在 Chroma 中搜索与认证相关的语义内容
2. 根据元数据中的时间戳筛选出上周的讨论
3. 将相关的历史上下文纳入回复中

![mcp-search](/mcp-search.png)

这种设置特别适用于：
- 上下文容易丢失的长期项目
- 多人团队与 Claude 交互的情况
- 引用过去决策的复杂讨论
- 跨多个会话保持一致上下文的场景

### 高级功能

Chroma MCP 服务器支持以下功能：

- **集合管理**：为不同项目创建和组织独立的集合
- **文档操作**：添加、更新或删除文档
- **搜索功能**：
  - 向量相似性搜索
  - 关键词搜索
  - 元数据过滤
- **批量处理**：高效处理多个操作

## 故障排查

如果遇到问题：

1. 检查配置文件语法是否正确
2. 确保所有路径为绝对路径且有效
3. 尝试在配置中使用 `uvx` 的完整路径，可通过 `which uvx` 命令获取路径
4. 查看 Claude 的日志（路径如上所述）

## 资源

- [Model Context Protocol 文档](https://modelcontextprotocol.io/introduction)
- [Chroma MCP 服务器文档](https://github.com/chroma-core/chroma-mcp)
- [Claude 桌面版指南](https://docs.anthropic.com/claude/docs/claude-desktop)