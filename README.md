# Paper Library

Paper Library 是一个本地论文库网页工具，用来导入、解析、整理和管理 PDF 论文。它默认运行在本机浏览器里，论文记录保存在浏览器 IndexedDB 中，PDF 副本保存在项目或安装包目录下的 `library-files` 文件夹中。

## 主要功能

- 导入单个或多个 PDF 文件。
- 导入整个文件夹中的 PDF。
- 从 ChatGPT、网页或笔记文本中识别 PDF / arXiv 链接，下载并入库。
- 解析论文标题、摘要、作者、年份、DOI、arXiv ID、关键词、参考文献数量、页数和论文图片。
- 使用本地 Argos Translate 将英文标题和摘要翻译为中文，不消耗在线 API 额度。
- 在左侧快速浏览最近导入的论文，在主区域进行论文库管理。
- 支持搜索、分类筛选、排序、分页、批量分类和批量删除。
- 支持查看论文详情、打开 PDF、打开论文副本所在文件夹、打开来源链接。
- 支持浅色 / 深色模式切换，支持中文 / English 界面切换。

## Windows 开箱即用版本

如果你只想在其他 Windows 电脑上使用，不需要安装 Python。把下面这个文件夹或压缩包复制到目标电脑即可：

```text
dist\PaperLibrary
dist\PaperLibrary-Windows-Portable.zip
```

在目标电脑上解压后，双击运行：

```text
PaperLibrary.exe
```

程序会启动本地服务，并打开本机网页。PDF 副本会保存在安装包目录下的 `library-files` 文件夹中。

注意：不要只复制 `PaperLibrary.exe` 一个文件，必须复制整个 `dist\PaperLibrary` 文件夹，因为 `_internal` 目录里包含运行所需的依赖、网页文件和本地翻译模型。

## 源码运行

### 1. 初始化环境

第一次在开发电脑上运行：

```powershell
setup.bat
```

脚本会自动完成：

- 检查 Python 3。
- 创建项目本地虚拟环境 `.venv`。
- 安装 `requirements.txt` 中的依赖。
- 创建 `.env`。
- 下载并安装本地英译中 Argos 模型到 `.argos`。

### 2. 启动项目

初始化完成后运行：

```powershell
start.bat
```

默认访问地址：

```text
http://localhost:8000
```

如果页面提示“无法连接本地解析服务”，请确认已经启动 `PaperLibrary.exe`，或者在源码目录运行：

```powershell
.\.venv\Scripts\python server.py
```

## 手动运行

如果不使用批处理脚本，也可以手动执行：

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python install_argos_zh.py
.\.venv\Scripts\python server.py
```

然后打开：

```text
http://localhost:8000
```

## 配置

`.env.example` 当前配置如下：

```env
PAPER_TRANSLATION_PROVIDER=argos
PORT=8000
```

- `PAPER_TRANSLATION_PROVIDER=argos`：使用本地 Argos Translate 翻译。
- `PORT=8000`：本地服务端口。

如果需要修改端口，请复制 `.env.example` 为 `.env` 后修改 `PORT`。

## 生成 Windows 安装包 / 便携包

完成 `setup.bat` 后运行：

```powershell
build_exe.bat
```

或：

```powershell
powershell -ExecutionPolicy Bypass -File .\build_exe.ps1
```

生成结果：

```text
dist\PaperLibrary\PaperLibrary.exe
```

发布给其他 Windows 电脑时，请压缩或复制整个目录：

```text
dist\PaperLibrary
```

当前打包脚本会使用 PyInstaller，并把网页文件、`.env.example` 和 `.argos` 本地翻译模型一起放入安装包。这样目标电脑不需要额外安装 Python。

## 数据保存位置

开发模式下：

- 论文记录：浏览器 IndexedDB。
- PDF 副本：项目目录下的 `library-files`。

打包版本下：

- 论文记录：目标电脑浏览器 IndexedDB。
- PDF 副本：`dist\PaperLibrary\library-files`，或用户解压后的同名安装目录下。

清空浏览器数据会影响 IndexedDB 中的论文记录；删除 `library-files` 会影响打开 PDF 副本和打开所在文件夹功能。

## 项目结构

```text
index.html              网页结构
styles.css              页面样式
script.js               前端逻辑和 IndexedDB 论文库
server.py               本地 HTTP 服务、PDF 解析、下载和打开文件夹
requirements.txt        Python 依赖
install_argos_zh.py     安装本地英译中模型
setup.bat / setup.ps1   初始化开发环境
start.bat / start.ps1   启动本地服务
build_exe.bat / .ps1    生成 Windows 便携包
PaperLibrary.spec       PyInstaller 配置
```

## 不建议提交的文件

以下文件或目录通常是本机生成内容，不建议提交到 Git：

```text
.env
.venv
.argos
dist
build
library-files
paper-library-port.json
```

