from schemas import SemanticQuery
from tools import query_semantic_layer


def is_comparison_question(question: str) -> bool:

    q = question.lower()

    comparison_words = [
        "increase",
        "decrease",
        "compare",
        "higher",
        "lower",
        "from",
        "to"
    ]

    return any(word in q for word in comparison_words)


def get_comparison_data(metric: str, state: str):

    # Get July data
    july_query = SemanticQuery(
        metric=metric,
        filters={
            "state": state,
            "month": "2026-07"
        }
    )

    july_data = query_semantic_layer(july_query)

    # Get August data
    august_query = SemanticQuery(
        metric=metric,
        filters={
            "state": state,
            "month": "2026-08"
        }
    )

    august_data = query_semantic_layer(august_query)

    return {
        "july": july_data,
        "august": august_data
    }


def calculate_change(july_data, august_data, metric):

    july_value = july_data[0][metric]
    august_value = august_data[0][metric]

    difference = august_value - july_value

    percentage_change = (difference / july_value) * 100

    return {
        "metric": metric,
        "july": july_value,
        "august": august_value,
        "difference": difference,
        "percentage_change": percentage_change
    }