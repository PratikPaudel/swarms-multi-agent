"""
Autonomous Trading Floor - Core implementation using Swarms framework
"""

from swarms import Agent, ConcurrentWorkflow, SequentialWorkflow, MajorityVoting
import asyncio
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import os

from agents.tier1 import MarketDataAgent, SentimentAgent, OnChainAgent
from agents.tier2 import TechnicalAnalystAgent, RiskCalculatorAgent, CorrelationAgent
from agents.tier3 import StrategyAgent, PortfolioAgent, ExecutorAgent

logger = logging.getLogger(__name__)

class AutonomousTradingFloor:
    """
    Main trading floor orchestrator managing multi-tier agent architecture
    """

    def __init__(self):
        self.agents: Dict[str, Agent] = {}
        self.tier1_agents: Dict[str, Agent] = {}
        self.tier2_agents: Dict[str, Agent] = {}
        self.tier3_agents: Dict[str, Agent] = {}

        # Workflows
        self.intelligence_workflow: Optional[ConcurrentWorkflow] = None
        self.analysis_workflow: Optional[ConcurrentWorkflow] = None
        self.strategy_workflow: Optional[SequentialWorkflow] = None
        self.voting_system: Optional[MajorityVoting] = None

        # System state
        self.last_market_data: Dict[str, Any] = {}
        self.agent_decisions: Dict[str, Any] = {}
        self.system_status = "initializing"

    async def initialize(self):
        """Initialize all agents and workflows"""
        try:
            logger.info("Initializing Autonomous Trading Floor...")

            # Initialize Tier 1: Intelligence Gathering
            await self._initialize_tier1_agents()

            # Initialize Tier 2: Analysis & Processing
            await self._initialize_tier2_agents()

            # Initialize Tier 3: Strategy & Execution
            await self._initialize_tier3_agents()

            # Setup workflows
            await self._setup_workflows()

            self.system_status = "operational"
            logger.info("Trading Floor initialization complete")

        except Exception as e:
            logger.error(f"Error initializing trading floor: {e}")
            self.system_status = "error"
            raise

    async def _initialize_tier1_agents(self):
        """Initialize Tier 1 intelligence gathering agents"""
        logger.info("Initializing Tier 1 agents...")

        # Market Data Collector
        self.tier1_agents["market_data"] = MarketDataAgent(
            agent_name="Market-Data-Collector",
            system_prompt="""You are a market data specialist. Your role is to:
            1. Collect real-time cryptocurrency prices (BTC, ETH, SOL)
            2. Monitor trading volumes and order book depth
            3. Detect price anomalies and significant movements
            4. Report findings in structured JSON format

            Always provide current market analysis and flag any unusual activity.""",
            model_name="claude-3-haiku-20240307",
            max_loops=1
        )

        # Sentiment Analyzer
        self.tier1_agents["sentiment"] = SentimentAgent(
            agent_name="Sentiment-Analyzer",
            system_prompt="""You are a social sentiment analyst. Your role is to:
            1. Analyze social media sentiment for crypto assets
            2. Monitor news and Reddit discussions
            3. Score sentiment on -100 to +100 scale
            4. Identify trending topics and influencer mentions

            Provide sentiment scores and key discussion points.""",
            model_name="claude-3-haiku-20240307",
            max_loops=1
        )

        # On-Chain Monitor
        self.tier1_agents["onchain"] = OnChainAgent(
            agent_name="On-Chain-Monitor",
            system_prompt="""You are an on-chain data analyst. Your role is to:
            1. Track whale wallet movements and large transfers
            2. Monitor DeFi protocol TVL changes
            3. Identify unusual transaction patterns
            4. Analyze smart contract interactions

            Report significant on-chain events and their potential impact.""",
            model_name="claude-3-haiku-20240307",
            max_loops=1
        )

        # Add to main agents dict
        self.agents.update(self.tier1_agents)

    async def _initialize_tier2_agents(self):
        """Initialize Tier 2 analysis and processing agents"""
        logger.info("Initializing Tier 2 agents...")

        # Technical Analyst
        self.tier2_agents["technical"] = TechnicalAnalystAgent(
            agent_name="Technical-Analyst",
            system_prompt="""You are a technical analysis expert. Your role is to:
            1. Calculate technical indicators (RSI, MACD, Bollinger Bands)
            2. Identify chart patterns and support/resistance levels
            3. Generate buy/sell/hold signals with confidence scores
            4. Perform multi-timeframe analysis

            Provide clear technical recommendations with reasoning.""",
            model_name="claude-3-haiku-20240307",
            max_loops=1
        )

        # Risk Calculator
        self.tier2_agents["risk"] = RiskCalculatorAgent(
            agent_name="Risk-Calculator",
            system_prompt="""You are a risk management specialist. Your role is to:
            1. Calculate VaR, Expected Shortfall, and drawdown metrics
            2. Perform portfolio stress testing
            3. Recommend position sizing using Kelly Criterion
            4. Monitor concentration and correlation risks

            Always prioritize capital preservation and risk-adjusted returns.""",
            model_name="claude-3-haiku-20240307",
            max_loops=1
        )

        # Correlation Analyzer
        self.tier2_agents["correlation"] = CorrelationAgent(
            agent_name="Correlation-Analyzer",
            system_prompt="""You are a correlation and arbitrage specialist. Your role is to:
            1. Analyze inter-market correlations
            2. Identify pairs trading opportunities
            3. Monitor market regime changes
            4. Detect correlation breakdowns

            Find inefficiencies and arbitrage opportunities.""",
            model_name="claude-3-haiku-20240307",
            max_loops=1
        )

        # Add to main agents dict
        self.agents.update(self.tier2_agents)

    async def _initialize_tier3_agents(self):
        """Initialize Tier 3 strategy and execution agents"""
        logger.info("Initializing Tier 3 agents...")

        # Strategy Synthesizer
        self.tier3_agents["strategy"] = StrategyAgent(
            agent_name="Strategy-Synthesizer",
            system_prompt="""You are the strategy coordination lead. Your role is to:
            1. Synthesize inputs from all analysis agents
            2. Use ensemble decision-making with weighted voting
            3. Adapt strategies based on market conditions
            4. Provide final trading recommendations

            Consider all agent inputs and provide clear, actionable strategies.""",
            model_name="claude-3-haiku-20240307",
            max_loops=1
        )

        # Portfolio Optimizer
        self.tier3_agents["portfolio"] = PortfolioAgent(
            agent_name="Portfolio-Optimizer",
            system_prompt="""You are a portfolio optimization expert. Your role is to:
            1. Apply Modern Portfolio Theory for allocation
            2. Implement dynamic rebalancing strategies
            3. Optimize risk-adjusted returns
            4. Manage position sizing and leverage

            Focus on efficient frontier optimization and risk parity.""",
            model_name="claude-3-haiku-20240307",
            max_loops=1
        )

        # Trade Executor
        self.tier3_agents["executor"] = ExecutorAgent(
            agent_name="Trade-Executor",
            system_prompt="""You are the trade execution specialist. Your role is to:
            1. Route orders for optimal execution
            2. Implement TWAP/VWAP algorithms for large orders
            3. Monitor slippage and execution quality
            4. Provide execution reports and metrics

            Ensure best execution practices and minimal market impact.""",
            model_name="claude-3-haiku-20240307",
            max_loops=1
        )

        # Add to main agents dict
        self.agents.update(self.tier3_agents)

    async def _setup_workflows(self):
        """Setup multi-tier workflows"""
        logger.info("Setting up agent workflows...")

        # Tier 1: Concurrent intelligence gathering
        self.intelligence_workflow = ConcurrentWorkflow(
            agents=list(self.tier1_agents.values()),
            max_loops=1
        )

        # Tier 2: Concurrent analysis
        self.analysis_workflow = ConcurrentWorkflow(
            agents=list(self.tier2_agents.values()),
            max_loops=1
        )

        # Tier 3: Sequential strategy and execution
        self.strategy_workflow = SequentialWorkflow(
            agents=list(self.tier3_agents.values()),
            max_loops=1
        )

        # Democratic Voting System - All agents vote on trading decisions
        all_agents = list(self.agents.values())
        self.voting_system = MajorityVoting(
            agents=all_agents,
            name="Trading-Decision-Democracy",
            description="Democratic voting system for trading decisions",
            consensus_agent_model_name="claude-3-haiku-20240307",
            consensus_agent_prompt="""You are the Trading Decision Consensus Agent. Your role is to synthesize agent votes into final trading recommendations.

**Instructions:**
1. **Vote Analysis:** Each agent will provide a BUY/SELL/HOLD recommendation with reasoning
2. **Democratic Process:** Count votes for each action (BUY/SELL/HOLD)
3. **Consensus Building:** Determine the majority decision or synthesize if tied
4. **Confidence Scoring:** Rate confidence (0-100) based on vote distribution and reasoning quality
5. **Risk Assessment:** Evaluate overall risk level (Low/Medium/High)

**Output Format:**
{
    "consensus_action": "BUY|SELL|HOLD",
    "vote_breakdown": {"BUY": X, "SELL": Y, "HOLD": Z},
    "confidence": 85,
    "reasoning": "Clear explanation of the decision",
    "risk_level": "Medium",
    "dissenting_opinions": "Summary of minority votes"
}

Prioritize capital preservation and only recommend BUY/SELL with high confidence.""",
            verbose=True,
            max_loops=1
        )

    async def execute_trading_cycle(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute complete trading cycle through all tiers"""
        try:
            logger.info("Executing trading cycle...")

            # Fetch real market data using Market Data Agent
            if "market_data" in self.tier1_agents:
                try:
                    real_market_data = await self.tier1_agents["market_data"].fetch_market_data()
                    # Merge with provided data, preferring real data
                    combined_data = {**market_data, **real_market_data}
                    self.last_market_data = combined_data
                    logger.info(f"Using real market data: {real_market_data}")
                except Exception as e:
                    logger.warning(f"Failed to fetch real market data: {e}, using provided data")
                    self.last_market_data = market_data
            else:
                self.last_market_data = market_data

            # Phase 1: Intelligence Gathering (Tier 1)
            intelligence_task = f"Analyze current market data: {json.dumps(self.last_market_data)}"
            intelligence_results = await self._run_workflow_async(
                self.intelligence_workflow, intelligence_task
            )

            # Phase 2: Analysis & Processing (Tier 2)
            analysis_task = f"Process intelligence data: {intelligence_results}"
            analysis_results = await self._run_workflow_async(
                self.analysis_workflow, analysis_task
            )

            # Phase 3: Strategy & Execution (Tier 3)
            strategy_task = f"Create strategy from: Intelligence: {intelligence_results}, Analysis: {analysis_results}"
            strategy_results = await self._run_workflow_async(
                self.strategy_workflow, strategy_task
            )

            # Phase 4: Democratic Voting on Trading Decision
            voting_task = f"""Based on the following analysis, each agent must vote BUY, SELL, or HOLD for the major cryptocurrencies (BTC, ETH, SOL).

Market Data: {json.dumps(self.last_market_data)}
Intelligence: {intelligence_results}
Analysis: {analysis_results}
Strategy: {strategy_results}

INSTRUCTIONS: Provide your vote in this exact format:
VOTE: BUY/SELL/HOLD
REASONING: [Your reasoning in 1-2 sentences]
CONFIDENCE: [0-100]"""

            # Run democratic voting
            final_decision = await self._run_democratic_vote(voting_task)

            return final_decision

        except Exception as e:
            logger.error(f"Error in trading cycle: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
                "status": "failed"
            }

    async def _run_workflow_async(self, workflow, task: str) -> str:
        """Run workflow asynchronously"""
        try:
            # Since swarms workflows might not be async, run in executor
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, workflow.run, task)
            return result
        except Exception as e:
            logger.error(f"Workflow execution error: {e}")
            return f"Error: {str(e)}"

    async def _run_democratic_vote(self, voting_task: str) -> Dict[str, Any]:
        """Run democratic voting process across all agents"""
        try:
            logger.info("🗳️ Starting democratic voting process...")

            # Run the voting system
            loop = asyncio.get_event_loop()
            voting_results = await loop.run_in_executor(
                None, self.voting_system.run, voting_task
            )

            logger.info(f"Voting completed: {voting_results}")

            # Parse the consensus result and format for our system
            return await self._parse_voting_results(voting_results)

        except Exception as e:
            logger.error(f"Democratic voting error: {e}")
            return {
                "decisions": [],
                "consensus_action": "HOLD",
                "overall_confidence": 50,
                "risk_assessment": "High",
                "voting_error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    async def _parse_voting_results(self, voting_results) -> Dict[str, Any]:
        """Parse democratic voting results into our decision format"""
        try:
            logger.info("📊 Parsing voting results...")

            # Convert voting results to string if it's a list
            if isinstance(voting_results, list):
                voting_text = " ".join(str(item) for item in voting_results)
            else:
                voting_text = str(voting_results)

            logger.info(f"Voting results: {voting_text[:200]}...")

            # Extract consensus action and reasoning from voting results
            consensus_action = "HOLD"  # Default fallback
            confidence = 70
            reasoning = "Democratic vote completed"
            vote_breakdown = {"BUY": 0, "SELL": 0, "HOLD": 0}

            # Try to parse the consensus agent's response
            if "BUY" in voting_text.upper():
                consensus_action = "BUY"
            elif "SELL" in voting_text.upper():
                consensus_action = "SELL"
            else:
                consensus_action = "HOLD"

            # Look for confidence indicators
            import re
            confidence_match = re.search(r'confidence[:\s]*(\d+)', voting_text, re.IGNORECASE)
            if confidence_match:
                confidence = int(confidence_match.group(1))

            # Create trading decisions for each asset
            decisions = []
            for asset in ["BTC", "ETH", "SOL"]:
                decisions.append({
                    "asset": asset,
                    "action": consensus_action,
                    "confidence": min(confidence, 95),
                    "reasoning": f"Democratic vote: {reasoning[:100]}...",
                    "price_target": self.last_market_data.get(asset, {}).get('price', 0) * (1.05 if consensus_action == "BUY" else 0.95 if consensus_action == "SELL" else 1.0),
                    "timestamp": datetime.utcnow().isoformat()
                })

            return {
                "decisions": decisions,
                "consensus_action": consensus_action,
                "overall_confidence": confidence,
                "risk_assessment": "Medium",
                "democracy_summary": voting_text[:300] + "..." if len(voting_text) > 300 else voting_text,
                "vote_breakdown": vote_breakdown,
                "timestamp": datetime.utcnow().isoformat(),
                "agent_votes": {
                    agent_id: consensus_action for agent_id in self.agents.keys()
                }
            }

        except Exception as e:
            logger.error(f"Error parsing voting results: {e}")
            return {
                "decisions": [],
                "consensus_action": "HOLD",
                "overall_confidence": 50,
                "risk_assessment": "High",
                "parsing_error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    async def _synthesize_decision(self, intelligence: str, analysis: str, strategy: str) -> Dict[str, Any]:
        """Synthesize final trading decision from all tiers"""

        # Mock decision synthesis (in production, this would be more sophisticated)
        decisions = []

        # Extract key information and create decision
        if "BUY" in strategy.upper() or "bullish" in strategy.lower():
            action = "BUY"
            confidence = 75 + (len([x for x in [intelligence, analysis, strategy] if "positive" in x.lower()]) * 5)
        elif "SELL" in strategy.upper() or "bearish" in strategy.lower():
            action = "SELL"
            confidence = 75 + (len([x for x in [intelligence, analysis, strategy] if "negative" in x.lower()]) * 5)
        else:
            action = "HOLD"
            confidence = 70

        # Create decision for primary assets
        for asset in ["BTC", "ETH", "SOL"]:
            decisions.append({
                "asset": asset,
                "action": action,
                "confidence": min(confidence, 95),
                "reasoning": f"Multi-agent analysis: {strategy[:100]}...",
                "price_target": self.last_market_data.get(asset, 0) * (1.05 if action == "BUY" else 0.95),
                "timestamp": datetime.utcnow().isoformat()
            })

        return {
            "decisions": decisions,
            "consensus_action": action,
            "overall_confidence": confidence,
            "risk_assessment": "Medium",
            "intelligence_summary": intelligence[:200] + "..." if len(intelligence) > 200 else intelligence,
            "analysis_summary": analysis[:200] + "..." if len(analysis) > 200 else analysis,
            "strategy_summary": strategy[:200] + "..." if len(strategy) > 200 else strategy,
            "timestamp": datetime.utcnow().isoformat(),
            "agent_votes": {
                agent_id: action for agent_id in self.agents.keys()
            }
        }

    async def get_agents_status(self) -> List[Dict[str, Any]]:
        """Get current status of all agents"""
        agents_status = []

        for tier, agents_dict in [(1, self.tier1_agents), (2, self.tier2_agents), (3, self.tier3_agents)]:
            for agent_id, agent in agents_dict.items():
                status = {
                    "id": agent_id,
                    "name": agent.agent_name,
                    "tier": tier,
                    "status": "active",  # In production, get actual status
                    "confidence": 85 + (hash(agent_id) % 15),  # Mock confidence
                    "last_action": f"Processing {agent.agent_name.lower()} data",
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
        logger.info("Shutting down Autonomous Trading Floor...")
        self.system_status = "shutdown"
        # Cleanup resources if needed
        logger.info("Trading Floor shutdown complete")