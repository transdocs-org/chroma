---
id: anthropic-mcp
name: Anthropic MCP
---

# Anthropic MCP 集成

## 什么是 MCP？

模型上下文协议（MCP）是一种开放协议，用于标准化 AI 应用程序与数据源和工具之间的通信方式。可以把 MCP 想象成 AI 应用程序的 USB-C 接口——它为将 Claude 这样的 AI 模型连接到不同服务和数据源提供了通用方式。

MCP 采用客户端-服务器架构：
- **MCP 主机**：如 Claude Desktop 等希望通过 MCP 访问数据的应用程序
- **MCP 客户端**：与服务器保持连接的协议客户端
- **MCP 服务器**：轻量级程序，用于暴露特定功能（例如 Chroma 的向量数据库）
- **数据源**：本地或远程数据，MCP 服务器可以安全访问这些数据

## 什么是 Chroma MCP 服务器？

Chroma MCP 服务器允许 Claude 通过此标准化协议直接与 Chroma 的向量数据库功能进行交互。这实现了以下强大功能：

- 跨对话的持久化记忆
- 通过历史聊天进行语义搜索
- 文档管理和检索
- 向量和关键词搜索功能
- 元数据管理和过滤

## 前提条件

在设置 Chroma MCP 服务器之前，请确保你已具备以下条件：

1. 已安装 Claude Desktop（适用于 Windows 或 macOS）
2. 已安装 Python 3.10 或更高版本
3. 已安装 `uvx`（安装命令：`curl -LsSf https://astral.sh/uv/install.sh | sh`）

## 设置指南

### 1. 配置 MCP 服务器

1. 打开 Claude Desktop
2. 点击 Claude 菜单，选择 "Settings..."
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

将 `/path/to/your/data/directory` 替换为你希望 Chroma 存储数据的位置，例如：
- macOS: `/Users/username/Documents/chroma-data`
- Windows: `C:\\Users\\username\\Documents\\chroma-data`

### 2. 重启并验证

1. 完全重启 Claude Desktop
2. 在聊天输入框的右下角寻找锤子 🔨 图标
![mcp-hammer](/mcp-hammer.png)
3. 点击该图标以查看可用的 Chroma 工具
![mcp-tools](/mcp-tools.png)

如果你未看到这些工具，请检查以下位置的日志文件：
- macOS: `~/Library/Logs/Claude/mcp*.log`
- Windows: `%APPDATA%\Claude\logs\mcp*.log`

## 客户端类型

Chroma MCP 服务器支持多种客户端类型以满足不同的需求：

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
- 仅将数据存储在内存中  
- 服务器重启时数据会被清除  
- 适用于临时会话或测试  

### 2. 持久化客户端
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
- 将数据持久化存储在本地机器上  
- 数据在重启之间保留  
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
- 连接到你自己的 Chroma 服务器  
- 对数据和基础设施拥有完全控制权  
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
- 可扩展且受管理的基础架构  
- 最适合生产环境部署  

## 将 Chroma 与 Claude 配合使用  

### 团队知识库示例  

假设您的团队维护着一个客户支持互动的知识库。通过将这些数据存储在 Chroma Cloud 中，团队成员可以利用 Claude 快速访问和学习过往的支持案例。

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

# 创建一个用于支持案例的集合
collection = client.create_collection("support_cases")

# 添加一些示例支持案例
support_cases = [
    {
        "case": "客户报告其 IoT 设备无法连接到仪表板。",
        "resolution": "指导客户完成防火墙配置和端口转发设置。",
        "category": "连接性",
        "date": "2024-03-15"
    },
    {
        "case": "用户在最近的更新后无法访问管理员功能。",
        "resolution": "发现角色权限未正确迁移。应用修复程序并记录流程。",
        "category": "权限",
        "date": "2024-03-16"
    }
]
```

# 向集合中添加文档
```python
collection.add(
    documents=[case["case"] + "\n" + case["resolution"] for case in support_cases],
    metadatas=[{
        "category": case["category"],
        "date": case["date"]
    } for case in support_cases],
    ids=[f"case_{i}" for i in range(len(support_cases))]
)
```

现在团队成员可以在使用 Claude 时访问这些知识。

在你的 claude 配置中添加以下内容：
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
Claude，我正在帮助一个客户解决 IoT 设备的连接问题。
你可以检查一下我们的支持知识库中是否有类似案例，并提出解决方案建议吗？
```

Claude 将会：
1. 在共享的知识库中搜索相关的案例
2. 结合类似过往问题的上下文和解决方案
3. 基于以往成功的解决经验提供建议

这种设置非常强大，因为它可以：
- 让所有支持团队成员访问同一个知识库
- 让 Claude 从整个团队的经验中学习
- 在整个组织范围内标准化解决方案
- 新团队成员可以快速掌握常见问题的处理方法

### 项目记忆示例

Claude 的上下文窗口是有一定限制的——长时间的对话最终会被截断，且会话之间聊天记录也不会持久保留。使用 Chroma 作为外部记忆存储可以解决这些限制，使 Claude 能够引用过去的对话，并在多个会话中保持上下文。

首先，在项目设置中告诉 Claude 使用 Chroma 作为记忆存储：
```
记住，你有访问 Chroma 工具的权限。
当用户提及过去的聊天记录或记忆时，请查询 Chroma 中的相似对话。
尽可能使用检索到的信息。
```

![mcp-instructions](/mcp-instructions.png)

此提示指示 Claude：
- 在涉及记忆相关话题时主动查询 Chroma
- 搜索语义上相似的过往对话
- 将相关的历史上下文纳入回复中

要存储当前对话：
```
请将我们的对话切分为小块，并存储到 Chroma 中，以供将来参考。
```

Claude 将会：
1. 将对话拆分为更小的片段（通常为 512-1024 个 token）
   - 分块是必要的，因为：
   - 大段文本难以进行语义搜索
   - 较小的片段有助于更精确地检索上下文
   - 可避免将来检索时超出 token 限制
2. 为每个片段生成嵌入（embeddings）
3. 添加诸如时间戳和检测到的主题等元数据
4. 将所有内容存储在你的 Chroma 集合中

![mcp-store](/mcp-store.png)

之后，你可以自然地访问过去的对话：
```
我们之前关于认证系统的讨论是什么？
```

Claude 将会：
1. 在 Chroma 中搜索与认证相关的语义片段
2. 通过时间戳元数据筛选出上周的讨论
3. 将相关的上下文纳入其回复中

![mcp-search](/mcp-search.png)

这种设置特别适用于：
- 上下文容易丢失的长期项目
- 多人与 Claude 交互的团队协作
- 引用过去决策的复杂讨论

- 在多个聊天会话中保持一致的上下文

### 高级功能

Chroma MCP 服务器支持：

- **集合管理**：为不同项目创建和组织独立的集合
- **文档操作**：添加、更新或删除文档
- **搜索功能**：
  - 向量相似性搜索
  - 基于关键词的搜索
  - 元数据过滤
- **批量处理**：高效处理多个操作

## 故障排除

如果遇到问题：

1. 验证配置文件语法
2. 确保所有路径都是绝对路径且有效
3. 尝试对 `uvx` 使用完整路径，可通过 `which uvx` 获取路径并在配置文件中使用该路径
4. 检查 Claude 的日志（路径见上文）

## 资源

- [模型上下文协议文档](https://modelcontextprotocol.io/introduction)
- [Chroma MCP 服务器文档](https://github.com/chroma-core/chroma-mcp)
- [Claude 桌面版指南](https://docs.anthropic.com/claude/docs/claude-desktop)