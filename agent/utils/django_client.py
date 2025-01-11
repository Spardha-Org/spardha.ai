import httpx
from typing import Optional, Dict, Any, Type, TypeVar
from pydantic import BaseModel, ValidationError

T = TypeVar("T", bound=BaseModel)

class DjangoapiClient:
    def __init__(self, base_url: str, timeout: Optional[int] = 10):
        self.base_url = base_url
        self.timeout = timeout

    async def _request(self, method: str, endpoint: str, model: Type[T], **kwargs) -> T:
        async with httpx.AsyncClient() as client:
            response = await client.request(method, f"{self.base_url}{endpoint}", timeout=self.timeout, **kwargs)
            response.raise_for_status()
            try:
                parsed_response = model.parse_obj(response.json())
                return parsed_response
            except ValidationError as e:
                raise ValueError(f"Error parsing response: {e}")

    async def get(self, endpoint: str, model: Type[T], params: Optional[Dict[str, Any]] = None) -> T:
        return await self._request("GET", endpoint, model, params=params)

    async def post(self, endpoint: str, model: Type[T], data: Optional[Dict[str, Any]] = None, json: Optional[Dict[str, Any]] = None) -> T:
        return await self._request("POST", endpoint, model, data=data, json=json)

    async def put(self, endpoint: str, model: Type[T], data: Optional[Dict[str, Any]] = None, json: Optional[Dict[str, Any]] = None) -> T:
        return await self._request("PUT", endpoint, model, data=data, json=json)

    async def delete(self, endpoint: str, model: Type[T], params: Optional[Dict[str, Any]] = None) -> T:
        return await self._request("DELETE", endpoint, model, params=params)