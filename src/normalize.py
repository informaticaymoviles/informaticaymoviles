"""
Normalización de nombres de modelo para poder cruzar el nombre comercial de un
producto en una tienda (ej. "Procesador AMD Ryzen 7 7800X3D OEM") con el nombre
tal y como aparece en PassMark/Antutu (ej. "AMD Ryzen 7 7800X3D").

Es una normalización deliberadamente simple (heurística) porque los nombres
comerciales varían mucho entre tiendas. Se recomienda revisar manualmente los
casos sin match en `data/unmatched_products.csv` (generado por scoring.py).
"""
import re

NOISE_WORDS = [
    "procesador", "tarjeta", "grafica", "gráfica", "cpu", "gpu", "oem", "box",
    "nuevo", "reacondicionado", "reacondicionada", "smartphone", "movil", "móvil",
    "tablet", "portatil", "portátil", "ordenador", "pc", "de", "con", "para",
]


def normalize_model(raw_name: str) -> str:
    text = raw_name.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    tokens = [t for t in text.split() if t not in NOISE_WORDS and len(t) > 1]
    return " ".join(tokens).strip()
