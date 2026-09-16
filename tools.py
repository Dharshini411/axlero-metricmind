from schemas import SemanticQuery
from mock_data import sales_data


def query_semantic_layer(query: SemanticQuery):
    results = sales_data

    # Apply filters
    for key, value in query.filters.items():

        if key == "state":
            results = [
                row for row in results
                if row["state"].lower() == value.lower()
            ]

        elif key == "period":
            if value == "last_month":
                # For our mock project, last_month = August 2026
                results = [
                    row for row in results
                    if row["month"] == "2026-08"
                ]

    # Get requested metric
    output = []

    for row in results:
        output.append({
            "month": row["month"],
            "state": row["state"],
            query.metric: row[query.metric]
        })

    return output