"""
Descarga las tablas públicas de PassMark:
  - CPU Mark:  https://www.cpubenchmark.net/cpu_list.php
  - G3D Mark:  https://www.videocardbenchmark.net/gpu_list.php

Verificado por inspección real (13/07/2026): AMBAS páginas devuelven una
tabla HTML estática de verdad (no dependen de JavaScript/AJAX para mostrar
los datos), con estas columnas confirmadas:
  CPU list:  Nombre (enlace a cpu_lookup.php) | CPU Mark | Rank | CPU Value | Price (USD)
  GPU list:  Nombre (enlace a video_lookup.php) | G3D Mark | Rank | Videocard Value | Price (USD)
Esto es una buena noticia: un scraper simple con requests+BeautifulSoup
funciona aquí sin necesitar navegador headless.

⚠️ Nota: la página /cpu_list.php muestra por defecto solo Intel; hay pestañas
Intel/AMD/Other/All en la propia página (enlaces separados, ej.
/cpu-list/amd, /cpu-list/all) — hay que recorrer varias URLs para cubrir
todas las marcas, no una sola.
⚠️ Los precios de esta tabla están en USD, no en EUR — no los usamos para
nuestro value_score (que usa el precio real de la tienda en euros), solo
tomamos la columna de puntuación (CPU Mark / G3D Mark).
⚠️ Existe también CPU_mega_page.html / GPU_mega_page.html ("Mega List"), pero
esas páginas SÍ dependen de JavaScript para rellenar la tabla (llegan vacías
con una petición HTTP simple) — no usar esas URLs para scraping.

PassMark permite consultar estas listas para uso no comercial; revisa
https://www.cpubenchmark.net/software_faq.html si vas a hacer un uso intensivo
o comercial y considera contactar con PassMark para un acuerdo de datos.
"""
from __future__ import annotations

import logging
from typing import Optional

import requests
from bs4 import BeautifulSoup

from src.normalize import normalize_model

logger = logging.getLogger(__name__)

# Listas por marca confirmadas; recorrer todas para tener cobertura completa.
CPU_URLS = [
    "https://www.cpubenchmark.net/cpu_list.php",       # vista por defecto (Intel)
    "https://www.cpubenchmark.net/cpu-list/amd",
    "https://www.cpubenchmark.net/cpu-list/all",        # incluye el resto (Apple, ARM, etc.)
]
GPU_URLS = [
    "https://www.videocardbenchmark.net/gpu_list.php",
]
HEADERS = {"User-Agent": "informaticaymoviles-bot/1.0"}


def _fetch_table(url: str) -> list[dict]:
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml")

    # No dependemos de un id de tabla concreto (no verificado): tomamos la
    # primera <table> de la página, que es donde está el listado real.
    table = soup.find("table")
    if table is None:
        logger.error("No se encontró ninguna tabla en %s — revisar la página", url)
        return []

    rows = []
    for tr in table.select("tr"):
        cells = tr.find_all("td")
        if len(cells) < 2:
            continue
        name_link = cells[0].find("a")
        name = (name_link or cells[0]).get_text(strip=True)
        score_text = cells[1].get_text(strip=True).replace(",", "")
        try:
            score = float(score_text)
        except ValueError:
            continue
        if not name:
            continue
        rows.append({
            "model_name": name,
            "normalized_model": normalize_model(name),
            "score": score,
            "source_url": url,
        })
    return rows


def fetch_cpu_mark() -> list[dict]:
    all_rows = []
    seen = set()
    for url in CPU_URLS:
        for row in _fetch_table(url):
            if row["normalized_model"] in seen:
                continue
            seen.add(row["normalized_model"])
            all_rows.append({**row, "kind": "cpu_mark"})
    return all_rows


def fetch_g3d_mark() -> list[dict]:
    all_rows = []
    seen = set()
    for url in GPU_URLS:
        for row in _fetch_table(url):
            if row["normalized_model"] in seen:
                continue
            seen.add(row["normalized_model"])
            all_rows.append({**row, "kind": "g3d_mark"})
    return all_rows
