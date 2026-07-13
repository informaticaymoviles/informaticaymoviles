# informaticaymoviles.com

Comparador **open source** (GPL-3.0) de componentes de PC, portátiles, móviles y tablets,
que calcula automáticamente la relación **calidad/precio** cruzando:

- Precios y disponibilidad reales, extraídos semanalmente de webs de referencia.
- Rendimiento real, extraído de [PassMark CPU Mark](https://www.cpubenchmark.net) y
  [PassMark G3D Mark](https://www.videocardbenchmark.net) para componentes de PC.
- Rendimiento real, extraído de [Antutu Benchmark](https://www.antutu.com) para móviles y tablets.

El resultado final es una web sencilla que hace unas preguntas al usuario (presupuesto,
uso, marca preferida...) y le devuelve un listado ordenado con enlaces directos a la
tienda de origen.

> ⚠️ Lee el archivo [`DISCLAIMER.md`](DISCLAIMER.md) antes de desplegar este proyecto.
> Contiene información legal importante sobre scraping, marcas y responsabilidad.

---

## 1. Arquitectura

```
informaticaymoviles/
├── config/
│   ├── sites.yaml          # Definición de cada tienda a scrapear (selectores CSS, URLs, categorías)
│   └── benchmarks.yaml     # Fuentes de benchmark (PassMark, Antutu) y pesos de la fórmula de puntuación
├── src/
│   ├── db.py                # Modelos SQLAlchemy + creación de la base de datos SQLite
│   ├── scoring.py            # Cálculo de "puntos por euro" para PC, móviles y tablets
│   ├── app.py                 # Aplicación Flask (web + API del cuestionario)
│   ├── scrapers/
│   │   ├── base.py            # Clase base común (rate limiting, cabeceras, parsing genérico)
│   │   ├── pccomponentes.py
│   │   ├── mediamarkt.py
│   │   ├── coolmod.py
│   │   ├── neobyte.py
│   │   ├── amazon_es.py
│   │   ├── backmarket.py
│   │   ├── corteingles.py
│   │   └── carrefour.py
│   ├── benchmarks/
│   │   ├── passmark.py        # Descarga tablas CPU Mark / G3D Mark
│   │   └── antutu.py          # Descarga ranking de Antutu
│   ├── templates/index.html   # Front-end del cuestionario
│   └── static/{style.css,app.js}
├── scripts/
│   └── run_weekly_update.py   # Orquesta: scraping tiendas -> scraping benchmarks -> scoring -> guarda DB
├── .github/workflows/weekly_update.yml  # Cron semanal (GitHub Actions)
├── data/                       # Aquí se genera db.sqlite3 (no versionar los datos si prefieres)
├── requirements.txt
├── LICENSE                     # GPL-3.0
└── DISCLAIMER.md
```

## 2. Cómo funciona el flujo semanal

1. **GitHub Actions** lanza `scripts/run_weekly_update.py` cada semana (cron configurable).
2. El script recorre `config/sites.yaml` y ejecuta el scraper correspondiente a cada tienda,
   guardando en la tabla `products` (nombre, categoría, precio, disponibilidad, URL, tienda).
3. Ejecuta `src/benchmarks/passmark.py` y `src/benchmarks/antutu.py` para actualizar la tabla
   `benchmarks` (modelo de CPU/GPU/SoC -> puntuación).
4. `src/scoring.py` cruza ambas tablas (por nombre normalizado de modelo) y calcula el campo
   `value_score` (puntos de rendimiento por euro) para cada producto.
5. Se guarda todo en `data/db.sqlite3` y el propio workflow hace commit del fichero actualizado
   al repositorio (o, si lo prefieres, lo sube a un storage externo — ver comentarios en el YAML).
6. La web (`src/app.py`) simplemente lee esa base de datos en cada petición, no vuelve a scrapear
   en tiempo real.

## 3. Cuestionario de la web

**Informática (PC):**
- ¿Portátil o PC de escritorio a medida?
- Presupuesto máximo (€)
- CPU: ¿Intel o AMD?
- Uso: ¿Gaming (gráfica dedicada) u ofimática (gráficos integrados)?
- Si gaming: ¿AMD (ATI/Radeon) o NVIDIA?

**Móviles:**
- Presupuesto máximo (€)
- ¿Android o iOS?

**Tablets:**
- Presupuesto máximo (€)

Con esas respuestas, `src/app.py` filtra la base de datos y devuelve el ranking por
`value_score`, con enlace directo al producto en la tienda de origen.

## 4. Fórmula de puntuación (ajustable en `config/benchmarks.yaml`)

**PC (por componente):**
```
value_score = benchmark_score / precio
```
(CPU Mark / precio para CPUs, G3D Mark / precio para GPUs). Para el build completo se
maximiza la suma ponderada de `value_score` de CPU+GPU dentro del presupuesto, respetando
las restricciones marcadas (Intel/AMD, dedicada/integrada, etc).

**Móviles y tablets:**
```
value_score = (w1 * antutu_normalizado + w2 * ram_gb_normalizado + w3 * almacenamiento_gb_normalizado) / precio
```
Pesos por defecto: `w1=0.6, w2=0.2, w3=0.2` (editable en `config/benchmarks.yaml`).

## 5. Instalación local

```bash
git clone https://github.com/tuusuario/informaticaymoviles.git
cd informaticaymoviles
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Primera carga de datos (puede tardar, respeta rate limiting)
python scripts/run_weekly_update.py

# Lanzar la web
flask --app src/app.py run
```

Abre `http://127.0.0.1:5000`.

## 6. Despliegue

Cualquier hosting que soporte Python/Flask sirve (Render, Railway, PythonAnywhere, un VPS
con gunicorn+nginx...). El dominio `informaticaymoviles.com` solo necesita apuntar (registro A/CNAME)
al hosting elegido; este repositorio no gestiona el DNS.

Lo verificado hasta ahora, tienda por tienda:

- **PcComponentes**: categorías y paginación (`?page=N`) correctas, listado
  server-rendered, precio `1.234,56€`, URLs de producto en slug plano.
- **MediaMarkt**: categorías correctas (`/es/category/procesadores-58.html`,
  `/es/category/tarjetas-gráficas-63.html`), pero **no pagina con `?page=N`**:
  usa un botón "Mostrar más productos" que probablemente carga por
  JavaScript/XHR. El scraper incluido solo capturará los primeros ~12-24
  resultados hasta que se localice el endpoint JSON subyacente o se use un
  navegador headless.
- **Coolmod**: categorías correctas (`/componentes-pc-procesadores`,
  `/tarjetas-graficas/`), precio `1.234,56€`, "Sin Stock" como texto literal
  de agotado. **Bloqueó activamente la petición de mi herramienta de
  navegación por detección de bots**, así que no pude verificar los
  selectores CSS ni confirmar que un scraper simple (`requests` +
  `BeautifulSoup`) consiga pasar ese filtro en producción. Si al activarlo
  ves errores 403/429 constantes, es esa protección; prueba con una cabecera
  User-Agent de navegador real y/o un navegador headless, y revisa su
  `robots.txt` antes de insistir.

## 6ter. Sobre las fuentes de benchmark (PassMark y Antutu)

Verificado por inspección real (13/07/2026) — buena noticia: **las tres
fuentes de benchmark son tablas HTML estáticas de verdad**, no dependen de
JavaScript, así que un scraper simple con `requests` + `BeautifulSoup`
funciona sin necesitar navegador headless (a diferencia de MediaMarkt o
Coolmod, tratados más arriba):

- **PassMark CPU Mark**: `https://www.cpubenchmark.net/cpu_list.php` (vista
  por defecto = solo Intel) + `/cpu-list/amd` + `/cpu-list/all` para cubrir
  todas las marcas. Columnas confirmadas: Nombre, CPU Mark, Rank, CPU Value,
  Precio (USD, no usado en nuestra fórmula).
- **PassMark G3D Mark**: `https://www.videocardbenchmark.net/gpu_list.php`,
  mismas columnas equivalentes para tarjetas gráficas.
- **Antutu**: `https://www.antutu.com/web/ranking` (la URL que se supuso
  inicialmente, `/en/ranking/rank1.htm`, era incorrecta). Tabla con columnas
  Rank, Device/Spec, CPU, GPU, MEM, UX, Total Score — usamos "Total Score".
  Actualizado mensualmente, ~120 modelos, y **excluye explícitamente el
  mercado chino**. La página tiene pestañas Android/iOS y Smartphone/Pad
  cuyo comportamiento (URL propia vs. solo estado JS) no pude verificar del
  todo; revísalo con las DevTools antes de asumir que existe una URL propia
  para tablets.
- Ojo: existen también `CPU_mega_page.html` / `GPU_mega_page.html` ("Mega
  List") en PassMark — **esas sí dependen de JavaScript y llegan vacías**
  con una petición HTTP simple. No usarlas para el scraper.

## 6bis. Sobre los selectores CSS y el método "por patrones"

Los nombres exactos de clase CSS de cada tienda **deben confirmarse con las
DevTools del navegador** (F12 → clic derecho sobre una tarjeta de producto →
Inspeccionar), ya que las herramientas automatizadas de inspección remota no
siempre tienen acceso al HTML con atributos completos.

Lo que sí se ha podido verificar por inspección real de PcComponentes:
- Las categorías (`/procesadores`, `/tarjetas-graficas`...) y sus subcategorías
  por marca (`/procesadores/amd`, `/procesadores/intel`...) son correctas.
- La paginación funciona con `?page=2`, `?page=3`...
- El listado es *server-rendered* (no depende de ejecutar JavaScript para
  obtener el HTML de los productos), lo que facilita el scraping con
  `requests` + `BeautifulSoup` sin necesitar un navegador headless.
- El precio aparece siempre como texto con el patrón `1.234,56€`.
- Las URLs de producto son slugs planos sin subcarpeta.

Por eso `src/scrapers/pccomponentes.py` incluye un método alternativo,
`scrape_category_by_pattern()`, que **no depende de nombres de clase CSS**:
localiza productos por la forma de su URL (regex) y extrae el precio con otro
regex. Es más lento y algo menos preciso (por ejemplo, no distingue bien
"agotado" sin un selector de disponibilidad), pero sobrevive a rediseños
visuales que rompen los selectores CSS tradicionales. Puedes usarlo como red
de seguridad cuando el selector principal deje de encontrar resultados.

## 7. Mantenimiento de los scrapers — MUY IMPORTANTE

Los selectores CSS de cada tienda en `src/scrapers/*.py` están marcados con `# TODO`.
Las tiendas cambian su maquetación con frecuencia, así que **es normal que dejen de
funcionar de vez en cuando** y haya que actualizar el selector correspondiente. Este
repo no puede darte una garantía de funcionamiento perpetuo sobre webs de terceros que
no controla.

Antes de activar cualquier scraper en producción, revisa:
- El archivo `robots.txt` de cada tienda.
- Sus Términos y Condiciones de uso respecto a la extracción automatizada de datos.
- Limita la frecuencia de peticiones (`RATE_LIMIT_SECONDS` en `config/sites.yaml`).

## 8. Licencia

GPL-3.0. Ver [`LICENSE`](LICENSE). Puedes usar, modificar y redistribuir el código
libremente, siempre que cualquier versión derivada que distribuyas también sea GPL-3.0
y mantenga el aviso de copyright.
