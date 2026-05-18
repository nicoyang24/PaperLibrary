import base64
import hashlib
import re
import json
import mimetypes
import os
import subprocess
import sys
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse
from urllib.request import Request, urlopen

import fitz


def app_root():
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


ROOT = app_root()
STATIC_ROOT = Path(getattr(sys, "_MEIPASS", ROOT))
ARGOS_HOME = ROOT / ".argos"
if not ARGOS_HOME.exists() and (STATIC_ROOT / ".argos").exists():
    ARGOS_HOME = STATIC_ROOT / ".argos"
PORT_FILE = STATIC_ROOT / "paper-library-port.json"
MAX_PDF_BYTES = 35 * 1024 * 1024
LIBRARY_FILES = ROOT / "library-files"
ALLOWED_LOCAL_PATHS = set()


def configure_argos_paths():
    os.environ.setdefault("XDG_CONFIG_HOME", str(ARGOS_HOME / "config"))
    os.environ.setdefault("XDG_DATA_HOME", str(ARGOS_HOME / "data"))
    os.environ.setdefault("XDG_CACHE_HOME", str(ARGOS_HOME / "cache"))
    os.environ.setdefault("ARGOS_STANZA_AVAILABLE", "0")
    os.environ.setdefault("ARGOS_CHUNK_TYPE", "MINISBD")


def load_dotenv():
    env_path = ROOT / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ[key.strip()] = value.strip().strip('"').strip("'")


def is_mostly_chinese(text):
    if not text:
        return False
    chinese_chars = len(re.findall(r"[\u4e00-\u9fff]", text))
    letters = len(re.findall(r"[A-Za-z]", text))
    return chinese_chars > 0 and chinese_chars >= letters


def translate_with_argos(text):
    configure_argos_paths()
    import argostranslate.translate

    if not text or is_mostly_chinese(text):
        return text

    installed_languages = argostranslate.translate.get_installed_languages()
    source_language = next((language for language in installed_languages if language.code == "en"), None)
    target_language = next((language for language in installed_languages if language.code in {"zh", "zt"}), None)
    if not source_language or not target_language:
        raise RuntimeError("未找到 Argos 英译中模型。请确认打包目录完整，或在源码模式运行 install_argos_zh.py。")

    translation = source_language.get_translation(target_language)
    return clean_text(translation.translate(text))


def translate_paper_fields(title, abstract):
    load_dotenv()
    configured_provider = os.environ.get("PAPER_TRANSLATION_PROVIDER", "argos").lower()
    provider = "none" if configured_provider == "none" else "argos"

    try:
        if provider == "none":
            raise RuntimeError("已关闭自动翻译。")
        translated = {
            "title": translate_with_argos(title),
            "abstract": translate_with_argos(abstract),
        }
        return {
            "title": clean_text(translated.get("title", "")) or title,
            "abstract": clean_text(translated.get("abstract", "")) or abstract,
            "translated": True,
            "translation_provider": provider,
            "translation_error": "",
        }
    except Exception as error:
        return {
            "title": title,
            "abstract": abstract,
            "translated": False,
            "translation_provider": provider,
            "translation_error": f"中文翻译暂不可用，已显示原文：{error}",
        }


def clean_text(text):
    return re.sub(r"\s+", " ", text or "").strip()


def extract_title(document):
    metadata_title = clean_text(document.metadata.get("title", ""))
    if metadata_title and len(metadata_title) > 6 and not metadata_title.lower().endswith(".pdf"):
        return metadata_title

    first_page = document[0]
    blocks = first_page.get_text("dict").get("blocks", [])
    spans = []
    for block in blocks:
        for line in block.get("lines", []):
            line_text = clean_text(" ".join(span.get("text", "") for span in line.get("spans", [])))
            if not line_text:
                continue
            size = max((span.get("size", 0) for span in line.get("spans", [])), default=0)
            bbox = line.get("bbox", [0, 0, 0, 0])
            if bbox[1] < first_page.rect.height * 0.48:
                spans.append({"text": line_text, "size": size, "y": bbox[1]})

    if not spans:
        return "未识别到标题"

    max_size = max(item["size"] for item in spans)
    title_lines = [
        item for item in spans
        if item["size"] >= max_size * 0.82 and not re.match(r"^(abstract|摘要|keywords?)\b", item["text"], re.I)
    ][:4]
    title = clean_text(" ".join(item["text"] for item in title_lines))
    return title or spans[0]["text"]


def extract_abstract(document):
    pages = [document[index].get_text("text") for index in range(min(4, document.page_count))]
    text = re.sub(r"[ \t]+", " ", "\n".join(pages))
    match = re.search(
        r"(?:^|\n)\s*(?:abstract|摘要)\s*[:：]?\s*(.+?)(?=(?:\n|\s{2,})\s*(?:keywords?|index terms|introduction|1\.?\s+introduction|关键词|引言)\b)",
        text,
        re.I | re.S,
    )
    if not match:
        match = re.search(r"(?:abstract|摘要)\s*[:：]?\s*(.{40,1200})", text, re.I | re.S)

    if not match:
        return "未识别到摘要。"

    abstract = clean_text(match.group(1))
    return abstract[:1800] if abstract else "未识别到摘要。"


def extract_images(document, limit=8):
    images = []
    seen = set()

    for page_index in range(document.page_count):
        page = document[page_index]
        for image_info in page.get_images(full=True):
            xref = image_info[0]
            if xref in seen:
                continue
            seen.add(xref)

            extracted = document.extract_image(xref)
            image_bytes = extracted.get("image", b"")
            width = extracted.get("width", 0)
            height = extracted.get("height", 0)
            ext = extracted.get("ext", "png")
            if not image_bytes or width < 120 or height < 90:
                continue

            mime = "image/jpeg" if ext.lower() in {"jpg", "jpeg"} else f"image/{ext.lower()}"
            encoded = base64.b64encode(image_bytes).decode("ascii")
            images.append({
                "src": f"data:{mime};base64,{encoded}",
                "page": page_index + 1,
                "width": width,
                "height": height,
            })
            if len(images) >= limit:
                return images

    return images


def parse_paper(file_bytes, file_name):
    document = fitz.open(stream=file_bytes, filetype="pdf")
    try:
        if document.page_count == 0:
            raise ValueError("PDF 没有可读取的页面。")
        return {
            "file_name": file_name,
            "page_count": document.page_count,
            "title": extract_title(document),
            "abstract": extract_abstract(document),
            "images": extract_images(document),
        }
    finally:
        document.close()


def enrich_paper_result(result):
    translation = translate_paper_fields(result["title"], result["abstract"])
    result["original_title"] = result["title"]
    result["original_abstract"] = result["abstract"]
    result["title"] = translation["title"]
    result["abstract"] = translation["abstract"]
    result["translated"] = translation["translated"]
    result["translation_provider"] = translation["translation_provider"]
    result["translation_error"] = translation["translation_error"]
    return result


def file_name_from_url(url):
    path_name = Path(unquote(urlparse(url).path)).name
    if path_name.lower().endswith(".pdf"):
        return path_name
    return "paper.pdf"


def safe_file_name(name):
    cleaned = re.sub(r'[\\/:*?"<>|]+', " ", name or "paper.pdf")
    cleaned = clean_text(cleaned).strip(". ")
    if not cleaned.lower().endswith(".pdf"):
        cleaned = f"{cleaned or 'paper'}.pdf"
    return cleaned


def save_pdf_copy(file_bytes, file_name):
    LIBRARY_FILES.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha256(file_bytes).hexdigest()
    target_name = f"{digest[:12]}-{safe_file_name(file_name)}"
    target = (LIBRARY_FILES / target_name).resolve()
    library_root = LIBRARY_FILES.resolve()
    if library_root not in target.parents:
        raise ValueError("Invalid PDF file path.")
    if not target.exists():
        target.write_bytes(file_bytes)
    return str(target)


def is_safe_library_path(path):
    try:
        resolved = Path(path).resolve()
        library_root = LIBRARY_FILES.resolve()
        return resolved.exists() and library_root in resolved.parents
    except Exception:
        return False


def is_safe_original_pdf_path(path):
    try:
        resolved = Path(path).resolve()
        return resolved.exists() and resolved.is_file() and resolved.suffix.lower() == ".pdf"
    except Exception:
        return False


def open_containing_folder(path):
    resolved = Path(path).resolve()
    if not is_safe_library_path(resolved) and not is_safe_original_pdf_path(resolved):
        raise ValueError("File is not a known local PDF.")

    if sys.platform.startswith("win"):
        import ctypes

        result = ctypes.windll.shell32.ShellExecuteW(
            None,
            "open",
            "explorer.exe",
            f'/select,"{resolved}"',
            None,
            1,
        )
        if result <= 32:
            raise OSError(f"Explorer failed to open the folder. ShellExecuteW returned {result}.")
    elif sys.platform == "darwin":
        subprocess.run(["open", "-R", str(resolved)], check=False)
    else:
        subprocess.run(["xdg-open", str(resolved.parent)], check=False)


def choose_local_pdf_paths(mode):
    import tkinter as tk
    from tkinter import filedialog

    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True)
    try:
      if mode == "folder":
          folder = filedialog.askdirectory(title="Select a folder containing PDF papers")
          if not folder:
              return []
          return [str(path) for path in Path(folder).rglob("*.pdf") if path.is_file()]

      paths = filedialog.askopenfilenames(
          title="Select PDF papers",
          filetypes=[("PDF files", "*.pdf"), ("All files", "*.*")],
      )
      return [str(Path(path)) for path in paths]
    finally:
      root.destroy()


def parse_local_pdf_path(path):
    resolved = Path(path).resolve()
    if not is_safe_original_pdf_path(resolved):
        raise ValueError("Selected file is not a valid PDF.")
    if str(resolved) not in ALLOWED_LOCAL_PATHS:
        raise ValueError("PDF path was not selected from this app session.")
    file_bytes = resolved.read_bytes()
    if len(file_bytes) > MAX_PDF_BYTES:
        raise ValueError("PDF file is larger than 35MB.")
    if not file_bytes.startswith(b"%PDF"):
        raise ValueError("Selected file is not a valid PDF.")

    result = parse_paper(file_bytes, resolved.name)
    result = enrich_paper_result(result)
    result["local_file_path"] = str(resolved)
    result["pdf_base64"] = base64.b64encode(file_bytes).decode("ascii")
    result["file_size"] = len(file_bytes)
    return result


def download_pdf(url):
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only http and https PDF links are supported.")

    request = Request(
        url,
        headers={
            "User-Agent": "PaperLibrary/1.0 (+local PDF importer)",
            "Accept": "application/pdf,*/*;q=0.8",
        },
    )
    with urlopen(request, timeout=30) as response:
        content_length = response.headers.get("Content-Length")
        if content_length and int(content_length) > MAX_PDF_BYTES:
            raise ValueError("PDF file is larger than 35MB.")

        chunks = []
        total = 0
        while True:
            chunk = response.read(1024 * 1024)
            if not chunk:
                break
            total += len(chunk)
            if total > MAX_PDF_BYTES:
                raise ValueError("PDF file is larger than 35MB.")
            chunks.append(chunk)

    file_bytes = b"".join(chunks)
    if not file_bytes.startswith(b"%PDF"):
        raise ValueError("The link did not return a valid PDF file.")
    return file_bytes


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_ROOT), **kwargs)

    def do_POST(self):
        if self.path == "/api/paper":
            self.handle_paper()
            return
        if self.path == "/api/paper-url":
            self.handle_paper_url()
            return
        if self.path == "/api/open-folder":
            self.handle_open_folder()
            return
        if self.path == "/api/select-local-papers":
            self.handle_select_local_papers()
            return
        if self.path == "/api/paper-path":
            self.handle_paper_path()
            return

        self.send_error(404, "Not found")

    def do_GET(self):
        if self.path == "/api/status":
            self.send_json({"ok": True})
            return

        super().do_GET()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def handle_paper(self):
        content_type = self.headers.get("Content-Type", "")
        boundary_match = re.search(r"boundary=(.+)", content_type)
        if "multipart/form-data" not in content_type or not boundary_match:
            self.send_json({"error": "请上传 multipart/form-data 格式的 PDF 文件。"}, status=400)
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            self.send_json({"error": "上传文件为空。"}, status=400)
            return
        if content_length > MAX_PDF_BYTES:
            self.send_json({"error": "PDF 文件过大，请选择 35MB 以内的文件。"}, status=413)
            return

        body = self.rfile.read(content_length)
        boundary = boundary_match.group(1).strip().strip('"').encode("utf-8")
        marker = b"--" + boundary
        file_name = "paper.pdf"
        file_bytes = b""

        for part in body.split(marker):
            if b'name="paper"' not in part:
                continue
            header, _, content = part.partition(b"\r\n\r\n")
            name_match = re.search(br'filename="([^"]+)"', header)
            if name_match:
                file_name = name_match.group(1).decode("utf-8", errors="replace")
            file_bytes = content.rsplit(b"\r\n", 1)[0].rstrip(b"--")
            break

        if not file_bytes:
            self.send_json({"error": "没有读取到 PDF 文件。"}, status=400)
            return
        if not file_bytes.startswith(b"%PDF"):
            self.send_json({"error": "请选择有效的 PDF 文件。"}, status=400)
            return

        try:
            result = parse_paper(file_bytes, file_name)
        except Exception as error:
            self.send_json({"error": f"PDF 解析失败：{error}"}, status=500)
            return

        result = enrich_paper_result(result)
        result["local_file_path"] = save_pdf_copy(file_bytes, file_name)
        self.send_json(result)

    def handle_paper_url(self):
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            self.send_json({"error": "Missing PDF URL."}, status=400)
            return
        if content_length > 1024 * 1024:
            self.send_json({"error": "Request body is too large."}, status=413)
            return

        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
            url = clean_text(payload.get("url", ""))
            file_name = clean_text(payload.get("file_name", "")) or file_name_from_url(url)
            if not url:
                raise ValueError("Missing PDF URL.")
            file_bytes = download_pdf(url)
            result = parse_paper(file_bytes, file_name)
        except Exception as error:
            message = str(error) or repr(error)
            self.send_json({"error": f"PDF link import failed: {message}"}, status=500)
            return

        result = enrich_paper_result(result)
        result["source_url"] = url
        result["local_file_path"] = save_pdf_copy(file_bytes, file_name)
        result["pdf_base64"] = base64.b64encode(file_bytes).decode("ascii")
        result["file_size"] = len(file_bytes)
        self.send_json(result)

    def handle_open_folder(self):
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            self.send_json({"error": "Missing file path."}, status=400)
            return
        if content_length > 8192:
            self.send_json({"error": "Request body is too large."}, status=413)
            return

        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
            local_file_path = clean_text(payload.get("local_file_path", ""))
            if not local_file_path:
                raise ValueError("Missing file path.")
            open_containing_folder(local_file_path)
        except Exception as error:
            message = str(error) or repr(error)
            self.send_json({"error": f"Could not open folder: {message}"}, status=500)
            return

        self.send_json({"ok": True})

    def send_json(self, payload, status=200):
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store" if self.path.startswith("/api/") else "public, max-age=300")
        super().end_headers()


if __name__ == "__main__":
    load_dotenv()
    preferred_port = int(os.environ.get("PORT", "8000"))
    mimetypes.add_type("text/css", ".css")
    mimetypes.add_type("application/javascript", ".js")
    try:
        server = ThreadingHTTPServer(("localhost", preferred_port), Handler)
        port = preferred_port
    except OSError:
        server = ThreadingHTTPServer(("localhost", 0), Handler)
        port = server.server_address[1]

    PORT_FILE.write_text(json.dumps({"port": port}), encoding="utf-8")
    print(f"Paper Library running at http://localhost:{port}")
    if os.environ.get("OPEN_BROWSER", "1") == "1":
        webbrowser.open(f"http://localhost:{port}")
    server.serve_forever()
