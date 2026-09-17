from parser import parse_question
from tools import query_semantic_layer
from reasoning import (
    is_comparison_question,
    get_comparison_data,
    calculate_change
)


def run_agent(question: str):

    print("User question:")
    print(question)

    # Check if this is a comparison question
    if is_comparison_question(question):

        # For our current prototype
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

        print("\nReasoning result:")
        print(result)

        return {
            "type": "comparison",
            "result": result
        }

    # Normal question
    query = parse_question(question)

    print("\nStructured query:")
    print(query)

    result = query_semantic_layer(query)

    print("\nSemantic API result:")
    print(result)

    return {
        "type": "lookup",
        "query": query,
        "data": result
    }