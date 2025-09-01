# 安装 Chroma CLI

Chroma CLI 可以让你在本地机器上运行 Chroma 服务器、安装示例应用、浏览你的集合、与你的 Chroma Cloud 数据库进行交互，以及其他更多操作！

当你全局安装我们的 Python 或 JavaScript 包时，Chroma CLI 会被自动安装。

如果你不使用我们的任何一个包，你仍然可以通过 `cURL`（或 Windows 上的 `iex`）将 CLI 作为独立程序安装。

## Python

你可以使用 `pip` 安装 Chroma：

```terminal
pip install chromadb
```

如果你的机器不允许全局安装 `pip` 包，可以使用 `pipx` 来安装 Chroma CLI：

```terminal
pipx install chromadb
```

## JavaScript


{% TabbedUseCaseCodeBlock language="Terminal" %}


{% Tab label="yarn" %}

```terminal
yarn global add chromadb 
```

{% /Tab %}


{% Tab label="npm" %}

```terminal
npm install -g chromadb
```

{% /Tab %}


{% Tab label="pnpm" %}

```terminal
pnpm add -g chromadb 
```

{% /Tab %}


{% Tab label="bun" %}

```terminal
bun add -g chromadb 
```

{% /Tab %}


{% /TabbedUseCaseCodeBlock %}

## 全局安装

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="cURL" %}
```terminal
curl -sSL https://raw.githubusercontent.com/chroma-core/chroma/main/rust/cli/install/install.sh | bash 
```
{% /Tab %}

{% Tab label="Windows" %}
```terminal
iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/chroma-core/chroma/main/rust/cli/install/install.ps1'))
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}