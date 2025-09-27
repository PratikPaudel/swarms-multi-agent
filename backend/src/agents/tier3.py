"""
Tier 3 Agents: Strategy & Execution
Strategy Synthesis, Portfolio Optimization, Trade Execution
"""

from swarms import Agent
import random
import json
from datetime import datetime
from typing import Dict, Any, List, Tuple

class StrategyAgent(Agent):
    """Synthesizes inputs from all agents to create coherent trading strategies"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.strategy_types = ["momentum", "mean_reversion", "breakout", "arbitrage"]
        self.voting_weights = {
            "tier1": 0.3,  # Intelligence gathering
            "tier2": 0.5,  # Analysis
            "tier3": 0.2   # Execution feedback
        }

    def parse_agent_inputs(self, intelligence: str, analysis: str) -> Dict[str, Any]:
        """Parse and structure inputs from other agents"""

        # Extract key signals from intelligence (Tier 1)
        intelligence_signals = {
            "market_trend": "neutral",
            "sentiment_score": 0,
            "whale_activity": "normal",
            "volume_analysis": "normal"
        }

        # Simple keyword extraction (in production, use NLP)
        if "bullish" in intelligence.lower() or "surge" in intelligence.lower():
            intelligence_signals["market_trend"] = "bullish"
        elif "bearish" in intelligence.lower() or "drop" in intelligence.lower():
            intelligence_signals["market_trend"] = "bearish"

        if "positive" in intelligence.lower():
            intelligence_signals["sentiment_score"] = random.randint(60, 90)
        elif "negative" in intelligence.lower():
            intelligence_signals["sentiment_score"] = random.randint(-90, -60)
        else:
            intelligence_signals["sentiment_score"] = random.randint(-20, 20)

        if "whale" in intelligence.lower():
            intelligence_signals["whale_activity"] = "high"

        # Extract key signals from analysis (Tier 2)
        analysis_signals = {
            "technical_signal": "neutral",
            "risk_level": "medium",
            "correlation_opportunities": [],
            "volatility": "normal"
        }

        if "buy" in analysis.lower() or "bullish" in analysis.lower():
            analysis_signals["technical_signal"] = "buy"
        elif "sell" in analysis.lower() or "bearish" in analysis.lower():
            analysis_signals["technical_signal"] = "sell"

        if "high risk" in analysis.lower() or "var" in analysis.lower():
            analysis_signals["risk_level"] = "high"
        elif "low risk" in analysis.lower():
            analysis_signals["risk_level"] = "low"

        return {
            "intelligence": intelligence_signals,
            "analysis": analysis_signals,
            "raw_intelligence": intelligence,
            "raw_analysis": analysis
        }

    def ensemble_decision_making(self, parsed_inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Use ensemble methods to combine different signals"""

        intelligence = parsed_inputs["intelligence"]
        analysis = parsed_inputs["analysis"]

        # Asset-specific decisions
        asset_decisions = {}

        for asset in ["BTC", "ETH", "SOL"]:
            # Collect votes from different signal sources
            votes = []
            confidence_scores = []

            # Intelligence vote (market data, sentiment, on-chain)
            intel_vote = self._intelligence_vote(intelligence, asset)
            votes.append(intel_vote["action"])
            confidence_scores.append(intel_vote["confidence"])

            # Technical analysis vote
            tech_vote = self._technical_vote(analysis, asset)
            votes.append(tech_vote["action"])
            confidence_scores.append(tech_vote["confidence"])

            # Risk-adjusted vote
            risk_vote = self._risk_adjusted_vote(analysis, asset)
            votes.append(risk_vote["action"])
            confidence_scores.append(risk_vote["confidence"])

            # Weighted ensemble decision
            final_decision = self._weighted_vote(votes, confidence_scores)

            asset_decisions[asset] = {
                "action": final_decision["action"],
                "confidence": final_decision["confidence"],
                "votes": {
                    "intelligence": intel_vote,
                    "technical": tech_vote,
                    "risk": risk_vote
                },
                "reasoning": self._generate_reasoning(intel_vote, tech_vote, risk_vote, final_decision)
            }

        return asset_decisions

    def _intelligence_vote(self, intelligence: Dict[str, Any], asset: str) -> Dict[str, Any]:
        """Generate vote based on intelligence signals"""
        score = 0
        reasoning = []

        # Market trend influence
        trend = intelligence.get("market_trend", "neutral")
        if trend == "bullish":
            score += 30
            reasoning.append("Bullish market trend")
        elif trend == "bearish":
            score -= 30
            reasoning.append("Bearish market trend")

        # Sentiment influence
        sentiment = intelligence.get("sentiment_score", 0)
        score += sentiment * 0.3
        if sentiment > 50:
            reasoning.append(f"Positive sentiment ({sentiment})")
        elif sentiment < -50:
            reasoning.append(f"Negative sentiment ({sentiment})")

        # Whale activity
        whale_activity = intelligence.get("whale_activity", "normal")
        if whale_activity == "high":
            score += random.choice([-15, 15])  # Can be bullish or bearish
            reasoning.append("Significant whale activity detected")

        # Convert score to action
        if score > 20:
            action = "BUY"
        elif score < -20:
            action = "SELL"
        else:
            action = "HOLD"

        confidence = min(abs(score) + 40, 95)

        return {
            "action": action,
            "confidence": confidence,
            "score": score,
            "reasoning": reasoning
        }

    def _technical_vote(self, analysis: Dict[str, Any], asset: str) -> Dict[str, Any]:
        """Generate vote based on technical analysis"""
        score = 0
        reasoning = []

        # Technical signal
        tech_signal = analysis.get("technical_signal", "neutral")
        if tech_signal == "buy":
            score += 40
            reasoning.append("Technical indicators show buy signal")
        elif tech_signal == "sell":
            score -= 40
            reasoning.append("Technical indicators show sell signal")

        # Volatility consideration
        volatility = analysis.get("volatility", "normal")
        if volatility == "high":
            score *= 0.8  # Reduce confidence in high volatility
            reasoning.append("High volatility reduces signal strength")

        # Correlation opportunities
        opportunities = analysis.get("correlation_opportunities", [])
        if opportunities:
            score += 10
            reasoning.append("Correlation arbitrage opportunities available")

        # Convert score to action
        if score > 25:
            action = "BUY"
        elif score < -25:
            action = "SELL"
        else:
            action = "HOLD"

        confidence = min(abs(score) + 35, 95)

        return {
            "action": action,
            "confidence": confidence,
            "score": score,
            "reasoning": reasoning
        }

    def _risk_adjusted_vote(self, analysis: Dict[str, Any], asset: str) -> Dict[str, Any]:
        """Generate risk-adjusted vote"""
        score = 0
        reasoning = []

        risk_level = analysis.get("risk_level", "medium")

        if risk_level == "high":
            score -= 30
            reasoning.append("High portfolio risk - recommend caution")
        elif risk_level == "low":
            score += 15
            reasoning.append("Low risk environment - can increase exposure")

        # Risk-adjusted action
        if score > 10:
            action = "BUY"
        elif score < -20:
            action = "SELL"
        else:
            action = "HOLD"

        confidence = 60 + abs(score)

        return {
            "action": action,
            "confidence": min(confidence, 90),
            "score": score,
            "reasoning": reasoning
        }

    def _weighted_vote(self, votes: List[str], confidences: List[float]) -> Dict[str, Any]:
        """Combine votes using weighted ensemble"""

        # Count votes
        vote_counts = {"BUY": 0, "SELL": 0, "HOLD": 0}
        weighted_scores = {"BUY": 0, "SELL": 0, "HOLD": 0}

        for vote, confidence in zip(votes, confidences):
            vote_counts[vote] += 1
            weighted_scores[vote] += confidence

        # Find winning vote
        winner = max(weighted_scores, key=weighted_scores.get)

        # Calculate ensemble confidence
        total_confidence = sum(confidences)
        winning_confidence = weighted_scores[winner]

        ensemble_confidence = (winning_confidence / total_confidence) * 100 if total_confidence > 0 else 50

        return {
            "action": winner,
            "confidence": min(ensemble_confidence, 95),
            "vote_distribution": vote_counts,
            "weighted_scores": weighted_scores
        }

    def _generate_reasoning(self, intel_vote: Dict, tech_vote: Dict, risk_vote: Dict, final: Dict) -> str:
        """Generate human-readable reasoning for the decision"""

        reasoning_parts = []

        # Summarize key factors
        if final["action"] == "BUY":
            reasoning_parts.append("BUY recommendation based on:")
        elif final["action"] == "SELL":
            reasoning_parts.append("SELL recommendation based on:")
        else:
            reasoning_parts.append("HOLD recommendation due to:")

        # Add strongest supporting reasons
        all_reasons = []
        all_reasons.extend(intel_vote.get("reasoning", []))
        all_reasons.extend(tech_vote.get("reasoning", []))
        all_reasons.extend(risk_vote.get("reasoning", []))

        # Take top 2-3 reasons
        reasoning_parts.extend(all_reasons[:3])

        # Add confidence note
        confidence = final["confidence"]
        if confidence > 80:
            reasoning_parts.append(f"High confidence ({confidence:.0f}%)")
        elif confidence < 60:
            reasoning_parts.append(f"Low confidence ({confidence:.0f}%) - monitor closely")

        return ". ".join(reasoning_parts)

class PortfolioAgent(Agent):
    """Optimizes portfolio allocation and manages risk"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.max_position_size = 0.3  # 30% max per asset
        self.risk_budget = 0.02  # 2% daily VaR limit

    async def optimize_portfolio(self, strategy_decisions: Dict[str, Any], current_portfolio: Dict[str, Any] = None) -> Dict[str, Any]:
        """Optimize portfolio allocation based on strategy decisions using real portfolio data"""
        from ..services.real_data_sources import real_data_sources

        try:
            # Get real portfolio data if not provided
            if current_portfolio is None:
                portfolio_data = await real_data_sources.get_real_portfolio_data()
                current_portfolio = portfolio_data.get("portfolio", {})

        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error fetching real portfolio data: {e}")

        if current_portfolio is None:
            current_portfolio = {
                "BTC": {"weight": 0.4, "value": 100000},
                "ETH": {"weight": 0.3, "value": 75000},
                "SOL": {"weight": 0.2, "value": 50000},
                "CASH": {"weight": 0.1, "value": 25000}
            }

        total_value = sum(pos["value"] for pos in current_portfolio.values())

        # Calculate target weights based on strategy decisions
        target_weights = self._calculate_target_weights(strategy_decisions, current_portfolio)

        # Apply risk constraints
        constrained_weights = self._apply_risk_constraints(target_weights, strategy_decisions)

        # Generate rebalancing recommendations
        rebalancing_actions = self._generate_rebalancing_actions(
            current_portfolio, constrained_weights, total_value
        )

        # Calculate expected risk and return
        portfolio_metrics = self._calculate_portfolio_metrics(
            constrained_weights, strategy_decisions
        )

        return {
            "current_allocation": {asset: pos["weight"] for asset, pos in current_portfolio.items()},
            "target_allocation": constrained_weights,
            "rebalancing_actions": rebalancing_actions,
            "portfolio_metrics": portfolio_metrics,
            "optimization_notes": self._generate_optimization_notes(strategy_decisions, constrained_weights)
        }

    def _calculate_target_weights(self, strategy_decisions: Dict[str, Any], current_portfolio: Dict[str, Any]) -> Dict[str, float]:
        """Calculate target weights based on strategy signals"""

        # Start with equal weight for crypto assets
        base_crypto_weight = 0.25  # 25% each for BTC, ETH, SOL
        cash_weight = 0.25

        target_weights = {
            "BTC": base_crypto_weight,
            "ETH": base_crypto_weight,
            "SOL": base_crypto_weight,
            "CASH": cash_weight
        }

        # Adjust based on strategy decisions
        for asset, decision in strategy_decisions.items():
            if asset in target_weights:
                action = decision.get("action", "HOLD")
                confidence = decision.get("confidence", 50) / 100

                if action == "BUY":
                    # Increase allocation for buy signals
                    adjustment = 0.1 * confidence  # Up to 10% adjustment
                    target_weights[asset] += adjustment
                    target_weights["CASH"] -= adjustment / 3  # Reduce cash

                elif action == "SELL":
                    # Decrease allocation for sell signals
                    adjustment = 0.15 * confidence  # Up to 15% reduction
                    target_weights[asset] -= adjustment
                    target_weights["CASH"] += adjustment  # Increase cash

        # Ensure weights are non-negative and sum to 1
        for asset in target_weights:
            target_weights[asset] = max(0, target_weights[asset])

        total_weight = sum(target_weights.values())
        if total_weight > 0:
            for asset in target_weights:
                target_weights[asset] /= total_weight

        return target_weights

    def _apply_risk_constraints(self, target_weights: Dict[str, float], strategy_decisions: Dict[str, Any]) -> Dict[str, float]:
        """Apply risk management constraints to target weights"""

        constrained_weights = target_weights.copy()

        # Apply maximum position size constraint
        for asset in constrained_weights:
            if asset != "CASH":
                constrained_weights[asset] = min(constrained_weights[asset], self.max_position_size)

        # Apply correlation constraint (don't over-concentrate in correlated assets)
        crypto_weight = sum(constrained_weights[asset] for asset in ["BTC", "ETH", "SOL"])
        if crypto_weight > 0.8:  # Max 80% in crypto
            excess = crypto_weight - 0.8
            for asset in ["BTC", "ETH", "SOL"]:
                reduction = excess * (constrained_weights[asset] / crypto_weight)
                constrained_weights[asset] -= reduction
                constrained_weights["CASH"] += reduction

        # Ensure minimum cash position during high volatility
        min_cash = 0.05  # 5% minimum cash
        if constrained_weights["CASH"] < min_cash:
            deficit = min_cash - constrained_weights["CASH"]
            # Reduce other positions proportionally
            total_other = sum(constrained_weights[asset] for asset in constrained_weights if asset != "CASH")
            if total_other > 0:
                for asset in constrained_weights:
                    if asset != "CASH":
                        reduction = deficit * (constrained_weights[asset] / total_other)
                        constrained_weights[asset] -= reduction
                constrained_weights["CASH"] = min_cash

        return constrained_weights

    def _generate_rebalancing_actions(self, current_portfolio: Dict[str, Any], target_weights: Dict[str, float], total_value: float) -> List[Dict[str, Any]]:
        """Generate specific rebalancing actions"""

        actions = []

        for asset in target_weights:
            current_weight = current_portfolio.get(asset, {}).get("weight", 0)
            target_weight = target_weights[asset]

            weight_diff = target_weight - current_weight
            value_diff = weight_diff * total_value

            if abs(weight_diff) > 0.02:  # Only rebalance if difference > 2%
                if weight_diff > 0:
                    action_type = "BUY"
                    amount = abs(value_diff)
                else:
                    action_type = "SELL"
                    amount = abs(value_diff)

                actions.append({
                    "asset": asset,
                    "action": action_type,
                    "amount_usd": round(amount, 2),
                    "weight_change": round(weight_diff * 100, 2),
                    "priority": "high" if abs(weight_diff) > 0.1 else "medium"
                })

        return sorted(actions, key=lambda x: abs(x["weight_change"]), reverse=True)

    def _calculate_portfolio_metrics(self, weights: Dict[str, float], strategy_decisions: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate expected portfolio risk and return metrics"""

        # Mock expected returns and volatilities
        expected_returns = {
            "BTC": 0.15,  # 15% annual
            "ETH": 0.18,  # 18% annual
            "SOL": 0.25,  # 25% annual
            "CASH": 0.02  # 2% annual
        }

        volatilities = {
            "BTC": 0.60,  # 60% annual
            "ETH": 0.70,  # 70% annual
            "SOL": 0.90,  # 90% annual
            "CASH": 0.01  # 1% annual
        }

        # Calculate portfolio expected return
        portfolio_return = sum(weights[asset] * expected_returns.get(asset, 0) for asset in weights)

        # Calculate portfolio volatility (simplified - assumes correlations)
        portfolio_variance = 0
        for asset1 in weights:
            for asset2 in weights:
                if asset1 in volatilities and asset2 in volatilities:
                    correlation = 0.7 if asset1 != asset2 and asset1 != "CASH" and asset2 != "CASH" else 1.0
                    portfolio_variance += (weights[asset1] * weights[asset2] *
                                         volatilities[asset1] * volatilities[asset2] * correlation)

        portfolio_volatility = portfolio_variance ** 0.5

        # Calculate Sharpe ratio
        risk_free_rate = 0.02
        sharpe_ratio = (portfolio_return - risk_free_rate) / portfolio_volatility if portfolio_volatility > 0 else 0

        return {
            "expected_return": round(portfolio_return * 100, 2),
            "expected_volatility": round(portfolio_volatility * 100, 2),
            "sharpe_ratio": round(sharpe_ratio, 3),
            "risk_level": "HIGH" if portfolio_volatility > 0.5 else "MEDIUM" if portfolio_volatility > 0.3 else "LOW",
            "diversification_score": round((1 - max(weights.values())) * 100, 1)
        }

    def _generate_optimization_notes(self, strategy_decisions: Dict[str, Any], target_weights: Dict[str, float]) -> List[str]:
        """Generate notes about the optimization process"""

        notes = []

        # Check for high conviction decisions
        high_conviction_assets = [asset for asset, decision in strategy_decisions.items()
                                if decision.get("confidence", 0) > 80]
        if high_conviction_assets:
            notes.append(f"High conviction signals for: {', '.join(high_conviction_assets)}")

        # Check for concentration
        max_weight = max(target_weights.values())
        if max_weight > 0.4:
            concentrated_asset = max(target_weights, key=target_weights.get)
            notes.append(f"Concentrated position in {concentrated_asset} ({max_weight*100:.1f}%)")

        # Check cash allocation
        cash_weight = target_weights.get("CASH", 0)
        if cash_weight > 0.3:
            notes.append("High cash allocation - defensive positioning")
        elif cash_weight < 0.1:
            notes.append("Low cash allocation - aggressive positioning")

        return notes

class ExecutorAgent(Agent):
    """Handles trade execution and order management"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.execution_algorithms = ["TWAP", "VWAP", "Market", "Limit"]
        self.slippage_tolerance = 0.001  # 0.1%

    async def execute_rebalancing(self, rebalancing_actions: List[Dict[str, Any]], market_conditions: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute portfolio rebalancing actions using real market microstructure data"""
        from ..services.real_data_sources import real_data_sources

        try:
            # Get real execution data if not provided
            if market_conditions is None:
                execution_data = await real_data_sources.get_real_execution_data()
                market_conditions = execution_data.get("market_conditions", {})

        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error fetching real execution data: {e}")

        if market_conditions is None:
            market_conditions = {
                "volatility": "normal",
                "liquidity": "good",
                "market_hours": True
            }

        execution_plan = []
        execution_summary = {
            "total_trades": len(rebalancing_actions),
            "estimated_slippage": 0,
            "estimated_fees": 0,
            "execution_time_estimate": 0,
            "risk_assessment": "low"
        }

        for action in rebalancing_actions:
            trade_plan = self._plan_trade_execution(action, market_conditions)
            execution_plan.append(trade_plan)

            # Update summary
            execution_summary["estimated_slippage"] += trade_plan["estimated_slippage"]
            execution_summary["estimated_fees"] += trade_plan["estimated_fees"]
            execution_summary["execution_time_estimate"] = max(
                execution_summary["execution_time_estimate"],
                trade_plan["estimated_duration"]
            )

        # Determine overall risk
        if execution_summary["estimated_slippage"] > 0.005:  # 0.5%
            execution_summary["risk_assessment"] = "high"
        elif execution_summary["estimated_slippage"] > 0.002:  # 0.2%
            execution_summary["risk_assessment"] = "medium"

        return {
            "execution_plan": execution_plan,
            "execution_summary": execution_summary,
            "market_impact_analysis": self._analyze_market_impact(execution_plan),
            "execution_recommendations": self._generate_execution_recommendations(execution_plan, market_conditions)
        }

    def _plan_trade_execution(self, action: Dict[str, Any], market_conditions: Dict[str, Any]) -> Dict[str, Any]:
        """Plan execution for a single trade"""

        asset = action["asset"]
        trade_size = action["amount_usd"]
        trade_type = action["action"]

        # Choose execution algorithm based on trade size and market conditions
        algorithm = self._choose_execution_algorithm(trade_size, market_conditions)

        # Estimate execution parameters
        estimated_slippage = self._estimate_slippage(trade_size, asset, market_conditions)
        estimated_fees = self._estimate_fees(trade_size, asset)
        estimated_duration = self._estimate_duration(trade_size, algorithm)

        # Determine order splitting
        order_splits = self._calculate_order_splits(trade_size, algorithm, market_conditions)

        return {
            "asset": asset,
            "action": trade_type,
            "total_amount": trade_size,
            "algorithm": algorithm,
            "estimated_slippage": estimated_slippage,
            "estimated_fees": estimated_fees,
            "estimated_duration": estimated_duration,
            "order_splits": order_splits,
            "execution_priority": action.get("priority", "medium"),
            "execution_notes": self._generate_execution_notes(action, algorithm, market_conditions)
        }

    def _choose_execution_algorithm(self, trade_size: float, market_conditions: Dict[str, Any]) -> str:
        """Choose optimal execution algorithm"""

        volatility = market_conditions.get("volatility", "normal")
        liquidity = market_conditions.get("liquidity", "good")

        if trade_size < 10000:  # Small trades
            return "Market"
        elif trade_size < 100000:  # Medium trades
            if volatility == "high":
                return "TWAP"  # Time-weighted to reduce impact
            else:
                return "Limit"
        else:  # Large trades
            if liquidity == "poor":
                return "TWAP"  # Spread over time
            elif volatility == "high":
                return "VWAP"  # Volume-weighted
            else:
                return "TWAP"

    def _estimate_slippage(self, trade_size: float, asset: str, market_conditions: Dict[str, Any]) -> float:
        """Estimate execution slippage"""

        # Base slippage rates by asset
        base_slippage = {
            "BTC": 0.0005,   # 0.05%
            "ETH": 0.0008,   # 0.08%
            "SOL": 0.0015,   # 0.15%
            "CASH": 0.0001   # 0.01%
        }

        base = base_slippage.get(asset, 0.001)

        # Adjust for trade size
        size_multiplier = 1 + (trade_size / 1000000) * 0.5  # Increases with size

        # Adjust for market conditions
        volatility = market_conditions.get("volatility", "normal")
        liquidity = market_conditions.get("liquidity", "good")

        condition_multiplier = 1.0
        if volatility == "high":
            condition_multiplier *= 1.5
        if liquidity == "poor":
            condition_multiplier *= 2.0

        return base * size_multiplier * condition_multiplier

    def _estimate_fees(self, trade_size: float, asset: str) -> float:
        """Estimate trading fees"""

        # Typical exchange fees
        fee_rates = {
            "BTC": 0.001,    # 0.1%
            "ETH": 0.001,    # 0.1%
            "SOL": 0.0015,   # 0.15%
            "CASH": 0.0001   # 0.01%
        }

        fee_rate = fee_rates.get(asset, 0.001)
        return trade_size * fee_rate

    def _estimate_duration(self, trade_size: float, algorithm: str) -> int:
        """Estimate execution duration in minutes"""

        base_durations = {
            "Market": 1,      # Immediate
            "Limit": 5,       # 5 minutes
            "TWAP": 30,       # 30 minutes
            "VWAP": 20        # 20 minutes
        }

        base_duration = base_durations.get(algorithm, 10)

        # Adjust for trade size
        if trade_size > 100000:
            base_duration *= 2
        elif trade_size > 1000000:
            base_duration *= 4

        return base_duration

    def _calculate_order_splits(self, trade_size: float, algorithm: str, market_conditions: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Calculate how to split large orders"""

        if algorithm == "Market" or trade_size < 50000:
            # Execute as single order
            return [{
                "order_size": trade_size,
                "delay_minutes": 0,
                "order_type": "market" if algorithm == "Market" else "limit"
            }]

        # Split large orders
        max_order_size = 25000  # $25k per order
        num_orders = max(1, int(trade_size / max_order_size))
        order_size = trade_size / num_orders

        splits = []
        for i in range(num_orders):
            delay = 0 if algorithm == "Market" else i * 2  # 2 minute intervals
            splits.append({
                "order_size": order_size,
                "delay_minutes": delay,
                "order_type": "limit" if algorithm != "Market" else "market"
            })

        return splits

    def _analyze_market_impact(self, execution_plan: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze overall market impact of execution plan"""

        total_slippage = sum(trade["estimated_slippage"] for trade in execution_plan)
        total_fees = sum(trade["estimated_fees"] for trade in execution_plan)
        total_cost = total_slippage + total_fees

        # Analyze by asset
        asset_impact = {}
        for trade in execution_plan:
            asset = trade["asset"]
            if asset not in asset_impact:
                asset_impact[asset] = {
                    "total_amount": 0,
                    "total_slippage": 0,
                    "total_fees": 0
                }

            asset_impact[asset]["total_amount"] += trade["total_amount"]
            asset_impact[asset]["total_slippage"] += trade["estimated_slippage"]
            asset_impact[asset]["total_fees"] += trade["estimated_fees"]

        return {
            "total_execution_cost": total_cost,
            "total_slippage": total_slippage,
            "total_fees": total_fees,
            "cost_percentage": (total_cost / sum(trade["total_amount"] for trade in execution_plan)) * 100,
            "asset_breakdown": asset_impact,
            "impact_assessment": "LOW" if total_cost < 1000 else "MEDIUM" if total_cost < 5000 else "HIGH"
        }

    def _generate_execution_recommendations(self, execution_plan: List[Dict[str, Any]], market_conditions: Dict[str, Any]) -> List[str]:
        """Generate execution recommendations"""

        recommendations = []

        # Check for high-impact trades
        high_impact_trades = [trade for trade in execution_plan if trade["estimated_slippage"] > 0.003]
        if high_impact_trades:
            recommendations.append(f"Consider delaying {len(high_impact_trades)} high-impact trades during low volatility periods")

        # Check for simultaneous large trades
        large_trades = [trade for trade in execution_plan if trade["total_amount"] > 100000]
        if len(large_trades) > 1:
            recommendations.append("Stagger large trades to minimize market impact")

        # Market timing recommendations
        volatility = market_conditions.get("volatility", "normal")
        if volatility == "high":
            recommendations.append("High volatility detected - use TWAP/VWAP algorithms to reduce slippage")

        # Liquidity recommendations
        liquidity = market_conditions.get("liquidity", "good")
        if liquidity == "poor":
            recommendations.append("Poor liquidity - extend execution timeframe and use smaller order sizes")

        return recommendations

    def _generate_execution_notes(self, action: Dict[str, Any], algorithm: str, market_conditions: Dict[str, Any]) -> List[str]:
        """Generate specific notes for trade execution"""

        notes = []

        # Algorithm choice explanation
        notes.append(f"Using {algorithm} algorithm based on trade size and market conditions")

        # Priority notes
        priority = action.get("priority", "medium")
        if priority == "high":
            notes.append("High priority trade - execute immediately")
        elif priority == "low":
            notes.append("Low priority - can be delayed if market conditions improve")

        # Market condition notes
        volatility = market_conditions.get("volatility", "normal")
        if volatility == "high":
            notes.append("High volatility - monitor execution closely for slippage")

        return notes