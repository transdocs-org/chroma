---
id: braintrust
name: Braintrust
---

# Braintrust

[Braintrust](https://www.braintrustdata.com) 是一个用于构建 AI 产品的企业级技术栈，包括：评估、提示词开发环境、数据集管理、追踪等功能。

Braintrust 提供了 Typescript 和 Python 库用于运行和记录评估，并且与 Chroma 有良好的集成。

- [教程：使用 Braintrust 评估 Chroma 检索应用](https://www.braintrustdata.com/docs/examples/rag)

Python 中的示例评估脚本：
（完整实现请参考上面的教程）
```python
from autoevals.llm import *
from braintrust import Eval

PROJECT_NAME="Chroma_Eval"

from openai import OpenAI

client = OpenAI()
leven_evaluator = LevenshteinScorer()

async def pipeline_a(input, hooks=None):
    # 从 Chroma 获取相关信息
    relevant = collection.query(
        query_texts=[input],
        n_results=1,
    )
    relevant_text = ','.join(relevant["documents"][0])
    prompt = """
        你是一个助手，名叫 BT。请帮助用户。
        相关信息：{relevant}
        问题：{question}
        答案：
        """.format(question=input, relevant=relevant_text)
    messages = [{"role": "system", "content": prompt}]
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0,
        max_tokens=100,
    )

    result = response.choices[0].message.content
    return result

# 运行评估并记录到 Braintrust
await Eval(
    PROJECT_NAME,
    # 定义你的测试用例
    data = lambda:[{"input": "我的眼睛颜色是什么？", "expected": "棕色"}],
    # 定义上面的检索流程
    task = pipeline_a,
    # 使用预置评分函数或自定义评分函数 :)
    scores=[leven_evaluator],
)
```

了解更多：[文档](https://www.braintrustdata.com/docs)