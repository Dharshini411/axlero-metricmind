
from parser import parse_question
from tools import query_semantic_layer
from reasoning import (
    is_comparison_question,
    get_comparison_data,
    calculate_change
)


def format_currency(value):
    return f"₹{value:,.0f}"


def generate_lookup_answer(query, data):
    if not data:
        return "I couldn't find any data for that question."

    # Grouped result, for example: sales by region
    if query.dimensions:

        lines = []

        for row in data:
            dimension = query.dimensions[0]
            dimension_value = row.get(dimension)
            metric_value = row.get(query.metric)

            lines.append(
                f"{dimension_value}: {format_currency(metric_value)}"
            )

        title = f"{query.metric.title()} by {query.dimensions[0]}:"

        return title + "\n" + "\n".join(lines)

    # Normal single-result query
    row = data[0]

    metric_value = row.get(query.metric)

    if metric_value is None:
        return "I found the data, but I couldn't determine the value."

    metric_name = query.metric.title()

    return f"{metric_name} was {format_currency(metric_value)}."


def run_agent(question: str):

    print("User question:")
    print(question)

    # Check if this is a comparison question
    if is_comparison_question(question):

        # Current prototype comparison
        metric = "revenue"
        state = "Maharashtra"

        data = get_comparison_data(
            metric=metric,
            state=state
        )

        result = calculate_change(
            data["july"],
            data["august"],
            metric
        )

        answer = (
            f"{metric.title()} in {state} increased by "
            f"{format_currency(result['difference'])} "
            f"from July to August, which is "
            f"{result['percentage_change']:.1f}%."
        )

        print("\nAnswer:")
        print(answer)

        return {
            "type": "comparison",
            "answer": answer
        }

    # Normal question
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

