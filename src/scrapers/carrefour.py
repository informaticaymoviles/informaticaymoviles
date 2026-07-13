"""
Scraper para carrefour — usa el patrón genérico de src/scrapers/generic.py.
Los selectores concretos se definen en config/sites.yaml.

Se instancia desde scripts/run_weekly_update.py así:
    GenericStoreScraper(site_cfg, global_cfg, source_name="carrefour")

Si en el futuro carrefour necesita lógica especial (paginación distinta, JS
obligatorio, captcha, etc.), convierte este archivo en una subclase propia de
BaseScraper como se hizo en pccomponentes.py.
"""
