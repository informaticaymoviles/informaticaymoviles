"""
Clase base para scrapers de tiendas. Cada scraper concreto (pccomponentes.py,
mediamarkt.py, ...) hereda de BaseScraper e implementa parse_product_card().

Antes de activar un scraper en producción:
  1. Revisa robots.txt y los T&C de la tienda (ver DISCLAIMER.md).
  2. Verifica que los selectores CSS en config/sites.yaml siguen siendo válidos.
  3. Respeta rate_limit_seconds definido en config/sites.yaml.

⚠️ Se usa `cloudscraper` en vez de una sesión normal de `requests`. Confirmado
en pruebas reales (14/07/2026): PcComponentes, Neobyte y Carrefour devuelven
403 Forbidden incluso con un User-Agent de navegador real, lo que indica un
bloqueo a nivel de red/TLS (tipo Cloudflare) y no solo de cabeceras.
`cloudscraper` imita la huella TLS de un navegador real y resuelve el
challenge de JavaScript de Cloudflare cuando es posible. No es infalible:
si sigue dando 403 con cloudscraper, esa tienda necesitará un navegador
headless (Playwright) o quedará fuera del scraping automático.
"""
from __future__ import annotations

import time
import logging
from dataclasses import dataclass
from typing import Optional

import cloudscraper
from bs4 import BeautifulSoup
from tenacity import retry, stop_after_attempt, wait_exponential

from src.normalize import normalize_model

logger = logging.getLogger(__name__)


@dataclass
class ScrapedProduct:
    category: str
    name: str
    price_eur: float
    url: str
    source: str
    available: bool = True
    brand: Optional[str] = None
    cpu_brand: Optional[str] = None
    gpu_brand: Optional[str] = None
    os: Optional[str] = None
    ram_gb: Optional[float] = None
    storage_gb: Optional[float] = None

    @property
    def normalized_model(self) -> str:
        return normalize_model(self.name)


class BaseScraper:
    source_name = "base"

    def __init__(self, site_config: dict, global_config: dict):
        self.cfg = site_config
        self.global_cfg = global_config
        # cloudscraper crea una sesión compatible con requests.Session
        # (mismo .get(), .headers, etc.) pero con huella TLS de navegador.
        self.session = cloudscraper.create_scraper(
            browser={"browser": "chrome", "platform": "linux", "mobile": False}
        )
        self.session.headers.update(
            {"User-Agent": global_config.get("user_agent", "informaticaymoviles-bot/1.0")}
        )

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=2, max=20))
    def _get(self, url: str) -> BeautifulSoup:
        resp = self.session.get(url, timeout=self.global_cfg.get("timeout_seconds", 15))
        resp.raise_for_status()
        time.sleep(self.global_cfg.get("rate_limit_seconds", 3))
        return BeautifulSoup(resp.text, "lxml")

    def build_category_url(self, category: str) -> Optional[str]:
        path = self.cfg.get("categories", {}).get(category)
        if not path:
            return None
        return self.cfg["base_url"].rstrip("/") + path

    @staticmethod
    def parse_price(raw_price: str) -> Optional[float]:
        """Convierte '1.299,00 €' -> 1299.00"""
        if not raw_price:
            return None
        cleaned = (
            raw_price.replace("€", "")
            .replace(".", "")
            .replace(",", ".")
            .strip()
        )
        try:
            return float(cleaned)
        except ValueError:
            logger.warning("No se pudo parsear el precio: %r", raw_price)
            return None

    def parse_product_card(self, card, category: str) -> Optional[ScrapedProduct]:
        """
        Debe implementarse en cada scraper concreto, usando los selectores
        definidos en config/sites.yaml (self.cfg['selectors']).
        """
        raise NotImplementedError

    def scrape_category(self, category: str) -> list[ScrapedProduct]:
        url = self.build_category_url(category)
        if not url:
            return []
        logger.info("Scrapeando %s -> %s", self.source_name, url)
        soup = self._get(url)
        selectors = self.cfg["selectors"]
        cards = soup.select(selectors["product_card"])
        products = []
        for card in cards:
            try:
                product = self.parse_product_card(card, category)
                if product:
                    products.append(product)
            except Exception:  # noqa: BLE001
                logger.exception("Error parseando una tarjeta de producto en %s", self.source_name)
        return products
