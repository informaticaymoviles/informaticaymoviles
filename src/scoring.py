"""
Cruza los productos scrapeados (tabla Product) con los benchmarks (tabla
Benchmark) y calcula value_score para cada producto:

  - CPU / GPU:            value_score = benchmark_score / precio
  - Móviles / Tablets:    value_score = (w1*antutu_norm + w2*ram_norm + w3*storage_norm) / precio

Los productos sin benchmark encontrado (modelo no reconocido) se guardan sin
value_score y se listan en data/unmatched_products.csv para revisión manual.
"""
from __future__ import annotations

import csv
import os

import yaml
from sqlalchemy.orm import Session

from src.db import Product, Benchmark, get_session, BASE_DIR

CONFIG_PATH = os.path.join(BASE_DIR, "config", "benchmarks.yaml")


def _load_weights() -> dict:
    with open(CONFIG_PATH, encoding="utf-8") as f:
        return yaml.safe_load(f)


def _find_benchmark(session: Session, kind: str, normalized_model: str) -> float | None:
    match = (
        session.query(Benchmark)
        .filter(Benchmark.kind == kind, Benchmark.normalized_model == normalized_model)
        .first()
    )
    return match.score if match else None


def score_pc_components(session: Session) -> list[Product]:
    unmatched = []
    for category, kind in (("cpu", "cpu_mark"), ("gpu", "g3d_mark")):
        products = session.query(Product).filter(Product.category == category).all()
        for product in products:
            score = _find_benchmark(session, kind, product.normalized_model)
            if score is None:
                unmatched.append(product)
                continue
            product.benchmark_score = score
            product.value_score = score / product.price_eur if product.price_eur else None
    return unmatched


def score_phones_and_tablets(session: Session) -> list[Product]:
    weights = _load_weights()["scoring_weights"]["phones_tablets"]
    unmatched = []

    products = session.query(Product).filter(Product.category.in_(("phone", "tablet"))).all()
    if not products:
        return unmatched

    antutu_scores = {}
    for product in products:
        score = _find_benchmark(session, "antutu", product.normalized_model)
        antutu_scores[product.id] = score

    max_antutu = max([s for s in antutu_scores.values() if s], default=1)
    max_ram = max([p.ram_gb for p in products if p.ram_gb], default=1)
    max_storage = max([p.storage_gb for p in products if p.storage_gb], default=1)

    for product in products:
        antutu = antutu_scores.get(product.id)
        if antutu is None:
            unmatched.append(product)
            continue
        antutu_norm = antutu / max_antutu if max_antutu else 0
        ram_norm = (product.ram_gb / max_ram) if product.ram_gb and max_ram else 0
        storage_norm = (product.storage_gb / max_storage) if product.storage_gb and max_storage else 0

        combined = (
            weights["w_benchmark"] * antutu_norm
            + weights["w_ram"] * ram_norm
            + weights["w_storage"] * storage_norm
        )
        product.benchmark_score = antutu
        product.value_score = combined / product.price_eur if product.price_eur else None

    return unmatched


def run_scoring():
    session = get_session()
    unmatched = []
    unmatched += score_pc_components(session)
    unmatched += score_phones_and_tablets(session)
    session.commit()

    if unmatched:
        path = os.path.join(BASE_DIR, "data", "unmatched_products.csv")
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["id", "category", "name", "source", "url"])
            for p in unmatched:
                writer.writerow([p.id, p.category, p.name, p.source, p.url])
        print(f"[scoring] {len(unmatched)} productos sin benchmark encontrado -> {path}")

    session.close()


if __name__ == "__main__":
    run_scoring()
