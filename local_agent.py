import csv
import re
from collections import defaultdict
from pathlib import Path

from parser import parse_question


DATA_FILE = Path(__file__).with_name("sample_sales.csv")

COLUMNS = {
    "Sales.orderId": "orderId",
    "Sales.orderDate": "orderDate",
    "Sales.country": "country",
    "Sales.region": "region",
    "Sales.productName": "productName",
    "Sales.category": "category",
    "Sales.customerName": "customerName",
    "Sales.segment": "segment",
    "Sales.salesChannel": "salesChannel",
    "Sales.revenue": "revenue",
    "Sales.cost": "cost",
    "Sales.profit": "profit",
    "Sales.marginPercent": "marginPercent",
}

METRIC_NAMES = {
    "Sales.revenue": "Revenue",
    "Sales.cost": "Cost",
    "Sales.profit": "Profit",
    "Sales.marginPercent": "Margin (%)",
}



def load_data():
    with DATA_FILE.open(
        "r", encoding="utf-8-sig", newline=""
    ) as file:
        # Ignore empty lines before or within the CSV.
        non_empty_lines = (
            line for line in file if line.strip()
        )
        rows = list(csv.DictReader(non_empty_lines))

    if not rows or "country" not in rows[0]:
        raise ValueError(
            "The CSV must contain a header row with a country column."
        )

    return rows



def format_value(value):
    if float(value).is_integer():
        return f"{value:,.0f}"
    return f"{value:,.2f}"


def run_local_agent(question):
    try:
        query = parse_question(question)
        rows = load_data()

        # Apply supported country filters.
        for field, value in query.filters.items():
            column = COLUMNS.get(field)

            if column:
                rows = [
                    row for row in rows
                    if row[column].lower() == value.lower()
                ]

        # Apply recognized calendar time ranges.
        if query.time_range:
            from tools import get_date_range

            start, end = get_date_range(query.time_range)

            rows = [
                row for row in rows
                if start <= row["orderDate"] <= end
            ]

        if not rows:
            return {
                "type": "local",
                "answer": (
                    "No matching records were found in the "
                    "sample dataset."
                ),
            }

        # Group records by requested dimensions.
        groups = defaultdict(list)

        for row in rows:
            key = tuple(
                row[COLUMNS[dimension]]
                for dimension in query.dimensions
            )
            groups[key].append(row)

        if not query.dimensions:
            groups[()] = rows

        results = []

        for key, group_rows in groups.items():
            result = {}

            for index, dimension in enumerate(query.dimensions):
                result[dimension] = key[index]

            for measure in query.measures:
                column = COLUMNS[measure]
                values = [float(row[column]) for row in group_rows]

                # Sum monetary measures; average margin percentages.
                if measure == "Sales.marginPercent":
                    result[measure] = sum(values) / len(values)
                else:
                    result[measure] = sum(values)

            results.append(result)

        # Support highest/lowest and top/bottom questions.
        q = question.lower()
        ranking = None

        if re.search(r"\b(highest|maximum|greatest|most|top|best)\b", q):
            ranking = "highest"
        elif re.search(r"\b(lowest|minimum|least|bottom|worst)\b", q):
            ranking = "lowest"

        if ranking and query.dimensions:
            measure = query.measures[0]
            results.sort(
                key=lambda item: item[measure],
                reverse=(ranking == "highest"),
            )

            count_match = re.search(
                r"\b(?:top|bottom)\s+(\d+)\b", q
            )
            count = int(count_match.group(1)) if count_match else 1
            results = results[:max(1, min(count, 100))]

        # Format the answer.
        answer_lines = []

        for result in results:
            labels = [
                f"{dimension.split('.')[-1]}: "
                f"{result.get(dimension, 'Unknown')}"
                for dimension in query.dimensions
            ]

            values = [
                f"{METRIC_NAMES.get(measure, measure)}: "
                f"{format_value(result[measure])}"
                for measure in query.measures
                if measure in result
            ]

            answer_lines.append(" | ".join(labels + values))

        return {
            "type": "local",
            "answer": "\n".join(answer_lines),
        }

    except ValueError as error:
        return {"type": "error", "answer": str(error)}

    except Exception as error:
        print(f"Local agent error: {error}")
        return {
            "type": "error",
            "answer": (
                "I couldn't process that question. "
                "Check the sample CSV and try again."
            ),
        }


if __name__ == "__main__":
    print("MetricMind — LOCAL SAMPLE DATA MODE")
    print("Note: answers use invented sample data, not real business data.")

    while True:
        question = input("\nAsk a business question (or type 'exit'): ")

        if question.strip().lower() in {"exit", "quit"}:
            break

        result = run_local_agent(question)
        print("\nAnswer:")
        print(result["answer"])