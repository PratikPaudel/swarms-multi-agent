"""
Updated Autonomous Trading Floor using latest Swarms API
"""

from swarms import Agent, SequentialWorkflow, ConcurrentWorkflow, run_agents_concurrently_async
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import os

logger = logging.getLogger(__name__)

class SwarmsAutonomousTradingFloor:
    """
    Trading floor using latest Swarms framework
    """

    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self.tier1_agents: List[Agent] = []
        self.tier2_agents: List[Agent] = []
        self.tier3_agents: List[Agent] = []

        # System state
        self.last_market_data: Dict[str, Any] = {}
        self.system_status = "initializing"

    async def initialize(self):
        """Initialize all agents and workflows"""
        try:
            logger.info("Initializing Swarms Trading Floor...")

            # Initialize agents
            await self._initialize_agents()

            self.system_status = "operational"
            logger.info("Swarms Trading Floor initialization complete")

        except Exception as e:
            logger.error(f"Error initializing trading floor: {e}")
            self.system_status = "error"
            raise

    async def _initialize_agents(self):
        """Initialize all trading agents"""

        # Tier 1: Intelligence Gathering Agents
        market_data_agent = Agent(
            agent_name="Market-Data-Collector",
            system_prompt="""You are a market data specialist. Analyze the provided market data and identify:
            1. Price trends and momentum
            2. Volume patterns
            3. Significant price movements
            4. Market volatility indicators

            Provide a clear analysis with specific insights about market conditions.""",
            model_name="google/gemini-2.5-pro",
            max_loops=1,
        )

        sentiment_agent = Agent(
            agent_name="Sentiment-Analyzer",
            system_prompt="""You are a social sentiment analyst for cryptocurrency markets. Based on the current market data, analyze:
            1. Overall market sentiment (bullish/bearish/neutral)
            2. Fear and greed indicators
            3. Social media trends impact
            4. News sentiment implications

            Provide sentiment score and key factors driving market psychology.""",
            model_name="google/gemini-2.5-pro",
            max_loops=1,
        )

        onchain_agent = Agent(
            agent_name="On-Chain-Monitor",
            system_prompt="""You are an on-chain data analyst. Based on market movements, analyze:
            1. Potential whale movements
            2. Exchange flow patterns
            3. Network activity indicators
            4. DeFi protocol impacts

            Provide insights on on-chain activity affecting price action.""",
            model_name="google/gemini-2.5-pro",
            max_loops=1,
        )

        # Tier 2: Analysis & Processing Agents
        technical_agent = Agent(
            agent_name="Technical-Analyst",
            system_prompt="""You are a technical analysis expert. Analyze the market data for:
            1. Key technical indicators (RSI, MACD, moving averages)
            2. Support and resistance levels
            3. Chart patterns and breakouts
            4. Entry and exit signals

            Provide clear BUY/SELL/HOLD recommendations with confidence levels.""",
            model_name="google/gemini-2.5-pro",
            max_loops=1,
        )

        risk_agent = Agent(
            agent_name="Risk-Calculator",
            system_prompt="""You are a risk management specialist. Evaluate:
            1. Current market volatility and risk levels
            2. Position sizing recommendations
            3. Stop-loss and take-profit levels
            4. Portfolio risk assessment

            Focus on capital preservation and risk-adjusted returns.""",
            model_name="google/gemini-2.5-pro",
            max_loops=1,
        )

        correlation_agent = Agent(
            agent_name="Correlation-Analyzer",
            system_prompt="""You are a market correlation specialist. Analyze:
            1. Inter-asset correlations (BTC, ETH, SOL)
            2. Market regime changes
            3. Sector rotation patterns
            4. Arbitrage opportunities

            Identify market inefficiencies and correlation breakdowns.""",
            model_name="google/gemini-2.5-pro",
            max_loops=1,
        )

        # Tier 3: Strategy & Execution Agents
        strategy_agent = Agent(
            agent_name="Strategy-Synthesizer",
            system_prompt="""You are the lead strategy coordinator. Synthesize inputs from intelligence and analysis agents to:
            1. Create coherent trading strategies
            2. Weigh different agent recommendations
            3. Provide final trading decisions
            4. Explain reasoning and confidence levels

            Consider all agent inputs and market conditions for optimal decisions.""",
            model_name="google/gemini-2.5-pro",
            max_loops=1,
        )

        portfolio_agent = Agent(
            agent_name="Portfolio-Optimizer",
            system_prompt="""You are a portfolio optimization expert. Based on strategy recommendations:
            1. Optimize asset allocation
            2. Recommend position sizes
            3. Balance risk and return
            4. Suggest rebalancing actions

            Apply modern portfolio theory and risk management principles.""",
            model_name="google/gemini-2.5-pro",
            max_loops=1,
        )

        executor_agent = Agent(
            agent_name="Trade-Executor",
            system_prompt="""You are a trade execution specialist. Based on portfolio decisions:
            1. Plan optimal trade execution
            2. Minimize market impact and slippage
            3. Recommend execution timing
            4. Monitor execution quality

            Ensure best execution practices for all trades.""",
            model_name="google/gemini-2.5-pro",
            max_loops=1,
        )

        # Store agents by tier
        self.tier1_agents = [market_data_agent, sentiment_agent, onchain_agent]
        self.tier2_agents = [technical_agent, risk_agent, correlation_agent]
        self.tier3_agents = [strategy_agent, portfolio_agent, executor_agent]

        # Store all agents with IDs
        all_agents = [
            ("market_data", market_data_agent),
            ("sentiment", sentiment_agent),
            ("onchain", onchain_agent),
            ("technical", technical_agent),
            ("risk", risk_agent),
            ("correlation", correlation_agent),
            ("strategy", strategy_agent),
            ("portfolio", portfolio_agent),
            ("executor", executor_agent)
        ]

        for agent_id, agent in all_agents:
            self.agents[agent_id] = agent

        logger.info(f"Initialized {len(self.agents)} Swarms agents")

    async def execute_trading_cycle(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute complete trading cycle through all tiers"""
        try:
            logger.info("Executing Swarms trading cycle...")
            self.last_market_data = market_data

            # Create market context for agents
            market_context = f"Current market data: {json.dumps(market_data, indent=2)}\nAnalyze this data according to your role."

            # Phase 1: Intelligence Gathering (Tier 1) - Run concurrently
            logger.info("Phase 1: Running intelligence gathering agents...")
            tier1_results = await run_agents_concurrently_async(
                agents=self.tier1_agents,
                task=market_context
            )

            # Phase 2: Analysis & Processing (Tier 2) - Run concurrently with Tier 1 context
            logger.info("Phase 2: Running analysis agents...")
            analysis_context = f"{market_context}\n\nIntelligence Summary:\n{tier1_results}\n\nProvide your specialized analysis."
            tier2_results = await run_agents_concurrently_async(
                agents=self.tier2_agents,
                task=analysis_context
            )

            # Phase 3: Strategy & Execution (Tier 3) - Run sequentially
            logger.info("Phase 3: Running strategy agents...")
            strategy_context = f"{market_context}\n\nIntelligence:\n{tier1_results}\n\nAnalysis:\n{tier2_results}\n\nProvide final recommendations."

            # Run strategy agents in sequence for coordinated decision making
            strategy_workflow = SequentialWorkflow(
                agents=self.tier3_agents,
                max_loops=1,
            )
            tier3_results = strategy_workflow.run(strategy_context)

            # Synthesize final decision
            final_decision = await self._synthesize_decision(
                tier1_results, tier2_results, tier3_results, market_data
            )

            return final_decision

        except Exception as e:
            logger.error(f"Error in Swarms trading cycle: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
                "status": "failed"
            }

    async def _synthesize_decision(self, tier1: str, tier2: str, tier3: str, market_data: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesize final trading decision from all tiers"""

        # Extract key signals from agent outputs
        all_analysis = f"{tier1} {tier2} {tier3}".lower()

        decisions = []

        # Analyze sentiment for each asset
        for asset in ["BTC", "ETH", "SOL"]:
            # Count bullish vs bearish signals
            bullish_signals = (
                all_analysis.count("buy") +
                all_analysis.count("bullish") +
                all_analysis.count("positive") +
                all_analysis.count("strong") +
                all_analysis.count("breakout")
            )

            bearish_signals = (
                all_analysis.count("sell") +
                all_analysis.count("bearish") +
                all_analysis.count("negative") +
                all_analysis.count("weak") +
                all_analysis.count("breakdown")
            )

            # Determine action and confidence
            signal_diff = bullish_signals - bearish_signals

            if signal_diff > 2:
                action = "BUY"
                confidence = min(75 + (signal_diff * 5), 95)
            elif signal_diff < -2:
                action = "SELL"
                confidence = min(75 + (abs(signal_diff) * 5), 95)
            else:
                action = "HOLD"
                confidence = 60 + abs(signal_diff) * 5

            # Create decision
            decisions.append({
                "asset": asset,
                "action": action,
                "confidence": confidence,
                "reasoning": f"Swarms analysis: {bullish_signals} bullish vs {bearish_signals} bearish signals",
                "price_target": market_data.get(asset, 0) * (1.05 if action == "BUY" else 0.95),
                "timestamp": datetime.utcnow().isoformat()
            })

        return {
            "decisions": decisions,
            "consensus_action": max(set([d["action"] for d in decisions]), key=[d["action"] for d in decisions].count),
            "overall_confidence": sum([d["confidence"] for d in decisions]) / len(decisions),
            "risk_assessment": "Medium",
            "intelligence_summary": tier1[:200] + "..." if len(tier1) > 200 else tier1,
            "analysis_summary": tier2[:200] + "..." if len(tier2) > 200 else tier2,
            "strategy_summary": tier3[:200] + "..." if len(tier3) > 200 else tier3,
            "timestamp": datetime.utcnow().isoformat(),
            "agent_votes": {
                agent_id: decisions[0]["action"] for agent_id in self.agents.keys()
            }
        }

    async def get_agents_status(self) -> List[Dict[str, Any]]:
        """Get current status of all agents"""
        agents_status = []

        tier_mapping = {
            **{agent.agent_name: 1 for agent in self.tier1_agents},
            **{agent.agent_name: 2 for agent in self.tier2_agents},
            **{agent.agent_name: 3 for agent in self.tier3_agents},
        }

        for agent_id, agent in self.agents.items():
            status = {
                "id": agent_id,
                "name": agent.agent_name,
                "tier": tier_mapping.get(agent.agent_name, 1),
                "status": "active",
                "confidence": 85 + (hash(agent_id) % 15),  # Simulated confidence
                "last_action": f"Processing {agent.agent_name.lower()} analysis",
                "last_updated": datetime.utcnow().isoformat()
            }
            agents_status.append(status)

        return agents_status

    async def query_agent(self, agent_id: str, query: str) -> str:
        """Query specific agent directly"""
        if agent_id not in self.agents:
            return f"Agent {agent_id} not found"

        try:
            agent = self.agents[agent_id]
            result = agent.run(query)
            return result
        except Exception as e:
            logger.error(f"Error querying agent {agent_id}: {e}")
            return f"Error querying agent: {str(e)}"

    async def shutdown(self):
        """Gracefully shutdown the trading floor"""
        logger.info("Shutting down Swarms Trading Floor...")
        self.system_status = "shutdown"
        logger.info("Swarms Trading Floor shutdown complete")