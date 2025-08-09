---
id: hugging-face-server
name: 'Hugging Face Server'
---

# Hugging Face Server

Chroma 为 HuggingFace 文本嵌入服务器提供了一个便捷的封装。这是一个独立的服务器，通过 REST API 提供文本嵌入功能。你可以在这里阅读更多相关信息 [**here**](https://github.com/huggingface/text-embeddings-inference)。

## 设置服务器

要本地运行嵌入服务器，你可以从 Chroma 仓库的根目录运行以下命令。该 docker compose 命令会同时运行 Chroma 和嵌入服务器。

```terminal
docker compose -f examples/server_side_embeddings/huggingface/docker-compose.yml up -d
```

或者

```terminal
docker run -p 8001:80 -d -rm --name huggingface-embedding-server ghcr.io/huggingface/text-embeddings-inference:cpu-0.3.0 --model-id BAAI/bge-small-en-v1.5 --revision -main
```

{% Banner type="note" %}
上面的 docker 命令会使用 `BAAI/bge-small-en-v1.5` 模型运行服务器。你可以在[这里](https://github.com/huggingface/text-embeddings-inference#docker)找到更多关于在 docker 中运行服务器的信息。
{% /Banner %}

## 使用方法

{% TabbedCodeBlock %}

{% Tab label="python" %}

```python
from chromadb.utils.embedding_functions import HuggingFaceEmbeddingServer
huggingface_ef = HuggingFaceEmbeddingServer(url="http://localhost:8001/embed")
```

{% /Tab %}

{% Tab label="typescript" %}


```typescript
// npm install @chroma-core/huggingface-server

import { HuggingFaceEmbeddingServerFunction } from '@chroma-core/huggingface-server';

const embedder = new HuggingFaceEmbeddingServerFunction({ url: "http://localhost:8001/embed" })

// 直接使用
const embeddings = embedder.generate(["document1","document2"])

// 传递文档以进行 .add 和 .query
let collection = await client.createCollection({name: "name", embeddingFunction: embedder})
collection = await client.getCollection({name: "name", embeddingFunction: embedder})
```

{% /Tab %}
{% /TabbedCodeBlock %}

嵌入模型是在服务器端配置的。查看 `examples/server_side_embeddings/huggingface/docker-compose.yml` 中的 docker-compose 文件，了解如何配置服务器的示例。

## 身份验证

嵌入服务器可以配置为仅允许使用 API 密钥进行访问。
你可以在 chroma 客户端中使用身份验证：

{% TabbedCodeBlock %}

{% Tab label="python" %}

```python
from chromadb.utils.embedding_functions import HuggingFaceEmbeddingServer
huggingface_ef = HuggingFaceEmbeddingServer(url="http://localhost:8001/embed", api_key="your secret key")
```

{% /Tab %}

{% Tab label="typescript" %}


```typescript
import  {HuggingFaceEmbeddingServerFunction} from 'chromadb';
const embedder = new HuggingFaceEmbeddingServerFunction({ url: "http://localhost:8001/embed", apiKey: "your secret key" })
```

{% /Tab %}
{% /TabbedCodeBlock %}