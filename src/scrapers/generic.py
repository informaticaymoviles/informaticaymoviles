"""
Scraper genérico basado en selectores CSS de config/sites.yaml. La mayoría de
tiendas listadas comparten la misma estructura (tarjeta -> nombre/precio/enlace/
disponibilidad), así que en vez de repetir código en cada archivo, las tiendas
"sencillas" heredan de aquí y solo cambian el `source_name`.

Para tiendas con comportamiento realmente distinto (ej. Amazon con su API
oficial), crea un scraper específico como src/scrapers/pccomponentes.py.
"""
from __future__ import annotations

import re
from typing import Optional

from src.scrapers.base import BaseScraper, ScrapedProduct


def _extract_ram_storage(name: str) -> tuple[Optional[float], Optional[float]]:
    """Extrae RAM y almacenamiento en GB del propio nombre del producto,
    ej. 'Xiaomi Redmi Note 13 8GB/256GB' -> (8.0, 256.0)"""
    ram = None
    storage = None
    ram_match = re.search(r"(\d+)\s*GB\s*(?:RAM)?\s*/", name, re.IGNORECASE)
    if ram_match:
        ram = float(ram_match.group(1))
    storage_match = re.search(r"/\s*(\d+)\s*(GB|TB)", name, re.IGNORECASE)
    if storage_match:
        value = float(storage_match.group(1))
        storage = value * 1024 if storage_match.group(2).upper() == "TB" else value
    return ram, storage


def _guess_os(name: str) -> Optional[str]:
    lower = name.lower()
    if "iphone" in lower or "ipad" in lower:
        return "ios"
    return "android"


def _guess_pc_brand(name: str, category: str) -> tuple[Optional[str], Optional[str]]:
    lower = name.lower()
    cpu_brand = gpu_brand = None
    if category == "cpu":
        if "intel" in lower:
            cpu_brand = "intel"
        elif "amd" in lower or "ryzen" in lower:
            cpu_brand = "amd"
    if category == "gpu":
        if any(k in lower for k in ("nvidia", "geforce", "rtx", "gtx")):
            gpu_brand = "nvidia"
        elif any(k in lower for k in ("radeon", "amd")):
            gpu_brand = "amd"
    return cpu_brand, gpu_brand


class GenericStoreScraper(BaseScraper):
    """Instanciar con source_name concreto desde el orquestador
    (scripts/run_weekly_update.py), pasando site_config de config/sites.yaml."""

    def __init__(self, site_config: dict, global_config: dict, source_name: str):
        super().__init__(site_config, global_config)
        self.source_name = source_name

    def parse_product_card(self, card, category: str) -> Optional[ScrapedProduct]:
        sel = self.cfg["selectors"]

        name_el = card.select_one(sel["name"])
        price_el = card.select_one(sel["price"])
        link_el = card.select_one(sel["link"])
        availability_el = card.select_one(sel.get("availability", "")) if sel.get("availability") else None

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
            available = not any(k in text for k in ("agotado", "sin stock", "no disponible"))

        kwargs = dict(
            category=category,
            name=name,
            price_eur=price,
            url=url,
            source=self.source_name,
            available=available,
        )

        if category in ("phone", "tablet"):
            ram, storage = _extract_ram_storage(name)
            kwargs.update(ram_gb=ram, storage_gb=storage, os=_guess_os(name))
        elif category in ("cpu", "gpu"):
            cpu_brand, gpu_brand = _guess_pc_brand(name, category)
            kwargs.update(cpu_brand=cpu_brand, gpu_brand=gpu_brand)

        return ScrapedProduct(**kwargs)
