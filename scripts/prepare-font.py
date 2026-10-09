from pathlib import Path
import sys
from io import BytesIO

sys.path.insert(0, str(Path("artifacts/sources/fonttools").resolve()))
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

source = Path(sys.argv[1])
target = Path("src/assets/fonts/archivo-latin.woff2")
font = TTFont(source)
font = instantiateVariableFont(font, {"wght": (400, 800), "wdth": (75, 100)}, inplace=True)
buffer = BytesIO()
font.save(buffer)
buffer.seek(0)
font = TTFont(buffer)
options = subset.Options()
options.flavor = "woff2"
options.name_IDs = ["*"]
options.name_legacy = True
options.name_languages = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=list(range(0x20, 0x100)) + list(range(0x2000, 0x2070)) + [0x20AC, 0x2122, 0x2191, 0x2193, 0x2212, 0x2215, 0xFEFF, 0xFFFD])
subsetter.subset(font)
target.parent.mkdir(parents=True, exist_ok=True)
font.flavor = "woff2"
font.save(target)
assert font["fvar"].axes, "Variable axes must remain available"
print(f"Archivo variable: {source.stat().st_size} -> {target.stat().st_size} bytes")
