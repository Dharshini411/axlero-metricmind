
import requests
from datetime import date, timedelta

from schemas import SemanticQuery


CUBE_API_URL = (
    "https://cgi-payday-alignment-recruitment.trycloudflare.com/"
    "cubejs-api/v1/load"
)


def get_date_range(time_range):
    today = date.today()

    if time_range == "last month":
        first_this_month = today.replace(day=1)
        last_day_previous_month = first_this_month - timedelta(days=1)
        first_previous_month = last_day_previous_month.replace(day=1)

        return [
            first_previous_month.isoformat(),
            last_day_previous_month.isoformat(),
        ]

    if time_range == "this month":
        return [
            today.replace(day=1).isoformat(),
            today.isoformat(),
        ]

    if time_range == "last year":
        return [
            date(today.year - 1, 1, 1).isoformat(),
            date(today.year - 1, 12, 31).isoformat(),
        ]

    if time_range == "this year":
        return [
            date(today.year, 1, 1).isoformat(),
            today.isoformat(),
        ]

    return None


def build_cube_query(query: SemanticQuery):
    """Build the Cube.js query used for data and SQL retrieval."""
    cube_filters = [
        {
            "member": field,
            "operator": "equals",
            "values": [value],
        }
        for field, value in query.filters.items()
    ]

    cube_query = {
        "measures": query.measures,
        "dimensions": query.dimensions,
        "filters": cube_filters,
    }

    date_range = get_date_range(query.time_range)

    if date_range or query.granularity:
        time_dimension = {
            "dimension": "Sales.orderDate",
        }

        if date_range:
            time_dimension["dateRange"] = date_range

        if query.granularity:
            time_dimension["granularity"] = query.granularity

        cube_query["timeDimensions"] = [time_dimension]

    return cube_query


def query_semantic_layer(query: SemanticQuery):
    cube_query = build_cube_query(query)

    response = requests.post(
        CUBE_API_URL,
        json={"query": cube_query},
        timeout=30,
    )
    response.raise_for_status()

    result = response.json()
    return result.get("data", [])


def query_generated_sql(query: SemanticQuery):
    """Return generated SQL from Cube.js, or None if unavailable."""
    cube_query = build_cube_query(query)
    sql_url = CUBE_API_URL.rsplit("/", 1)[0] + "/sql"

    try:
        response = requests.post(
            sql_url,
            json={"query": cube_query},
            timeout=30,
        )
        response.raise_for_status()

        result = response.json()
        sql_info = result.get("sql", {})
        sql_parts = sql_info.get("sql", [])

        if sql_parts and isinstance(sql_parts[0], str):
            return sql_parts[0]

        return None

    except (requests.RequestException, ValueError, AttributeError) as error:
        print(f"Could not retrieve generated SQL: {error}")
        return None
