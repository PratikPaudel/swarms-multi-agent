#!/usr/bin/env python3
"""
Test script to verify real data integration
"""

import asyncio
import sys
import os

# Add the src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from services.real_data_sources import real_data_sources

async def test_real_data_sources():
    """Test all real data sources"""
    print("🧪 Testing Real Data Sources Integration")
    print("=" * 50)

    # Test sentiment data
    print("\n📊 Testing Sentiment Data (Tavily + Exa APIs)...")
    try:
        sentiment_data = await real_data_sources.get_real_sentiment_data(["BTC", "ETH", "SOL"])
        print(f"✅ Sentiment data retrieved for {len(sentiment_data)} assets")
        for asset, data in sentiment_data.items():
            sentiment_score = data.get("overall_sentiment", 0.5)
            confidence = data.get("confidence", 0)
            source = data.get("data_source", "unknown")
            print(f"   {asset}: sentiment={sentiment_score:.2f}, confidence={confidence:.2f}, source={source}")
    except Exception as e:
        print(f"❌ Sentiment data failed: {e}")

    # Test DeFi data
    print("\n🏦 Testing DeFi Data (DefiLlama API)...")
    try:
        defi_data = await real_data_sources.get_real_defi_data()
        protocols = defi_data.get("protocols", {})
        total_tvl = defi_data.get("total_tvl", 0)
        print(f"✅ DeFi data retrieved: {len(protocols)} protocols, ${total_tvl:,.0f} total TVL")
        for name, data in list(protocols.items())[:3]:  # Show first 3
            tvl = data.get("tvl", 0)
            change = data.get("tvl_change_24h", 0)
            print(f"   {name}: ${tvl:,.0f} TVL, {change:+.1f}% 24h change")
    except Exception as e:
        print(f"❌ DeFi data failed: {e}")

    # Test on-chain data
    print("\n🔗 Testing On-Chain Data...")
    try:
        onchain_data = await real_data_sources.get_real_onchain_data(["BTC", "ETH"])
        print(f"✅ On-chain data retrieved for {len(onchain_data)} assets")
        for asset, data in onchain_data.items():
            whale_txs = data.get("whale_movements", {}).get("large_transactions_24h", 0)
            network_data = data.get("network_metrics", {})
            active_addresses = network_data.get("active_addresses", 0)
            print(f"   {asset}: {whale_txs} large transactions, {active_addresses:,} active addresses")
    except Exception as e:
        print(f"❌ On-chain data failed: {e}")

    # Test historical data
    print("\n📈 Testing Historical Price Data (Yahoo Finance)...")
    try:
        hist_data = real_data_sources.get_real_historical_data("BTC", "1mo")
        if not hist_data.empty:
            latest_price = hist_data['Close'].iloc[-1]
            price_change = ((hist_data['Close'].iloc[-1] / hist_data['Close'].iloc[0]) - 1) * 100
            print(f"✅ Historical data retrieved: {len(hist_data)} data points")
            print(f"   BTC: ${latest_price:,.2f} current, {price_change:+.1f}% monthly change")
        else:
            print("❌ No historical data returned")
    except Exception as e:
        print(f"❌ Historical data failed: {e}")

    # Test portfolio data
    print("\n💼 Testing Portfolio Data...")
    try:
        portfolio_data = await real_data_sources.get_real_portfolio_data()
        portfolio = portfolio_data.get("portfolio", {})
        total_value = portfolio_data.get("total_value", 0)
        pnl_24h = portfolio_data.get("pnl_24h", 0)
        print(f"✅ Portfolio data retrieved: ${total_value:,.0f} total value")
        print(f"   24h P&L: ${pnl_24h:,.2f} ({(pnl_24h/total_value)*100:+.2f}%)")
        for asset, data in portfolio.items():
            weight = data.get("weight", 0)
            value = data.get("value", 0)
            print(f"   {asset}: {weight:.1%} weight, ${value:,.0f} value")
    except Exception as e:
        print(f"❌ Portfolio data failed: {e}")

    # Test execution data
    print("\n⚡ Testing Execution Data...")
    try:
        execution_data = await real_data_sources.get_real_execution_data()
        market_conditions = execution_data.get("market_conditions", {})
        trading_costs = execution_data.get("trading_costs", {})
        volatility = market_conditions.get("volatility", "unknown")
        liquidity = market_conditions.get("liquidity", "unknown")
        commission = trading_costs.get("commission", 0)
        print(f"✅ Execution data retrieved")
        print(f"   Market: {volatility} volatility, {liquidity} liquidity")
        print(f"   Trading cost: {commission:.3%} commission")
    except Exception as e:
        print(f"❌ Execution data failed: {e}")

    # Test macro data
    print("\n🌍 Testing Macro Economic Data (FRED API)...")
    try:
        macro_data = await real_data_sources.get_real_macro_data()
        indicators = macro_data.get("indicators", {})
        print(f"✅ Macro data retrieved: {len(indicators)} indicators")
        for name, data in indicators.items():
            value = data.get("value", 0)
            date = data.get("date", "unknown")[:10]  # Just date part
            print(f"   {name}: {value:.2f} (as of {date})")
    except Exception as e:
        print(f"❌ Macro data failed: {e}")

    print("\n🎉 Real Data Integration Test Complete!")
    print("=" * 50)

if __name__ == "__main__":
    asyncio.run(test_real_data_sources())