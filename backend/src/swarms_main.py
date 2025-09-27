"""
Autonomous Trading Floor - FastAPI Backend with Swarms
Main application with working Swarms integration
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

from core.swarms_trading_floor import SwarmsAutonomousTradingFloor
from core.websocket_manager import ConnectionManager

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
    logger.info("🚀 Starting Autonomous Trading Floor Backend with Swarms...")
    logger.info("📊 Initializing multi-agent trading system...")
    trading_floor = SwarmsAutonomousTradingFloor()
    await trading_floor.initialize()
    logger.info("✅ Swarms Trading Floor initialized successfully")

    yield

    # Shutdown
    logger.info("Shutting down Trading Floor...")
    if trading_floor:
        await trading_floor.shutdown()

# Initialize FastAPI app
app = FastAPI(
    title="Autonomous Trading Floor API with Swarms",
    description="AI-powered multi-agent trading system using Swarms framework",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Autonomous Trading Floor API with Swarms",
        "status": "operational",
        "framework": "Swarms v8.3.8",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/agents/status")
async def get_agents_status():
    """Get status of all trading agents"""
    try:
        if not trading_floor:
            raise HTTPException(status_code=503, detail="Trading floor not initialized")

        status = await trading_floor.get_agents_status()
        return {
            "agents": status,
            "timestamp": datetime.utcnow().isoformat(),
            "system_status": "operational"
        }
    except Exception as e:
        logger.error(f"Error getting agent status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/trading/execute")
async def execute_trading_cycle(request: dict):
    """Execute a trading cycle with market data"""
    try:
        if not trading_floor:
            raise HTTPException(status_code=503, detail="Trading floor not initialized")

        market_data = request.get("market_data", {})
        decision = await trading_floor.execute_trading_cycle(market_data)

        # Broadcast to connected clients
        await manager.broadcast({
            "type": "trading_decision",
            "data": decision,
            "timestamp": datetime.utcnow().isoformat()
        })

        return decision

    except Exception as e:
        logger.error(f"Error executing trading cycle: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
                "message": "Connected to Autonomous Trading Floor with Swarms",
                "agents_count": len(trading_floor.agents) if trading_floor else 0,
                "framework": "Swarms v8.3.8"
            }
        }, websocket)

        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)

            # Handle different message types
            if message["type"] == "market_data":
                # Process market data and trigger agents
                logger.info("Processing market data via WebSocket...")
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

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

# Background task for periodic updates
async def send_periodic_updates():
    """Send periodic updates to all connected clients"""
    while True:
        try:
            await asyncio.sleep(15)  # Every 15 seconds

            if not trading_floor or not manager.active_connections:
                continue

            # Get current agent status
            agents_status = await trading_floor.get_agents_status()

            # Broadcast agent updates
            await manager.broadcast({
                "type": "agents_update",
                "data": agents_status,
                "timestamp": datetime.utcnow().isoformat()
            })

        except Exception as e:
            logger.error(f"Error sending periodic updates: {e}")
            await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    """Start background tasks"""
    asyncio.create_task(send_periodic_updates())

@app.get("/health")
async def health_check():
    """Detailed health check"""
    health_status = {
        "api": "healthy",
        "trading_floor": "healthy" if trading_floor else "not_initialized",
        "agents": len(trading_floor.agents) if trading_floor else 0,
        "websocket_connections": len(manager.active_connections),
        "framework": "Swarms v8.3.8",
        "timestamp": datetime.utcnow().isoformat()
    }

    return health_status

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    logger.info(f"🔗 WebSocket endpoint: ws://localhost:{port}/ws/trading-floor")
    logger.info(f"📡 API docs: http://localhost:{port}/docs")

    uvicorn.run(
        "swarms_main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )