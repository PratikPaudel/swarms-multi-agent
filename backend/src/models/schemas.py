"""
Pydantic models for API request/response schemas
"""

from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime

class MarketDataRequest(BaseModel):
    """Request model for market data"""
    market_data: Dict[str, Any]
    timestamp: Optional[str] = None

class AgentStatus(BaseModel):
    """Individual agent status"""
    id: str
    name: str
    tier: int
    status: str
    confidence: float
    last_action: str
    last_updated: str

class AgentStatusResponse(BaseModel):
    """Response model for agent status"""
    agents: List[AgentStatus]
    timestamp: str
    system_status: str

class TradingDecision(BaseModel):
    """Individual trading decision"""
    asset: str
    action: str  # BUY, SELL, HOLD
    confidence: float
    reasoning: str
    price_target: Optional[float] = None
    stop_loss: Optional[float] = None
    position_size: Optional[float] = None

class TradingDecisionResponse(BaseModel):
    """Response model for trading decisions"""
    decisions: List[TradingDecision]
    consensus_action: str
    overall_confidence: float
    risk_assessment: str
    timestamp: str
    agent_votes: Dict[str, str]

class WebSocketMessage(BaseModel):
    """WebSocket message format"""
    type: str
    data: Dict[str, Any]
    timestamp: str

class SystemHealth(BaseModel):
    """System health status"""
    api_status: str
    trading_floor_status: str
    agents_count: int
    websocket_connections: int
    timestamp: str