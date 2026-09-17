from schemas import SemanticQuery


def parse_question(question: str) -> SemanticQuery:

    q = question.lower()

    # Detect metric
    if "profit" in q:
        metric = "profit"

    elif "revenue" in q:
        metric = "revenue"

    else:
        raise ValueError("I don't understand which metric you want.")

    # Detect filters
    filters = {}

    if "maharashtra" in q:
        filters["state"] = "Maharashtra"

    elif "karnataka" in q:
        filters["state"] = "Karnataka"

    if "last month" in q:
        filters["period"] = "last_month"

    return SemanticQuery(
        metric=metric,
        dimensions=[],
        filters=filters
    )