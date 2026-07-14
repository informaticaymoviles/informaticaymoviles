"""
Web de informaticaymoviles.com.

Sirve el cuestionario (templates/index.html) y expone una API JSON que lee la
base de datos ya generada por scripts/run_weekly_update.py (no scrapea en
tiempo real).

Ejecutar en local:
    flask --app src/app.py run
"""
from __future__ import annotations

import os

from flask import Flask, jsonify, render_template, request

from src.db import get_session, Product

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


def _base_query(session, category):
    return (
        session.query(Product)
        .filter(Product.category == category, Product.available == True)  # noqa: E712
        .filter(Product.value_score.isnot(None))
    )


@app.route("/api/pc-builder", methods=["POST"])
def api_pc_builder():
    """
    Body JSON esperado:
    {
      "budget": 1200,
      "form_factor": "desktop_component" | "laptop",
      "cpu_brand": "intel" | "amd" | "any",
      "use_case": "gaming" | "office",
      "gpu_brand": "nvidia" | "amd" | "any"   (solo si use_case == gaming)
    }
    """
    data = request.get_json(force=True)
    budget = float(data.get("budget", 0))
    form_factor = data.get("form_factor", "desktop_component")
    cpu_brand = data.get("cpu_brand", "any")
    use_case = data.get("use_case", "office")
    gpu_brand = data.get("gpu_brand", "any")

    session = get_session()

    if form_factor == "laptop":
        query = _base_query(session, "laptop").filter(Product.price_eur <= budget)
        if cpu_brand != "any":
            query = query.filter(Product.cpu_brand == cpu_brand)
        if use_case == "gaming":
            query = query.filter(Product.gpu_brand.isnot(None), Product.gpu_brand != "integrated")
            if gpu_brand != "any":
                query = query.filter(Product.gpu_brand == gpu_brand)
        else:
            query = query.filter((Product.gpu_brand == "integrated") | (Product.gpu_brand.is_(None)))

        results = query.order_by(Product.value_score.desc()).limit(20).all()
        session.close()
        return jsonify([_serialize(p) for p in results])

    # PC de escritorio a medida: recomendamos mejor CPU y mejor GPU (si gaming)
    # dentro del presupuesto, repartiendo el presupuesto de forma orientativa
    # (60% CPU / 40% GPU si gaming; 100% CPU si ofimática).
    cpu_budget = budget * (0.6 if use_case == "gaming" else 1.0)
    cpu_query = _base_query(session, "cpu").filter(Product.price_eur <= cpu_budget)
    if cpu_brand != "any":
        cpu_query = cpu_query.filter(Product.cpu_brand == cpu_brand)
    best_cpus = cpu_query.order_by(Product.value_score.desc()).limit(10).all()

    best_gpus = []
    if use_case == "gaming":
        gpu_budget = budget * 0.4
        gpu_query = _base_query(session, "gpu").filter(Product.price_eur <= gpu_budget)
        if gpu_brand != "any":
            gpu_query = gpu_query.filter(Product.gpu_brand == gpu_brand)
        best_gpus = gpu_query.order_by(Product.value_score.desc()).limit(10).all()

    session.close()
    return jsonify({
        "cpus": [_serialize(p) for p in best_cpus],
        "gpus": [_serialize(p) for p in best_gpus],
        "note": "Recomendación orientativa de CPU/GPU según presupuesto y uso. "
                "RAM, almacenamiento, placa base y fuente se muestran en la misma "
                "categoría de resultados para que completes el resto del build.",
    })


@app.route("/api/phones", methods=["POST"])
def api_phones():
    data = request.get_json(force=True)
    budget = float(data.get("budget", 0))
    os_pref = data.get("os", "any")

    session = get_session()
    query = _base_query(session, "phone").filter(Product.price_eur <= budget)
    if os_pref != "any":
        query = query.filter(Product.os == os_pref)
    results = query.order_by(Product.value_score.desc()).limit(20).all()
    session.close()
    return jsonify([_serialize(p) for p in results])


@app.route("/api/tablets", methods=["POST"])
def api_tablets():
    data = request.get_json(force=True)
    budget = float(data.get("budget", 0))

    session = get_session()
    query = _base_query(session, "tablet").filter(Product.price_eur <= budget)
    results = query.order_by(Product.value_score.desc()).limit(20).all()
    session.close()
    return jsonify([_serialize(p) for p in results])


def _serialize(p: Product) -> dict:
    return {
        "name": p.name,
        "brand": p.brand,
        "price_eur": p.price_eur,
        "source": p.source,
        "url": p.url,
        "benchmark_score": p.benchmark_score,
        "value_score": round(p.value_score, 4) if p.value_score else None,
        "ram_gb": p.ram_gb,
        "storage_gb": p.storage_gb,
        "os": p.os,
        "cpu_brand": p.cpu_brand,
        "gpu_brand": p.gpu_brand,
        "last_updated": p.last_updated.isoformat() if p.last_updated else None,
    }


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "0") == "1")
