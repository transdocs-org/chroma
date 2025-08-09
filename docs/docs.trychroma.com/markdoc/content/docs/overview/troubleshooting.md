# 故障排除

本页面列出了常见问题及解决方法。

如果你的问题没有列在这里，请查看 [Github Issues](https://github.com/chroma-core/chroma/issues)。

## 在 NextJS 项目中使用 Chroma JS-Client 时出错

我们的默认嵌入函数使用了 @huggingface/transformers，它依赖的二进制文件无法被 NextJS 正确打包。如果你遇到这个问题，可以使用 `withChroma` 插件包裹你的 `nextConfig`（在 `next.config.ts` 中），该插件会添加必要的设置以解决打包问题。

```typescript
import type { NextConfig } from "next";
import { withChroma } from "chromadb";

const nextConfig: NextConfig = {
  /* 配置选项 */
};

export default withChroma(nextConfig);
```

## 无法以连续的二维数组返回结果。可能是 ef 或 M 值太小

当 HNSW 索引由于其结构和你的数据而无法检索到请求的查询结果数量时，就会出现此错误。解决方法是减少每次查询请求的结果数量（n_result），或增加 HNSW 参数 `M`、`ef_construction` 和 `ef_search`。你可以[在此](/docs/collections/configure)阅读更多关于 HNSW 配置的信息。

## 使用 .get 或 .query 时，嵌入值显示为 `None`

这实际上不是错误。嵌入值通常较大且传输成本较高，大多数应用不会使用这些底层嵌入值，因此默认情况下 Chroma 不会返回它们。

如需返回这些数据，请在查询中添加 `include=["embeddings", "documents", "metadatas", "distances"]` 以返回所有信息。

例如：

```python
results = collection.query(
    query_texts="hello",
    n_results=1,
    include=["embeddings", "documents", "metadatas", "distances"],
)
```

{% note type="tip" %}
我们可能会将 `None` 改为其他提示信息，以更清晰地说明为何未返回嵌入值。
{% /note %}

## 运行 `pip install chromadb` 时出现构建错误

如果在安装过程中遇到如下错误：

```
Failed to build hnswlib
ERROR: Could not build wheels for hnswlib, which is required to install pyproject.toml-based projects
```

请尝试社区提供的以下建议 [链接](https://github.com/chroma-core/chroma/issues/221)：

1. 如果你遇到错误：`clang: error: the clang compiler does not support '-march=native'`，请设置环境变量：`export HNSWLIB_NO_NATIVE=1`
2. 如果使用 Mac，请安装或更新 Xcode 开发工具：`xcode-select --install`
3. 如果使用 Windows，请尝试[这些步骤](https://github.com/chroma-core/chroma/issues/250#issuecomment-1540934224)

## SQLite

Chroma 要求 SQLite 版本 > 3.35。如果你遇到 SQLite 版本过低的问题，请尝试以下方法：

1. 安装最新版本的 Python 3.10，因为较低版本的 Python 可能附带的是旧版 SQLite。
2. 如果使用 Linux，可以安装 pysqlite3-binary：`pip install pysqlite3-binary`，然后在运行 Chroma 之前按照[此指南](https://gist.github.com/defulmere/8b9695e415a44271061cc8e272f3c300)替换默认的 sqlite3 库。你也可以从源码编译 SQLite，并用最新版本替换 Python 安装目录中的库，详见[此文档](https://github.com/coleifer/pysqlite3#building-a-statically-linked-library)。
3. 如果使用 Windows，可以从 https://www.sqlite.org/download.html 手动下载最新版 SQLite，并将 Python 安装目录中 DLLs 文件夹内的 DLL 文件替换为最新版本。可通过在 Python 中运行 `os.path.dirname(sys.executable)` 找到你的 Python 安装路径。
4. 如果使用基于 Debian 的 Docker 容器，旧版 Debian 可能没有最新版 SQLite，请使用 `bookworm` 或更高版本。

## 非法指令（核心已转储）

如果你在使用 Docker 时遇到类似错误，可能是你在不同 CPU 架构的机器上构建了镜像。请尝试在你要运行它的机器上重新构建 Docker 镜像。

## 我的数据目录过大

如果你在 v0.5.6 之前的版本中使用过 Chroma，可以通过[清理数据库](/reference/cli#vacuuming)显著减小数据库体积。清理一次后，自动清理功能（v0.5.6 中的新功能）将被启用，从而保持数据库大小在合理范围内。