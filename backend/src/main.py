"""
Autonomous Trading Floor - FastAPI Backend
Main application entry point with WebSocket support
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import json
import asyncio
import logging
from typing import Dict, List, Any
from datetime import datetime
import os
from dotenv import load_dotenv

from core.trading_floor import AutonomousTradingFloor
from core.websocket_manager import ConnectionManager
from models.schemas import AgentStatusResponse, TradingDecisionResponse, MarketDataRequest
from services.json_storage import json_storage

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global instances
trading_floor = None
manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global trading_floor

    # Startup
    logger.info("Initializing Autonomous Trading Floor...")
    trading_floor = AutonomousTradingFloor()
    await trading_floor.initialize()
    logger.info("Trading Floor initialized successfully")

    yield

    # Shutdown
    logger.info("Shutting down Trading Floor...")
    if trading_floor:
        await trading_floor.shutdown()

# Initialize FastAPI app
app = FastAPI(
    title="Autonomous Trading Floor API",
    description="AI-powered multi-agent trading system backend",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://swarms-multi-agent.vercel.app",
        "https://swarms-multi-agent-git-main-pratikpaudels-projects.vercel.app",
        "https://swarms-multi-agent-90lnpbfoj-pratikpaudels-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Autonomous Trading Floor API",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/agents/status")
async def get_agents_status() -> AgentStatusResponse:
    """Get status of all trading agents"""
    try:
        if not trading_floor:
            raise HTTPException(status_code=503, detail="Trading floor not initialized")

        status = await trading_floor.get_agents_status()
        return AgentStatusResponse(
            agents=status,
            timestamp=datetime.utcnow().isoformat(),
            system_status="operational"
        )
    except Exception as e:
        logger.error(f"Error getting agent status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/trading/analyze")
async def analyze_market_conditions(request: MarketDataRequest):
    """Analyze market conditions using Tier 1 + Tier 2 agents only (no voting)"""
    try:
        if not trading_floor:
            raise HTTPException(status_code=503, detail="Trading floor not initialized")

        # Execute analysis-only cycle (Tier 1 + Tier 2, no voting)
        analysis = await trading_floor.execute_analysis_cycle(request.market_data)

        # Broadcast to connected clients
        await manager.broadcast({
            "type": "market_analysis",
            "data": analysis,
            "timestamp": datetime.utcnow().isoformat()
        })

        return {
            "analysis": analysis,
            "timestamp": datetime.utcnow().isoformat(),
            "analysis_type": "intelligence_and_analysis"
        }

    except Exception as e:
        logger.error(f"Error executing analysis cycle: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/trading/execute")
async def execute_trading_cycle(request: MarketDataRequest) -> TradingDecisionResponse:
    """Execute a trading cycle with market data"""
    try:
        if not trading_floor:
            raise HTTPException(status_code=503, detail="Trading floor not initialized")

        # Execute trading cycle
        decision = await trading_floor.execute_trading_cycle(request.market_data)

        # Broadcast to connected clients
        await manager.broadcast({
            "type": "trading_decision",
            "data": decision,
            "timestamp": datetime.utcnow().isoformat()
        })

        return TradingDecisionResponse(**decision)

    except Exception as e:
        logger.error(f"Error executing trading cycle: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/trading/decisions")
async def get_trading_decisions():
    """Get recent trading decisions"""
    try:
        if not trading_floor:
            raise HTTPException(status_code=503, detail="Trading floor not initialized")

        # Get recent trading decisions from the trading floor
        decisions = await trading_floor.get_recent_decisions()

        return {
            "decisions": decisions,
            "timestamp": datetime.utcnow().isoformat(),
            "total_decisions": len(decisions)
        }
    except Exception as e:
        logger.error(f"Error getting trading decisions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis/history")
async def get_analysis_history(limit: int = 20):
    """Get previous analysis results from JSON storage"""
    try:
        analysis_results = json_storage.get_analysis_results(limit=limit)

        return {
            "analysis_results": analysis_results,
            "total_count": len(analysis_results),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting analysis history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/trading/history")
async def get_trading_history(limit: int = 20):
    """Get previous trading decisions from JSON storage"""
    try:
        trading_decisions = json_storage.get_trading_decisions(limit=limit)

        return {
            "trading_decisions": trading_decisions,
            "total_count": len(trading_decisions),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting trading history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis/{analysis_id}")
async def get_analysis_by_id(analysis_id: str):
    """Get specific analysis result by ID"""
    try:
        analysis_result = json_storage.get_analysis_by_id(analysis_id)

        if not analysis_result:
            raise HTTPException(status_code=404, detail=f"Analysis {analysis_id} not found")

        return {
            "analysis_result": analysis_result,
            "timestamp": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting analysis {analysis_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/storage/stats")
async def get_storage_stats():
    """Get storage statistics"""
    try:
        stats = json_storage.get_stats()

        return {
            "storage_stats": stats,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting storage stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/storage/init-mock-data")
async def initialize_mock_data():
    """Initialize storage with mock data for testing"""
    try:
        from utils.init_mock_data import initialize_mock_data as init_mock

        result = init_mock()

        return {
            "message": "Mock data initialized successfully",
            "data": result,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error initializing mock data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market/historical")
async def get_historical_data(symbol: str = "BTC", period: str = "1d"):
    """Get historical market data for chart display"""
    try:
        from services.real_data_sources import real_data_sources

        # Get real historical data
        historical_data = real_data_sources.get_real_historical_data(symbol, period)

        if historical_data.empty:
            raise HTTPException(status_code=404, detail=f"No historical data found for {symbol}")

        # Convert to format expected by frontend
        chart_data = []
        for index, row in historical_data.tail(24).iterrows():
            chart_data.append({
                "time": index.strftime("%H:%M") if period == "1d" else index.strftime("%m-%d"),
                symbol: float(row['Close']),
                "volume": float(row['Volume']) if 'Volume' in row else 0
            })

        return {
            "data": chart_data,
            "symbol": symbol,
            "period": period,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting historical data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market/current")
async def get_current_market_prices():
    """Get current market prices for major cryptocurrencies"""
    try:
        from services.real_data_sources import real_data_sources

        # Get current market data from CoinGecko
        current_data = await real_data_sources.get_real_market_data()

        # Extract current prices for the requested assets
        prices = {}
        asset_mapping = {
            "BTC": "bitcoin",
            "ETH": "ethereum",
            "SOL": "solana",
            "BNB": "binancecoin"
        }

        for asset, api_name in asset_mapping.items():
            if api_name in current_data:
                prices[asset] = current_data[api_name].get("usd", 0)

        return {
            "prices": prices,
            "timestamp": datetime.utcnow().isoformat(),
            "data_source": "CoinGecko API"
        }
    except Exception as e:
        logger.error(f"Error getting current market prices: {e}")
        # Fallback prices if API fails
        return {
            "prices": {
                "BTC": 43000,
                "ETH": 2900,
                "SOL": 99,
                "BNB": 310
            },
            "timestamp": datetime.utcnow().isoformat(),
            "data_source": "Fallback data"
        }

@app.websocket("/ws/trading-floor")
async def websocket_endpoint(websocket: WebSocket):
    """Main WebSocket endpoint for real-time communication"""
    await manager.connect(websocket)

    try:
        logger.info("New WebSocket connection established")

        # Send initial system status
        await manager.send_personal_message({
            "type": "system_status",
            "data": {
                "status": "connected",
                "message": "Connected to Autonomous Trading Floor",
                "agents_count": len(trading_floor.agents) if trading_floor else 0
            }
        }, websocket)

        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)

            # Handle different message types
            if message["type"] == "market_data":
                # Process market data and trigger agents
                result = await trading_floor.execute_trading_cycle(message["data"])

                # Send result back to all connected clients
                await manager.broadcast({
                    "type": "trading_decision",
                    "data": result,
                    "timestamp": datetime.utcnow().isoformat()
                })

            elif message["type"] == "agent_query":
                # Query specific agent
                agent_id = message["data"]["agent_id"]
                query = message["data"]["query"]

                result = await trading_floor.query_agent(agent_id, query)

                await manager.send_personal_message({
                    "type": "agent_response",
                    "data": {
                        "agent_id": agent_id,
                        "response": result
                    }
                }, websocket)

            # Simulate periodic updates (in production, this would be driven by real market data)
            asyncio.create_task(send_periodic_updates())

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

async def send_periodic_updates():
    """Send periodic updates to all connected clients"""
    if not trading_floor:
        return

    try:
        # Get current agent status
        agents_status = await trading_floor.get_agents_status()

        # Broadcast agent updates
        await manager.broadcast({
            "type": "agents_update",
            "data": agents_status,
            "timestamp": datetime.utcnow().isoformat()
        })

        # Simulate market data updates
        mock_market_data = {
            "BTC": 42000 + (asyncio.get_event_loop().time() % 1000),
            "ETH": 2800 + (asyncio.get_event_loop().time() % 100),
            "SOL": 95 + (asyncio.get_event_loop().time() % 10),
        }

        await manager.broadcast({
            "type": "market_update",
            "data": mock_market_data,
            "timestamp": datetime.utcnow().isoformat()
        })

    except Exception as e:
        logger.error(f"Error sending periodic updates: {e}")

@app.get("/health")
async def health_check():
    """Detailed health check"""
    health_status = {
        "api": "healthy",
        "trading_floor": "healthy" if trading_floor else "not_initialized",
        "agents": len(trading_floor.agents) if trading_floor else 0,
        "websocket_connections": len(manager.active_connections),
        "timestamp": datetime.utcnow().isoformat()
    }

    return health_status

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )