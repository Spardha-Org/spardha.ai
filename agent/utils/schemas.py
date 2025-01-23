from pydantic import BaseModel
from typing import Optional

class PrimaryPromptResponse(BaseModel):
    primary_prompt: Optional[str]
    summary_promopt: Optional[str]
    suggestion_prompt: Optional[str]
    error: Optional[str] = None