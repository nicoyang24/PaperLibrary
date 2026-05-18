import base64
import re
import json
import mimetypes
import os
import sys
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

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


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_ROOT), **kwargs)

    def do_POST(self):
        if self.path == "/api/paper":
            self.handle_paper()
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
        if content_length > 35 * 1024 * 1024:
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

        translation = translate_paper_fields(result["title"], result["abstract"])
        result["original_title"] = result["title"]
        result["original_abstract"] = result["abstract"]
        result["title"] = translation["title"]
        result["abstract"] = translation["abstract"]
        result["translated"] = translation["translated"]
        result["translation_provider"] = translation["translation_provider"]
        result["translation_error"] = translation["translation_error"]
        self.send_json(result)

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
