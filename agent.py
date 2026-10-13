
import os
import re
from datetime import datetime

from parser import parse_question
from tools import query_semantic_layer, query_generated_sql
from local_agent import run_local_agent


# Set METRICMIND_LOCAL_MODE=true to use fictional sample data.
# Default: live data mode.
USE_LOCAL_SAMPLE_DATA = (
    os.getenv("METRICMIND_LOCAL_MODE", "false").lower() == "true"
)


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


def format_month(value):
    """Convert a Cube.js date value to a readable month and year."""
    if value is None:
        return None

    try:
        date_text = str(value).replace("Z", "+00:00")
        parsed_date = datetime.fromisoformat(date_text)
        return parsed_date.strftime("%B %Y")
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

        # Format regular dimensions.
        for dimension in query.dimensions:
            name = dimension.split(".")[-1]
            value = row.get(dimension, "Unknown")
            dimension_values.append(f"{name}: {value}")

        # Cube.js uses a generated key for time dimensions.
        if query.granularity:
            time_key = f"Sales.orderDate.{query.granularity}"
            time_value = row.get(time_key)

            if time_value is None:
                time_value = row.get("Sales.orderDate")

            if time_value is not None:
                month_label = format_month(time_value)
                dimension_values.append(f"Month: {month_label}")

        metric_values = []

        # Format measures such as revenue, cost, and profit.
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
        available_keys = ", ".join(str(key) for key in data[0].keys())
        return (
            "I found the data, but couldn't determine the values. "
            f"Returned fields: {available_keys}"
        )

    return "\n".join(lines)


def generate_lookup_answer(query, data):
    """Backward-compatible helper for older code."""
    return format_lookup_rows(query, data)


def run_agent(question: str):
    """Query live data and return the answer and generated SQL."""
    try:
        query = parse_question(question)

        # Explicit demo mode: do not call the live API.
        if USE_LOCAL_SAMPLE_DATA:
            return run_local_agent(question)

        data = query_semantic_layer(query)
        sql = query_generated_sql(query)

        if not data:
            return {
                "type": "lookup",
                "answer": "I couldn't find any data for that question.",
                "sql": sql,
            }

        ranking = get_ranking(question)

        if ranking:
            if not query.dimensions:
                return {
                    "type": "error",
                    "answer": (
                        "To rank results, specify a dimension such as "
                        "country, region, product, or customer."
                    ),
                    "sql": sql,
                }

            measure = get_ranking_measure(question, query)

            if not measure:
                return {
                    "type": "error",
                    "answer": "Please specify a metric to rank.",
                    "sql": sql,
                }

            valid_rows = [
                row for row in data
                if row.get(measure) is not None
            ]

            if not valid_rows:
                return {
                    "type": "lookup",
                    "answer": "No comparable values were returned.",
                    "sql": sql,
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
                "sql": sql,
            }

        return {
            "type": "lookup",
            "answer": format_lookup_rows(query, data),
            "sql": sql,
        }

    except ValueError as error:
        return {
            "type": "error",
            "answer": str(error),
        }

    except Exception as error:
        print(f"Live API unavailable: {error}")

        return {
            "type": "error",
            "answer": (
                "The live data service is currently unavailable.\n"
                "Please try again later."
            ),
        }


if __name__ == "__main__":
    if USE_LOCAL_SAMPLE_DATA:
        print("MetricMind - LOCAL SAMPLE DATA MODE")
        print(
            "Note: Answers use fictional sample data, "
            "not real business data."
        )
    else:
        print("MetricMind - LIVE DATA MODE")

    while True:
        question = input(
            "\nAsk a business question (or type 'exit'): "
        )

        if question.strip().lower() in {"exit", "quit"}:
            break

        result = run_agent(question)

        print("\nAnswer:")
        print(result["answer"])

        if result.get("sql"):
            print("\nGenerated SQL:")
            print(result["sql"])
