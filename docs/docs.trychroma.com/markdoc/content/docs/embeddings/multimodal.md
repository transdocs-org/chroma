# 多模态

{% Banner type="note" %}
多模态支持目前仅在 Python 中可用。Javascript/Typescript 的支持即将推出！
{% /Banner %}

你可以创建多模态的 Chroma 集合；这些集合可以存储多种模态的数据，并且可以通过多种模态进行查询。

[在 Colab 中尝试](https://githubtocolab.com/chroma-core/chroma/blob/main/examples/multimodal/multimodal_retrieval.ipynb)

## 多模态嵌入函数

Chroma 支持多模态嵌入函数，可以用于将多种模态的数据嵌入到一个嵌入空间中。

Chroma 内置了 OpenCLIP 嵌入函数，支持文本和图像。

```python
from chromadb.utils.embedding_functions import OpenCLIPEmbeddingFunction
embedding_function = OpenCLIPEmbeddingFunction()
```

## 添加多模态数据和数据加载器

你可以直接将不同于文本的其他模态的嵌入数据添加到 Chroma 中。目前支持图像：

```python
collection.add(
    ids=['id1', 'id2', 'id3'],
    images=[[1.0, 1.1, 2.1, ...], ...] # 表示图像的 NumPy 数组列表
)
```

与存储在 Chroma 中的文本文档不同，我们不会存储你的原始图像或其他模态的原始数据。相反，对于每条多模态记录，你可以指定一个 URI 指向原始格式的存储位置，以及一个**数据加载器**。你添加的每个 URI，Chroma 都会使用数据加载器来检索原始数据，对其进行嵌入，并存储该嵌入。

例如，Chroma 提供了一个数据加载器 `ImageLoader`，用于从本地文件系统加载图像。我们可以创建一个使用 `ImageLoader` 的集合：

```python
import chromadb
from chromadb.utils.data_loaders import ImageLoader
from chromadb.utils.embedding_functions import OpenCLIPEmbeddingFunction

client = chromadb.Client()

data_loader = ImageLoader()
embedding_function = OpenCLIPEmbeddingFunction()

collection = client.create_collection(
    name='multimodal_collection',
    embedding_function=embedding_function,
    data_loader=data_loader
)
```

现在，我们可以使用 `.add` 方法将记录添加到此集合中。集合的数据加载器将使用 URI 获取图像，使用 `OpenCLIPEmbeddingFunction` 对其进行嵌入，并将嵌入存储在 Chroma 中。

```python
collection.add(
    ids=["id1", "id2"],
    uris=["path/to/file/1", "path/to/file/2"]
)
```

如果你使用的嵌入函数是多模态的（例如 `OpenCLIPEmbeddingFunction`），你也可以将文本添加到同一个集合中：

```python
collection.add(
    ids=["id3", "id4"],
    documents=["This is a document", "This is another document"]
)
```

## 查询

你可以使用该集合支持的任何模态对多模态集合进行查询。例如，可以使用图像进行查询：

```python
results = collection.query(
    query_images=[...] # 表示图像的 NumPy 数组列表
)
```

或者使用文本进行查询：

```python
results = collection.query(
    query_texts=["This is a query document", "This is another query document"]
)
```

如果集合设置了数据加载器，你也可以使用引用了其他位置存储的支持模态的 URI 进行查询：

```python
results = collection.query(
    query_uris=[...] # 表示数据 URI 的字符串列表
)
```

此外，如果集合设置了数据加载器，并且有 URI 可用，你可以在查询结果中包含数据：

```python
results = collection.query(
    query_images=[...], # 表示图像的 NumPy 数组列表
    include=['data']
)
```

这将自动为任何可用的 URI 调用数据加载器，并将数据包含在结果中。`uris` 也可以作为一个 `include` 字段包含在内。

## 更新

你可以通过指定数据模态的方式更新多模态集合，这与 `add` 方法类似。目前支持图像：

```python
collection.update(
    ids=['id1', 'id2', 'id3'],
    images=[...] # 表示图像的 NumPy 数组列表
)
```

请注意，具有特定 ID 的条目一次只能关联一种模态。更新操作会覆盖现有的模态。例如，原本包含文本的条目，如果使用图像进行更新，那么更新后该条目将不再包含原来的文本。