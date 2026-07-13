"""
Descarga el ranking público de Antutu (SoC de Android) desde antutu.com.

Verificado por inspección real (13/07/2026): la URL correcta es
https://www.antutu.com/web/ranking (NO /en/ranking/rank1.htm, que era una
suposición incorrecta). Es una tabla HTML estática de verdad, con columnas:
  Rank | Device / Spec | CPU | GPU | MEM | UX | Total Score
Usamos "Total Score" como puntuación de referencia para el value_score.
Actualizado mensualmente por Antutu; la página muestra ~120 modelos.

⚠️ La página tiene pestañas Android/iOS y Performance/SoC/AI y
Smartphone/Pad. Mi herramienta de navegación solo pudo confirmar el
contenido de la vista por defecto (Android, Performance, Smartphone). No
pude verificar los parámetros de URL o el comportamiento JS exactos de las
otras pestañas (podrían ser rutas distintas, query params, o cambios de
estado solo en el cliente vía JavaScript sin recarga). Antes de asumir que
existe una URL separada y estática para "Pad" (tablets) o "iOS", verifica
manualmente en el navegador qué URL/petición se dispara al cambiar de
pestaña (DevTools -> Network).
⚠️ Antutu no publica ranking oficial de iOS con URL propia conocida; sus
comparativas de iPhone/iPad aparecen como artículos de noticias mensuales
(ej. antutu.com/web/news/detail?id=...), no como una tabla estable. Para
iOS se recomienda usar Geekbench (https://browser.geekbench.com/ios-benchmarks)
como fuente alternativa, y dejarlo indicado en la web.
⚠️ El ranking excluye explícitamente el mercado chino (solo mercado global).
"""
from __future__ import annotations

import logging

import requests
from bs4 import BeautifulSoup

from src.normalize import normalize_model

logger = logging.getLogger(__name__)

RANKING_URL = "https://www.antutu.com/web/ranking"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
}


def fetch_antutu_ranking() -> list[dict]:
    resp = requests.get(RANKING_URL, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")

    table = soup.find("table")
    if table is None:
        logger.error("No se encontró la tabla de ranking en %s — revisar la página", RANKING_URL)
        return []

    rows = []
    for tr in table.select("tr"):
        cells = tr.find_all("td")
        if len(cells) < 7:
            continue  # cabecera u otra fila que no es un dispositivo
        name = cells[1].get_text(strip=True)          # "Device / Spec"
        total_score_text = cells[6].get_text(strip=True).replace(",", "")  # "Total Score"
        try:
            score = float(total_score_text)
        except ValueError:
            continue
        if not name:
            continue
        rows.append({
            "kind": "antutu",
            "model_name": name,
            "normalized_model": normalize_model(name),
            "score": score,
            "source_url": RANKING_URL,
        })

    if not rows:
        logger.error("No se extrajeron filas del ranking de Antutu — revisar estructura de la tabla")
    return rows
