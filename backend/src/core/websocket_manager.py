"""
WebSocket connection manager for real-time communication
"""

from fastapi import WebSocket
from typing import List, Dict, Any
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Manages WebSocket connections"""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket):
        """Send message to specific WebSocket connection"""
        try:
            await websocket.send_text(json.dumps(message))
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            self.disconnect(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast message to all connected clients"""
        if not self.active_connections:
            return

        message_text = json.dumps(message)
        disconnected_clients = []

        for connection in self.active_connections:
            try:
                await connection.send_text(message_text)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")
                disconnected_clients.append(connection)

        # Remove disconnected clients
        for client in disconnected_clients:
            self.disconnect(client)

    async def broadcast_to_group(self, message: Dict[str, Any], group: str):
        """Broadcast message to specific group (future enhancement)"""
        # For now, broadcast to all
        await self.broadcast(message)

    def get_connection_count(self) -> int:
        """Get number of active connections"""
        return len(self.active_connections)