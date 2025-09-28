"""
Initialize mock data for JSON storage
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.json_storage import json_storage
from datetime import datetime, timedelta
import random

def create_mock_analysis_data():
    """Create mock analysis results"""
    mock_analysis = []

    # Create 5 mock analysis results
    for i in range(5):
        mock_time = datetime.utcnow() - timedelta(hours=i*2, minutes=random.randint(0, 59))

        analysis_data = {
            "analysis_type": "intelligence_and_analysis",
            "market_data": {
                "BTC": random.randint(40000, 50000),
                "ETH": random.randint(2500, 3500),
                "SOL": random.randint(90, 120),
                "BNB": random.randint(300, 400)
            },
            "intelligence_results": f"Mock intelligence analysis {i+1}: Market showing {'bullish' if random.random() > 0.5 else 'bearish'} sentiment. Trading volume {'increased' if random.random() > 0.5 else 'decreased'} by {random.randint(5, 25)}% in the last 24 hours.",
            "analysis_results": f"Mock technical analysis {i+1}: RSI at {random.randint(30, 70)}, MACD {'positive' if random.random() > 0.5 else 'negative'}, {'Support' if random.random() > 0.5 else 'Resistance'} level identified at ${random.randint(41000, 49000)}.",
            "tiers_completed": ["tier1_intelligence", "tier2_analysis"],
            "agents_involved": {
                "tier1": ["market_data", "sentiment", "onchain"],
                "tier2": ["technical", "risk", "correlation"]
            },
            "timestamp": mock_time.isoformat(),
            "status": "analysis_complete"
        }

        json_storage.save_analysis_result(analysis_data)
        mock_analysis.append(analysis_data)

    return mock_analysis

def create_mock_trading_data():
    """Create mock trading decisions"""
    mock_trading = []

    actions = ["BUY", "SELL", "HOLD"]

    # Create 5 mock trading decisions
    for i in range(5):
        mock_time = datetime.utcnow() - timedelta(hours=i*3, minutes=random.randint(0, 59))
        action = random.choice(actions)
        confidence = random.randint(65, 95)

        trading_data = {
            "decisions": [
                {
                    "asset": "BTC",
                    "action": action,
                    "confidence": confidence,
                    "reasoning": f"Democratic consensus {i+1}: {action} recommendation based on multi-agent analysis",
                    "price_target": random.randint(40000, 50000),
                    "timestamp": mock_time.isoformat()
                }
            ],
            "consensus_action": action,
            "overall_confidence": confidence,
            "risk_assessment": random.choice(["Low", "Medium", "High"]),
            "democracy_summary": f"Mock democratic voting {i+1}: All agents reached consensus on {action} action with {confidence}% confidence.",
            "vote_breakdown": {"BUY": 0, "SELL": 0, "HOLD": 0},
            "timestamp": mock_time.isoformat(),
            "agent_votes": {
                "market_data": action,
                "sentiment": action,
                "onchain": action,
                "technical": action,
                "risk": action,
                "correlation": action,
                "strategy": action,
                "portfolio": action,
                "executor": action
            },
            "market_data": {
                "BTC": random.randint(40000, 50000),
                "ETH": random.randint(2500, 3500),
                "SOL": random.randint(90, 120),
                "BNB": random.randint(300, 400)
            }
        }

        # Set vote breakdown
        trading_data["vote_breakdown"][action] = 9

        json_storage.save_trading_decision(trading_data)
        mock_trading.append(trading_data)

    return mock_trading

def initialize_mock_data():
    """Initialize both analysis and trading mock data"""
    print("Creating mock analysis data...")
    analysis_data = create_mock_analysis_data()
    print(f"Created {len(analysis_data)} mock analysis results")

    print("Creating mock trading data...")
    trading_data = create_mock_trading_data()
    print(f"Created {len(trading_data)} mock trading decisions")

    # Get stats
    stats = json_storage.get_stats()
    print(f"Storage stats: {stats}")

    return {
        "analysis_count": len(analysis_data),
        "trading_count": len(trading_data),
        "stats": stats
    }

if __name__ == "__main__":
    initialize_mock_data()