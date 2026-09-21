
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


def parse_question(question: str) -> SemanticQuery:
    q = question.lower()

    measures = []
    dimensions = []
    filters = {}

    # Detect measures
    for keyword in sorted(MEASURES, key=len, reverse=True):
        if keyword in q:
            cube_measure = MEASURES[keyword]

            if cube_measure not in measures:
                measures.append(cube_measure)

    # Detect dimensions
    for keyword in sorted(DIMENSIONS, key=len, reverse=True):
        if keyword in q:
            cube_dimension = DIMENSIONS[keyword]

            if cube_dimension not in dimensions:
                dimensions.append(cube_dimension)

    # Detect country filters
    for country in COUNTRIES:
        if country.lower() in q:
            filters["Sales.country"] = country
            break

    # Require at least one measure
    if not measures:
        raise ValueError(
            "I couldn't identify a metric. "
            "Try revenue, cost, profit, or margin."
        )

    return SemanticQuery(
        measures=measures,
        dimensions=dimensions,
        filters=filters,
    )

