# 与AI共同构建

AI是一种新型的编程原语。大语言模型（LLMs）使我们能够编写以**常识**方式处理**非结构化**信息的软件。

设想一个任务：编写程序，从以下段落中提取出所有人名的列表：

> 现在，其他阿开奥斯的王子们都整夜酣睡，但阿特柔斯之子阿伽门农却辗转难眠。就像赫拉的丈夫宙斯在天空闪烁电光，预示着大雨、冰雹或雪花覆盖大地，又或者昭示着战争即将爆发一样，阿伽门农也发出一声声沉重的叹息，他的内心充满焦虑。当他望向特洛伊平原时，看到伊利昂城前燃起的无数篝火，不禁感到惊讶……——《伊利亚特》，第10卷

对于人类来说，提取名字很容易，但如果只使用传统编程方法则非常困难。编写一个能从任何段落中提取人名的通用程序更是难上加难。

然而，使用LLM，这项任务几乎变得微不足道。我们只需将以下输入提供给LLM：

> 列出以下段落中提到的人名，用逗号分隔：Now the other princes of the Achaeans slept soundly the whole night through, but Agamemnon son of Atreus was troubled, so that he could get no rest. As when fair Hera's lord flashes his lightning in token of great rain or hail or snow when the snow-flakes whiten the ground, or again as a sign that he will open the wide jaws of hungry war, even so did Agamemnon heave many a heavy sigh, for his soul trembled within him. When he looked upon the plain of Troy he marveled at the many watchfires burning in front of Ilion... - The Iliad, Scroll 10

输出结果将是正确的：

> Agamemnon, Atreus, Hera

将LLM集成到软件应用中，只需调用一个API即可。虽然不同LLM的API细节可能不同，但大多数API已经形成了一些通用的模式：
* API调用通常包括一个`model`标识符和一个`messages`列表。
* 每条`message`都有一个`role`和`content`。
* `system`角色可以理解为模型的*指令*。
* `user`角色可以理解为需要处理的*数据*。

例如，我们可以使用AI编写一个通用函数，从输入文本中提取名字。

{% CustomTabs %}

{% Tab label="OpenAI" %}

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import json
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_names(text: str) -> list[str]:
    system_prompt = "你是一个名字提取器。用户提供给你一段文本，你需要返回一个包含所有提到的名字的JSON数组。不要包含任何解释或格式说明。"

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ]
    )

    response = response.choices[0].message["content"]
    return json.loads(response)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function extractNames(text: string): Promise<string[]> {
    const systemPrompt =
        '你是一个名字提取器。用户提供给你一段文本，你需要返回一个包含所有提到的名字的JSON数组。不要包含任何解释或格式说明。';

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text },
        ]
    });

    const responseText = chatCompletion.choices[0].message?.content ?? '[]';
    return JSON.parse(responseText);
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

{% /Tab %}


{% Tab label="Anthropic" %}

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
import json
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

def extract_names(text: str) -> list[str]:
    system_prompt = "你是一个名字提取器。用户提供给你一段文本，你需要返回一个包含所有提到的名字的JSON数组。不要包含任何解释或格式说明。"

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=system_prompt,
        messages=[
            {"role": "user", "content": text}
        ]
    )

    response_text = response.content[0].text
    return json.loads(response_text)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function extractNames(text: string): Promise<string[]> {
    const systemPrompt =
        '你是一个名字提取器。用户提供给你一段文本，你需要返回一个包含所有提到的名字的JSON数组。不要包含任何解释或格式说明。';

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
            { role: 'user', content: text },
        ]
    });

    const responseText = message.content[0]?.type === 'text' ? message.content[0].text : '[]';
    return JSON.parse(responseText);
}
```
{% /Tab %}

{% /TabbedCodeBlock %}

{% /Tab %}

{% /CustomTabs %}