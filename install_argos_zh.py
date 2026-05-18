import sys
import os
from pathlib import Path


ROOT = Path(__file__).resolve().parent
ARGOS_HOME = ROOT / ".argos"
os.environ.setdefault("XDG_CONFIG_HOME", str(ARGOS_HOME / "config"))
os.environ.setdefault("XDG_DATA_HOME", str(ARGOS_HOME / "data"))
os.environ.setdefault("XDG_CACHE_HOME", str(ARGOS_HOME / "cache"))
os.environ.setdefault("ARGOS_STANZA_AVAILABLE", "0")
os.environ.setdefault("ARGOS_CHUNK_TYPE", "MINISBD")

import argostranslate.package
import argostranslate.translate


def has_english_to_chinese():
    languages = argostranslate.translate.get_installed_languages()
    source = next((language for language in languages if language.code == "en"), None)
    target = next((language for language in languages if language.code in {"zh", "zt"}), None)
    if not source or not target:
        return False
    try:
        source.get_translation(target)
        return True
    except Exception:
        return False


def main():
    if has_english_to_chinese():
        print("Argos English -> Chinese model is already installed.", flush=True)
        return

    print("Updating Argos package index...", flush=True)
    argostranslate.package.update_package_index()
    packages = argostranslate.package.get_available_packages()
    package = next(
        (
            item for item in packages
            if item.from_code == "en" and item.to_code in {"zh", "zt"}
        ),
        None,
    )
    if not package:
        raise RuntimeError("Could not find an Argos English -> Chinese package.")

    print(f"Downloading {package.from_code} -> {package.to_code} model...", flush=True)
    package_path = package.download()
    print("Installing model...", flush=True)
    argostranslate.package.install_from_path(package_path)
    print("Done.", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Failed: {error}", file=sys.stderr)
        raise
