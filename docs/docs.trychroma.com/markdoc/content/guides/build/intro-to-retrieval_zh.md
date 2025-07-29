# 检索简介

像 GPT-4、Claude 或 Llama 这样的大型语言模型可以编写代码、回答问题、生成内容，并以令人印象深刻的方式解决复杂问题。你可以通过设计良好的提示词（prompt）并调用 AI API 来构建聊天机器人、内容生成器、代码助手和分析工具。

然而，当你开始构建更复杂的应用程序时，尤其是那些需要依赖 LLM（大型语言模型）本身不具备的知识的应用程序时，你会很快遇到一些根本性的限制。

## 知识问题

想象一下你正在为一家公司的客服团队构建一个 AI 助手。你希望这个 AI 能够回答有关你们公司产品、政策和流程的问题。

如果给出一个简单的提示：

> 牙刷的退货政策是什么？

AI 很可能会返回一个通用的回答，因为它并不了解你们公司的具体政策：

> 我不是一个售卖牙刷的零售商或公司——我是 Claude，一个由 Anthropic 创建的 AI 助手。我没有产品，也没有退货政策。如果你在寻找有关牙刷退货政策的信息，你需要咨询你购买或计划购买牙刷的具体商店或公司。大多数零售商都会在其网站上列出退货政策，或者你可以直接联系他们的客服。

我们可以通过为 AI 提供有用的信息或上下文来解决这个问题。这通常被称为“上下文工程”（context engineering）：

> 牙刷的退货政策是什么？请参考以下信息：牙刷在购买后 360 天内未开封的情况下可以退货。

现在，AI 拥有了正确回答用户问题所需的信息：

> 根据所提供的信息，我们牙刷的退货政策允许在购买后 360 天内退货，只要牙刷未被打开并仍处于原始包装中。这意味着如果您需要退回未拆封的牙刷，您几乎有一整年的时间。一旦牙刷被打开，就不再符合本政策的退货条件。

但是，如果我们希望我们的 AI 聊天机器人能够回答有关运输、产品规格、故障排查或任何其他主题的问题，该怎么办呢？我们将不得不把我们的整个知识库都包含在上下文中，而这会引发多个技术问题。

**Token 限制：** AI 模型有最大输入长度限制。即使是最大的模型，也可能无法在一个提示中容纳一整家公司的文档。

**成本：** AI 的 API 通常按 token 计费。每次请求中包含数千字的上下文会迅速增加成本。

**相关性：** 当你包含过多信息时，AI 可能会产生混淆，或者关注不相关的细节，而不是回答用户问题真正需要的内容。

**时效性：** 信息在不断变化。产品规格更新、政策变更、新文档不断产生。如果所有信息都放在提示词中，就意味着每次有任何变动时都需要手动更新每一个提示。

**幻觉问题（胡编乱造）：** 如果没有正确的信息或重点来回答用户的问题，大语言模型（LLM）可能会以权威的语气生成错误的答案。对于大多数注重准确性的商业应用来说，幻觉是一个非常严重的问题。

## 进入检索（Retrieval）

检索技术通过在 AI 模型与你的实际数据之间架起一座桥梁，解决了这些基础性的挑战。与其将所有信息都塞进提示词（prompt）中，不如使用检索系统以一种可搜索的格式**存储你的信息**。这使得你可以使用自然语言来搜索你的知识库，从而找到与用户问题相关的信息——你只需将用户的问题本身作为输入提供给检索系统。这样，你就可以战略性地为模型构建上下文环境。

当一个检索系统从你的知识库中返回与用户问题相关的结果时，你可以利用这些结果为 AI 模型提供上下文，帮助它生成准确的响应。

典型的检索流程通常由以下几个步骤构成：

1. **将信息转换为可搜索的格式** —— 这一步通过使用**嵌入模型**（embedding models）完成。它们会创建你数据的数学表示形式，称为“嵌入”（embeddings），捕捉的是文本的语义含义，而不仅仅是关键词。
2. **将这些表示形式存储起来**，以便在检索系统中快速查找与输入查询相似的嵌入。
3. **将用户查询处理为嵌入形式**，使其可以作为输入提供给你的检索系统。
4. **将检索到的结果与原始用户查询结合**，然后提供给 AI 模型进行处理。

**Chroma** 是一个功能强大的检索系统，它可以开箱即用地处理上述大部分流程。它还允许你自定义这些步骤，以在你的 AI 应用中获得最佳性能。接下来，我们将在客户支持的示例中实际体验它的使用。

### 步骤 1: 嵌入我们的知识库并将其存储在 Chroma 集合中

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

Chroma 在一个操作中嵌入并存储信息。

```python
import chromadb

client = chromadb.Client()
customer_support_collection = client.create_collection(
    name="customer support"
)

customer_support_collection.add(
   ids=["1", "2", "3"],
   documents=[
      "牙刷在购买后360天内如未开封可退货。",
      "所有订单免运费。",
      "发货通常需要2-3个工作日"
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

Chroma 在一个操作中嵌入并存储信息。

```typescript
import { ChromaClient } from "chromadb";

const client = new ChromaClient();
const customer_support_collection = await client.createCollection({
    name: "customer support"
});
```

await customer_support_collection.add({
    ids: ["1", "2", "3"],
    documents: [
        "牙刷在购买后360天内未开封可退货。",
        "所有订单均可享受免运费服务。",
        "通常配送需要2-3个工作日"
    ]
})

```

{% /Tab %}

{% /Tabs %}


### 步骤 2：处理用户查询

同样地，Chroma 可以为你开箱即用地处理查询的嵌入。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
user_query = "牙刷的退货政策是怎样的？"

context = customer_support_collection.query(
    queryTexts=[user_query],
    n_results=1
)['documents'][0]

print(context) # 牙刷在购买后 360 天内未开封可退货。
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
const user_query = "牙刷的退货政策是怎样的？";

const context = (await customer_support_collection.query({
    queryTexts: [user_query],
    n_results: 1
})).documents[0];

console.log(context); // 牙刷在购买后 360 天内未开封可退货。
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 步骤 3：生成 AI 回复

借助 Chroma 返回的结果，我们可以为 AI 模型构建正确的上下文。

{% CustomTabs %}

{% Tab label="OpenAI" %}

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

prompt = f"{user_query}. 使用此内容作为回答的上下文：{context}"

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


const prompt = `${userQuery}. 使用此内容作为回答的上下文：${context}`;

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

prompt = f"{user_query}. 将此作为回答的上下文: {context}"

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": prompt}
    ]
)
```

```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const prompt = `${userQuery}. Use this as context for answering: ${context}`;

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