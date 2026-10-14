"""
MetricMind Project - load_data.py (Updated)
---------------------------------------------
Fixes applied (per team lead review):
1. DB password ab .env file se aata hai (hardcoded nahi hai code mein)
2. Rerun karne se duplicate data nahi banta - har table pehle
   truncate hoti hai, phir fresh CSV data load hota hai

Requirements:
    pip install pandas sqlalchemy psycopg2-binary python-dotenv

Setup (pehli baar):
    1. Is file ke saath ek `.env` file banao (database folder mein)
    2. Usme ye likho (apna asli password daalo):
         DB_PASSWORD=your_actual_password
    3. `.env` file ko `.gitignore` mein add karo (taaki commit na ho)

Note: Pehle schema.sql chala ke tables bana lo (pgAdmin Query Tool se),
      uske baad ye script data load karega.
"""

import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from urllib.parse import quote_plus

# ============================================================
# .env FILE SE ENVIRONMENT VARIABLES LOAD KARO
# ============================================================
load_dotenv()

# ============================================================
# DATABASE CONNECTION - password ab .env se aata hai
# ============================================================
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")   # .env file se aayega
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "metricmind")

if not DB_PASSWORD:
    raise ValueError(
        "DB_PASSWORD nahi mila! .env file banao aur usme "
        "DB_PASSWORD=your_password likho (database folder ke andar)."
    )

# Password ko URL-encode karna zaroori hai agar usme @, #, %,
# jaise special characters hon - warna connection string galat ban jati hai
encoded_password = quote_plus(DB_PASSWORD)

engine = create_engine(
    f"postgresql+psycopg2://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# ============================================================
# CSV FILES KA PATH
# ============================================================
DATA_FOLDER = "data/raw"

files_to_tables = {
    "customers_raw.csv": "customers",
    "products_raw.csv": "products",
    "date_dimension_raw.csv": "date_dimension",
    "orders_raw.csv": "orders",
    "costs_raw.csv": "costs",
}


def truncate_table(table_name):
    """Table ko khaali karta hai taaki dobara load karne pe
    duplicate data na bane. CASCADE isliye taaki agar koi
    dusri table isse foreign-key se judi ho to bhi chal jaye."""
    with engine.connect() as conn:
        conn.execute(text(f"TRUNCATE TABLE raw.{table_name} CASCADE;"))
        conn.commit()
    print(f"  -> raw.{table_name} truncated (purana data hataya)")


def load_csv_to_table(csv_filename, table_name):
    """Ek CSV file ko raw schema ke table mein load karta hai.
    Pehle table truncate hoti hai, phir fresh data load hota hai -
    isse rerun karne pe duplicate rows nahi banti."""
    filepath = f"{DATA_FOLDER}/{csv_filename}"
    print(f"Loading {filepath} -> raw.{table_name} ...")

    # Step 1: Purana data hatao (duplicate se bachne ke liye)
    truncate_table(table_name)

    # Step 2: Naya data load karo
    df = pd.read_csv(filepath)
    df.to_sql(
        table_name,
        engine,
        schema="raw",
        if_exists="append",   # table already bani hai, sirf rows add karo
        index=False,
    )
    print(f"  -> {len(df)} rows loaded into raw.{table_name}")


def main():
    for csv_file, table in files_to_tables.items():
        load_csv_to_table(csv_file, table)

    print("\nSab CSV files successfully (re)load ho gayi hain, bina duplicate ke!")


if __name__ == "__main__":
    main()