#!/usr/bin/env python3
"""
Simple FastAPI backend for testing
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uvicorn
import json
import asyncio
from typing import List

# WebSocket connection manager
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
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                disconnected.append(connection)

        # Remove disconnected connections
        for connection in disconnected:
            self.disconnect(connection)

manager = ConnectionManager()

# Initialize FastAPI app
app = FastAPI(
    title="Autonomous Trading Floor API (Simple)",
    description="Simplified backend for testing",
    version="1.0.0",
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
        "message": "Autonomous Trading Floor API (Simple Mode)",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check"""
    return {
        "api": "healthy",
        "mode": "simple",
        "websocket_connections": len(manager.active_connections),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.websocket("/ws/trading-floor")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time communication"""
    import sys
    sys.stderr.write("WebSocket connection attempt starting...\n")
    sys.stderr.flush()

    try:
        await websocket.accept()
        sys.stderr.write("WebSocket connection accepted!\n")
        sys.stderr.flush()

        # Send a simple initial message
        await websocket.send_text(json.dumps({
            "type": "connection_confirmed",
            "message": "WebSocket connected successfully",
            "timestamp": datetime.utcnow().isoformat()
        }))
        sys.stderr.write("Initial message sent!\n")
        sys.stderr.flush()

        # Just keep the connection alive for now
        while True:
            try:
                data = await websocket.receive_text()
                sys.stderr.write(f"Received: {data}\n")
                sys.stderr.flush()

                # Echo back a simple response
                await websocket.send_text(json.dumps({
                    "type": "echo",
                    "received": data,
                    "timestamp": datetime.utcnow().isoformat()
                }))

            except Exception as e:
                sys.stderr.write(f"Error in receive loop: {e}\n")
                sys.stderr.flush()
                break

    except Exception as e:
        sys.stderr.write(f"WebSocket connection error: {e}\n")
        sys.stderr.flush()
        import traceback
        traceback.print_exc()

# Background task to send periodic updates
async def send_periodic_updates():
    """Send periodic market updates to connected clients"""
    while True:
        if len(manager.active_connections) > 0:
            # Simulate market data
            import time
            current_time = time.time()

            mock_market_data = {
                "BTC": 42000 + (current_time % 1000),
                "ETH": 2800 + (current_time % 100),
                "SOL": 95 + (current_time % 10),
            }

            await manager.broadcast({
                "type": "market_update",
                "data": mock_market_data,
                "timestamp": datetime.utcnow().isoformat()
            })

            # Simulate agent status update
            await manager.broadcast({
                "type": "agents_update",
                "data": [
                    {"id": "trader_1", "status": "active", "last_action": "analyzing"},
                    {"id": "risk_manager", "status": "monitoring", "last_action": "calculating"},
                    {"id": "market_analyzer", "status": "active", "last_action": "processing"}
                ],
                "timestamp": datetime.utcnow().isoformat()
            })

        await asyncio.sleep(5)  # Send updates every 5 seconds

# Disable background task for now to simplify debugging
# @app.on_event("startup")
# async def startup_event():
#     asyncio.create_task(send_periodic_updates())

if __name__ == "__main__":
    print("🚀 Starting Simple Backend Server...")
    print("📡 API available at: http://localhost:8000")
    print("📄 API docs at: http://localhost:8000/docs")

    uvicorn.run(
        "simple_main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )