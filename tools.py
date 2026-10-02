
import requests
from schemas import SemanticQuery


CUBE_API_URL = "https://isolation-pledge-symbol-bullet.trycloudflare.com/cubejs-api/v1/load"


def query_semantic_layer(query: SemanticQuery):

    cube_filters = [
        {
            "member": field,
            "operator": "equals",
            "values": [value],
        }
        for field, value in query.filters.items()
    ]

    payload = {
        "query": {
            "measures": query.measures,
            "dimensions": query.dimensions,
            "filters": cube_filters,
        }
    }

    response = requests.post(
        CUBE_API_URL,
        json=payload,
        timeout=30
    )

    response.raise_for_status()

    result = response.json()

    return result.get("data", [])

