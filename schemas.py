from pydantic import BaseModel, Field
from typing import List, Dict


class SemanticQuery(BaseModel):
    metric: str
    dimensions: List[str] = Field(default_factory=list)
    filters: Dict[str, str] = Field(default_factory=dict)