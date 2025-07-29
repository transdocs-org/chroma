# 故障排除

本页面列出了常见问题及其解决方法。

如果你没有在此页面上找到你的问题，请查看 [Github Issues](https://github.com/chroma-core/chroma/issues)。

## 在 NextJS 项目中使用 Chroma JS-Client 失败

我们的默认嵌入函数使用了 @huggingface/transformers，它依赖的二进制文件无法被 NextJS 正常打包。如果你遇到此问题，可以使用 `withChroma` 插件包裹你的 `nextConfig`（在 `next.config.ts` 文件中），该插件会添加必要的配置以解决打包问题。

```typescript
import type { NextConfig } from "next";
import { withChroma } from "chromadb";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withChroma(nextConfig);
```

## 无法返回连续的二维数组结果。可能是 ef 或 M 太小

当 HNSW 索引由于其结构或你的数据而无法为查询检索到所请求数量的结果时，就会出现此错误。解决方法是减少查询请求的结果数量（n_result），或者增加 HNSW 参数 `M`、`ef_construction` 和 `ef_search`。你可以在此处了解更多关于 [HNSW 配置](/docs/collections/configure) 的信息。

## 使用 .get 或 .query 时，嵌入向量返回 `None`

这实际上并不是一个错误。嵌入向量通常较大且传输成本较高，默认情况下，Chroma 不会返回它们，因为大多数应用程序并不使用底层的嵌入向量数据。

如果你希望返回嵌入向量，请在查询时添加参数 `include=["embeddings", "documents", "metadatas", "distances"]` 以获取所有信息。

例如：

```python
results = collection.query(
    query_texts="hello",
    n_results=1,
    include=["embeddings", "documents", "metadatas", "distances"],
)
```

{% note type="tip" %}
我们可能会将 `None` 更换为其他提示信息，以更清晰地说明为何未返回嵌入向量。
{% /note %}

## 运行 `pip install chromadb` 时出现构建错误

如果你在安装过程中遇到类似以下错误：

```
Failed to build hnswlib
ERROR: Could not build wheels for hnswlib, which is required to install pyproject.toml-based projects
```

可以尝试参考社区提供的以下解决方法：[参考链接](https://github.com/chroma-core/chroma/issues/221)

1. 如果你遇到错误：`clang: error: the clang compiler does not support '-march=native'`，请设置环境变量：`export HNSWLIB_NO_NATIVE=1`
2. 如果使用 Mac，请安装或更新 Xcode 开发工具：`xcode-select --install`
3. 如果使用 Windows，请尝试[这些步骤](https://github.com/chroma-core/chroma/issues/250#issuecomment-1540934224)

## SQLite

Chroma 需要 SQLite 版本高于 3.35，如果你遇到 SQLite 版本过低的问题，请尝试以下解决方案：

1. 安装最新版本的 Python 3.10，有时较低版本的 Python 会附带较旧版本的 SQLite。
2. 如果你使用的是 Linux 系统，可以安装 pysqlite3-binary：`pip install pysqlite3-binary`，然后在运行 Chroma 之前按照[此指南](https://gist.github.com/defulmere/8b9695e415a44271061cc8e272f3c300)覆盖默认的 sqlite3 库。  
   或者，你也可以从源码编译 SQLite，并用最新版本替换 Python 安装目录中的库文件，具体步骤请参阅[这里](https://github.com/coleifer/pysqlite3#building-a-statically-linked-library)。
3. 如果你使用的是 Windows 系统，可以从 [https://www.sqlite.org/download.html](https://www.sqlite.org/download.html) 手动下载最新版本的 SQLite，并将你 Python 安装目录下的 DLLs 文件夹中的 sqlite3.dll 替换为最新版本。你可以在 Python 中运行 `os.path.dirname(sys.executable)` 来查找你的 Python 安装路径。
4. 如果你使用的是基于 Debian 的 Docker 容器，较旧的 Debian 版本没有最新版本的 SQLite，请使用 `bookworm` 或更高版本。

##  非法指令（核心已转储）

如果你在进行配置时遇到类似这样的错误，并且你正在使用 Docker——可能是因为你在一台 CPU 架构不同的机器上构建了镜像，而却在另一台机器上运行它。请尝试在你要运行它的机器上重新构建 Docker 镜像。

## 我的数据目录太大

如果你在 v0.5.6 之前的版本中使用过 Chroma，你可以通过[清理数据库](/reference/cli#vacuuming)来显著减小数据库体积。清理一次之后，自动清理（v0.5.6 中的新功能）将被启用，从而帮助你控制数据库的体积。