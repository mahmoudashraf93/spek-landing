"""Import editable product captures from a local Spek checkout. Requires Pillow."""
from pathlib import Path
from PIL import Image
import argparse
p=argparse.ArgumentParser();p.add_argument('spek_repository',type=Path);args=p.parse_args()
root=Path(__file__).resolve().parents[1];out=root/'assets/spek'
for name in ['voice','text','photo']:
    im=Image.open(args.spek_repository/'marketing/screenshots/raw'/f'{name}.png').convert('RGB')
    im.resize((880,round(880*im.height/im.width)),Image.Resampling.LANCZOS).save(out/f'{name}.webp',quality=86,method=6)
im=Image.open(args.spek_repository/'ios/Spek/Spek/Assets.xcassets/AppIcon.appiconset/spekappicon.png').convert('RGB')
im.resize((192,192),Image.Resampling.LANCZOS).save(out/'icon.png',optimize=True)
print('Imported the app icon and three proportional product captures.')
