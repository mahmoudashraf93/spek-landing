"""Regression checks for discovery and draft/future publication boundaries."""
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
import importlib.util
import os
import shutil
import re
import subprocess
import tempfile
import unittest
import xml.etree.ElementTree as ET

PROJECT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("site_validator", PROJECT / "scripts/validate-site.py")
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)

class SiteChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.output = Path(self.temp.name) / "output"
        shutil.copytree(PROJECT / "_site", self.output)

    def tearDown(self):
        self.temp.cleanup()

    def test_detects_broken_contextual_anchor(self):
        p = self.output / "blog/translate-menu-iphone/index.html"
        p.write_text(p.read_text().replace('href="#clearer-results"', 'href="#missing-section"'))
        with self.assertRaisesRegex(AssertionError, "Missing fragment"):
            validator.validate(self.output)

    def test_detects_missing_sitemap_entry(self):
        p = self.output / "sitemap.xml"
        tree = ET.parse(p)
        item = next(e for e in tree.getroot() if e.findtext("{*}loc").endswith("/blog/translate-menu-iphone/"))
        tree.getroot().remove(item)
        tree.write(p, encoding="unicode")
        with self.assertRaisesRegex(AssertionError, "Sitemap differs"):
            validator.validate(self.output)

    def test_detects_orphan_article(self):
        for p in self.output.rglob("*.html"):
            p.write_text(p.read_text().replace('href="/blog/translate-menu-iphone/"', 'href="/blog/"'))
        with self.assertRaisesRegex(AssertionError, "Unreachable pages"):
            validator.validate(self.output)

    def test_published_related_content_and_draft_boundaries(self):
        source = Path(self.temp.name) / "source"
        shutil.copytree(PROJECT, source, ignore=shutil.ignore_patterns(".git", "_site", "_preview", "vendor", ".bundle", "docs"))
        template = (source / "_posts/2026-10-19-translate-menu-iphone.md").read_text()
        def fixture(title, date, extra=""):
            data = template.replace("How to translate a menu on your iPhone", title)
            data = data.replace("description: Learn how", f"description: {title}. Learn how")
            data = data.replace("date: 2026-10-19 00:00:00 +0300", f"date: {date} 00:00:00 +0300")
            data = data.replace("updated: 2026-10-19 00:00:00 +0300", f"updated: {date} 00:00:00 +0300")
            data = re.sub(r"title_lines:\n(?:  - .*\n)+", "", data)
            return data.replace("---\n", "---\n" + extra, 1)
        (source / "_drafts").mkdir(exist_ok=True)
        (source / "_drafts/synthetic-draft.md").write_text(fixture("Synthetic draft", "2020-01-01"))
        (source / "_posts/2999-01-01-future.md").write_text(fixture("Future guide", "2999-01-01"))
        (source / "_posts/2020-01-01-unpublished.md").write_text(fixture("Unpublished guide", "2020-01-01", "published: false\n"))
        (source / "_posts/2020-01-02-approved-related.md").write_text(fixture("Approved related guide", "2020-01-02"))
        built = Path(self.temp.name) / "fixture-output"
        # Keep the project's bundle/cache while building the isolated fixture source.
        result = subprocess.run(
            ["bundle", "exec", "jekyll", "build", "--destination", str(built), "--quiet"],
            cwd=source, env={**os.environ, "BUNDLE_GEMFILE": str(PROJECT / "Gemfile")},
            capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertTrue((built / "blog/approved-related/index.html").exists())
        for slug in ("synthetic-draft", "future", "unpublished"):
            self.assertFalse((built / "blog" / slug).exists())
            for name in ("sitemap.xml", "feed.xml", "blog/index.html", "blog/translate-menu-iphone/index.html"):
                self.assertNotIn(f"/blog/{slug}/", (built / name).read_text())
        article = (built / "blog/translate-menu-iphone/index.html").read_text()
        self.assertIn('href="/blog/approved-related/"', article)
        with redirect_stdout(StringIO()):
            validator.validate(built)

if __name__ == "__main__":
    unittest.main()
