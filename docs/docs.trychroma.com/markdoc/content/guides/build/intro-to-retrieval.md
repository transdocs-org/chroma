# 检索简介

像 GPT-4、Claude 或 Llama 这样的大语言模型可以编写代码、回答问题、生成内容，并以显著的复杂性解决复杂问题。你可以通过编写良好的提示词并调用 AI API 来构建聊天机器人、内容生成器、代码助手和分析工具。

然而，当你开始构建更复杂的应用程序时，尤其是那些需要大型语言模型（LLM）无法获取的知识的应用程序时，你很快就会遇到一些根本性的限制。

## 知识问题

假设你正在为一家公司的客服团队构建一个 AI 助手。你希望 AI 能够回答有关公司产品、政策和流程的问题。

给定以下简单提示：

> 贵公司的牙刷退货政策是什么？

AI 很可能会返回一个通用答案，因为它不知道你公司的具体政策：

> 我不是销售牙刷的零售商或公司——我是 Anthropic 创建的 AI 助手 Claude。我没有产品，也没有退货政策。如果你在寻找有关牙刷退货政策的信息，你需要咨询你购买或计划购买牙刷的具体商店或公司。大多数零售商在其网站上都列出了退货政策，或者你可以直接联系他们的客户服务。

我们可以通过为 AI 提供有用的信息或上下文来解决这个问题。这通常被称为“上下文工程”：

> 贵公司的牙刷退货政策是什么？请使用以下信息作为上下文：牙刷在未开封的情况下可在购买后 360 天内退货。

现在 AI 有了正确回答用户问题所需的信息：

> 根据提供的信息，我们的牙刷退货政策允许在购买后 360 天内退货，只要牙刷未被打开并保持在原始包装中。这为你提供近一年的时间来退货未开封的牙刷（如有需要）。一旦牙刷被打开，将不再符合此政策的退货条件。

但是，如果你希望你的 AI 聊天机器人能够回答有关运输、产品规格、故障排除或任何其他主题的问题，该怎么办呢？我们将不得不在上下文中包含整个知识库，这会导致多个技术问题。

**Token 限制**：AI 模型有最大输入长度。即使是最大的模型，也可能无法在一个提示中容纳整个公司的文档。

**成本**：AI API 通常按 token 收费。在每次请求中包含数千字的上下文会迅速变得昂贵。

**相关性**：当你包含太多信息时，AI 可能会被混淆，或者关注不相关的细节，而不是回答用户问题真正重要的内容。

**时效性**：信息在不断变化。产品规格更新、政策变更、新文档被撰写。将所有内容放在提示中意味着每次任何内容更改时都要手动更新每个提示。

**幻觉**：在没有正确信息或焦点的情况下回答用户问题时，LLM 可能会产生具有权威语气的错误答案。对于大多数对准确性有要求的商业应用来说，幻觉是一个关键问题。

## 检索登场

检索通过在 AI 模型和你的实际数据之间建立桥梁来解决这些根本性挑战。检索系统不会试图将所有内容塞进提示中，而是**将你的信息存储**在可搜索的格式中。这使你可以使用自然语言搜索你的知识库，从而找到相关的信息来回答用户的问题，只需将用户的问题本身提供给检索系统即可。这样，你可以战略性地为模型构建上下文。

当检索系统返回与用户问题相关的知识库结果时，你可以使用这些结果为 AI 模型提供上下文，帮助它生成准确的响应。

典型的检索流程是这样构建的：

1. **将信息转换为可搜索格式** —— 这是通过使用**嵌入模型**完成的。它们会创建数学表示形式（称为“嵌入”），不仅捕捉关键词，还捕捉文本的语义含义。
2. **将这些表示形式存储** 在一个检索系统中，该系统优化了为输入查询快速查找相似嵌入的能力。
3. **将用户查询处理为嵌入**，以便它们可以作为输入提供给你的检索系统。
4. **将检索结果与原始用户查询结合**，然后提供给 AI 模型。

**Chroma** 是一个强大的检索系统，它几乎开箱即用地处理了这个过程的大部分内容。它还允许你自定义这些步骤，以在你的 AI 应用中获得最佳性能。让我们在我们的客服示例中看看它的实际应用。

### 步骤 1：将知识库嵌入并存储到 Chroma 集合中

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

Chroma 在一次操作中嵌入并存储信息。

```python
import chromadb

client = chromadb.Client()
customer_support_collection = client.create_collection(
    name="customer support"
)

customer_support_collection.add(
   ids=["1", "2", "3"],
   documents=[
      "牙刷在未开封的情况下可在购买后 360 天内退货。",
      "所有订单免运费。",
      "通常情况下，运输需要 2-3 个工作日"
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

在本地运行 Chroma 服务器：

```terminal
chroma run
```

Chroma 在一次操作中嵌入并存储信息。

```typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient();
const customer_support_collection = await client.createCollection({
    name: "customer support"
});

await customer_support_collection.add({
    ids: ["1", "2", "3"],
    documents: [
        "牙刷在未开封的情况下可在购买后 360 天内退货。",
        "所有订单免运费。",
        "通常情况下，运输需要 2-3 个工作日"
    ]
})
```

{% /Tab %}

{% /Tabs %}

### 步骤 2：处理用户查询

同样，Chroma 开箱即用地处理查询的嵌入。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
user_query = "贵公司的牙刷退货政策是什么？"

context = customer_support_collection.query(
    query_texts=[user_query],
    n_results=1
)['documents'][0]

print(context) # 牙刷在未开封的情况下可在购买后 360 天内退货。
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
const user_query = "贵公司的牙刷退货政策是什么？";

const context = (await customer_support_collection.query({
    query_texts: [user_query],
    n_results: 1
})).documents[0];

console.log(context); // 牙刷在未开封的情况下可在购买后 360 天内退货。
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 步骤 3：生成 AI 响应

有了来自 Chroma 的结果，我们可以为 AI 模型构建正确的上下文。

{% CustomTabs %}

{% Tab label="OpenAI" %}

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

prompt = f"{user_query}。请使用以下内容作为回答的上下文：{context}"

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


const prompt = `${userQuery}。请使用以下内容作为回答的上下文：${context}`;

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

prompt = f"{user_query}。请使用以下内容作为回答的上下文：{context}"

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

const prompt = `${userQuery}。请使用以下内容作为回答的上下文：${context}`;

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