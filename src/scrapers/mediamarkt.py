"""
Scraper para mediamarkt.es (componentes de PC).

Verificado por inspección real (13/07/2026):
  - CPU: https://www.mediamarkt.es/es/category/procesadores-58.html
  - GPU: https://www.mediamarkt.es/es/category/tarjetas-gr%C3%A1ficas-63.html
  - Precio: texto tipo "241,00€" (con precio anterior tachado si hay descuento)
  - URL de producto: /es/product/_slug-id-numerico.html

⚠️ LIMITACIÓN IMPORTANTE: la página de listado solo carga ~12 productos de
entrada y el resto se obtiene pulsando "Mostrar 12 productos más", lo que
normalmente dispara una petición JavaScript/XHR que este scraper (basado en
requests + BeautifulSoup, sin ejecutar JS) NO ve. Es decir: tal cual está,
este scraper solo capturará los primeros ~12-24 resultados por categoría.

Antes de confiar en datos completos de MediaMarkt:
  1. Abre las DevTools del navegador -> pestaña Red -> pulsa "Mostrar más
     productos" -> localiza la petición (normalmente devuelve JSON) y su
     URL/parámetros -> llama a ese endpoint directamente (más robusto).
  2. Si no hay endpoint JSON accesible, usar un navegador headless
     (Playwright/Selenium) que haga clic en el botón antes de leer el HTML.
"""
from __future__ import annotations

import re
from typing import Optional

from src.scrapers.pccomponentes import PRICE_RE  # reutilizamos el mismo regex de precio
from src.scrapers.base import BaseScraper, ScrapedProduct


class MediaMarktScraper(BaseScraper):
    source_name = "mediamarkt"

    def scrape_category_by_pattern(self, category: str) -> list[ScrapedProduct]:
        """
        Extrae productos de la primera 'página' visible (ver limitación del
        botón 'Mostrar más' arriba) localizando enlaces con forma de URL de
        producto de MediaMarkt (regex) + un precio cercano (regex), sin
        depender de clases CSS exactas.
        """
        url = self.build_category_url(category)
        if not url:
            return []
        soup = self._get(url)
        link_re = re.compile(self.cfg.get("fallback_pattern", {}).get(
            "product_link_regex", r"^/es/product/_[a-z0-9-]+-\d+\.html$"
        ))

        products = []
        seen = set()
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if not link_re.match(href):
                continue
            container = a.parent or a
            text = container.get_text(" ", strip=True)
            price_match = PRICE_RE.search(text)
            if not price_match:
                continue

            full_url = href if href.startswith("http") else self.cfg["base_url"].rstrip("/") + href
            if full_url in seen:
                continue
            seen.add(full_url)

            price = self.parse_price(price_match.group(1) + " €")
            name = a.get_text(strip=True)
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
                available=True,
                cpu_brand=cpu_brand,
                gpu_brand=gpu_brand,
            ))
        return products

    def parse_product_card(self, card, category: str) -> Optional[ScrapedProduct]:
        # TODO: confirmar selectores exactos con DevTools (ver config/sites.yaml).
        sel = self.cfg["selectors"]
        name_el = card.select_one(sel["name"])
        price_el = card.select_one(sel["price"])
        link_el = card.select_one(sel["link"])
        if not (name_el and price_el and link_el):
            return None

        name = name_el.get_text(strip=True)
        price = self.parse_price(price_el.get_text(strip=True))
        href = link_el.get("href", "")
        url = href if href.startswith("http") else self.cfg["base_url"].rstrip("/") + href
        if price is None:
            return None

        return ScrapedProduct(
            category=category, name=name, price_eur=price, url=url, source=self.source_name,
        )
