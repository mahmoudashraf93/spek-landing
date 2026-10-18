"""Validate Jekyll output at Spek's custom domain root."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re, sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()
base = ''
app = 'https://apps.apple.com/us/app/voice-translator-spek/id6748774580'

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.elements=[]; self.text=[]
    def handle_starttag(self,tag,attrs): self.elements.append((tag,dict(attrs)))
    def handle_data(self,data): self.text.append(data)

pages = list(root.rglob('*.html'))
assert len(pages) == 3, f'Expected homepage, privacy and terms; got {pages}'
for file in pages:
    html=file.read_text(); page=Page(); page.feed(html)
    assert not re.search(r'trainers\s*kit|client.progress|lifetime pro|120k|4\.9', ' '.join(page.text), re.I),file
    assert sum(t=='main' for t,a in page.elements)==1,file
    assert '<html lang="en">' in html and '<title>' in html,file
    assert not any(t=='script' for t,a in page.elements),file
    assert any(t=='meta' and a.get('name')=='description' and a.get('content') for t,a in page.elements),file
    assert any(t=='meta' and a.get('property')=='og:image' for t,a in page.elements),file
    canonical=next(a['href'] for t,a in page.elements if t=='link' and a.get('rel')=='canonical')
    assert canonical.startswith('https://usespek.com/'),canonical
    for tag, attrs in page.elements:
        if tag=='img': assert 'alt' in attrs and 'width' in attrs and 'height' in attrs,(file,attrs)
        if tag=='a' and 'apps.apple.com' in attrs.get('href',''): assert attrs['href']==app,attrs
        for attr in ['href','src']:
            value=attrs.get(attr)
            if not value: continue
            parsed=urlsplit(value)
            if parsed.scheme or parsed.netloc or not parsed.path: continue
            path=unquote(parsed.path)
            if path.startswith('/'):
                assert path.startswith(base+'/'),(file,path)
                target=root/path[len(base)+1:]
            else: target=file.parent/path
            if path.endswith('/'): target=target/'index.html'
            assert target.exists(),(file,value,target)
assert (root/'CNAME').read_text().strip() == 'usespek.com'
print(f'Validated {len(pages)} pages: links/assets, SEO, semantics, image descriptions and claim checks passed.')
