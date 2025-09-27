"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Activity } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface CoinDetailsCardProps {
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

export function CoinDetailsCard({
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
}: CoinDetailsCardProps) {
  const isPositive = change24h >= 0;

  // Generate mock sparkline data if not provided
  const chartData = sparklineData.length > 0 ? sparklineData :
    Array.from({ length: 24 }, (_, i) => ({
      value: price + (Math.random() - 0.5) * price * 0.05
    }));

  return (
    <Card className="relative overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: color }}
            >
              {symbol.substring(0, 2)}
            </div>
            <div>
              <CardTitle className="text-lg">{symbol}</CardTitle>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
          </div>
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change24h).toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Price */}
        <div className="text-center">
          <div className="text-3xl font-bold font-mono">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm flex items-center justify-center gap-1 ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {isPositive ? '+' : ''}${(price * change24h / 100).toFixed(2)} today
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-16 w-full">
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

        {/* 24h High/Low */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-muted/30 rounded">
            <div className="text-xs text-muted-foreground">24h High</div>
            <div className="font-semibold">${high24h.toLocaleString()}</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded">
            <div className="text-xs text-muted-foreground">24h Low</div>
            <div className="font-semibold">${low24h.toLocaleString()}</div>
          </div>
        </div>

        {/* Volume & Market Cap */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              Volume (24h)
            </div>
            <div className="font-semibold">{volume}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              Market Cap
            </div>
            <div className="font-semibold">{marketCap}</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Dominance</div>
            <div className="font-semibold">
              {symbol === 'BTC' ? '55.2%' :
               symbol === 'ETH' ? '18.1%' :
               symbol === 'SOL' ? '2.1%' : '1.8%'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Rank</div>
            <div className="font-semibold">
              #{symbol === 'BTC' ? '1' :
                 symbol === 'ETH' ? '2' :
                 symbol === 'SOL' ? '5' : '4'}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${color}22 0%, transparent 50%)`
        }}
      />
    </Card>
  );
}