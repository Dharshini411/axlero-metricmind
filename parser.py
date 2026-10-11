
from schemas import SemanticQuery


MEASURES = {
    "revenue": "Sales.revenue",
    "cost": "Sales.cost",
    "profit": "Sales.profit",
    "margin percent": "Sales.marginPercent",
    "margin": "Sales.marginPercent",
}


DIMENSIONS = {
    "sales channel": "Sales.salesChannel",
    "country": "Sales.country",
    "region": "Sales.region",
    "product name": "Sales.productName",
    "product": "Sales.productName",
    "category": "Sales.category",
    "customer name": "Sales.customerName",
    "customer": "Sales.customerName",
    "segment": "Sales.segment",
    "channel": "Sales.salesChannel",
    "month": "Sales.orderDate",
    "date": "Sales.orderDate",
}


COUNTRIES = [
    "India",
    "USA",
    "UK",
    "France",
    "Germany",
    "Japan",
    "Canada",
    "Australia",
]


# The current Semantic Layer does not expose a state dimension.
UNSUPPORTED_STATES = [
    "Maharashtra",
    "Gujarat",
    "Karnataka",
    "Tamil Nadu",
    "Delhi",
    "Rajasthan",
    "West Bengal",
]


def parse_question(question: str) -> SemanticQuery:
    q = question.lower()

    # Recognize common time ranges.
    time_range = None

    if "last month" in q:
        time_range = "last month"
    elif "this month" in q:
        time_range = "this month"
    elif "last year" in q:
        time_range = "last year"
    elif "this year" in q:
        time_range = "this year"

    # Reject unsupported state-level questions.
    for state in UNSUPPORTED_STATES:
        if state.lower() in q:
            raise ValueError(
                "State-level analysis is not available because "
                "the Semantic Layer currently supports country-level "
                f"data only. '{state}' cannot be filtered."
            )

    measures = []
    dimensions = []
    filters = {}

    # Detect measures.
    for keyword in sorted(MEASURES, key=len, reverse=True):
        if keyword in q:
            cube_measure = MEASURES[keyword]

            if cube_measure not in measures:
                measures.append(cube_measure)

    # Detect dimensions.
    for keyword in sorted(DIMENSIONS, key=len, reverse=True):
        if keyword in q:
            cube_dimension = DIMENSIONS[keyword]

            # A time-range question filters by date rather than
            # automatically grouping the results by date.
            if (
                time_range is not None
                and cube_dimension == "Sales.orderDate"
            ):
                continue

            if cube_dimension not in dimensions:
                dimensions.append(cube_dimension)

    # Detect country filters.
    for country in COUNTRIES:
        if country.lower() in q:
            filters["Sales.country"] = country
            break

    # Require at least one recognized measure.
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
