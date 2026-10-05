from pypdf import PdfReader
from PIL import Image, ImageOps, ImageDraw
from pathlib import Path

root = Path('artifacts/sources/touring-extract')
root.mkdir(parents=True, exist_ok=True)
r = PdfReader('artifacts/sources/800mt-touring.pdf')
tiles = []
for page_no, page in enumerate(r.pages):
    for index, item in enumerate(page.images):
        if not item.name.endswith('.png') or len(item.data) < 50000:
            continue
        path = root / f'p{page_no+1:02d}-{index:02d}.png'
        path.write_bytes(item.data)
        im = Image.open(path).convert('RGB')
        tile = Image.new('RGB', (260, 200), '#eeeeee')
        thumb = ImageOps.contain(im, (260, 175))
        tile.paste(thumb, ((260-thumb.width)//2, 0))
        ImageDraw.Draw(tile).text((8,180), f'{path.name} {im.width}x{im.height}', fill='black')
        tiles.append(tile)
sheet = Image.new('RGB',(260*4,200*((len(tiles)+3)//4)),'white')
for i,tile in enumerate(tiles): sheet.paste(tile,((i%4)*260,(i//4)*200))
sheet.save(root/'contact.jpg')
Path('artifacts/sources/touring-text.txt').write_text('\n'.join(p.extract_text() for p in r.pages), encoding='utf8')
print(len(tiles),'images extracted')
