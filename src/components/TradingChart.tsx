"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

// Mock trading data - using fixed initial data to prevent hydration mismatch
const getInitialMockData = () => {
  const data = [];
  let btcPrice = 42000;
  let ethPrice = 2800;
  let solPrice = 95;

  for (let i = 0; i < 24; i++) {
    // Use deterministic values for initial load to prevent hydration mismatch
    const btcChange = Math.sin(i * 0.3) * 500;
    const ethChange = Math.sin(i * 0.4) * 50;
    const solChange = Math.sin(i * 0.5) * 3;

    btcPrice += btcChange;
    ethPrice += ethChange;
    solPrice += solChange;

    data.push({
      time: `${i}:00`,
      BTC: Math.round(btcPrice),
      ETH: Math.round(ethPrice),
      SOL: Math.round(solPrice * 100) / 100,
    });
  }
  return data;
};

export function TradingChart() {
  const [data, setData] = useState(getInitialMockData());
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only start real-time updates after component is mounted on client
    if (!mounted) return;

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        const lastPoint = newData[newData.length - 1];

        // Add new data point
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          BTC: lastPoint.BTC + (Math.random() - 0.5) * 500,
          ETH: lastPoint.ETH + (Math.random() - 0.5) * 50,
          SOL: Math.round((lastPoint.SOL + (Math.random() - 0.5) * 3) * 100) / 100,
        };

        // Keep only last 24 points
        if (newData.length >= 24) {
          newData.shift();
        }
        newData.push(newPoint);

        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [mounted]);

  const currentPrice = data[data.length - 1];
  const previousPrice = data[data.length - 2];
  const priceChange = currentPrice && previousPrice ?
    ((Number(currentPrice[selectedAsset as keyof typeof currentPrice]) - Number(previousPrice[selectedAsset as keyof typeof previousPrice])) / Number(previousPrice[selectedAsset as keyof typeof previousPrice]) * 100).toFixed(2) : "0.00";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Real-time Trading Chart</CardTitle>
          <div className="flex gap-2">
            {["BTC", "ETH", "SOL"].map((asset) => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedAsset === asset
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>
        {currentPrice && (
          <div className="flex items-center gap-4 text-sm">
            <span className="font-mono text-lg">
              ${Number(currentPrice[selectedAsset as keyof typeof currentPrice]).toLocaleString()}
            </span>
            <span className={`flex items-center gap-1 ${
              parseFloat(priceChange) >= 0 ? "text-green-500" : "text-red-500"
            }`}>
              {parseFloat(priceChange) >= 0 ? "↗" : "↘"}
              {Math.abs(parseFloat(priceChange))}%
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                domain={['dataMin - 500', 'dataMax + 500']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedAsset}
                stroke={selectedAsset === "BTC" ? "#F59E0B" : selectedAsset === "ETH" ? "#3B82F6" : "#8B5CF6"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#F59E0B" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}