
from pydantic import BaseModel, Field
from typing import List, Dict, Optional


class SemanticQuery(BaseModel):
    measures: List[str] = Field(default_factory=list)
    dimensions: List[str] = Field(default_factory=list)
    filters: Dict[str, str] = Field(default_factory=dict)
    time_range: Optional[str] = None
    granularity: Optional[str] = None
