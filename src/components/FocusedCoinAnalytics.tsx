"use client";

import { CoinDetailsCard } from "@/components/CoinDetailsCard";
import { useState, useEffect } from "react";

interface FocusedCoinAnalyticsProps {
  // We'll fetch real data later, for now use mock data structure
}

export function FocusedCoinAnalytics({}: FocusedCoinAnalyticsProps) {
  const [marketData, setMarketData] = useState([
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 109665.78,
      change24h: 2.15,
      volume: "$28.5B",
      marketCap: "$2.17T",
      high24h: 111250.00,
      low24h: 107890.00,
      color: "#F7931A"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 4028.42,
      change24h: -1.23,
      volume: "$12.8B",
      marketCap: "$484B",
      high24h: 4150.00,
      low24h: 3985.00,
      color: "#627EEA"
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 204.15,
      change24h: 3.45,
      volume: "$2.1B",
      marketCap: "$97B",
      high24h: 209.80,
      low24h: 198.20,
      color: "#9945FF"
    },
    {
      symbol: "BNB",
      name: "BNB",
      price: 976.23,
      change24h: 0.87,
      volume: "$1.9B",
      marketCap: "$141B",
      high24h: 985.40,
      low24h: 965.10,
      color: "#F3BA2F"
    }
  ]);

  // Fetch real market data from backend
  const fetchMarketData = async () => {
    try {
      const response = await fetch('http://localhost:8000/market/current');
      if (response.ok) {
        const data = await response.json();
        // Update with real prices if available
        if (data.prices) {
          setMarketData(prevData =>
            prevData.map(coin => ({
              ...coin,
              price: data.prices[coin.symbol] || coin.price
            }))
          );
        }
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    }
  };

  useEffect(() => {
    fetchMarketData();
    // Update market data every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Cryptocurrency Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive information about all supported cryptocurrencies
        </p>
      </div>

      {/* 2x2 Grid of Coin Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketData.map((coin) => (
          <CoinDetailsCard
            key={coin.symbol}
            symbol={coin.symbol}
            name={coin.name}
            price={coin.price}
            change24h={coin.change24h}
            volume={coin.volume}
            marketCap={coin.marketCap}
            high24h={coin.high24h}
            low24h={coin.low24h}
            color={coin.color}
          />
        ))}
      </div>

      {/* Market Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-green-500">
            {marketData.filter(c => c.change24h > 0).length}
          </div>
          <div className="text-sm text-muted-foreground">Gainers</div>
        </div>

        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-red-500">
            {marketData.filter(c => c.change24h < 0).length}
          </div>
          <div className="text-sm text-muted-foreground">Losers</div>
        </div>

        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold text-blue-500">
            ${(marketData.reduce((sum, coin) => {
              const marketCapNum = parseFloat(coin.marketCap.replace(/[$BTM]/g, ''));
              const multiplier = coin.marketCap.includes('T') ? 1000 : 1;
              return sum + (marketCapNum * multiplier);
            }, 0)).toFixed(1)}B
          </div>
          <div className="text-sm text-muted-foreground">Total Market Cap</div>
        </div>

        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-lg font-bold">
            {(marketData.reduce((sum, coin) => sum + coin.change24h, 0) / marketData.length).toFixed(2)}%
          </div>
          <div className="text-sm text-muted-foreground">Avg Change</div>
        </div>
      </div>
    </div>
  );
}