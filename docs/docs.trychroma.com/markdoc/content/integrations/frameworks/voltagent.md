---
id: voltagent
name: VoltAgent
---

# VoltAgent

[VoltAgent](https://github.com/VoltAgent/voltagent) 是一个开源的 TypeScript 框架，用于构建具有模块化工具、LLM 编排和灵活多代理系统的 AI 代理。它内置了一个类似 n8n 的可观察性控制台，使您能够直观地检查代理行为、追踪操作并轻松调试。

{% Banner type="tip" %}
您可以在以下位置找到完整的示例代码：[VoltAgent with Chroma 示例](https://github.com/VoltAgent/voltagent/tree/main/examples/with-chroma)
{% /Banner %}

## 安装

创建一个集成 Chroma 的新 VoltAgent 项目：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="npm" %}

```terminal
npm create voltagent-app@latest -- --example with-chroma
```

{% /Tab %}

{% Tab label="yarn" %}

```terminal
yarn create voltagent-app --example=with-chroma
```

{% /Tab %}

{% Tab label="pnpm" %}

```terminal
pnpm create voltagent-app --example=with-chroma
```

{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

这将创建一个完整的 VoltAgent + Chroma 设置，包含示例数据和两种不同的代理配置。

安装依赖项：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="npm" %}

```terminal
npm install
```

{% /Tab %}

{% Tab label="yarn" %}

```terminal
yarn install
```

{% /Tab %}

{% Tab label="pnpm" %}

```terminal
pnpm install
```

{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

接下来，您需要启动一个 Chroma 服务器实例。

```terminal
npm run chroma run
```

服务器将在 `http://localhost:8000` 上可用。

**注意**：对于生产部署，您可能更倾向于使用 [Chroma Cloud](https://www.trychroma.com/)，这是一个完全托管的托管服务。有关云配置，请参阅下面的环境设置部分。

## 环境设置

使用您的配置创建 `.env` 文件：

### 选项 1：本地 Chroma 服务器

```env
# OpenAI API 密钥，用于嵌入和 LLM
OPENAI_API_KEY=your-openai-api-key-here

# 本地 Chroma 服务器配置（可选，默认值如下）
CHROMA_HOST=localhost
CHROMA_PORT=8000
```

### 选项 2：[Chroma Cloud](https://www.trychroma.com/)

```env
# OpenAI API 密钥，用于嵌入和 LLM
OPENAI_API_KEY=your-openai-api-key-here

# Chroma Cloud 配置
CHROMA_API_KEY=your-chroma-cloud-api-key
CHROMA_TENANT=your-tenant-name
CHROMA_DATABASE=your-database-name
```

代码将根据是否存在 `CHROMA_API_KEY` 自动检测使用哪种配置。

## 运行您的应用程序

启动您的 VoltAgent 应用程序：

```terminal
npm run dev
```

您将看到：

```
🚀 VoltAgent with Chroma is running!
📚 Sample knowledge base initialized with 5 documents
📚 Two different agents are ready:
  1️⃣ Assistant with Retriever - Automatic semantic search on every interaction
  2️⃣ Assistant with Tools - LLM decides when to search autonomously

💡 Chroma server started easily with npm run chroma run (no Docker/Python needed!)

══════════════════════════════════════════════════
  VOLTAGENT SERVER STARTED SUCCESSFULLY
══════════════════════════════════════════════════
  ✓ HTTP Server: http://localhost:3141

  VoltOps Platform:    https://console.voltagent.dev
══════════════════════════════════════════════════
```

{% Banner type="tip" %}
有关更多信息，请参考官方 [VoltAgent 文档](https://voltagent.dev/docs/)。
{% /Banner %}

## 与您的代理互动

您的代理现在正在运行！要与它们互动：

1. **打开控制台：** 点击终端输出中的 [`https://console.voltagent.dev`](https://console.voltagent.dev) 链接（或将其复制粘贴到浏览器中）。
2. **查找您的代理：** 在 VoltOps LLM 可观察性平台页面上，您应该看到两个列出的代理：
   - "Assistant with Retriever"
   - "Assistant with Tools"
3. **打开代理详细信息：** 点击任一代理的名称。
4. **开始聊天：** 在代理详细信息页面上，点击右下角的聊天图标以打开聊天窗口。
5. **测试 RAG 功能：** 尝试以下问题：
   - "什么是 VoltAgent？"
   - "告诉我关于向量数据库"
   - "TypeScript 如何帮助开发？"

![VoltAgent with Chroma Demo](https://cdn.voltagent.dev/docs/chroma-rag-example.gif)

您的 AI 代理将提供包含 Chroma 知识库中相关内容的答案，并附带引用信息，显示在生成响应时参考了哪些源材料。

## 工作原理

快速了解其内部机制及如何自定义它。

### 创建 Chroma 检索器

创建 `src/retriever/index.ts`：

```typescript
import {
  BaseRetriever,
  type BaseMessage,
  type RetrieveOptions,
} from "@voltagent/core";
import {
  ChromaClient,
  CloudClient,
  type QueryRowResult,
  type Metadata,
} from "chromadb";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

// 初始化 Chroma 客户端 - 支持本地和云
const chromaClient = process.env.CHROMA_API_KEY
  ? new CloudClient() // 使用 CHROMA_API_KEY、CHROMA_TENANT、CHROMA_DATABASE 环境变量
  : new ChromaClient({
      host: process.env.CHROMA_HOST || "localhost",
      port: parseInt(process.env.CHROMA_PORT || "8000"),
    });

// 配置 OpenAI 嵌入
const embeddingFunction = new OpenAIEmbeddingFunction({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-3-small", // 高效且成本效益
});

const collectionName = "voltagent-knowledge-base";
```

**关键元素解析**：

- **ChromaClient/CloudClient**：连接到您的本地 Chroma 服务器或 Chroma Cloud
- **自动检测**：如果设置了 CHROMA_API_KEY，则使用 CloudClient，否则回退到本地 ChromaClient
- **OpenAIEmbeddingFunction**：使用 OpenAI 的嵌入模型将文本转换为向量
- **集合**：存储文档及其嵌入的命名容器

### 初始化示例数据

添加示例文档以开始：

```typescript
async function initializeCollection() {
  try {
    const collection = await chromaClient.getOrCreateCollection({
      name: collectionName,
      embeddingFunction: embeddingFunction,
    });

    // 关于您的领域的示例文档
    const sampleDocuments = [
      "VoltAgent 是一个使用模块化组件构建 AI 代理的 TypeScript 框架。",
      "Chroma 是一个 AI 原生的开源向量数据库，可自动处理嵌入。",
      "向量数据库存储高维向量并支持语义搜索功能。",
      "检索增强生成 (RAG) 结合了信息检索和语言生成。",
      "TypeScript 为 JavaScript 提供静态类型，使代码更可靠且易于维护。",
    ];

    const sampleIds = sampleDocuments.map((_, index) => `sample_${index + 1}`);

    // 使用 upsert 避免重复
    await collection.upsert({
      documents: sampleDocuments,
      ids: sampleIds,
      metadatas: sampleDocuments.map((_, index) => ({
        type: "sample",
        index: index + 1,
        topic:
          index < 2 ? "框架" : index < 4 ? "数据库" : "编程",
      })),
    });

    console.log("📚 示例知识库已初始化");
  } catch (error) {
    console.error("初始化集合时出错:", error);
  }
}

// 模块加载时初始化
initializeCollection();
```

**此操作的作用**：

- 使用 OpenAI 的嵌入功能建立集合
- 添加带有元数据的示例文档
- 使用 `upsert` 避免重复文档
- 自动生成每个文档的嵌入

### 实现检索器类

创建主检索器类：

```typescript
async function retrieveDocuments(query: string, nResults = 3) {
  try {
    const collection = await chromaClient.getOrCreateCollection({
      name: collectionName,
      embeddingFunction: embeddingFunction,
    });

    const results = await collection.query({
      queryTexts: [query],
      nResults,
    });

    // 使用新的 .rows() 方法进行更清晰的数据访问
    const rows = results.rows();

    if (!rows || rows.length === 0 || !rows[0]) {
      return [];
    }

    // 格式化结果 - rows[0] 包含实际的行数据
    return rows[0].map((row: QueryRowResult<Metadata>, index: number) => ({
      content: row.document || "",
      metadata: row.metadata || {},
      distance: results.distances?.[0]?.[index] || 0, // 距离仍来自原始结果
      id: row.id,
    }));
  } catch (error) {
    console.error("检索文档时出错:", error);
    return [];
  }
}

export class ChromaRetriever extends BaseRetriever {
  async retrieve(
    input: string | BaseMessage[],
    options: RetrieveOptions
  ): Promise<string> {
    // 将输入转换为可搜索字符串
    let searchText = "";

    if (typeof input === "string") {
      searchText = input;
    } else if (Array.isArray(input) && input.length > 0) {
      const lastMessage = input[input.length - 1];

      // 处理不同的内容格式
      if (Array.isArray(lastMessage.content)) {
        const textParts = lastMessage.content
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text);
        searchText = textParts.join(" ");
      } else {
        searchText = lastMessage.content as string;
      }
    }

    // 执行语义搜索
    const results = await retrieveDocuments(searchText, 3);

    // 将引用添加到 userContext 以进行跟踪
    if (options.userContext && results.length > 0) {
      const references = results.map((doc, index) => ({
        id: doc.id,
        title: doc.metadata.title || `文档 ${index + 1}`,
        source: "Chroma 知识库",
        distance: doc.distance,
      }));

      options.userContext.set("references", references);
    }

    // 为 LLM 格式化结果
    if (results.length === 0) {
      return "在知识库中未找到相关文档。";
    }

    return results
      .map(
        (doc, index) =>
          `文档 ${index + 1} (ID: ${doc.id}, 距离: ${doc.distance.toFixed(4)}):\n${doc.content}`
      )
      .join("\n\n---\n\n");
  }
}

export const retriever = new ChromaRetriever();
```

**关键功能**：

- **输入处理**：支持字符串和消息数组输入
- **语义搜索**：使用 Chroma 的向量相似性搜索
- **用户上下文**：跟踪引用以提高透明度
- **错误处理**：搜索失败时优雅回退

### 创建您的代理

现在在 `src/index.ts` 中使用不同的检索模式创建代理：

```typescript
import { openai } from "@ai-sdk/openai";
import { Agent, VoltAgent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { retriever } from "./retriever/index.js";

// 代理 1：每次交互时自动检索
const agentWithRetriever = new Agent({
  name: "带有检索器的助手",
  description:
    "一个有用的助手，可在每次响应前自动搜索知识库中的相关信息",
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  retriever: retriever,
});

// 代理 2：LLM 决定何时搜索
const agentWithTools = new Agent({
  name: "带有工具的助手",
  description:
    "一个有用的助手，可以在需要时搜索知识库",
  llm: new VercelAIProvider(),
  model: openai("gpt-4o-mini"),
  tools: [retriever.tool],
});

new VoltAgent({
  agents: {
    agentWithRetriever,
    agentWithTools,
  },
});
```

## 使用模式

### 自动检索

第一个代理在每次响应前自动搜索：

```
用户："什么是 VoltAgent？"
代理：根据知识库，VoltAgent 是一个使用模块化组件构建 AI 代理的 TypeScript 框架...

来源：
- 文档 1 (ID: sample_1, 距离: 0.1234): Chroma 知识库
- 文档 2 (ID: sample_2, 距离: 0.2456): Chroma 知识库
```

### 基于工具的检索

第二个代理仅在确定必要时才搜索：

```
用户："告诉我关于 TypeScript"
代理：让我搜索有关 TypeScript 的相关信息。
[搜索知识库]
根据搜索结果，TypeScript 为 JavaScript 提供静态类型，使代码更可靠且易于维护...

来源：
- 文档 5 (ID: sample_5, 距离: 0.0987): Chroma 知识库
```

### 在代码中访问来源

您可以从响应中访问检索时使用的来源：

```typescript
// 生成响应后
const response = await agent.generateText("什么是 VoltAgent？");
console.log("答案:", response.text);

// 检查使用的来源
const references = response.userContext?.get("references");
if (references) {
  console.log("使用的来源:", references);
  references.forEach((ref) => {
    console.log(`- ${ref.title} (ID: ${ref.id}, 距离: ${ref.distance})`);
  });
}
// 输出: [{ id: "sample_1", title: "文档 1", source: "Chroma 知识库", distance: 0.1234 }]
```

或者在使用 `streamText` 时：

```typescript
const result = await agent.streamText("告诉我关于向量数据库");

for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}

// 流完成后访问来源
const references = result.userContext?.get("references");
if (references) {
  console.log("\n使用的来源:", references);
}
```

此集成为您提供了一个坚实的基础，可用于为 VoltAgent 应用程序添加语义搜索功能。VoltAgent 的灵活架构与 Chroma 的强大向量搜索相结合，创建了一个强大的 RAG 系统，可满足实际知识检索需求。

{% Banner type="tip" %}
有关如何将 VoltAgent 与 Chroma 一起使用的更多信息，请参阅 [VoltAgent 文档](https://voltagent.dev/docs/rag/chroma/)。
{% /Banner %}