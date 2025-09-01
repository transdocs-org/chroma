---
id: 'cohere'
name: 'Cohere'
---

# Cohere

Chroma 同样为 Cohere 的嵌入 API 提供了一个便捷的封装。这个嵌入函数在 Cohere 的服务器上远程运行，并且需要 API 密钥。你可以通过访问 [Cohere](https://dashboard.cohere.ai/welcome/register) 注册账户来获取 API 密钥。

{% Tabs %}
{% Tab label="python" %}

这个嵌入函数依赖于 `cohere` Python 包，你可以使用 `pip install cohere` 命令进行安装。

```python
import chromadb.utils.embedding_functions as embedding_functions
cohere_ef  = embedding_functions.CohereEmbeddingFunction(api_key="YOUR_API_KEY",  model_name="large")
cohere_ef(input=["document1","document2"])
```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
// npm install @chroma-core/cohere

import { CohereEmbeddingFunction } from '@chroma-core/cohere';

const embedder = new CohereEmbeddingFunction({ apiKey: "apiKey" })

// 直接使用
const embeddings = embedder.generate(["document1","document2"])

// 传递文档以进行 .add 和 .query 操作
const collection = await client.createCollection({name: "name", embeddingFunction: embedder})
const collectionGet = await client.getCollection({name:"name", embeddingFunction: embedder})
```

{% /Tab %}

{% /Tabs %}

你可以选择性地传入 `model_name` 参数，从而选择使用哪一个 Cohere 嵌入模型。默认情况下，Chroma 使用的是 `large` 模型。你可以在 [此处](https://docs.cohere.ai/reference/embed) 的 `Get embeddings` 部分查看可用的模型。

### 多语言模型示例

{% TabbedCodeBlock %}

{% Tab label="python" %}

```python
cohere_ef  = embedding_functions.CohereEmbeddingFunction(
        api_key="YOUR_API_KEY",
        model_name="multilingual-22-12")

multilingual_texts  = [ 'Hello from Cohere!', 'مرحبًا من كوهير!',
        'Hallo von Cohere!', 'Bonjour de Cohere!',
        '¡Hola desde Cohere!', 'Olá do Cohere!',
        'Ciao da Cohere!', '您好，来自 Cohere！',
        'कोहिअर से नमस्ते!'  ]

cohere_ef(input=multilingual_texts)

```

{% /Tab %}

{% Tab label="typescript" %}

```typescript
import { CohereEmbeddingFunction } from 'chromadb';

const embedder = new CohereEmbeddingFunction("apiKey")

multilingual_texts  = [ 'Hello from Cohere!', 'مرحبًا من كوهير!',
        'Hallo von Cohere!', 'Bonjour de Cohere!',
        '¡Hola desde Cohere!', 'Olá do Cohere!',
        'Ciao da Cohere!', '您好，来自 Cohere！',
        'कोहिअर से नमस्ते!'  ]

const embeddings = embedder.generate(multilingual_texts)

```

{% /Tab %}

{% /TabbedCodeBlock %}

关于多语言模型的更多信息，你可以阅读 [此处文档](https://docs.cohere.ai/docs/multilingual-language-models)。

### 多模态模型示例

{% tabs group="code-lang" hideTabs=true %}
{% Tab label="python" %}

```python

import os
from datasets import load_dataset, Image


dataset = load_dataset(path="detection-datasets/coco", split="train", streaming=True)

IMAGE_FOLDER = "images"
N_IMAGES = 5

# 将图片写入文件夹
dataset_iter = iter(dataset)
os.makedirs(IMAGE_FOLDER, exist_ok=True)
for i in range(N_IMAGES):
    image = next(dataset_iter)['image']
    image.save(f"images/{i}.jpg")


multimodal_cohere_ef = CohereEmbeddingFunction(
    model_name="embed-english-v3.0",
    api_key="YOUR_API_KEY",
)
image_loader = ImageLoader()

multimodal_collection = client.create_collection(
    name="multimodal",
    embedding_function=multimodal_cohere_ef,
    data_loader=image_loader)

image_uris = sorted([os.path.join(IMAGE_FOLDER, image_name) for image_name in os.listdir(IMAGE_FOLDER)])
ids = [str(i) for i in range(len(image_uris))]
for i in range(len(image_uris)):
    # 每次添加最多一张图片，请参阅 Cohere 文档 https://docs.cohere.com/v2/reference/embed#request.body.images
    multimodal_collection.add(ids=[str(i)], uris=[image_uris[i]])

retrieved = multimodal_collection.query(query_texts=["animals"], include=['data'], n_results=3)

```

{% /Tab %}
{% /tabs %}