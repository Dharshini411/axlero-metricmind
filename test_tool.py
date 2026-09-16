from schemas import SemanticQuery
from tools import query_semantic_layer


query = SemanticQuery(
    metric="revenue",
    filters={
        "state": "Maharashtra",
        "period": "last_month"
    }
)

result = query_semantic_layer(query)

print(result)