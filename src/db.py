"""
Modelos de base de datos (SQLite via SQLAlchemy) para informaticaymoviles.com

Tablas:
- Product: cualquier artículo scrapeado (componente de PC, portátil, móvil o tablet)
- Benchmark: puntuaciones de referencia (PassMark CPU/GPU, Antutu) por modelo normalizado
"""
from __future__ import annotations

import datetime
import os

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, create_engine
)
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "db.sqlite3")

Base = declarative_base()


class Product(Base):
    """
    Un producto tal y como aparece en una tienda concreta.
    category: 'cpu' | 'gpu' | 'ram' | 'storage' | 'motherboard' | 'psu' | 'case' | 'cooler'
              | 'laptop' | 'phone' | 'tablet'
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category = Column(String(32), nullable=False, index=True)
    name = Column(String(256), nullable=False)
    normalized_model = Column(String(256), index=True)  # para cruzar con Benchmark
    brand = Column(String(64))
    price_eur = Column(Float, nullable=False)
    available = Column(Boolean, default=True)
    source = Column(String(64), nullable=False)   # 'pccomponentes', 'mediamarkt', ...
    url = Column(String(512), nullable=False)

    # Específico de PC
    cpu_brand = Column(String(16))       # 'intel' | 'amd'
    gpu_brand = Column(String(16))       # 'nvidia' | 'amd' | 'integrated'
    form_factor = Column(String(16))     # 'desktop_component' | 'laptop'

    # Específico de móviles / tablets
    os = Column(String(16))              # 'android' | 'ios'
    ram_gb = Column(Float)
    storage_gb = Column(Float)

    # Calculado por scoring.py
    benchmark_score = Column(Float)
    value_score = Column(Float, index=True)

    last_updated = Column(DateTime, default=datetime.datetime.utcnow)


class Benchmark(Base):
    """
    Puntuación de referencia por modelo (CPU, GPU o SoC de móvil), independiente
    de la tienda. Se cruza con Product.normalized_model.
    """
    __tablename__ = "benchmarks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    kind = Column(String(16), nullable=False, index=True)  # 'cpu_mark' | 'g3d_mark' | 'antutu'
    model_name = Column(String(256), nullable=False)
    normalized_model = Column(String(256), index=True)
    score = Column(Float, nullable=False)
    source_url = Column(String(512))
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)


def get_engine():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    return create_engine(f"sqlite:///{DB_PATH}")


def get_session():
    engine = get_engine()
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine)()
