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
                results = [
                    row for row in results
                    if row["month"] == "2026-08"
                ]

        elif key == "month":
            results = [
                row for row in results
                if row["month"] == value
            ]

    # Handle "by region"
    if "region" in query.dimensions:

        grouped = {}

        for row in results:
            region = row["region"]

            if region not in grouped:
                grouped[region] = 0

            grouped[region] += row[query.metric]

        return [
            {
                "region": region,
                query.metric: value
            }
            for region, value in grouped.items()
        ]

    # Handle "by state"
    if "state" in query.dimensions:

        grouped = {}

        for row in results:
            state = row["state"]

            if state not in grouped:
                grouped[state] = 0

            grouped[state] += row[query.metric]

        return [
            {
                "state": state,
                query.metric: value
            }
            for state, value in grouped.items()
        ]

    # Normal query
    output = []

    for row in results:
        output.append({
            "month": row["month"],
            "state": row["state"],
            query.metric: row[query.metric]
        })

    return output