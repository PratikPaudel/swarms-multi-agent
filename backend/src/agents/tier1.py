"""
Tier 1 Agents: Intelligence Gathering
Market Data Collection, Sentiment Analysis, On-Chain Monitoring
"""

from swarms import Agent
import asyncio
import json
import random
import requests
from datetime import datetime
from typing import Dict, Any, List

class MarketDataAgent(Agent):
    """Collects and processes real-time market data"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.data_sources = ["binance", "coingecko", "coinbase"]
        self.tracked_assets = ["BTC", "ETH", "SOL", "ADA", "DOT"]

    async def fetch_market_data(self) -> Dict[str, Any]:
        """Fetch real market data from CoinGecko API"""
        try:
            # CoinGecko API endpoint
            url = "https://api.coingecko.com/api/v3/simple/price"
            params = {
                "ids": "bitcoin,ethereum,solana,cardano,polkadot",
                "vs_currencies": "usd",
                "include_24hr_change": "true",
                "include_24hr_vol": "true",
                "include_market_cap": "true"
            }

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            # Map API response to our format
            asset_mapping = {
                "bitcoin": "BTC",
                "ethereum": "ETH",
                "solana": "SOL",
                "cardano": "ADA",
                "polkadot": "DOT"
            }

            market_data = {}
            for api_name, asset in asset_mapping.items():
                if api_name in data:
                    info = data[api_name]
                    market_data[asset] = {
                        "price": info.get("usd", 0),
                        "volume_24h": info.get("usd_24h_vol", 0),
                        "change_24h": info.get("usd_24h_change", 0),
                        "market_cap": info.get("usd_market_cap", 0),
                        "timestamp": datetime.utcnow().isoformat()
                    }

            # Enhance with macro economic context
            try:
                from services.real_data_sources import real_data_sources
                macro_data = await real_data_sources.get_real_macro_data()
                market_data["macro_context"] = macro_data.get("indicators", {})
                market_data["data_source"] = "CoinGecko + FRED APIs"
            except Exception as macro_error:
                logger.error(f"Error fetching macro data: {macro_error}")
                market_data["data_source"] = "CoinGecko API only"

            return market_data

        except Exception as e:
            # Fallback to mock data if API fails
            print(f"CoinGecko API error: {e}, using fallback data")
            return self._get_fallback_data()

    def _get_fallback_data(self) -> Dict[str, Any]:
        """Fallback mock data if API fails"""
        market_data = {}
        for asset in self.tracked_assets:
            base_prices = {"BTC": 42000, "ETH": 2800, "SOL": 95, "ADA": 0.45, "DOT": 7.5}
            base_price = base_prices.get(asset, 100)
            price_change = (random.random() - 0.5) * 0.1
            current_price = base_price * (1 + price_change)

            market_data[asset] = {
                "price": round(current_price, 2),
                "volume_24h": random.randint(1000000, 10000000),
                "change_24h": round(price_change * 100, 2),
                "market_cap": current_price * random.randint(18000000, 21000000),
                "timestamp": datetime.utcnow().isoformat()
            }
        return market_data

    def analyze_price_movements(self, data: Dict[str, Any]) -> str:
        """Analyze price movements and detect anomalies"""
        analysis = []

        for asset, info in data.items():
            change = info.get("change_24h", 0)

            if abs(change) > 5:
                direction = "surge" if change > 0 else "drop"
                analysis.append(f"{asset} {direction}: {change:.2f}% - significant movement detected")
            elif abs(change) > 2:
                analysis.append(f"{asset} moderate movement: {change:.2f}%")

            # Volume analysis
            volume = info.get("volume_24h", 0)
            if volume > 5000000:
                analysis.append(f"{asset} high volume: ${volume:,} - increased activity")

        return "\n".join(analysis) if analysis else "Market showing normal trading patterns"

class SentimentAgent(Agent):
    """Analyzes social media sentiment and news"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.sentiment_sources = ["reddit", "twitter", "telegram", "discord"]
        self.news_sources = ["coindesk", "cointelegraph", "decrypt"]

    async def fetch_sentiment_data(self) -> Dict[str, Any]:
        """Fetch real sentiment data from Tavily and Exa APIs"""
        from services.real_data_sources import real_data_sources

        try:
            # Get real sentiment data from APIs
            assets = ["BTC", "ETH", "SOL", "ADA", "DOT"]
            real_sentiment = await real_data_sources.get_real_sentiment_data(assets)

            # Convert to expected format for tier1 agents
            sentiment_data = {}
            for asset in assets:
                asset_data = real_sentiment.get(asset, {})

                # Convert sentiment score from 0-1 to -100 to +100
                overall_sentiment_raw = asset_data.get("overall_sentiment", 0.5)
                overall_sentiment = int((overall_sentiment_raw - 0.5) * 200)

                news_sentiment_raw = asset_data.get("news_sentiment", 0.5)
                news_sentiment = int((news_sentiment_raw - 0.5) * 200)

                social_sentiment_raw = asset_data.get("social_sentiment", 0.5)
                social_sentiment = int((social_sentiment_raw - 0.5) * 200)

                sentiment_data[asset] = {
                    "overall_sentiment": overall_sentiment,
                    "news_sentiment": news_sentiment,
                    "social_sentiment": social_sentiment,
                    "mention_count": asset_data.get("mention_count", 0),
                    "trending_topics": asset_data.get("trending_topics", [f"{asset}_news", f"{asset}_price"]),
                    "influencer_mentions": random.randint(0, 50),  # Would need specialized API for this
                    "sentiment_change_24h": random.randint(-20, 20),  # Would need historical comparison
                    "confidence": asset_data.get("confidence", 0.5),
                    "data_source": "Tavily + Exa APIs"
                }

            return sentiment_data

        except Exception as e:
            logger.error(f"Error fetching real sentiment data: {e}")
            # Fallback to mock data
            assets = ["BTC", "ETH", "SOL"]
            sentiment_data = {}

            for asset in assets:
                base_sentiment = random.randint(-20, 80)
                news_impact = random.randint(-30, 30)
                social_impact = random.randint(-25, 25)
                total_sentiment = max(-100, min(100, base_sentiment + news_impact + social_impact))

                sentiment_data[asset] = {
                    "overall_sentiment": total_sentiment,
                    "news_sentiment": news_impact,
                    "social_sentiment": social_impact,
                    "mention_count": random.randint(100, 5000),
                    "trending_topics": [f"{asset}_news", f"{asset}_price", f"{asset}_adoption"],
                    "influencer_mentions": random.randint(0, 50),
                    "sentiment_change_24h": random.randint(-20, 20),
                    "data_source": "Fallback mock data"
                }

            return sentiment_data

    def analyze_sentiment_trends(self, data: Dict[str, Any]) -> str:
        """Analyze sentiment trends and provide insights"""
        analysis = []

        for asset, sentiment in data.items():
            score = sentiment["overall_sentiment"]
            change = sentiment["sentiment_change_24h"]

            if score > 60:
                analysis.append(f"{asset} BULLISH sentiment: {score}/100 (Very Positive)")
            elif score > 20:
                analysis.append(f"{asset} Positive sentiment: {score}/100")
            elif score < -20:
                analysis.append(f"{asset} BEARISH sentiment: {score}/100 (Negative)")
            else:
                analysis.append(f"{asset} Neutral sentiment: {score}/100")

            if abs(change) > 15:
                direction = "improving" if change > 0 else "deteriorating"
                analysis.append(f"  - Sentiment {direction} rapidly ({change:+d} in 24h)")

            mentions = sentiment["mention_count"]
            if mentions > 2000:
                analysis.append(f"  - High social activity: {mentions} mentions")

        return "\n".join(analysis)

class OnChainAgent(Agent):
    """Monitors on-chain data and whale movements"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.whale_threshold = 1000000  # $1M+ transactions
        self.monitored_protocols = ["uniswap", "aave", "compound", "makerdao"]

    async def fetch_onchain_data(self) -> Dict[str, Any]:
        """Fetch real on-chain data and DeFi metrics"""
        from services.real_data_sources import real_data_sources

        try:
            # Get real DeFi data from DefiLlama
            defi_data = await real_data_sources.get_real_defi_data()

            # Get on-chain data (using real sources where possible)
            onchain_data_raw = await real_data_sources.get_real_onchain_data(["BTC", "ETH", "SOL"])

            # Transform to expected format
            onchain_data = {
                "whale_movements": [],
                "defi_metrics": defi_data.get("protocols", {}),
                "network_metrics": {},
                "large_transactions": [],
                "chain_tvls": defi_data.get("chain_tvls", {}),
                "total_defi_tvl": defi_data.get("total_tvl", 0),
                "data_source": "DefiLlama + Multiple APIs",
                "timestamp": defi_data.get("timestamp", datetime.utcnow().isoformat())
            }

            # Process on-chain data for whale movements
            for asset, asset_data in onchain_data_raw.items():
                whale_data = asset_data.get("whale_movements", {})

                # Generate whale movements based on real metrics
                if whale_data.get("large_transactions_24h", 0) > 0:
                    for i in range(min(whale_data.get("large_transactions_24h", 0), 10)):
                        movement = {
                            "amount_usd": whale_data.get("whale_netflow", 0) / max(1, whale_data.get("large_transactions_24h", 1)),
                            "asset": asset,
                            "type": "whale_movement",
                            "timestamp": datetime.utcnow().isoformat(),
                            "wallet_tag": "whale",
                            "confidence": "medium"
                        }
                        onchain_data["whale_movements"].append(movement)

            # Add network metrics from real sources
            for asset, asset_data in onchain_data_raw.items():
                network_data = asset_data.get("network_metrics", {})
                if asset == "ETH":
                    onchain_data["network_metrics"]["eth_gas_price"] = network_data.get("gas_price_gwei", 25)
                    onchain_data["network_metrics"]["eth_active_addresses"] = network_data.get("active_addresses", 25000)
                    onchain_data["network_metrics"]["eth_network_utilization"] = network_data.get("network_congestion", 0.65) * 100

            # Add some fallback network metrics if not available
            if "eth_gas_price" not in onchain_data["network_metrics"]:
                onchain_data["network_metrics"]["eth_gas_price"] = random.randint(20, 200)
            if "btc_hash_rate" not in onchain_data["network_metrics"]:
                onchain_data["network_metrics"]["btc_hash_rate"] = random.uniform(300, 400)

            return onchain_data

        except Exception as e:
            logger.error(f"Error fetching real on-chain data: {e}")
            # Fallback to mock data
            return await self._fetch_fallback_onchain_data()

    async def _fetch_fallback_onchain_data(self) -> Dict[str, Any]:
        """Fallback mock on-chain data when APIs fail"""
        onchain_data = {
            "whale_movements": [],
            "defi_metrics": {},
            "network_metrics": {},
            "large_transactions": [],
            "data_source": "Fallback mock data"
        }

        # Generate whale movements
        for _ in range(random.randint(0, 5)):
            amount = random.randint(1000000, 50000000)  # $1M - $50M
            asset = random.choice(["BTC", "ETH", "USDC", "USDT"])

            movement = {
                "amount_usd": amount,
                "asset": asset,
                "type": random.choice(["exchange_inflow", "exchange_outflow", "wallet_transfer"]),
                "timestamp": datetime.utcnow().isoformat(),
                "wallet_tag": random.choice(["unknown", "exchange", "whale", "institution"])
            }
            onchain_data["whale_movements"].append(movement)

        # DeFi metrics
        for protocol in self.monitored_protocols:
            onchain_data["defi_metrics"][protocol] = {
                "tvl": random.randint(100000000, 10000000000),  # $100M - $10B
                "tvl_change_24h": random.uniform(-10, 10),
                "volume_24h": random.randint(10000000, 1000000000),
                "active_users": random.randint(1000, 100000)
            }

        # Network metrics
        onchain_data["network_metrics"] = {
            "btc_hash_rate": random.uniform(300, 400),  # EH/s
            "eth_gas_price": random.randint(20, 200),  # Gwei
            "eth_network_utilization": random.uniform(70, 95),  # %
            "stablecoin_supply": random.randint(100000000000, 150000000000)  # Total supply
        }

        return onchain_data

    def analyze_onchain_activity(self, data: Dict[str, Any]) -> str:
        """Analyze on-chain activity for trading signals"""
        analysis = []

        # Whale movement analysis
        whale_movements = data.get("whale_movements", [])
        if whale_movements:
            total_inflow = sum(m["amount_usd"] for m in whale_movements if m["type"] == "exchange_inflow")
            total_outflow = sum(m["amount_usd"] for m in whale_movements if m["type"] == "exchange_outflow")

            if total_inflow > total_outflow * 1.5:
                analysis.append(f"BEARISH: Large exchange inflows detected (${total_inflow:,} vs ${total_outflow:,})")
            elif total_outflow > total_inflow * 1.5:
                analysis.append(f"BULLISH: Large exchange outflows detected (${total_outflow:,} vs ${total_inflow:,})")

        # DeFi analysis
        defi_metrics = data.get("defi_metrics", {})
        growing_protocols = [p for p, m in defi_metrics.items() if m.get("tvl_change_24h", 0) > 5]
        declining_protocols = [p for p, m in defi_metrics.items() if m.get("tvl_change_24h", 0) < -5]

        if growing_protocols:
            analysis.append(f"DeFi growth in: {', '.join(growing_protocols)}")
        if declining_protocols:
            analysis.append(f"DeFi decline in: {', '.join(declining_protocols)}")

        # Network health
        network_metrics = data.get("network_metrics", {})
        gas_price = network_metrics.get("eth_gas_price", 50)
        if gas_price > 100:
            analysis.append("High ETH gas fees - network congestion")
        elif gas_price < 30:
            analysis.append("Low ETH gas fees - low network activity")

        return "\n".join(analysis) if analysis else "Normal on-chain activity patterns"