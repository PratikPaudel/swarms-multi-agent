#!/usr/bin/env python3
"""
Quick start script for the Autonomous Trading Floor backend
"""

import sys
import os

# Add src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    import uvicorn
    from src.main import app

    if __name__ == "__main__":
        print("🚀 Starting Autonomous Trading Floor Backend...")
        print("📊 Initializing multi-agent trading system...")
        print("🔗 WebSocket endpoint: ws://localhost:8000/ws/trading-floor")
        print("📡 API docs: http://localhost:8000/docs")

        uvicorn.run(
            "src.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )

except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    print("💡 Please install dependencies: pip install -r requirements.txt")
    print("📦 Or install Swarms: pip install swarms")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error starting backend: {e}")
    sys.exit(1)