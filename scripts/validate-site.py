"""Validate production HTML, navigation, metadata, article schema, sitemap and RSS."""
from collections import deque
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from zoneinfo import ZoneInfo
import json
import re
import sys
import xml.etree.ElementTree as ET

ORIGIN = "https://usespek.com"
APP = "https://apps.apple.com/app/id6748774580"

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.elements, self.ids, self.json_ld = [], set(), []
        self.title, self._title, self._script, self._data = "", False, False, ""
        self.h1, self._h1 = "", False
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs["id"])
        if tag == "h1":
            self._h1 = True
        if tag == "title":
            self._title = True
        if tag == "script":
            assert attrs.get("type") == "application/ld+json" and not attrs.get("src"), "Executable script"
            self._script, self._data = True, ""

    def handle_endtag(self, tag):
        if tag == "h1":
            self._h1 = False
        if tag == "title":
            self._title = False
        if tag == "script" and self._script:
            self.json_ld.append(json.loads(self._data))
            self._script = False

    def handle_data(self, text):
        if self._h1:
            self.h1 += text
        if self._title:
            self.title += text
        if self._script:
            self._data += text

    def meta(self, name):
        return next((a.get("content", "") for t, a in self.elements
                     if t == "meta" and (a.get("name") == name or a.get("property") == name)), "")

    @property
    def canonical(self):
        return next((a.get("href", "") for t, a in self.elements
                     if t == "link" and a.get("rel") == "canonical"), "")

def validate(output):
    root = Path(output).resolve()
    pages = {f.resolve(): Page(f.read_text()) for f in root.rglob("*.html")}
    assert len(pages) >= 5, "Expected landing, policies, guides hub and starter guide"
    assert (root / "CNAME").read_text().strip() == "usespek.com"
    assert not (root / "docs").exists() and not (root / "design-qa.md").exists(), "Private build documentation leaked"
    graph = {f: set() for f in pages}
    canonicals, descriptions, titles, articles = set(), set(), set(), {}
    today = datetime.now(ZoneInfo("Africa/Cairo"))

    for file, page in pages.items():
        relative = file.relative_to(root).as_posix()
        route = "/" + relative.removesuffix("index.html")
        assert page.canonical == ORIGIN + route, f"Wrong canonical: {file}: {page.canonical}"
        assert page.canonical not in canonicals, f"Duplicate canonical: {page.canonical}"
        canonicals.add(page.canonical)
        assert page.title.strip() and page.title not in titles, f"Missing or duplicate title: {file}"
        titles.add(page.title)
        description = page.meta("description")
        assert description and description not in descriptions, f"Missing or duplicate description: {file}"
        descriptions.add(description)
        assert sum(t == "main" for t, _ in page.elements) == 1, f"Expected one main: {file}"
        assert sum(t == "h1" for t, _ in page.elements) == 1, f"Expected one h1: {file}"
        assert any(t == "html" and a.get("lang") == "en" for t, a in page.elements), f"Missing language: {file}"
        assert page.meta("og:image").startswith(ORIGIN + "/"), f"Missing social image: {file}"
        assert not re.search(r"trainers\s*kit|client.progress|lifetime pro|120k|4\.9", file.read_text(), re.I), file

        for tag, attrs in page.elements:
            if tag == "img":
                assert attrs.get("src") and all(k in attrs for k in ("alt", "width", "height")), f"Image needs alt/dimensions: {file}"
            if tag == "a":
                app_link = urlsplit(attrs.get("href", ""))
                if app_link.hostname == "apps.apple.com" and re.search(r"/id6748774580(?:/|$)", app_link.path):
                    assert attrs["href"] == APP, f"Wrong Spek App Store URL: {file}"
            for attr in ("href", "src"):
                value = attrs.get(attr)
                if not value:
                    continue
                parsed = urlsplit(urljoin(page.canonical, value))
                if parsed.netloc != "usespek.com" or parsed.scheme not in ("http", "https"):
                    continue
                path = unquote(parsed.path)
                target = root / path.lstrip("/")
                if path.endswith("/"):
                    target /= "index.html"
                target = target.resolve()
                assert target.is_relative_to(root) and target.exists(), f"Broken {attr}: {file}: {value}"
                if attr == "href" and target in pages:
                    graph[file].add(target)
                    if parsed.fragment:
                        assert unquote(parsed.fragment) in pages[target].ids, f"Missing fragment: {file}: {value}"

        if page.meta("og:type") == "article":
            data = [node for payload in page.json_ld for node in payload.get("@graph", [])]
            article = next((n for n in data if n.get("@type") == "BlogPosting"), None)
            crumbs = next((n for n in data if n.get("@type") == "BreadcrumbList"), None)
            assert article and crumbs, f"Missing article/breadcrumb schema: {file}"
            assert article["mainEntityOfPage"]["@id"] == page.canonical
            assert article["headline"] and article["description"] == description and article["author"]["name"]
            assert " ".join(page.h1.split()).rstrip(".") == article["headline"].rstrip("."), f"Article title differs from heading: {file}"
            image = article["image"][0]
            assert image == page.meta("og:image") and image.startswith(ORIGIN + "/assets/"), f"Wrong article image: {file}"
            assert (root / urlsplit(image).path.lstrip("/")).is_file(), f"Missing article image: {file}"
            assert page.meta("article:published_time") == article["datePublished"]
            assert page.meta("article:modified_time") == article["dateModified"]
            published = datetime.fromisoformat(article["datePublished"])
            modified = datetime.fromisoformat(article["dateModified"])
            assert published <= modified <= today, f"Invalid or future article dates: {file}"
            assert [x["position"] for x in crumbs["itemListElement"]] == [1, 2, 3]
            articles[page.canonical] = article

    reached = set()
    queue = deque([root / "index.html"])
    while queue:
        file = queue.popleft()
        if file in reached:
            continue
        reached.add(file)
        queue.extend(graph[file] - reached)
    assert set(pages) <= reached, f"Unreachable pages: {set(pages) - reached}"

    sitemap = ET.parse(root / "sitemap.xml")
    entries = sitemap.findall("{*}url")
    locations = [e.findtext("{*}loc") for e in entries]
    assert len(locations) == len(set(locations)), "Duplicate sitemap URLs"
    assert set(locations) == canonicals, f"Sitemap differs from HTML: {set(locations) ^ canonicals}"
    for e in entries:
        url = e.findtext("{*}loc")
        if url in articles:
            assert e.findtext("{*}lastmod") == articles[url]["dateModified"], f"Wrong lastmod: {url}"
    rss = ET.parse(root / "feed.xml")
    rss_urls = [e.text for e in rss.findall("./channel/item/link")]
    newest = sorted(articles, key=lambda u: articles[u]["datePublished"], reverse=True)[:20]
    assert set(rss_urls) == set(newest), "RSS differs from published articles"
    robots = (root / "robots.txt").read_text()
    assert f"Sitemap: {ORIGIN}/sitemap.xml" in robots
    for css in root.rglob("*.css"):
        for url in re.findall(r"url\(['\"]?([^)'\"\s]+)", css.read_text()):
            if url.startswith("/"):
                assert (root / url.lstrip("/")).exists(), f"Missing CSS asset: {url}"
    print(f"Validated {len(pages)} pages and {len(articles)} articles: links, anchors, reachability, metadata, JSON-LD, sitemap and RSS.")
    return len(pages)

if __name__ == "__main__":
    validate(sys.argv[1] if len(sys.argv) > 1 else "_site")
