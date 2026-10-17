"""Rebuild the code-native Open Graph card. Requires Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root = Path(__file__).resolve().parents[1]
font_dir = Path('/System/Library/Fonts/Supplemental')
canvas = Image.new('RGB', (1200, 630), '#171713')
draw = ImageDraw.Draw(canvas)
bold = lambda n: ImageFont.truetype(str(font_dir / 'Arial Bold.ttf'), n)
regular = lambda n: ImageFont.truetype(str(font_dir / 'Arial.ttf'), n)
icon = Image.open(root / 'assets/spek/icon.png').convert('RGB').resize((100, 100))
canvas.paste(icon, (70, 65))
draw.text((190, 78), 'Spek', font=bold(62), fill='#ffffff')
draw.multiline_text((70, 225), 'Everyday conversations.\nThe dialect you need.', font=bold(68), fill='#ffffff', spacing=10)
draw.text((70, 485), 'Voice, text & photo translation for iPhone', font=regular(30), fill='#ffb333')
canvas.save(root / 'assets/spek/social.jpg', quality=92)
