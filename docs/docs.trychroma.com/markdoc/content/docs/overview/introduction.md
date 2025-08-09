# Chroma

**Chroma 是一个开源的 AI 应用数据库**。Chroma 通过让知识、事实和技能可插拔的方式，使构建 LLM 应用变得更加简单。

{% Banner type="tip" %}
初次接触 Chroma？请查看 [入门指南](./getting-started)
{% /Banner %}

{% MarkdocImage lightSrc="/computer-light.png" darkSrc="/computer-dark.png" alt="Chroma Computer" /%}

Chroma 提供了检索所需的一切功能：

- 存储嵌入向量及其元数据
- 向量搜索
- 全文搜索
- 文档存储
- 元数据过滤
- 多模态检索

Chroma 可作为服务器运行，并提供 `Python` 和 `JavaScript/TypeScript` 的客户端 SDK。查看 [Colab 演示](https://colab.research.google.com/drive/1QEzFyqnoFxq7LUGyP1vzR4iLt9PpCDXv?usp=sharing)（是的，它也可以在 Jupyter Notebook 中运行）。

Chroma 使用 [Apache 2.0](https://github.com/chroma-core/chroma/blob/main/LICENSE) 许可证发布。

### Python

在 Python 中，Chroma 可以直接在 Python 脚本中运行，也可以作为服务器运行。使用以下命令安装 Chroma：

```shell
pip install chromadb
```

### JavaScript/TypeScript

在 JavaScript 和 TypeScript 中，使用 Chroma JS/TS 客户端连接到 Chroma 服务器。使用你喜欢的包管理器安装 Chroma：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="npm" %}
```terminal
npm install chromadb @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="pnpm" %}
```terminal
pnpm add chromadb @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="yarn" %}
```terminal
yarn add chromadb @chroma-core/default-embed
```
{% /Tab %}

{% Tab label="bun" %}
```terminal
bun add chromadb @chroma-core/default-embed
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

继续阅读完整的 [入门指南](./getting-started)。

***

## 语言客户端

| 语言       | 客户端                                                                                                                       |
|------------|------------------------------------------------------------------------------------------------------------------------------|
| Python     | [`chromadb`](https://pypistats.org/packages/chromadb)（由 Chroma 提供）                                                       |
| JavaScript | [`chromadb`](https://www.npmjs.com/package/chromadb)（由 Chroma 提供）                                                        |
| Ruby       | [来自 @mariochavez](https://github.com/mariochavez/chroma)                                                                    |
| Java       | [来自 @t_azarov](https://github.com/amikos-tech/chromadb-java-client)                                                         |
| Java       | [来自 @locxngo](https://github.com/locxngo/chroma-client)（支持 Java 17+ 和 ChromaAPI V2）                                    |
| Go         | [来自 @t_azarov](https://github.com/amikos-tech/chroma-go)                                                                    |
| C#/.NET    | [来自 @cincuranet, @ssone95, @microsoft](https://github.com/ssone95/ChromaDB.Client)                                          |
| Rust       | [来自 @Anush008](https://crates.io/crates/chromadb)                                                                           |
| Elixir     | [来自 @3zcurdia](https://hex.pm/packages/chroma/)                                                                             |
| Dart       | [来自 @davidmigloz](https://pub.dev/packages/chromadb)                                                                       |
| PHP        | [来自 @CodeWithKyrian](https://github.com/CodeWithKyrian/chromadb-php)，[来自 @pari](https://github.com/pari/phpMyChroma)     |
| PHP (Laravel) | [来自 @HelgeSverre](https://github.com/helgeSverre/chromadb)                                                                |
| Clojure    | [来自 @levand](https://github.com/levand/clojure-chroma-client)                                                               |
| R          | [来自 @cynkra](https://cynkra.github.io/rchroma/)                                                                             |
| C++        | [来自 @BlackyDrum](https://github.com/BlackyDrum/chromadb-cpp)                                                                |

{% br %}{% /br %}

我们欢迎为其他语言提供 [贡献](./contributing)！