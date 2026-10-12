
import re

from parser import parse_question
from tools import query_semantic_layer
from local_agent import run_local_agent


METRIC_NAMES = {
    "Sales.revenue": "Revenue",
    "Sales.cost": "Cost",
    "Sales.profit": "Profit",
    "Sales.marginPercent": "Margin",
}

METRIC_ALIASES = {
    "revenue": "Sales.revenue",
    "sales": "Sales.revenue",
    "turnover": "Sales.revenue",
    "cost": "Sales.cost",
    "costs": "Sales.cost",
    "profit": "Sales.profit",
    "margin percentage": "Sales.marginPercent",
    "profit margin": "Sales.marginPercent",
    "margin percent": "Sales.marginPercent",
    "margin": "Sales.marginPercent",
}

RANKING_WORDS = {
    "highest": "highest",
    "maximum": "highest",
    "greatest": "highest",
    "most": "highest",
    "top": "highest",
    "lowest": "lowest",
    "minimum": "lowest",
    "least": "lowest",
    "bottom": "lowest",
    "worst": "lowest",
}


def contains_phrase(text, phrase):
    pattern = r"\b" + re.escape(phrase) + r"\b"
    return re.search(pattern, text, re.IGNORECASE) is not None


def format_value(value):
    if value is None:
        return "N/A"

    try:
        number = float(value)

        if number.is_integer():
            return f"{number:,.0f}"

        return f"{number:,.2f}"

    except (ValueError, TypeError):
        return str(value)


def get_ranking(question):
    """Return highest/lowest ranking intent, if present."""
    q = question.lower()

    for word, direction in RANKING_WORDS.items():
        if contains_phrase(q, word):
            return direction

    return None


def get_ranking_measure(question, query):
    """Choose the metric mentioned earliest in the question."""
    q = question.lower()
    matches = []

    for alias, measure in METRIC_ALIASES.items():
        if measure not in query.measures:
            continue

        match = re.search(
            r"\b" + re.escape(alias) + r"\b",
            q,
        )

        if match:
            matches.append((match.start(), measure))

    if not matches:
        return query.measures[0] if query.measures else None

    matches.sort(key=lambda item: item[0])
    return matches[0][1]


def get_top_count(question):
    """Read requests such as 'top 5 countries'."""
    match = re.search(
        r"\b(?:top|bottom)\s+(\d+)\b",
        question.lower(),
    )

    if match:
        return max(1, min(int(match.group(1)), 100))

    return 1


def format_lookup_rows(query, data):
    """Format data returned by the live Semantic Layer API."""
    if not data:
        return "I couldn't find any data for that question."

    lines = []

    for row in data:
        dimension_values = []

        for dimension in query.dimensions:
            name = dimension.split(".")[-1]
            value = row.get(dimension, "Unknown")
            dimension_values.append(f"{name}: {value}")

        metric_values = []

        for measure in query.measures:
            value = row.get(measure)

            if value is not None:
                name = METRIC_NAMES.get(
                    measure,
                    measure.split(".")[-1],
                )
                metric_values.append(
                    f"{name}: {format_value(value)}"
                )

        parts = dimension_values + metric_values

        if parts:
            lines.append(" | ".join(parts))

    if not lines:
        return "I found the data, but couldn't determine the values."

    return "\n".join(lines)


def generate_lookup_answer(query, data):
    """Backward-compatible helper used by older code."""
    return format_lookup_rows(query, data)


def run_agent(question: str):
    """Try the live API first, then fall back to local sample data."""
    try:
        query = parse_question(question)
        data = query_semantic_layer(query)

        # Use local data if the API returns no records.
        if not data:
            return run_local_agent(question)

        ranking = get_ranking(question)

        if ranking:
            if not query.dimensions:
                return {
                    "type": "error",
                    "answer": (
                        "To rank results, specify a dimension such as "
                        "country, region, product, or customer."
                    ),
                }

            measure = get_ranking_measure(question, query)

            if not measure:
                return {
                    "type": "error",
                    "answer": "Please specify a metric to rank.",
                }

            valid_rows = [
                row for row in data
                if row.get(measure) is not None
            ]

            if not valid_rows:
                return {
                    "type": "lookup",
                    "answer": "No comparable values were returned.",
                }

            valid_rows.sort(
                key=lambda row: float(row[measure]),
                reverse=(ranking == "highest"),
            )

            count = get_top_count(question)
            selected_rows = valid_rows[:count]

            answer_lines = []

            for index, row in enumerate(selected_rows, start=1):
                dimensions = [
                    str(row.get(dimension, "Unknown"))
                    for dimension in query.dimensions
                ]

                label = ", ".join(dimensions)
                metrics = []

                for metric in query.measures:
                    value = row.get(metric)

                    if value is not None:
                        name = METRIC_NAMES.get(
                            metric,
                            metric.split(".")[-1],
                        )
                        metrics.append(
                            f"{name}: {format_value(value)}"
                        )

                answer_lines.append(
                    f"{index}. {label} - " + ", ".join(metrics)
                )

            return {
                "type": "reasoning",
                "answer": "\n".join(answer_lines),
            }

        return {
            "type": "lookup",
            "answer": format_lookup_rows(query, data),
        }

    except ValueError as error:
        # Preserve helpful parser and validation messages.
        return {
            "type": "error",
            "answer": str(error),
        }

    except Exception as error:
        # If the live API fails, try the local CSV-based agent.
        print(f"Live API unavailable: {error}")
        print("Trying local sample data...")

        local_result = run_local_agent(question)

        if local_result["type"] != "error":
            return local_result

        return {
            "type": "error",
            "answer": (
                "The live API is unavailable, and local sample data "
                f"could not answer the question: {local_result['answer']}"
            ),
        }


if __name__ == "__main__":
    print("MetricMind — LIVE API WITH LOCAL FALLBACK")
    print("Local fallback uses fictional sample data.")

    while True:
        question = input("\nAsk a business question (or type 'exit'): ")

        if question.strip().lower() in {"exit", "quit"}:
            break

        result = run_agent(question)

        print("\nAnswer:")
        print(result["answer"])
