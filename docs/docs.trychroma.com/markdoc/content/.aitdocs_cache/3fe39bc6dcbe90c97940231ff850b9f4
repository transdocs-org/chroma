# 使用人工智能进行构建

人工智能是一种新型的编程基础。大语言模型（LLMs）让我们能够编写出以**常识**方式处理**非结构化**信息的软件。

假设我们需要编写一个程序，从以下段落中提取出人名列表：

> 现在，其他阿开亚人的王子们都整夜安然入睡，但阿特柔斯之子阿伽门农却辗转反侧，难以入眠。正如赫拉的丈夫在天空中闪耀着闪电，预示着大雨、冰雹或雪花覆盖大地，又或是表明他将开启饥饿战争的广阔颚口，阿伽门农也发出一声声沉重的叹息，他的灵魂在胸中颤动。当他望向特洛伊平原时，他惊奇地看到伊里昂城前燃起了无数的警戒之火……——《伊利亚特》第十卷

对于人类来说，提取名字轻而易举，但如果仅使用传统编程方法却异常困难。而要编写一个能从任意段落中提取名字的通用程序则更加困难。

然而，使用LLM，这个任务几乎变得微不足道。我们只需将以下输入提供给一个LLM：

> 请列出以下段落中出现的人名，用逗号分隔：现在，其他阿开亚人的王子们都整夜安然入睡，但阿特柔斯之子阿伽门农却辗转反侧，难以入眠。正如赫拉的丈夫在天空中闪耀着闪电，预示着大雨、冰雹或雪花覆盖大地，又或是表明他将开启饥饿战争的广阔颚口，阿伽门农也发出一声声沉重的叹息，他的灵魂在胸中颤动。当他望向特洛伊平原时，他惊奇地看到伊里昂城前燃起了无数的警戒之火……——《伊利亚特》第十卷

输出结果将会是：

> 阿伽门农, 阿特柔斯, 赫拉

将LLM集成到软件应用中就像调用API一样简单。虽然不同LLM之间的API细节可能有所不同，但大多数已经形成了一些通用的模式：
* API调用通常包括参数，如`model`标识符和`messages`列表。
* 每条`message`都有`role`和`content`。
* `system`角色可以理解为给模型的*指令*。
* `user`角色可以理解为需要处理的*数据*。

例如，我们可以使用人工智能编写一个通用函数，从输入文本中提取名字。

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
    system_prompt = "你是一个名字提取器。用户将提供一段文本，你必须返回该文本中提到的所有名字组成的JSON数组。不要包含任何解释或格式。"

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
        '你是一个名字提取器。用户将提供一段文本，你必须返回该文本中提到的所有名字组成的JSON数组。不要包含任何解释或格式。';

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
    system_prompt = "你是一个名字提取器。用户将提供一段文本，你必须返回该文本中提到的所有名字组成的JSON数组。不要包含任何解释或格式。"

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
        '你是一个名字提取器。用户将提供一段文本，你必须返回该文本中提到的所有名字组成的JSON数组。不要包含任何解释或格式。';

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