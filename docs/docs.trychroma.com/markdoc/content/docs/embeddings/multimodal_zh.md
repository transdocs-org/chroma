# 多模态

{% Banner type="note" %}
多模态支持目前仅在 Python 中可用。Javascript/Typescript 支持即将推出！
{% /Banner %}

你可以创建多模态的 Chroma 集合；这些集合既可以存储多种模态的数据，也可以通过多种模态的数据进行查询。

[在 Colab 中尝试](https://githubtocolab.com/chroma-core/chroma/blob/main/examples/multimodal/multimodal_retrieval.ipynb)

## 多模态嵌入函数

Chroma 支持多模态嵌入函数，可以将多个模态的数据嵌入到一个嵌入空间中。

Chroma 内置了 OpenCLIP 嵌入函数，支持文本和图像：

```python
from chromadb.utils.embedding_functions import OpenCLIPEmbeddingFunction
embedding_function = OpenCLIPEmbeddingFunction()
```

## 添加多模态数据和数据加载器

你可以直接将不同于文本模态的嵌入数据添加到 Chroma 中。目前支持图像：

```python
collection.add(
    ids=['id1', 'id2', 'id3'],
    images=[[1.0, 1.1, 2.1, ...], ...] # 表示图像的 numpy 数组列表
)
```

与存储在 Chroma 中的文本文档不同，我们不会存储你的原始图像或其他模态的数据。相反，对于每条多模态记录，你可以指定一个存储原始数据的 URI 和一个**数据加载器**。对于你添加的每个 URI，Chroma 将使用数据加载器检索原始数据，对其进行嵌入，并存储该嵌入。

例如，Chroma 提供了一个用于从本地文件系统加载图像的数据加载器 `ImageLoader`。我们可以创建一个配置了 `ImageLoader` 的集合：

```python
import chromadb
from chromadb.utils.data_loaders import ImageLoader
from chromadb.utils.embedding_functions import OpenCLIPEmbeddingFunction

client = chromadb.Client()

data_loader = ImageLoader()
embedding_function = OpenCLIPEmbeddingFunction()
```

```python
collection = client.create_collection(
    name='multimodal_collection',
    embedding_function=embedding_function,
    data_loader=data_loader
)
```

现在，我们可以使用 `.add` 方法向此集合中添加记录。集合的数据加载器会通过这些 URI 获取图像，然后使用 `OpenCLIPEmbeddingFunction` 对其进行嵌入，并将生成的嵌入存储在 Chroma 中。

```python
collection.add(
    ids=["id1", "id2"],
    uris=["path/to/file/1", "path/to/file/2"]
)
```

如果你使用的嵌入函数是多模态的（例如 `OpenCLIPEmbeddingFunction`），你也可以向同一个集合中添加文本数据：

```python
collection.add(
    ids=["id3", "id4"],
    documents=["这是一篇文档", "这是另一篇文档"]
)
```

## 查询

你可以使用该多模态集合所支持的任意模态进行查询。例如，使用图像进行查询：

```python
results = collection.query(
    query_images=[...] # 表示图像的 numpy 数组列表
)
```

或者使用文本进行查询：

```python
results = collection.query(
    query_texts=["这是一个查询文档", "这是另一个查询文档"]
)
```

如果集合设置了数据加载器，你也可以使用引用了其他位置存储的支持模态数据的 URI 进行查询：

```python
results = collection.query(
    query_uris=[...] # 表示数据 URI 的字符串列表
)
```

此外，如果集合设置了数据加载器，并且存在可用的 URI，你还可以在查询结果中包含对应的数据：

```python
results = collection.query(
    query_images=[...], # 表示图像的 numpy 数组列表
    include=['data']
)
```

这样会自动调用数据加载器加载任何可用 URI 对应的数据，并将这些数据包含在查询结果中。`uris` 也可以作为 `include` 的一个字段包含在结果中。

## 更新

您可以像使用 `add` 方法一样，通过指定数据模态来更新多模态集合。目前支持图像模态：

```python
collection.update(
    ids=['id1', 'id2', 'id3'],
    images=[...] # 表示图像的 NumPy 数组列表
)
```

请注意，具有特定 ID 的条目一次只能关联一种模态。更新操作会覆盖现有的模态，例如，一个原本包含文本的条目如果通过图像进行更新，则更新后将不再保留原来的文本内容。