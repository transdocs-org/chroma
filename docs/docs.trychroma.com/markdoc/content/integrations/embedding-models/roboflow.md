---
id: 'roboflow'
name: Roboflow
---

# Roboflow

你可以通过 `RoboflowEmbeddingFunction` 类将 [Roboflow Inference](https://inference.roboflow.com) 与 Chroma 结合使用，通过 CLIP 计算多模态的文本和图像嵌入。

推理可以通过 Roboflow 云端运行，也可以在你的本地硬件上运行。

## Roboflow 云端推理

要通过 Roboflow 云端运行推理，你需要一个 API 密钥。[了解如何获取 Roboflow API 密钥](https://docs.roboflow.com/api-reference/authentication#retrieve-an-api-key)。

你可以在创建 `RoboflowEmbeddingFunction` 时直接传入 API 密钥：

```python
from chromadb.utils.embedding_functions import RoboflowEmbeddingFunction

roboflow_ef = RoboflowEmbeddingFunction(api_key=API_KEY)
```

或者，你可以将 API 密钥设置为环境变量：

```terminal
export ROBOFLOW_API_KEY=YOUR_API_KEY
```

然后，你可以在创建 `RoboflowEmbeddingFunction` 时不直接传递 API 密钥：

```python
from chromadb.utils.embedding_functions import RoboflowEmbeddingFunction

roboflow_ef = RoboflowEmbeddingFunction()
```

## 本地推理

你可以在自己的硬件上运行推理。

要安装推理服务，你需要安装 Docker。请参考 [Docker 官方安装指南](https://docs.docker.com/engine/install/) 来了解如何在你的设备上安装 Docker。

接着，你可以使用 pip 安装推理服务：

```terminal
pip install inference inference-cli
```

安装完成后，你可以启动推理服务器。该服务器将在后台运行，并接受来自 `RoboflowEmbeddingFunction` 的 HTTP 请求，用于计算 CLIP 文本和图像嵌入以供你的应用使用：

启动推理服务器的命令如下：

```terminal
inference server start
```

你的推理服务器将在 `http://localhost:9001` 运行。

然后你可以创建 `RoboflowEmbeddingFunction`：

```python
from chromadb.utils.embedding_functions import RoboflowEmbeddingFunction

roboflow_ef = RoboflowEmbeddingFunction(api_key=API_KEY, server_url="http://localhost:9001")
```

该函数将使用你本地的推理服务器而不是 Roboflow 云端来计算嵌入。

关于如何将 Roboflow Inference 与 Chroma 结合使用的完整教程，请参阅 [Roboflow Chroma 集成教程](https://github.com/chroma-core/chroma/blob/main/examples/use_with/roboflow/embeddings.ipynb)。