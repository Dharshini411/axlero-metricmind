"""
MetricMind — CSV to PostgreSQL loader.

Automates what was previously done manually via pgAdmin's Import/Export tool:
loads each raw CSV file into its matching table in the "raw" schema, in an
order that respects foreign key dependencies.

Usage:
    python load_data.py

Requires:
    pip install psycopg2-binary pandas
"""

import pandas as pd
from sqlalchemy import create_engine

# ---- connection settings — update these for your environment ----
DB_USER = "postgres"
DB_PASSWORD = "your_password"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "metricmind"

# Order matters: independent tables first, then tables that reference them.
LOAD_ORDER = [
    ("customers", "../data/raw/customers_raw.csv"),
    ("products", "../data/raw/products_raw.csv"),
    ("date_dimension", "../data/raw/date_dimension_raw.csv"),
    ("orders", "../data/raw/orders_raw.csv"),
    ("costs", "../data/raw/costs_raw.csv"),
]


def get_engine():
    url = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    return create_engine(url)


def load_all():
    engine = get_engine()

    for table_name, csv_path in LOAD_ORDER:
        print(f"Loading {csv_path} -> raw.{table_name} ...")
        df = pd.read_csv(csv_path)
        df.to_sql(
            table_name,
            engine,
            schema="raw",
            if_exists="append",
            index=False,
        )
        print(f"  -> {len(df)} rows loaded into raw.{table_name}")

    print("\nAll tables loaded successfully.")


if __name__ == "__main__":
    load_all()