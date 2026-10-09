from pathlib import Path
import sys

sys.path.insert(0, str(Path("artifacts/sources/fonttools").resolve()))
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

font = TTFont("src/assets/fonts/archivo-latin.woff2")
font = instantiateVariableFont(font, {"wght": 800, "wdth": 75}, inplace=True)
font.flavor = "woff2"
target = Path("src/assets/fonts/archivo-display.woff2")
font.save(target)
print(f"Archivo display: {target.stat().st_size} bytes")
