"""
MetricMind Project - load_data.py
-----------------------------------
Real team dataset (5 CSV files) ko PostgreSQL ke `raw` schema
mein load karta hai.

Requirements:
    pip install pandas sqlalchemy psycopg2-binary

Note: Pehle schema.sql chala ke tables bana lo (pgAdmin Query Tool se),
      uske baad ye script data load karega.
"""

import pandas as pd
from sqlalchemy import create_engine

# ============================================================
# DATABASE CONNECTION - apni details yaha daalo
# ============================================================
DB_USER = "postgres"
DB_PASSWORD = "Verm@45."   # apna pgAdmin password daalo
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "metricmind"

engine = create_engine(
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# ============================================================
# CSV FILES KA PATH (apne system ke hisaab se folder path adjust karo)
# ============================================================
DATA_FOLDER = "data/raw"  # jaha aapki 5 CSV files rakhi hain

files_to_tables = {
    "customers_raw.csv": "customers",
    "products_raw.csv": "products",
    "date_dimension_raw.csv": "date_dimension",
    "orders_raw.csv": "orders",
    "costs_raw.csv": "costs",
}


def load_csv_to_table(csv_filename, table_name):
    """Ek CSV file ko raw schema ke table mein load karta hai."""
    filepath = f"{DATA_FOLDER}/{csv_filename}"
    print(f"Loading {filepath} -> raw.{table_name} ...")

    df = pd.read_csv(filepath)

    df.to_sql(
        table_name,
        engine,
        schema="raw",
        if_exists="append",   # table already schema.sql se bana hua hai
        index=False,
    )
    print(f"  -> {len(df)} rows loaded into raw.{table_name}")


def main():
    for csv_file, table in files_to_tables.items():
        load_csv_to_table(csv_file, table)

    print("\nSab CSV files successfully load ho gayi hain!")


if __name__ == "__main__":
    main()