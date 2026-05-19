# -*- mode: python ; coding: utf-8 -*-

from pathlib import Path
import certifi


root = Path.cwd()


a = Analysis(
    ["server.py"],
    pathex=[str(root)],
    binaries=[],
    datas=[
        ("index.html", "."),
        ("styles.css", "."),
        ("script.js", "."),
        (".env.example", "."),
        (".argos", ".argos"),
        (certifi.where(), "certifi"),
    ],
    hiddenimports=[
        "argostranslate",
        "argostranslate.package",
        "argostranslate.translate",
        "ctranslate2",
        "sentencepiece",
        "minisbd",
        "stanza",
        "fitz",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="PaperLibrary",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="PaperLibrary",
)
