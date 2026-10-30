"""Add preview-only headers after validating the unchanged canonical domain."""
from pathlib import Path

root = Path(__file__).resolve().parents[1] / '.cloudflare/site'
headers = '''/*
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self'; img-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'

/assets/*
  Cache-Control: public, max-age=3600
'''
(root / '_headers').write_text(headers)
(root / 'CNAME').unlink(missing_ok=True)
for path in root.rglob('.DS_Store'):
    path.unlink()
print('Prepared Cloudflare preview: noindex headers, production canonicals retained, no DNS change.')
