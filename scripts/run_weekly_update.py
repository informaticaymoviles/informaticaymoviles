"""
Orquesta la actualización semanal completa:
  1. Scrapea todas las tiendas activas (config/sites.yaml) -> tabla Product
  2. Scrapea PassMark (CPU/GPU) y Antutu -> tabla Benchmark
  3. Ejecuta el motor de puntuación (src/scoring.py) -> value_score

Uso:
    python scripts/run_weekly_update.py
"""
from __future__ import annotations

import datetime
import logging
import os
import sys

import yaml

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.db import get_session, Product, Benchmark, BASE_DIR  # noqa: E402
from src.scrapers.pccomponentes import PcComponentesScraper  # noqa: E402
from src.scrapers.mediamarkt import MediaMarktScraper  # noqa: E402
from src.scrapers.generic import GenericStoreScraper  # noqa: E402
from src.benchmarks import passmark, antutu  # noqa: E402
from src.scoring import run_scoring  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("weekly_update")

CONFIG_PATH = os.path.join(BASE_DIR, "config", "sites.yaml")

# Tiendas con scraper propio (comportamiento especial)
CUSTOM_SCRAPERS = {
    "pccomponentes": PcComponentesScraper,
    "pccomponentes_moviles": PcComponentesScraper,
    "mediamarkt": MediaMarktScraper,
}


def load_config() -> dict:
    with open(CONFIG_PATH, encoding="utf-8") as f:
        return yaml.safe_load(f)


def scrape_all_stores(config: dict) -> list:
    global_cfg = {
        "user_agent": config["user_agent"],
        "rate_limit_seconds": config["rate_limit_seconds"],
        "timeout_seconds": config["timeout_seconds"],
    }
    all_products = []

    for group in ("pc_component_sites", "phone_tablet_sites"):
        for site_name, site_cfg in config.get(group, {}).items():
            if not site_cfg.get("enabled", False):
                logger.info("Saltando %s (enabled: false)", site_name)
                continue
            scraper_cls = CUSTOM_SCRAPERS.get(site_name)
            if scraper_cls:
                scraper = scraper_cls(site_cfg, global_cfg)
            else:
                scraper = GenericStoreScraper(site_cfg, global_cfg, source_name=site_name)

            for category in site_cfg.get("categories", {}):
                try:
                    # Las categorías de móviles se llaman 'phones'/'tablets' en el
                    # YAML pero se guardan en BD como 'phone'/'tablet' (singular).
                    normalized_category = category.rstrip("s") if category in ("phones", "tablets") else category
                    products = scraper.scrape_category(category)
                    for p in products:
                        p.category = normalized_category
                    all_products.extend(products)
                    logger.info("%s / %s -> %d productos", site_name, category, len(products))
                except Exception:  # noqa: BLE001
                    logger.exception("Fallo scrapeando %s / %s", site_name, category)

    return all_products


def save_products(scraped_products: list):
    session = get_session()
    # Estrategia simple: purgar productos existentes de cada (source, category)
    # y volver a insertar. Para histórico de precios, cambiar por upsert + log.
    seen_source_categories = {(p.source, p.category) for p in scraped_products}
    for source, category in seen_source_categories:
        session.query(Product).filter(
            Product.source == source, Product.category == category
        ).delete()

    now = datetime.datetime.utcnow()
    for sp in scraped_products:
        session.add(Product(
            category=sp.category,
            name=sp.name,
            normalized_model=sp.normalized_model,
            brand=sp.brand,
            price_eur=sp.price_eur,
            available=sp.available,
            source=sp.source,
            url=sp.url,
            cpu_brand=sp.cpu_brand,
            gpu_brand=sp.gpu_brand,
            os=sp.os,
            ram_gb=sp.ram_gb,
            storage_gb=sp.storage_gb,
            last_updated=now,
        ))
    session.commit()
    session.close()
    logger.info("Guardados %d productos en la base de datos", len(scraped_products))


def save_benchmarks():
    session = get_session()
    now = datetime.datetime.utcnow()

    for fetch_fn, kind in ((passmark.fetch_cpu_mark, "cpu_mark"), (passmark.fetch_g3d_mark, "g3d_mark")):
        rows = fetch_fn()
        session.query(Benchmark).filter(Benchmark.kind == kind).delete()
        for row in rows:
            session.add(Benchmark(**row, last_updated=now))
        logger.info("Guardados %d benchmarks de tipo %s", len(rows), kind)

    antutu_rows = antutu.fetch_antutu_ranking()
    session.query(Benchmark).filter(Benchmark.kind == "antutu").delete()
    for row in antutu_rows:
        session.add(Benchmark(**row, last_updated=now))
    logger.info("Guardados %d benchmarks de Antutu", len(antutu_rows))

    session.commit()
    session.close()


def main():
    config = load_config()

    logger.info("=== 1/3 Scrapeando tiendas ===")
    scraped_products = scrape_all_stores(config)
    save_products(scraped_products)

    logger.info("=== 2/3 Scrapeando benchmarks (PassMark / Antutu) ===")
    save_benchmarks()

    logger.info("=== 3/3 Calculando value_score ===")
    run_scoring()

    logger.info("Actualización semanal completada.")


if __name__ == "__main__":
    main()
