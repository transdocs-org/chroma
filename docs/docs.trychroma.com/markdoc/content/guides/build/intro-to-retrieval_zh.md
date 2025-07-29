# 检索简介

像 GPT-4、Claude 或 Llama 这样的大型语言模型（LLM）可以编写代码、回答问题、生成内容，并以极高的复杂度解决各种问题。你可以通过设计良好的提示词（prompt）并调用 AI API 来构建聊天机器人、内容生成器、代码助手和分析工具。

然而，当你开始构建更复杂的应用时，尤其是那些需要依赖 LLM 本身并不具备的知识时，你会很快遇到一些根本性的限制。

## 知识问题

假设你正在为一家公司的客服团队构建一个 AI 助手。你希望这个 AI 能够回答有关公司产品、政策和流程的问题。

当给定如下简单提示：

> 你们的牙刷退货政策是什么？

AI 很可能会返回一个通用的回答，因为它不知道你公司的具体政策：

> 我不是一个销售牙刷的零售商或公司——我是 Claude，一个由 Anthropic 创建的 AI 助手。我没有产品，也没有退货政策。如果你需要了解牙刷的退货政策，你需要联系你购买或计划购买牙刷的具体商店或公司。大多数零售商都会在其网站上列出退货政策，或者你可以直接联系他们的客服。

我们可以通过为 AI 提供有用的信息或上下文来解决这个问题，这通常被称为“上下文工程”（context engineering）：

> 你们的牙刷退货政策是什么？请使用以下信息作为参考：牙刷在未开封的前提下，可在购买后 360 天内退货。

现在，AI 拥有了正确回答用户问题所需的信息：

> 根据提供的信息，我们的牙刷退货政策允许在购买后 360 天内退货，前提是牙刷未被开封并保持原包装。这为你提供了将近一年的时间来退货。一旦牙刷被开封，就不再符合本政策下的退货条件。

但如果我们希望 AI 聊天机器人能够回答有关配送、产品规格、故障排查或任何其他主题的问题该怎么办呢？我们将不得不在提示中包含整个知识库的内容，这会导致几个技术问题。

**Token 限制：** AI 模型有最大输入长度限制。即使是最大的模型也可能无法在单个提示中容纳整个公司的文档。

**成本：** AI API 通常按 token 收费。每次请求都包含数千字的上下文会迅速增加成本。

**相关性：** 当你包含过多信息时，AI 可能会感到困惑，或者关注不相关的细节，而不是回答用户问题真正需要的信息。

**时效性：** 信息在不断变化。产品规格更新、政策变更、新文档不断产生。将所有内容放在提示中意味着每次变更都需要手动更新每一个提示。

**幻觉（Hallucinations）：** 如果没有正确的信息或重点来回答用户的问题，LLM 可能会以权威的语气给出错误答案。对于大多数重视准确性的商业应用来说，幻觉是一个关键问题。

## 检索的引入

检索通过在 AI 模型和你的实际数据之间建立桥梁，解决了这些根本性的挑战。与试图将所有内容塞进提示词不同，检索系统会将你的信息以**可搜索的格式**存储起来。这使你可以使用自然语言搜索你的知识库，从而在用户提问时，通过将用户的问题本身作为输入，找到相关信息。这样，你可以战略性地为模型构建上下文。

当检索系统返回与用户问题相关的知识库结果时，你可以将这些结果用作 AI 模型的上下文，以帮助其生成准确的回复。

一个典型的检索流程通常包括以下步骤：

1. **将信息转换为可搜索格式** —— 这是通过使用 **嵌入模型（embedding models）** 来完成的。它们会为你的数据创建数学表示（称为“嵌入”），捕捉文本的语义含义，而不仅仅是关键词。
2. **将这些表示存储** 在一个检索系统中，该系统优化了对输入查询的相似嵌入的快速查找。
3. **将用户查询处理为嵌入**，以便作为输入提供给你的检索系统。
4. **将检索结果与原始用户查询结合**，提供给 AI 模型。

**Chroma** 是一个强大的检索系统，它开箱即用地处理了大部分这一流程。它还允许你自定义这些步骤，以在你的 AI 应用中获得最佳性能。让我们在客服支持示例中看看它是如何工作的。

### 步骤 1：嵌入我们的知识库并存储到 Chroma 集合中

{% Tabs %}

{% Tab label="python" %}

安装 Chroma：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="pip" %}
```terminal
pip install chromadb
```
{% /Tab %}

{% Tab label="poetry" %}
```terminal
poetry add chromadb
```
{% /Tab %}

{% Tab label="uv" %}
```terminal
uv pip install chromadb
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

Chroma 在一个操作中完成嵌入和存储。

```python
import chromadb

client = chromadb.Client()
customer_support_collection = client.create_collection(
    name="customer support"
)

customer_support_collection.add(
   ids=["1", "2", "3"],
   documents=[
      "牙刷在未开封的前提下，可在购买后 360 天内退货。",
      "所有订单免收运费。",
      "配送通常需要 2-3 个工作日"
   ]
)
```

{% /Tab %}

{% Tab label="typescript" %}

安装 Chroma：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="npm" %}
```terminal
npm install chromadb @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="pnpm" %}
```terminal
pnpm add chromadb @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="yarn" %}
```terminal
yarn add chromadb @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="bun" %}
```terminal
bun add chromadb @chroma-core/default-embed
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

在本地运行 Chroma 服务：

```terminal
chroma run
```

Chroma 在一个操作中完成嵌入和存储。

```typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient();
const customer_support_collection = await client.createCollection({
    name: "customer support"
});

await customer_support_collection.add({
    ids: ["1", "2", "3"],
    documents: [
        "牙刷在未开封的前提下，可在购买后 360 天内退货。",
        "所有订单免收运费。",
        "配送通常需要 2-3 个工作日"
    ]
})
```

{% /Tab %}

{% /Tabs %}

### 步骤2：处理用户查询

同样地，Chroma可以为你开箱即用地处理查询的嵌入。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
user_query = "牙刷的退货政策是什么？"

context = customer_support_collection.query(
    queryTexts=[user_query],
    n_results=1
)['documents'][0]

print(context) # 牙刷若未开封，可在购买后360天内退货。
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
const user_query = "牙刷的退货政策是什么？";

const context = (await customer_support_collection.query({
    queryTexts: [user_query],
    n_results: 1
})).documents[0];

console.log(context); // 牙刷若未开封，可在购买后360天内退货。
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 步骤3：生成AI响应

借助来自Chroma的结果，我们可以为AI模型构建正确的上下文。

{% CustomTabs %}

{% Tab label="OpenAI" %}

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

prompt = f"{user_query}. 请使用以下内容作为回答的上下文：{context}"

response = openai.ChatCompletion.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "你是一个乐于助人的助手"},
        {"role": "user", "content": prompt}
    ]
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const prompt = `${userQuery}. 请使用以下内容作为回答的上下文：${context}`;

const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "你是一个乐于助人的助手" },
      { role: "user", content: prompt },
    ],
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

{% /Tab %}

{% Tab label="Anthropic" %}

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

prompt = f"{user_query}. 请使用以下内容作为回答的上下文：{context}"

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": prompt}
    ]
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const prompt = `${userQuery}. 请使用以下内容作为回答的上下文：${context}`;

const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
        {
            role: 'user',
            content: prompt,
        },
    ],
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

{% /Tab %}

{% /CustomTabs %}