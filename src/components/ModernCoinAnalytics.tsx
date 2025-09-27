"use client";

import { ModernCoinDetailsCard } from "@/components/ModernCoinDetailsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ModernCoinAnalyticsProps {
  // We'll fetch real data later, for now use mock data structure
}

export function ModernCoinAnalytics({ }: ModernCoinAnalyticsProps) {
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

  // Calculate summary metrics
  const totalMarketCap = marketData.reduce((sum, coin) => {
    const marketCapNum = parseFloat(coin.marketCap.replace(/[$BTM]/g, ''));
    const multiplier = coin.marketCap.includes('T') ? 1000 : 1;
    return sum + (marketCapNum * multiplier);
  }, 0);

  const gainers = marketData.filter(c => c.change24h > 0).length;
  const losers = marketData.filter(c => c.change24h < 0).length;
  const avgChange = marketData.reduce((sum, coin) => sum + coin.change24h, 0) / marketData.length;
  const totalVolume = marketData.reduce((sum, coin) => {
    const volumeNum = parseFloat(coin.volume.replace(/[$B]/g, ''));
    return sum + volumeNum;
  }, 0);

  // Fetch real market data from backend
  const fetchMarketData = async () => {
    try {
      const response = await fetch('http://localhost:8000/market/current');
      if (response.ok) {
        const data = await response.json();
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
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Cryptocurrency Analytics</h1>
        <p className="text-[#a0a0a0] text-lg">
          Comprehensive information about all supported cryptocurrencies
        </p>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl hover:bg-[#1f1f1f] transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">Total Market Cap</p>
                <p className="text-white text-2xl font-bold">${totalMarketCap.toFixed(1)}B</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl hover:bg-[#1f1f1f] transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">24h Volume</p>
                <p className="text-white text-2xl font-bold">${totalVolume.toFixed(1)}B</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl hover:bg-[#1f1f1f] transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">Gainers</p>
                <p className="text-white text-2xl font-bold">{gainers}<span className="text-lg text-[#a0a0a0]">/{marketData.length}</span></p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl hover:bg-[#1f1f1f] transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">Avg Change</p>
                <p className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                  {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                </p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${avgChange >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                {avgChange >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cryptocurrency Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {marketData.map((coin) => (
          <ModernCoinDetailsCard
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
    </div>
  );
}