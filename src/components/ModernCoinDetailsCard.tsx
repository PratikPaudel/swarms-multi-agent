"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface ModernCoinDetailsCardProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  high24h: number;
  low24h: number;
  sparklineData?: Array<{ value: number }>;
  color: string;
}

export function ModernCoinDetailsCard({
  symbol,
  name,
  price,
  change24h,
  volume,
  marketCap,
  high24h,
  low24h,
  sparklineData = [],
  color
}: ModernCoinDetailsCardProps) {
  const isPositive = change24h >= 0;

  // Generate mock sparkline data if not provided
  const chartData = sparklineData.length > 0 ? sparklineData :
    Array.from({ length: 24 }, (_, i) => ({
      value: price + (Math.random() - 0.5) * price * 0.05
    }));

  return (
    <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl overflow-hidden hover:bg-[#1f1f1f] transition-all duration-200 hover:border-[#3a3a3a]">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: color }}
            >
              {symbol.substring(0, 2)}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{symbol}</div>
              <div className="text-[#a0a0a0] text-xs">{name}</div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`border-0 text-xs font-medium px-2 py-1 ${isPositive
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
              }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(change24h).toFixed(2)}%
          </Badge>
        </div>

        {/* Current Price */}
        <div className="mb-4">
          <div className="text-white text-2xl font-bold font-mono leading-tight">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
            {isPositive ? '+' : ''}${(price * change24h / 100).toFixed(2)} today
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-12 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#111111] rounded-lg p-3">
              <div className="text-[#a0a0a0] text-xs mb-1">24h High</div>
              <div className="text-white font-semibold text-sm">${high24h.toLocaleString()}</div>
            </div>
            <div className="bg-[#111111] rounded-lg p-3">
              <div className="text-[#a0a0a0] text-xs mb-1">24h Low</div>
              <div className="text-white font-semibold text-sm">${low24h.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#a0a0a0] text-xs">Volume (24h)</span>
              <span className="text-white font-medium text-sm">{volume}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#a0a0a0] text-xs">Market Cap</span>
              <span className="text-white font-medium text-sm">{marketCap}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#2a2a2a]">
            <div className="text-center">
              <div className="text-[#a0a0a0] text-xs">Rank</div>
              <div className="text-white font-semibold text-sm">
                #{symbol === 'BTC' ? '1' :
                  symbol === 'ETH' ? '2' :
                    symbol === 'SOL' ? '5' : '4'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#a0a0a0] text-xs">Dominance</div>
              <div className="text-white font-semibold text-sm">
                {symbol === 'BTC' ? '55.2%' :
                  symbol === 'ETH' ? '18.1%' :
                    symbol === 'SOL' ? '2.1%' : '1.8%'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}