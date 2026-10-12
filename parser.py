import re

from schemas import SemanticQuery


MEASURES = {
    "margin percentage": "Sales.marginPercent",
    "profit margin": "Sales.marginPercent",
    "margin percent": "Sales.marginPercent",
    "revenue": "Sales.revenue",
    "sales": "Sales.revenue",
    "turnover": "Sales.revenue",
    "cost": "Sales.cost",
    "costs": "Sales.cost",
    "profit": "Sales.profit",
    "margin": "Sales.marginPercent",
}

DIMENSIONS = {
    "sales channels": "Sales.salesChannel",
    "sales channel": "Sales.salesChannel",
    "customer names": "Sales.customerName",
    "customer name": "Sales.customerName",
    "product names": "Sales.productName",
    "product name": "Sales.productName",
    "countries": "Sales.country",
    "country": "Sales.country",
    "regions": "Sales.region",
    "region": "Sales.region",
    "products": "Sales.productName",
    "product": "Sales.productName",
    "categories": "Sales.category",
    "category": "Sales.category",
    "customers": "Sales.customerName",
    "customer": "Sales.customerName",
    "segments": "Sales.segment",
    "segment": "Sales.segment",
    "channels": "Sales.salesChannel",
    "channel": "Sales.salesChannel",
    "months": "Sales.orderDate",
    "month": "Sales.orderDate",
    "dates": "Sales.orderDate",
    "date": "Sales.orderDate",
}

COUNTRIES = {
    "India": ["india"],
    "USA": ["usa", "united states", "us"],
    "UK": ["uk", "united kingdom", "britain"],
    "France": ["france"],
    "Germany": ["germany"],
    "Japan": ["japan"],
    "Canada": ["canada"],
    "Australia": ["australia"],
}

UNSUPPORTED_STATES = [
    "Maharashtra",
    "Gujarat",
    "Karnataka",
    "Tamil Nadu",
    "Delhi",
    "Rajasthan",
    "West Bengal",
]


def contains_phrase(text: str, phrase: str) -> bool:
    """Match a phrase without matching it inside another word."""
    pattern = r"(?<!\w)" + re.escape(phrase) + r"(?!\w)"
    return re.search(pattern, text, flags=re.IGNORECASE) is not None


def parse_question(question: str) -> SemanticQuery:
    if not question or not question.strip():
        raise ValueError("Please enter a business question.")

    q = question.lower()
    time_range = None

    time_aliases = {
        "last month": ["last month", "previous month"],
        "this month": ["this month", "current month"],
        "last year": ["last year", "previous year"],
        "this year": ["this year", "current year"],
    }

    for time_name, aliases in time_aliases.items():
        if any(contains_phrase(q, alias) for alias in aliases):
            time_range = time_name
            break

    for state in UNSUPPORTED_STATES:
        if contains_phrase(q, state.lower()):
            raise ValueError(
                "State-level analysis is not available because "
                "the Semantic Layer currently supports country-level "
                f"data only. '{state}' cannot be filtered."
            )

    measures = []
    dimensions = []
    filters = {}

    # Prefer longer metric names to avoid duplicate matches.
    for keyword in sorted(MEASURES, key=len, reverse=True):
        if contains_phrase(q, keyword):
            measure = MEASURES[keyword]

            if measure not in measures:
                measures.append(measure)

    for keyword in sorted(DIMENSIONS, key=len, reverse=True):
        if contains_phrase(q, keyword):
            dimension = DIMENSIONS[keyword]

            # A date filter alone should not group results by date.
            if (
                time_range
                and dimension == "Sales.orderDate"
            ):
                continue

            if dimension not in dimensions:
                dimensions.append(dimension)

    # Recognize country names and common aliases.
    for country, aliases in COUNTRIES.items():
        if any(contains_phrase(q, alias) for alias in aliases):
            filters["Sales.country"] = country
            break

    if not measures:
        raise ValueError(
            "I couldn't identify a metric. "
            "Try revenue, cost, profit, or margin."
        )

    return SemanticQuery(
        measures=measures,
        dimensions=dimensions,
        filters=filters,
        time_range=time_range,
    )