from datetime import date

from schemas import SemanticQuery
from tools import query_semantic_layer


METRICS = {
    "revenue": "Sales.revenue",
    "cost": "Sales.cost",
    "profit": "Sales.profit",
    "margin": "Sales.marginPercent",
    "margin percent": "Sales.marginPercent",
}


def is_comparison_question(question: str) -> bool:
    q = question.lower()
    comparison_words = [
        "increase",
        "decrease",
        "compare",
        "higher",
        "lower",
        "from",
        "to",
    ]
    return any(word in q for word in comparison_words)


def get_comparison_data(metric: str, country: str | None = None):
    metric_key = metric.lower()

    if metric_key not in METRICS:
        raise ValueError(
            f"Unsupported metric '{metric}'. "
            f"Supported metrics: {', '.join(METRICS)}."
        )

    cube_measure = METRICS[metric_key]
    current_year = date.today().year

    filters = {}
    if country:
        filters["Sales.country"] = country

    results = {}

    for month_name, month_number in (("july", 7), ("august", 8)):
        start_date = date(current_year, month_number, 1)

        if month_number == 7:
            end_date = date(current_year, 8, 1)
            end_date = end_date.fromordinal(end_date.toordinal() - 1)
        else:
            end_date = date(current_year, 9, 1)
            end_date = end_date.fromordinal(end_date.toordinal() - 1)

        query = SemanticQuery(
            measures=[cube_measure],
            filters=filters.copy(),
            time_range=None,
        )

        from tools import CUBE_API_URL
        import requests

        payload = {
            "query": {
                "measures": query.measures,
                "dimensions": query.dimensions,
                "filters": [
                    {
                        "member": field,
                        "operator": "equals",
                        "values": [value],
                    }
                    for field, value in query.filters.items()
                ],
                "timeDimensions": [
                    {
                        "dimension": "Sales.orderDate",
                        "dateRange": [
                            start_date.isoformat(),
                            end_date.isoformat(),
                        ],
                    }
                ],
            }
        }

        response = requests.post(CUBE_API_URL, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json().get("data", [])
        results[month_name] = data

    return results


def calculate_change(july_data, august_data, metric):
    if not july_data or not august_data:
        raise ValueError("Not enough data to compare July and August.")

    metric_key = metric.lower()
    if metric_key not in METRICS:
        raise ValueError(f"Unsupported metric: {metric}")

    cube_measure = METRICS[metric_key]

    july_value = float(july_data[0][cube_measure])
    august_value = float(august_data[0][cube_measure])

    difference = august_value - july_value

    percentage_change = (
        (difference / july_value) * 100
        if july_value != 0
        else None
    )

    return {
        "metric": metric_key,
        "july": july_value,
        "august": august_value,
        "difference": difference,
        "percentage_change": percentage_change,
    }
