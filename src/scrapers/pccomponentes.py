"""
Scraper para pccomponentes.com (componentes de PC).

# TODO: los selectores de config/sites.yaml -> pc_component_sites.pccomponentes
# deben verificarse contra el HTML real antes de usar en producción; PcComponentes
# cambia su maquetación con cierta frecuencia.
#
# Verificado por inspección real (13/07/2026): la página de listado (ej.
# /procesadores) es server-rendered (no requiere ejecutar JS para tener el
# HTML de productos), soporta paginación por ?page=N, y cada tarjeta enlaza
# a una URL de producto con slug plano (sin subcarpeta), ej.
# /amd-ryzen-7-9800x3d-47-52ghz. El precio aparece como texto "424,90€".
#
# No pude verificar los nombres EXACTOS de clase CSS (mi herramienta de
# navegación devuelve el contenido ya extraído a texto/markdown, sin
# atributos HTML) — confírmalos con las DevTools antes de producción.
# Como alternativa MÁS ROBUSTA a depender de clases CSS (que cambian con
# cada rediseño), este scraper incluye parse_by_pattern(), que localiza
# productos por la forma de su URL + un regex de precio, en vez de por
# nombre de clase. Es el método que usa scrape_category_by_pattern().
"""
from __future__ import annotations

import re
from typing import Optional

from src.scrapers.base import BaseScraper, ScrapedProduct

PRODUCT_LINK_RE = re.compile(r"^/[a-z0-9][a-z0-9-]{5,}$")   # slug plano, sin subcarpetas
PRICE_RE = re.compile(r"(\d{1,3}(?:\.\d{3})*,\d{2})\s*€")


class PcComponentesScraper(BaseScraper):
    source_name = "pccomponentes"

    def scrape_category_by_pattern(self, category: str) -> list[ScrapedProduct]:
        """
        Método alternativo, sin depender de clases CSS: recorre todos los
        enlaces <a> de la página cuyo href tiene forma de slug de producto
        plano, y busca un precio (regex) en el texto del propio enlace o de
        su contenedor inmediato. Más lento y menos preciso que un selector
        CSS correcto, pero no se rompe con cada rediseño visual.
        """
        url = self.build_category_url(category)
        if not url:
            return []
        soup = self._get(url)
        products = []
        seen_urls = set()

        for a in soup.find_all("a", href=True):
            href = a["href"]
            if not PRODUCT_LINK_RE.match(href):
                continue

            text = a.get_text(" ", strip=True)
            price_match = PRICE_RE.search(text)
            container = a
            # Si el precio no está dentro del propio <a>, busca en el padre inmediato
            if not price_match and a.parent:
                text = a.parent.get_text(" ", strip=True)
                price_match = PRICE_RE.search(text)
                container = a.parent

            if not price_match:
                continue

            full_url = href if href.startswith("http") else self.cfg["base_url"].rstrip("/") + href
            if full_url in seen_urls:
                continue
            seen_urls.add(full_url)

            price = self.parse_price(price_match.group(1) + " €")
            # El nombre es el texto del enlace, o si está vacío, el título del contenedor
            name = a.get_text(strip=True) or container.get_text(strip=True)
            # Recorta ruido: nos quedamos con lo anterior al primer precio en el texto
            name = text.split(price_match.group(0))[0].strip() or name

            if not name or price is None:
                continue

            lower_name = name.lower()
            cpu_brand = gpu_brand = None
            if category == "cpu":
                cpu_brand = "intel" if "intel" in lower_name else ("amd" if "amd" in lower_name or "ryzen" in lower_name else None)
            if category == "gpu":
                if any(k in lower_name for k in ("nvidia", "geforce", "rtx", "gtx")):
                    gpu_brand = "nvidia"
                elif any(k in lower_name for k in ("radeon", "amd")):
                    gpu_brand = "amd"

            products.append(ScrapedProduct(
                category=category,
                name=name,
                price_eur=price,
                url=full_url,
                source=self.source_name,
                available=True,   # el patrón no distingue agotados; ver nota en README
                cpu_brand=cpu_brand,
                gpu_brand=gpu_brand,
            ))

        return products

    def parse_product_card(self, card, category: str) -> Optional[ScrapedProduct]:
        sel = self.cfg["selectors"]

        name_el = card.select_one(sel["name"])
        price_el = card.select_one(sel["price"])
        link_el = card.select_one(sel["link"])
        availability_el = card.select_one(sel.get("availability", ""))

        if not (name_el and price_el and link_el):
            return None

        name = name_el.get_text(strip=True)
        price = self.parse_price(price_el.get_text(strip=True))
        href = link_el.get("href", "")
        url = href if href.startswith("http") else self.cfg["base_url"].rstrip("/") + href

        if price is None:
            return None

        available = True
        if availability_el:
            text = availability_el.get_text(strip=True).lower()
            available = "agotado" not in text and "sin stock" not in text

        # Heurística simple de marca de CPU/GPU a partir del propio nombre.
        cpu_brand = None
        gpu_brand = None
        lower_name = name.lower()
        if category == "cpu":
            if "intel" in lower_name:
                cpu_brand = "intel"
            elif "amd" in lower_name or "ryzen" in lower_name:
                cpu_brand = "amd"
        if category == "gpu":
            if "nvidia" in lower_name or "geforce" in lower_name or "rtx" in lower_name or "gtx" in lower_name:
                gpu_brand = "nvidia"
            elif "radeon" in lower_name or "amd" in lower_name:
                gpu_brand = "amd"

        return ScrapedProduct(
            category=category,
            name=name,
            price_eur=price,
            url=url,
            source=self.source_name,
            available=available,
            cpu_brand=cpu_brand,
            gpu_brand=gpu_brand,
        )
