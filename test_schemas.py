from schemas import SemanticQuery


query = SemanticQuery(
    metric="revenue",
    dimensions=[],
    filters={
        "state": "Maharashtra",
        "period": "last_month"
    }
)

print(query)