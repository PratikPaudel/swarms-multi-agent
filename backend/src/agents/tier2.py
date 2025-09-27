"""
Tier 2 Agents: Analysis & Processing
Technical Analysis, Risk Calculation, Correlation Analysis
"""

from swarms import Agent
import random
import math
from datetime import datetime, timedelta
from typing import Dict, Any, List, Tuple

class TechnicalAnalystAgent(Agent):
    """Performs technical analysis and generates trading signals"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.indicators = ["RSI", "MACD", "BB", "SMA", "EMA", "Stochastic"]
        self.timeframes = ["1h", "4h", "1d", "1w"]

    def calculate_rsi(self, prices: List[float], period: int = 14) -> float:
        """Calculate Relative Strength Index"""
        if len(prices) < period + 1:
            return 50.0  # Neutral RSI if insufficient data

        gains = []
        losses = []

        for i in range(1, len(prices)):
            change = prices[i] - prices[i-1]
            if change > 0:
                gains.append(change)
                losses.append(0)
            else:
                gains.append(0)
                losses.append(abs(change))

        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period

        if avg_loss == 0:
            return 100.0

        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

    def calculate_macd(self, prices: List[float]) -> Tuple[float, float, float]:
        """Calculate MACD (Moving Average Convergence Divergence)"""
        if len(prices) < 26:
            return 0.0, 0.0, 0.0

        # Simple implementation
        ema12 = sum(prices[-12:]) / 12
        ema26 = sum(prices[-26:]) / 26
        macd_line = ema12 - ema26

        # Signal line (simplified)
        signal_line = macd_line * 0.8

        histogram = macd_line - signal_line

        return macd_line, signal_line, histogram

    def generate_price_history(self, base_price: float, days: int = 30) -> List[float]:
        """Generate mock price history for analysis"""
        prices = [base_price]

        for _ in range(days):
            # Random walk with some trend
            change_percent = random.gauss(0, 0.02)  # 2% daily volatility
            new_price = prices[-1] * (1 + change_percent)
            prices.append(max(new_price, base_price * 0.5))  # Floor at 50% of base

        return prices

    def analyze_technical_indicators(self, asset: str, current_price: float) -> Dict[str, Any]:
        """Analyze technical indicators for given asset"""
        # Generate mock price history
        price_history = self.generate_price_history(current_price)

        # Calculate indicators
        rsi = self.calculate_rsi(price_history)
        macd_line, macd_signal, macd_histogram = self.calculate_macd(price_history)

        # Simple moving averages
        sma_20 = sum(price_history[-20:]) / 20
        sma_50 = sum(price_history[-50:]) if len(price_history) >= 50 else sum(price_history) / len(price_history)

        # Bollinger Bands (simplified)
        sma = sma_20
        std_dev = (sum([(p - sma) ** 2 for p in price_history[-20:]]) / 20) ** 0.5
        bb_upper = sma + (std_dev * 2)
        bb_lower = sma - (std_dev * 2)

        # Generate signals
        signals = []
        signal_strength = 0

        # RSI signals
        if rsi > 70:
            signals.append("RSI overbought (SELL signal)")
            signal_strength -= 20
        elif rsi < 30:
            signals.append("RSI oversold (BUY signal)")
            signal_strength += 20

        # MACD signals
        if macd_line > macd_signal and macd_histogram > 0:
            signals.append("MACD bullish crossover (BUY signal)")
            signal_strength += 15
        elif macd_line < macd_signal and macd_histogram < 0:
            signals.append("MACD bearish crossover (SELL signal)")
            signal_strength -= 15

        # Moving average signals
        if current_price > sma_20 > sma_50:
            signals.append("Price above rising moving averages (BULLISH)")
            signal_strength += 10
        elif current_price < sma_20 < sma_50:
            signals.append("Price below falling moving averages (BEARISH)")
            signal_strength -= 10

        # Bollinger Bands
        if current_price > bb_upper:
            signals.append("Price above Bollinger upper band (potential reversal)")
            signal_strength -= 5
        elif current_price < bb_lower:
            signals.append("Price below Bollinger lower band (potential bounce)")
            signal_strength += 5

        # Overall recommendation
        if signal_strength > 20:
            recommendation = "STRONG BUY"
        elif signal_strength > 5:
            recommendation = "BUY"
        elif signal_strength < -20:
            recommendation = "STRONG SELL"
        elif signal_strength < -5:
            recommendation = "SELL"
        else:
            recommendation = "HOLD"

        return {
            "asset": asset,
            "indicators": {
                "RSI": round(rsi, 2),
                "MACD": {
                    "line": round(macd_line, 4),
                    "signal": round(macd_signal, 4),
                    "histogram": round(macd_histogram, 4)
                },
                "SMA_20": round(sma_20, 2),
                "SMA_50": round(sma_50, 2),
                "Bollinger_Bands": {
                    "upper": round(bb_upper, 2),
                    "middle": round(sma, 2),
                    "lower": round(bb_lower, 2)
                }
            },
            "signals": signals,
            "recommendation": recommendation,
            "signal_strength": signal_strength,
            "confidence": min(abs(signal_strength) * 2, 95)
        }

class RiskCalculatorAgent(Agent):
    """Calculates portfolio risk metrics and position sizing"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.risk_metrics = ["VaR", "Expected_Shortfall", "Sharpe_Ratio", "Max_Drawdown"]

    def calculate_var(self, returns: List[float], confidence_level: float = 0.05) -> float:
        """Calculate Value at Risk (VaR)"""
        if not returns:
            return 0.0

        sorted_returns = sorted(returns)
        index = int(len(sorted_returns) * confidence_level)
        return sorted_returns[index] if index < len(sorted_returns) else sorted_returns[-1]

    def calculate_sharpe_ratio(self, returns: List[float], risk_free_rate: float = 0.02) -> float:
        """Calculate Sharpe ratio"""
        if not returns:
            return 0.0

        excess_returns = [r - risk_free_rate/252 for r in returns]  # Daily risk-free rate
        mean_return = sum(excess_returns) / len(excess_returns)

        if len(excess_returns) < 2:
            return 0.0

        variance = sum([(r - mean_return) ** 2 for r in excess_returns]) / (len(excess_returns) - 1)
        std_dev = variance ** 0.5

        return mean_return / std_dev if std_dev > 0 else 0.0

    def kelly_criterion(self, win_rate: float, avg_win: float, avg_loss: float) -> float:
        """Calculate optimal position size using Kelly Criterion"""
        if avg_loss <= 0:
            return 0.0

        b = avg_win / avg_loss  # Win/loss ratio
        p = win_rate  # Win probability
        q = 1 - p  # Loss probability

        kelly_percent = (b * p - q) / b
        return max(0, min(kelly_percent, 0.25))  # Cap at 25% for safety

    def generate_return_series(self, volatility: float = 0.15, days: int = 252) -> List[float]:
        """Generate mock return series for risk calculations"""
        returns = []
        for _ in range(days):
            # Generate normally distributed returns
            daily_return = random.gauss(0.08/252, volatility/math.sqrt(252))  # 8% annual return
            returns.append(daily_return)
        return returns

    def assess_portfolio_risk(self, positions: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """Assess overall portfolio risk"""
        total_value = sum(pos.get("value", 0) for pos in positions.values())
        if total_value == 0:
            return {"error": "No positions to analyze"}

        # Generate mock data for each position
        risk_metrics = {}
        portfolio_returns = []

        for asset, position in positions.items():
            weight = position.get("value", 0) / total_value
            volatility = position.get("volatility", 0.15)  # Default 15% volatility

            # Generate returns for this asset
            asset_returns = self.generate_return_series(volatility)

            # Weight the returns by position size
            weighted_returns = [r * weight for r in asset_returns]
            portfolio_returns.extend(weighted_returns)

            # Calculate individual asset metrics
            var_95 = self.calculate_var(asset_returns, 0.05)
            sharpe = self.calculate_sharpe_ratio(asset_returns)

            risk_metrics[asset] = {
                "weight": round(weight * 100, 2),
                "VaR_95": round(var_95 * 100, 2),
                "volatility": round(volatility * 100, 2),
                "sharpe_ratio": round(sharpe, 3)
            }

        # Portfolio-level metrics
        portfolio_var = self.calculate_var(portfolio_returns, 0.05)
        portfolio_sharpe = self.calculate_sharpe_ratio(portfolio_returns)

        # Risk assessment
        risk_level = "LOW"
        if abs(portfolio_var) > 0.03:  # 3% daily VaR
            risk_level = "HIGH"
        elif abs(portfolio_var) > 0.015:  # 1.5% daily VaR
            risk_level = "MEDIUM"

        # Position sizing recommendations
        kelly_positions = {}
        for asset in positions.keys():
            # Mock win rate and win/loss ratios for Kelly calculation
            win_rate = random.uniform(0.45, 0.65)
            avg_win = random.uniform(0.02, 0.05)
            avg_loss = random.uniform(0.015, 0.035)

            optimal_size = self.kelly_criterion(win_rate, avg_win, avg_loss)
            kelly_positions[asset] = round(optimal_size * 100, 2)

        return {
            "portfolio_metrics": {
                "total_value": total_value,
                "VaR_95_daily": round(portfolio_var * 100, 2),
                "sharpe_ratio": round(portfolio_sharpe, 3),
                "risk_level": risk_level
            },
            "asset_metrics": risk_metrics,
            "kelly_positions": kelly_positions,
            "recommendations": [
                f"Portfolio VaR: {portfolio_var*100:.2f}% daily",
                f"Risk level: {risk_level}",
                f"Sharpe ratio: {portfolio_sharpe:.3f}",
                "Consider rebalancing if VaR exceeds 2%"
            ]
        }

class CorrelationAgent(Agent):
    """Analyzes market correlations and identifies arbitrage opportunities"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.asset_pairs = [("BTC", "ETH"), ("ETH", "SOL"), ("BTC", "SOL")]
        self.correlation_threshold = 0.7

    def calculate_correlation(self, returns1: List[float], returns2: List[float]) -> float:
        """Calculate Pearson correlation coefficient"""
        if len(returns1) != len(returns2) or len(returns1) < 2:
            return 0.0

        n = len(returns1)
        mean1 = sum(returns1) / n
        mean2 = sum(returns2) / n

        numerator = sum((returns1[i] - mean1) * (returns2[i] - mean2) for i in range(n))

        sum_sq1 = sum((returns1[i] - mean1) ** 2 for i in range(n))
        sum_sq2 = sum((returns2[i] - mean2) ** 2 for i in range(n))

        denominator = (sum_sq1 * sum_sq2) ** 0.5

        return numerator / denominator if denominator > 0 else 0.0

    def generate_correlated_returns(self, base_returns: List[float], correlation: float) -> List[float]:
        """Generate correlated return series"""
        correlated_returns = []

        for base_return in base_returns:
            # Generate correlated return
            random_component = random.gauss(0, 0.01)
            correlated_return = correlation * base_return + (1 - correlation) * random_component
            correlated_returns.append(correlated_return)

        return correlated_returns

    def analyze_correlations(self, market_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze correlations between different assets"""

        # Generate mock return series for each asset
        asset_returns = {}
        base_returns = [random.gauss(0, 0.02) for _ in range(50)]  # 50 days of returns

        correlations = {}

        # Generate returns for each asset with realistic correlations
        for asset in market_data.keys():
            if asset == "BTC":
                asset_returns[asset] = base_returns
            elif asset == "ETH":
                # ETH typically highly correlated with BTC
                asset_returns[asset] = self.generate_correlated_returns(base_returns, 0.8)
            elif asset == "SOL":
                # SOL moderately correlated
                asset_returns[asset] = self.generate_correlated_returns(base_returns, 0.6)
            else:
                # Other assets with varying correlations
                correlation = random.uniform(0.3, 0.7)
                asset_returns[asset] = self.generate_correlated_returns(base_returns, correlation)

        # Calculate pairwise correlations
        assets = list(asset_returns.keys())
        for i, asset1 in enumerate(assets):
            for asset2 in assets[i+1:]:
                corr = self.calculate_correlation(asset_returns[asset1], asset_returns[asset2])
                correlations[f"{asset1}-{asset2}"] = round(corr, 3)

        # Identify trading opportunities
        opportunities = []

        # High correlation breakdown opportunities
        for pair, corr in correlations.items():
            asset1, asset2 = pair.split("-")

            if abs(corr) > 0.7:
                # Check if prices have diverged despite high correlation
                price1 = market_data[asset1]["price"]
                price2 = market_data[asset2]["price"]

                # Simplified divergence check
                if asset1 == "BTC" and asset2 == "ETH":
                    ratio = price1 / price2
                    if ratio > 16:  # BTC/ETH ratio typically 10-15
                        opportunities.append(f"BTC/ETH ratio high ({ratio:.1f}) - consider selling BTC, buying ETH")
                    elif ratio < 12:
                        opportunities.append(f"BTC/ETH ratio low ({ratio:.1f}) - consider buying BTC, selling ETH")

        # Sector rotation opportunities
        sector_analysis = self.analyze_sector_rotation(asset_returns)
        opportunities.extend(sector_analysis)

        return {
            "correlations": correlations,
            "correlation_analysis": self.interpret_correlations(correlations),
            "arbitrage_opportunities": opportunities,
            "market_regime": self.assess_market_regime(correlations),
            "recommendations": self.generate_correlation_recommendations(correlations, opportunities)
        }

    def interpret_correlations(self, correlations: Dict[str, float]) -> List[str]:
        """Interpret correlation values"""
        interpretations = []

        for pair, corr in correlations.items():
            if abs(corr) > 0.8:
                relationship = "very strong" if corr > 0 else "very strong negative"
                interpretations.append(f"{pair}: {relationship} correlation ({corr:.3f})")
            elif abs(corr) > 0.5:
                relationship = "moderate" if corr > 0 else "moderate negative"
                interpretations.append(f"{pair}: {relationship} correlation ({corr:.3f})")
            elif abs(corr) < 0.2:
                interpretations.append(f"{pair}: weak correlation ({corr:.3f}) - independent movement")

        return interpretations

    def analyze_sector_rotation(self, asset_returns: Dict[str, List[float]]) -> List[str]:
        """Analyze sector rotation patterns"""
        opportunities = []

        # Simplified sector analysis
        recent_performance = {}
        for asset, returns in asset_returns.items():
            # Calculate recent 5-day performance
            recent_returns = returns[-5:] if len(returns) >= 5 else returns
            performance = sum(recent_returns)
            recent_performance[asset] = performance

        # Find best and worst performers
        best_performer = max(recent_performance, key=recent_performance.get)
        worst_performer = min(recent_performance, key=recent_performance.get)

        best_perf = recent_performance[best_performer]
        worst_perf = recent_performance[worst_performer]

        if best_perf > 0.05:  # 5% outperformance
            opportunities.append(f"{best_performer} momentum: strong recent performance (+{best_perf*100:.1f}%)")

        if worst_perf < -0.05:  # 5% underperformance
            opportunities.append(f"{worst_performer} potential reversal: oversold (-{abs(worst_perf)*100:.1f}%)")

        return opportunities

    def assess_market_regime(self, correlations: Dict[str, float]) -> str:
        """Assess overall market regime based on correlations"""
        avg_correlation = sum(abs(corr) for corr in correlations.values()) / len(correlations)

        if avg_correlation > 0.7:
            return "HIGH_CORRELATION - Risk-off environment, assets moving together"
        elif avg_correlation > 0.4:
            return "MODERATE_CORRELATION - Normal market conditions"
        else:
            return "LOW_CORRELATION - Risk-on environment, asset-specific drivers"

    def generate_correlation_recommendations(self, correlations: Dict[str, float], opportunities: List[str]) -> List[str]:
        """Generate trading recommendations based on correlation analysis"""
        recommendations = []

        # Diversification recommendations
        high_corr_pairs = [pair for pair, corr in correlations.items() if abs(corr) > 0.8]
        if high_corr_pairs:
            recommendations.append(f"High correlation in {len(high_corr_pairs)} pairs - consider diversification")

        # Arbitrage recommendations
        if opportunities:
            recommendations.append(f"Found {len(opportunities)} potential arbitrage opportunities")
            recommendations.extend(opportunities[:3])  # Top 3 opportunities

        # Risk management
        avg_corr = sum(abs(corr) for corr in correlations.values()) / len(correlations)
        if avg_corr > 0.7:
            recommendations.append("High overall correlation - reduce position sizes during market stress")

        return recommendations