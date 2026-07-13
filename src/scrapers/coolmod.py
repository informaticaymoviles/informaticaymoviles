"""
Scraper para coolmod.com — usa el patrón genérico de src/scrapers/generic.py.
Los selectores concretos se definen en config/sites.yaml.

Verificado por inspección real (13/07/2026), vía snippets de búsqueda:
  - CPU: https://www.coolmod.com/componentes-pc-procesadores
  - GPU: https://www.coolmod.com/tarjetas-graficas/
  - Precio: texto tipo "423,95€" o "1.599,95€" (con punto de millar)
  - Sin stock: aparece literalmente el texto "Sin Stock" en la tarjeta
    (ya cubierto por el detector genérico de disponibilidad en generic.py,
    que busca "sin stock" como subcadena).

⚠️ IMPORTANTE: al intentar leer la página de listado con mi herramienta de
navegación (una petición HTTP simple, similar a lo que hace `requests`),
Coolmod la bloqueó activamente por detección de bots. Por tanto:
  - No pude verificar los selectores CSS exactos (ver config/sites.yaml).
  - Es MUY probable que este scraper, tal cual, también sea bloqueado en
    producción con la cabecera User-Agent genérica configurada por defecto.
  - Antes de activarlo: prueba con un User-Agent de navegador real, aumenta
    rate_limit_seconds específicamente para esta tienda, y si sigue
    bloqueando, valora un navegador headless (Playwright) en su lugar.
  - Revisa el robots.txt y los T&C de coolmod.com antes de insistir.

Se instancia desde scripts/run_weekly_update.py así:
    GenericStoreScraper(site_cfg, global_cfg, source_name="coolmod")
"""
