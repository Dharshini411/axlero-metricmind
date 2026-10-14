# MetricMind Testing

## Testing Objective

Validate that MetricMind produces accurate, consistent, governed, and explainable results.

## Core Test Questions

### Test 1 — Revenue
Question:
"What was Q3 Revenue?"

Expected:
The system should return the governed Revenue metric consistently.

### Test 2 — Geography
Question:
"Show me European sales."

Expected:
The system should filter the result using the Geography dimension correctly.

### Test 3 — Margin Analysis
Question:
"Why did European margins drop?"

Expected:
The system should provide a margin explanation and support secondary cost breakdowns such as shipping and material costs.

## Governance Checks

- Use governed metric definitions.
- Avoid incorrect or hallucinated joins.
- Verify consistent results for repeated questions.
- Validate API requests before execution.
- Apply query limits to prevent unbounded expensive queries.

## End-to-End Validation

User Question
→ AI Agent
→ Semantic Layer
→ Data
→ Query Result
→ AI Explanation
→ Visualization

## Transparency Checks

The application should provide options to view the generated SQL and API call where applicable.
