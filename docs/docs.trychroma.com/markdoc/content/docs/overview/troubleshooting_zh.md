# 常见问题排查

本页面列出了常见的注意事项或问题及其解决方法。

如果您没有在这里找到您的问题，请查看 [Github Issues](https://github.com/chroma-core/chroma/issues)。

## NextJS 项目中 Chroma JS-Client 出现错误

我们默认的嵌入函数使用了 @huggingface/transformers，它依赖的二进制文件无法被 NextJS 正确打包。如果您遇到此问题，可以在 `next.config.ts` 中使用 `withChroma` 插件包裹您的 `nextConfig`，该插件会添加必要的配置以解决打包问题。

```typescript
import type { NextConfig } from "next";
import { withChroma } from "chromadb";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withChroma(nextConfig);
```

## 无法返回连续的二维数组结果。可能是 ef 或 M 太小

当 HNSW 索引由于其结构和您的数据而无法检索到请求的查询结果数量时，就会出现此错误。解决方法是减少每次查询请求的结果数量（n_result），或增加 HNSW 参数 `M`、`ef_construction` 和 `ef_search`。您可以 [点击此处](/docs/collections/configure) 了解更多关于 HNSW 的配置信息。

## 使用 .get 或 .query 方法时，嵌入向量显示为 `None`

这实际上并不是一个错误。由于嵌入向量通常较大且传输成本较高，默认情况下 Chroma 不会返回它们。大多数应用程序并不需要使用这些底层嵌入向量，因此默认不返回。

如需返回它们，请在查询中添加 `include=["embeddings", "documents", "metadatas", "distances"]` 以获取所有信息。

例如：

```python
results = collection.query(
    query_texts="hello",
    n_results=1,
    include=["embeddings", "documents", "metadatas", "distances"],
)
```

{% note type="tip" %}
我们可能会将 `None` 改为其他内容，以更清晰地说明为何未返回。
{% /note %}

## 运行 `pip install chromadb` 时出现构建错误

如果在安装过程中遇到类似以下错误：

```
Failed to build hnswlib
ERROR: Could not build wheels for hnswlib, which is required to install pyproject.toml-based projects
```

请尝试社区提供的以下建议 [点击此处](https://github.com/chroma-core/chroma/issues/221)：

1. 如果遇到错误：`clang: error: the clang compiler does not support '-march=native'`，请设置环境变量：`export HNSWLIB_NO_NATIVE=1`
2. 如果使用 Mac，请安装/更新 xcode 开发工具：`xcode-select --install`
3. 如果使用 Windows，请参考 [这些步骤](https://github.com/chroma-core/chroma/issues/250#issuecomment-1540934224)

## SQLite

Chroma 要求 SQLite 版本 > 3.35，如果您遇到 SQLite 版本过低的问题，请尝试以下方法：

1. 安装最新版本的 Python 3.10，有时较低版本的 Python 会自带旧版 SQLite。
2. 如果使用 Linux 系统，可以安装 pysqlite3-binary：`pip install pysqlite3-binary`，然后按照 [这里](https://gist.github.com/defulmere/8b9695e415a44271061cc8e272f3c300) 的步骤在运行 Chroma 之前覆盖默认的 sqlite3 库。或者，您也可以从源码编译 SQLite，并按照 [这里](https://github.com/coleifer/pysqlite3#building-a-statically-linked-library) 的说明将 Python 安装中的库替换为最新版本。
3. 如果使用 Windows，可以手动从 https://www.sqlite.org/download.html 下载最新版本的 SQLite，并将其替换到 Python 安装目录下的 DLLs 文件夹中。您可以在 Python 中运行 `os.path.dirname(sys.executable)` 来查找您的 Python 安装路径。
4. 如果使用基于 Debian 的 Docker 容器，旧版本的 Debian 没有更新的 SQLite，请使用 `bookworm` 或更高版本。

## 非法指令（核心已转储）

如果您在使用 Docker 时遇到类似错误，可能是您在不同的 CPU 架构机器上构建了镜像。请尝试在您运行镜像的机器上重新构建 Docker 镜像。

## 我的数据目录太大

如果您在使用 Chroma v0.5.6 之前的版本，可以通过 [vacuum 命令](/reference/cli#vacuuming) 显着减小数据库体积。执行一次 vacuum 后，自动清理（v0.5.6 中新增功能）将被启用，并持续控制数据库大小。