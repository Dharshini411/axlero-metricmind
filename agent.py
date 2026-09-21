
from parser import parse_question
from tools import query_semantic_layer


def format_value(value):
    if isinstance(value, (int, float)):
        return f"{value:,.2f}"

    return str(value)


def generate_lookup_answer(query, data):
    if not data:
        return "I couldn't find any data for that question."

    if query.dimensions:
        dimension = query.dimensions[0]

        lines = []

        for row in data:
            dimension_value = row.get(dimension, "Unknown")

            metric_values = []

            for measure in query.measures:
                value = row.get(measure)

                if value is not None:
                    metric_name = measure.split(".")[-1]

                    metric_values.append(
                        f"{metric_name}: {format_value(value)}"
                    )

            lines.append(
                f"{dimension_value} → "
                + ", ".join(metric_values)
            )

        return "\n".join(lines)

    row = data[0]

    results = []

    for measure in query.measures:
        value = row.get(measure)

        if value is not None:
            metric_name = measure.split(".")[-1]

            results.append(
                f"{metric_name}: {format_value(value)}"
            )

    if not results:
        return "I found the data, but couldn't determine the values."

    return "\n".join(results)


def run_agent(question: str):

    print("User question:")
    print(question)

    query = parse_question(question)

    print("\nStructured query:")
    print(query)

    result = query_semantic_layer(query)

    print("\nSemantic API result:")
    print(result)

    answer = generate_lookup_answer(
        query,
        result
    )

    print("\nAnswer:")
    print(answer)

    return {
        "type": "lookup",
        "answer": answer
    }


def highest_revenue_country():

    print("Step 1: Query revenue by country")

    revenue_query = parse_question(
        "Show revenue by country"
    )

    revenue_data = query_semantic_layer(
        revenue_query
    )

    if not revenue_data:
        return "I couldn't find country revenue data."

    highest_country = max(
        revenue_data,
        key=lambda row: float(
            row["Sales.revenue"]
        )
    )

    country = highest_country["Sales.country"]
    revenue = highest_country["Sales.revenue"]

    print("\nStep 1 result:")
    print(highest_country)

    print("\nStep 2: Query profit for", country)

    profit_query = parse_question(
        f"Show profit for {country}"
    )

    profit_data = query_semantic_layer(
        profit_query
    )

    if not profit_data:
        return f"I found {country}'s revenue but couldn't find its profit."

    profit = profit_data[0].get(
        "Sales.profit"
    )

    print("\nStep 2 result:")
    print(profit_data)

    answer = (
        f"{country} has the highest revenue at "
        f"{format_value(float(revenue))}. "
        f"Its profit is "
        f"{format_value(float(profit))}."
    )

    print("\nFinal answer:")
    print(answer)

    return answer

