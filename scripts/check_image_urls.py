import re
import ssl
import pathlib
import urllib.request
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parents[1] / "src"
CODE_EXTS = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"}
SKIP_HOSTS = {
    "schema.org",
    "www.instagram.com",
    "wa.me",
    "t.me",
    "maps.google.com",
    "www.no1wellness.com",
    "www.hive68.com",
    "www.googletagmanager.com",
    "connect.facebook.net",
    "www.clarity.ms",
    "assets.mixkit.co",
}
IMAGE_HOSTS = {"tsresidence.id", "imagedelivery.net", "picsum.photos"}


def collect_urls() -> list[str]:
    urls: set[str] = set()
    pattern = re.compile(r"https?://[^\"'\)\s]+")
    for path in ROOT.rglob("*"):
        if path.suffix not in CODE_EXTS:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue
        urls.update(pattern.findall(text))
    return sorted(urls)


def check(url: str, ctx: ssl.SSLContext) -> tuple[bool, str]:
    for method in ("HEAD", "GET"):
        req = urllib.request.Request(
            url,
            method=method,
            headers={"User-Agent": "Mozilla/5.0"},
        )
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=4) as res:
                status = getattr(res, "status", 200)
            if status < 400:
                return True, f"{status}"
            last_error = f"HTTP {status}"
        except Exception as err:  # noqa: BLE001
            last_error = str(err)
    return False, last_error


def main() -> None:
    urls = collect_urls()
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    bad: list[tuple[str, str]] = []

    for url in urls:
        host = urlparse(url).netloc
        if host in SKIP_HOSTS or host not in IMAGE_HOSTS:
            continue
        ok, detail = check(url, ctx)
        if not ok:
            bad.append((url, detail))

    print(f"Checked URLs: {len(urls)}")
    print(f"Broken/Unreachable: {len(bad)}")
    for url, detail in bad:
        print(url)
        print(f"  -> {detail}")


if __name__ == "__main__":
    main()
