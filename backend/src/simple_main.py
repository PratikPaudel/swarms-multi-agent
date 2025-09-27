"""
Simplified Autonomous Trading Floor - FastAPI Backend
Runs without Swarms dependency for broader Python compatibility
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
import random

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simple agent simulation without Swarms
class SimpleAgent:
    def __init__(self, name: str, tier: int, system_prompt: str):
        self.name = name
        self.tier = tier
        self.system_prompt = system_prompt
        self.confidence = random.randint(70, 95)
        self.status = "active"
        self.last_action = f"Analyzing {name.lower()} data"

    async def analyze(self, market_data: Dict[str, Any]) -> str:
        """Simple analysis simulation"""
        await asyncio.sleep(0.1)  # Simulate processing time

        # Simple rule-based analysis based on agent type
        if "market" in self.name.lower():
            return self._market_analysis(market_data)
        elif "sentiment" in self.name.lower():
            return self._sentiment_analysis()
        elif "technical" in self.name.lower():
            return self._technical_analysis(market_data)
        elif "risk" in self.name.lower():
            return self._risk_analysis()
        elif "strategy" in self.name.lower():
            return self._strategy_analysis()
        else:
            return f"{self.name} analysis complete"

    def _market_analysis(self, market_data: Dict[str, Any]) -> str:
        btc_price = market_data.get("BTC", 42000)
        if btc_price > 43000:
            return "Market showing bullish momentum with BTC above resistance"
        elif btc_price < 41000:
            return "Market showing bearish pressure with BTC below support"
        else:
            return "Market in consolidation phase, awaiting breakout"

    def _sentiment_analysis(self) -> str:
        sentiment_score = random.randint(-30, 70)
        if sentiment_score > 40:
            return f"Social sentiment very positive ({sentiment_score}/100), strong buy signals"
        elif sentiment_score < -10:
            return f"Social sentiment negative ({sentiment_score}/100), caution advised"
        else:
            return f"Neutral sentiment ({sentiment_score}/100), mixed signals"

    def _technical_analysis(self, market_data: Dict[str, Any]) -> str:
        # Simple technical analysis simulation
        rsi = random.randint(30, 70)
        if rsi > 60:
            return f"Technical indicators bullish, RSI at {rsi} suggests buy signal"
        elif rsi < 40:
            return f"Technical indicators bearish, RSI at {rsi} suggests sell signal"
        else:
            return f"Technical indicators neutral, RSI at {rsi} suggests hold"

    def _risk_analysis(self) -> str:
        risk_level = random.choice(["Low", "Medium", "High"])
        return f"Portfolio risk assessment: {risk_level} risk detected"

    def _strategy_analysis(self) -> str:
        actions = ["BUY", "SELL", "HOLD"]
        action = random.choice(actions)
        confidence = random.randint(70, 95)
        return f"Strategy recommendation: {action} with {confidence}% confidence"

class SimpleTradingFloor:
    """Simplified trading floor without Swarms dependency"""

    def __init__(self):
        self.agents = {}
        self.initialize_agents()

    def initialize_agents(self):
        """Initialize simplified agents"""
        agents_config = [
            # Tier 1: Intelligence Gathering
            ("Market Data Collector", 1, "Collect and analyze real-time market data"),
            ("Sentiment Analyzer", 1, "Analyze social media and news sentiment"),
            ("On-Chain Monitor", 1, "Monitor blockchain and whale activity"),

            # Tier 2: Analysis & Processing
            ("Technical Analyst", 2, "Perform technical analysis and pattern recognition"),
            ("Risk Calculator", 2, "Calculate risk metrics and position sizing"),
            ("Correlation Analyzer", 2, "Analyze market correlations and arbitrage"),

            # Tier 3: Strategy & Execution
            ("Strategy Synthesizer", 3, "Synthesize multi-agent inputs into strategy"),
            ("Portfolio Optimizer", 3, "Optimize portfolio allocation and risk"),
            ("Trade Executor", 3, "Execute trades with optimal routing")
        ]

        for name, tier, prompt in agents_config:
            agent_id = name.lower().replace(" ", "_")
            self.agents[agent_id] = SimpleAgent(name, tier, prompt)

    async def execute_trading_cycle(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute simplified trading cycle"""
        try:
            logger.info("Executing trading cycle...")

            # Run agents in parallel by tier
            tier1_results = await self._run_tier_agents(1, market_data)
            tier2_results = await self._run_tier_agents(2, market_data)
            tier3_results = await self._run_tier_agents(3, market_data)

            # Synthesize final decision
            decisions = await self._synthesize_decision(tier1_results, tier2_results, tier3_results, market_data)

            return {
                "decisions": decisions,
                "tier1_analysis": tier1_results,
                "tier2_analysis": tier2_results,
                "tier3_analysis": tier3_results,
                "timestamp": datetime.utcnow().isoformat(),
                "status": "completed"
            }

        except Exception as e:
            logger.error(f"Error in trading cycle: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
                "status": "failed"
            }

    async def _run_tier_agents(self, tier: int, market_data: Dict[str, Any]) -> List[str]:
        """Run all agents in a specific tier"""
        tier_agents = [agent for agent in self.agents.values() if agent.tier == tier]

        tasks = [agent.analyze(market_data) for agent in tier_agents]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        return [str(result) for result in results]

    async def _synthesize_decision(self, tier1: List[str], tier2: List[str], tier3: List[str], market_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Synthesize final trading decisions"""
        decisions = []

        # Simple decision logic based on agent outputs
        all_analysis = " ".join(tier1 + tier2 + tier3).lower()

        for asset in ["BTC", "ETH", "SOL"]:
            # Count positive/negative signals
            buy_signals = all_analysis.count("buy") + all_analysis.count("bullish") + all_analysis.count("positive")
            sell_signals = all_analysis.count("sell") + all_analysis.count("bearish") + all_analysis.count("negative")

            if buy_signals > sell_signals + 1:
                action = "BUY"
                confidence = min(70 + (buy_signals * 5), 95)
            elif sell_signals > buy_signals + 1:
                action = "SELL"
                confidence = min(70 + (sell_signals * 5), 95)
            else:
                action = "HOLD"
                confidence = 65

            decisions.append({
                "asset": asset,
                "action": action,
                "confidence": confidence,
                "reasoning": f"Multi-agent analysis: {buy_signals} buy signals, {sell_signals} sell signals",
                "price_target": market_data.get(asset, 0) * (1.03 if action == "BUY" else 0.97),
                "timestamp": datetime.utcnow().isoformat()
            })

        return decisions

    async def get_agents_status(self) -> List[Dict[str, Any]]:
        """Get current status of all agents"""
        agents_status = []

        for agent_id, agent in self.agents.items():
            # Simulate some variation in confidence
            agent.confidence = max(60, min(95, agent.confidence + random.randint(-5, 5)))

            status = {
                "id": agent_id,
                "name": agent.name,
                "tier": agent.tier,
                "status": agent.status,
                "confidence": agent.confidence,
                "last_action": agent.last_action,
                "last_updated": datetime.utcnow().isoformat()
            }
            agents_status.append(status)

        return agents_status

# Connection manager for WebSocket
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        try:
            await websocket.send_text(json.dumps(message))
        except:
            self.disconnect(websocket)

    async def broadcast(self, message: dict):
        if not self.active_connections:
            return

        message_text = json.dumps(message)
        disconnected_clients = []

        for connection in self.active_connections:
            try:
                await connection.send_text(message_text)
            except:
                disconnected_clients.append(connection)

        for client in disconnected_clients:
            self.disconnect(client)

# Global instances
trading_floor = None
manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global trading_floor

    # Startup
    logger.info("🚀 Starting Autonomous Trading Floor Backend...")
    logger.info("📊 Initializing simplified multi-agent trading system...")
    trading_floor = SimpleTradingFloor()
    logger.info("✅ Trading Floor initialized successfully")

    yield

    # Shutdown
    logger.info("Shutting down Trading Floor...")

# Initialize FastAPI app
app = FastAPI(
    title="Autonomous Trading Floor API",
    description="AI-powered multi-agent trading system backend (Simplified)",
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
        "message": "Autonomous Trading Floor API (Simplified)",
        "status": "operational",
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

            # Send periodic updates every 10 seconds
            await asyncio.sleep(10)
            agents_status = await trading_floor.get_agents_status()
            await manager.broadcast({
                "type": "agents_update",
                "data": agents_status,
                "timestamp": datetime.utcnow().isoformat()
            })

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

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
        "simple_main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )