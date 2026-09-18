from schemas import SemanticQuery


def parse_question(question: str) -> SemanticQuery:

    q = question.lower()

    if "profit" in q:
        metric = "profit"

    elif "revenue" in q:
        metric = "revenue"

    elif "sales" in q:
        metric = "revenue"

    else:
        raise ValueError("I don't understand which metric you want.")

    dimensions = []

    if "by region" in q or "region" in q:
        dimensions.append("region")

    if "by state" in q or "state" in q:
        dimensions.append("state")

    filters = {}

    if "maharashtra" in q:
        filters["state"] = "Maharashtra"

    elif "karnataka" in q:
        filters["state"] = "Karnataka"

    if "last month" in q:
        filters["period"] = "last_month"

    return SemanticQuery(
        metric=metric,
        dimensions=dimensions,
        filters=filters
    )