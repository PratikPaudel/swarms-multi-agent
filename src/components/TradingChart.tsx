"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

// Initial empty data while loading real data
const getInitialData = () => {
  return [{
    time: "Loading...",
    BTC: 0,
    ETH: 0,
    SOL: 0,
  }];
};

export function TradingChart() {
  const [data, setData] = useState(getInitialData());
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real historical data from backend
  const fetchHistoricalData = async (symbol: string) => {
    try {
      const response = await fetch(`http://localhost:8000/market/historical?symbol=${symbol}&period=1d`);
      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          // Store data for this specific symbol
          return { symbol, data: result.data };
        }
      }
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
    }
    return null;
  };

  // Fetch data for all assets on mount
  useEffect(() => {
    if (!mounted) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const results = await Promise.all([
          fetchHistoricalData('BTC'),
          fetchHistoricalData('ETH'),
          fetchHistoricalData('SOL')
        ]);

        // Merge all data into combined chart data
        const btcData = results.find(r => r?.symbol === 'BTC')?.data || [];
        const ethData = results.find(r => r?.symbol === 'ETH')?.data || [];
        const solData = results.find(r => r?.symbol === 'SOL')?.data || [];

        if (btcData.length > 0) {
          const combinedData = btcData.map((btcPoint: any, index: number) => ({
            time: btcPoint.time,
            BTC: btcPoint.BTC || 0,
            ETH: ethData[index]?.ETH || 0,
            SOL: solData[index]?.SOL || 0,
          }));
          setData(combinedData);
        }
      } catch (error) {
        console.error('Error fetching all historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [mounted]);

  // Fetch current market data and update chart
  const fetchCurrentMarketData = async () => {
    try {
      const response = await fetch('http://localhost:8000/agents/status');
      if (response.ok) {
        // Update with any real-time market data if available
        // This would typically come from a market data agent
        console.log('Market data updated from backend');
      }
    } catch (error) {
      console.error('Error fetching current market data:', error);
    }
  };

  useEffect(() => {
    // Only start real-time updates after component is mounted and data is loaded
    if (!mounted || loading) return;

    // Fetch current market data periodically
    const interval = setInterval(() => {
      fetchCurrentMarketData();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [mounted, loading]);

  const currentPrice = data[data.length - 1];
  const previousPrice = data[data.length - 2];
  const priceChange = currentPrice && previousPrice ?
    ((Number(currentPrice[selectedAsset as keyof typeof currentPrice]) - Number(previousPrice[selectedAsset as keyof typeof previousPrice])) / Number(previousPrice[selectedAsset as keyof typeof previousPrice]) * 100).toFixed(2) : "0.00";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Real-time Trading Chart {loading && "(Loading...)"}</CardTitle>
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