# Chroma

**Chroma 是一个开源的 AI 应用数据库**。Chroma 通过将知识、事实和技能模块化，使得构建 LLM 应用变得简单。

{% Banner type="tip" %}
刚接触 Chroma？请查看 [入门指南](./getting-started)
{% /Banner %}

{% MarkdocImage lightSrc="/computer-light.png" darkSrc="/computer-dark.png" alt="Chroma 计算机" /%}

Chroma 提供了检索所需的一切功能：

- 存储嵌入向量及其元数据
- 向量搜索
- 全文搜索
- 文档存储
- 元数据过滤
- 多模态检索

Chroma 可以作为服务器运行，并提供 `Python` 和 `JavaScript/TypeScript` 的客户端 SDK。请查看 [Colab 演示](https://colab.research.google.com/drive/1QEzFyqnoFxq7LUGyP1vzR4iLt9PpCDXv?usp=sharing)（是的，它也可以在 Jupyter Notebook 中运行）。

Chroma 使用 [Apache 2.0](https://github.com/chroma-core/chroma/blob/main/LICENSE) 许可证进行授权。

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

| 语言      | 客户端                                                                                                                      |
|-----------|-----------------------------------------------------------------------------------------------------------------------------|
| Python    | [`chromadb`](https://pypistats.org/packages/chromadb)（由 Chroma 提供）                                                       |
| JavaScript| [`chromadb`](https://www.npmjs.com/package/chromadb)（由 Chroma 提供）                                                       |
| Ruby      | [由 @mariochavez 提供](https://github.com/mariochavez/chroma)                                                                  |
| Java      | [由 @t_azarov 提供](https://github.com/amikos-tech/chromadb-java-client)                                                       |
| Java      | [由 @locxngo 提供](https://github.com/locxngo/chroma-client)（支持 Java 17+，ChromaAPI V2）                                     |
| Go        | [由 @t_azarov 提供](https://github.com/amikos-tech/chroma-go)                                                                  |
| C#/.NET   | [由 @cincuranet, @ssone95, @microsoft 提供](https://github.com/ssone95/ChromaDB.Client)                                        |
| Rust      | [由 @Anush008 提供](https://crates.io/crates/chromadb)                                                                         |
| Elixir    | [由 @3zcurdia 提供](https://hex.pm/packages/chroma/)                                                                           |
| Dart      | [由 @davidmigloz 提供](https://pub.dev/packages/chromadb)                                                                      |
| PHP       | [由 @CodeWithKyrian 提供](https://github.com/CodeWithKyrian/chromadb-php)，[由 @pari 提供](https://github.com/pari/phpMyChroma) |
| PHP (Laravel) | [由 @HelgeSverre 提供](https://github.com/helgeSverre/chromadb)                                                              |
| Clojure   | [由 @levand 提供](https://github.com/levand/clojure-chroma-client)                                                             |
| R         | [由 @cynkra 提供](https://cynkra.github.io/rchroma/)                                                                           |
| C++       | [由 @BlackyDrum 提供](https://github.com/BlackyDrum/chromadb-cpp)                                                              |

{% br %}{% /br %}

我们欢迎为其他语言提供 [贡献](./contributing)！