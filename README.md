# Paper Library

一个本地论文库网页，可以导入 PDF、解析标题/摘要/图片、保存原始 PDF，并在浏览器里管理论文记录。

## 启动

### Windows 开箱使用

第一次使用：

```powershell
setup.bat
```

之后启动：

```powershell
start.bat
```

脚本会自动创建项目本地 `.venv`、安装依赖、下载本地英译中模型，并打开 `http://localhost:8000`。

### 手动启动

如果你不想用脚本，也可以运行：

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
Copy-Item .env.example .env
.\.venv\Scripts\python install_argos_zh.py
.\.venv\Scripts\python server.py
```

然后打开 `http://localhost:8000`。

不要提交 `.env`、`.venv` 和 `.argos`。

## 打包成 EXE

在已经完成 `setup.bat` 之后运行：

```powershell
build_exe.bat
```

生成结果在：

```text
dist\PaperLibrary\PaperLibrary.exe
```

把整个 `dist\PaperLibrary` 文件夹复制到其他 Windows 电脑，双击 `PaperLibrary.exe` 即可运行，不需要安装 Python。

## PDF 论文解析

页面支持选择本地 PDF，解析标题、摘要和最多 8 张论文图片，并把原始 PDF 保存到浏览器 IndexedDB。再次导入同一个 PDF 时会用 SHA-256 去重，不会重复入库。

解析完成后会默认用本地 Argos Translate 把英文标题和摘要翻译成中文，不消耗 API 额度。第一次需要运行 `python install_argos_zh.py` 下载英译中模型；模型装好后，翻译在本机完成。

导入过的论文会保存在浏览器本地 IndexedDB 中，可以切换查看、编辑标题和摘要、移除图片或删除记录。
