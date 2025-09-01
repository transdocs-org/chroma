---
id: anthropic-mcp
name: Anthropic MCP
---

# Anthropic MCP 集成

## 什么是 MCP？

模型上下文协议（MCP）是一种开放协议，用于标准化 AI 应用程序与数据源和工具之间的通信。你可以将 MCP 想象成 AI 应用程序的 USB-C 接口——它提供了一种通用方式，将像 Claude 这样的 AI 模型连接到不同的服务和数据源。

MCP 遵循客户端-服务器架构：
- **MCP 主机**：像 Claude Desktop 这样希望通过 MCP 访问数据的应用程序
- **MCP 客户端**：维护与服务器连接的协议客户端
- **MCP 服务器**：暴露特定功能的轻量级程序（如 Chroma 的向量数据库）
- **数据源**：MCP 服务器可以安全访问的本地或远程数据

## 什么是 Chroma MCP 服务器？

Chroma MCP 服务器允许 Claude 通过这个标准化协议直接与 Chroma 的向量数据库功能进行交互。这实现了以下强大功能：

- 跨对话的持久记忆
- 通过以前的聊天进行语义搜索
- 文档管理和检索
- 向量和关键字搜索功能
- 元数据管理和过滤

## 先决条件

在设置 Chroma MCP 服务器之前，请确保你已具备以下条件：

1. 已安装 Claude Desktop（Windows 或 macOS）
2. 已安装 Python 3.10+
3. 已安装 `uvx`（`curl -LsSf https://astral.sh/uv/install.sh | sh`）

## 设置指南

### 1. 配置 MCP 服务器

1. 打开 Claude Desktop
2. 点击 Claude 菜单并选择 "Settings..."
![mcp-settings](/mcp-settings.png)
3. 在左侧边栏中点击 "Developer"
![mcp-developer](/mcp-developer.png)
4. 点击 "Edit Config" 以打开你的配置文件

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

将 `/path/to/your/data/directory` 替换为你希望 Chroma 存储其数据的位置，例如：
- macOS: `/Users/username/Documents/chroma-data`
- Windows: `C:\\Users\\username\\Documents\\chroma-data`

### 2. 重启并验证

1. 完全重启 Claude Desktop
2. 在聊天输入框的右下角寻找锤子 🔨 图标
![mcp-hammer](/mcp-hammer.png)
3. 点击它以查看可用的 Chroma 工具
![mcp-tools](/mcp-tools.png)

如果你没有看到工具，请检查以下位置的日志：
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
- 数据在重启后依然保留
- 适用于个人使用和长期记忆

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
- 连接到你自己的 Chroma 服务器
- 完全控制数据和基础设施
- 适用于团队环境

### 4. 云客户端
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
- 适用于生产部署

## 在 Claude 中使用 Chroma

### 团队知识库示例

假设你的团队维护了一个客户支持交互的知识库。通过将这些信息存储在 Chroma Cloud 中，团队成员可以使用 Claude 快速访问和学习过去的支持案例。

首先，设置你的共享知识库：

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

# 创建一个集合用于支持案例
collection = client.create_collection("support_cases")

# 添加一些示例支持案例
support_cases = [
    {
        "case": "客户报告在仪表板上连接 IoT 设备时出现问题。",
        "resolution": "指导客户完成防火墙配置和端口转发设置。",
        "category": "connectivity",
        "date": "2024-03-15"
    },
    {
        "case": "用户在最近更新后无法访问管理功能。",
        "resolution": "发现角色权限未正确迁移。应用修复并记录流程。",
        "category": "permissions",
        "date": "2024-03-16"
    }
]

# 将文档添加到集合中
collection.add(
    documents=[case["case"] + "\n" + case["resolution"] for case in support_cases],
    metadatas=[{
        "category": case["category"],
        "date": case["date"]
    } for case in support_cases],
    ids=[f"case_{i}" for i in range(len(support_cases))]
)
```

现在团队成员可以使用 Claude 访问此知识。

在你的 claude 配置中，添加以下内容：
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

现在你可以在聊天中使用知识库：
```
Claude，我正在帮助客户解决 IoT 设备连接问题时遇到了困难。
你能检查我们的支持知识库中的类似案例并提出解决方案吗？
```

Claude 将：
1. 在共享知识库中搜索相关案例
2. 考虑类似过去问题的背景和解决方案
3. 根据以往成功的解决方法提供建议

这种设置特别强大，因为：
- 所有支持团队成员都可以访问相同的知识库
- Claude 可以从整个团队的经验中学习
- 解决方案在整个组织中标准化
- 新团队成员可以快速了解常见问题

### 项目记忆示例

Claude 的上下文窗口有限——长对话最终会被截断，并且聊天在会话之间不会持久保存。使用 Chroma 作为外部记忆存储解决了这些限制，使 Claude 能够引用过去的对话并在多个会话中保持上下文。

首先，在项目设置时告诉 Claude 使用 Chroma 进行记忆：
```
请记住，你可以访问 Chroma 工具。
当用户提及之前的聊天或记忆时，请检查 Chroma 中的类似对话。
尽可能使用检索到的信息。
```

![mcp-instructions](/mcp-instructions.png)

此提示指示 Claude：
- 在涉及记忆相关话题时主动检查 Chroma
- 搜索语义上相似的过去对话
- 在回复中包含相关的上下文历史

要存储当前对话：
```
请将我们的对话分成小块，并将其存储在 Chroma 中以备将来参考。
```

Claude 将：
1. 将对话分成较小的块（通常为 512-1024 个 token）
   - 分块是必要的，因为：
   - 大文本更难进行语义搜索
   - 较小的块有助于检索更精确的上下文
   - 它可以防止在未来的检索中达到 token 限制
2. 为每个块生成嵌入
3. 添加时间戳和检测到的主题等元数据
4. 将所有内容存储在你的 Chroma 集合中

![mcp-store](/mcp-store.png)

稍后，你可以自然地访问过去的对话：
```
我们之前关于认证系统的讨论是什么？
```

Claude 将：
1. 搜索与认证相关的语义上相似的块
2. 根据上周讨论的时间戳元数据进行过滤
3. 将相关的上下文历史包含在其回复中

![mcp-search](/mcp-search.png)

此设置对于以下情况特别有用：
- 长期项目中上下文丢失
- 多人与 Claude 交互的团队
- 引用过去决策的复杂讨论
- 跨多个聊天会话保持一致的上下文

### 高级功能

Chroma MCP 服务器支持：

- **集合管理**：为不同项目创建和组织单独的集合
- **文档操作**：添加、更新或删除文档
- **搜索功能**：
  - 向量相似性搜索
  - 基于关键字的搜索
  - 元数据过滤
- **批量处理**：高效处理多个操作

## 故障排除

如果你遇到问题：

1. 验证你的配置文件语法
2. 确保所有路径都是绝对且有效的
3. 尝试使用 `which uvx` 获取 `uvx` 的完整路径并在配置中使用该路径
4. 检查 Claude 日志（上面列出的路径）

## 资源

- [模型上下文协议文档](https://modelcontextprotocol.io/introduction)
- [Chroma MCP 服务器文档](https://github.com/chroma-core/chroma-mcp)
- [Claude Desktop 指南](https://docs.anthropic.com/claude/docs/claude-desktop)