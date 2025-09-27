"use client";

import NodeGraph from "@/components/NodeGraph";
import { TradingChart } from "@/components/TradingChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingDown, TrendingUp, Vote, Zap } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  tier: number;
  status: string;
  confidence: number;
  lastAction: string;
  icon: any;
}

interface ImprovedCoinAnalyticsProps {
  agents: Agent[];
  votingResults: any;
  onTriggerVoting: () => void;
  isVoting: boolean;
  onTriggerAnalysis: () => void;
  connectionStatus: string;
}

export function ImprovedCoinAnalytics({
  agents,
  votingResults,
  onTriggerVoting,
  isVoting,
  onTriggerAnalysis,
  connectionStatus
}: ImprovedCoinAnalyticsProps) {
  // Mock real-time market data - in real app this would come from props
  const marketData = {
    BTC: { price: 109665.781, change: 20, volume: "28.5B" },
    ETH: { price: 4028.42, change: -1.2, volume: "12.8B" },
    SOL: { price: 204.15, change: 3.4, volume: "2.1B" },
    BNB: { price: 976.23, change: 0.8, volume: "1.9B" }
  };

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const avgConfidence = Math.round(agents.reduce((sum, a) => sum + a.confidence, 0) / agents.length);

  return (
    <div className="space-y-6">
      {/* Top Section: Market Overview */}
      <Card className="col-span-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Market Overview</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {activeAgents}/9 Agents Active
              </Badge>
              <Badge variant="outline">
                {avgConfidence}% Avg Confidence
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart takes 2/3 width */}
            <div className="lg:col-span-2">
              <TradingChart />
            </div>

            {/* Live Market Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Live Prices</h3>
              {Object.entries(marketData).map(([symbol, data]) => (
                <div key={symbol} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{symbol}</div>
                    <div className="text-sm text-muted-foreground">Vol: {data.volume}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold">
                      ${data.price.toLocaleString()}
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${data.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                      {data.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(data.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Agent Network */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Agent Network & Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <NodeGraph
              agents={agents}
              votingResults={votingResults}
              onTriggerVoting={onTriggerVoting}
              isVoting={isVoting}
            />
          </CardContent>
        </Card>

        {/* Right: Controls & Quick Actions */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Control Center</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onTriggerAnalysis}
                disabled={connectionStatus !== "Connected"}
                className="w-full"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Trigger Market Analysis
              </Button>

              <Button
                onClick={onTriggerVoting}
                disabled={isVoting || connectionStatus !== "Connected"}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isVoting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Democratic Voting...
                  </>
                ) : (
                  <>
                    <Vote className="w-4 h-4 mr-2" />
                    Start Democratic Vote
                  </>
                )}
              </Button>
            </div>

            {/* Current Consensus */}
            {votingResults && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Latest Consensus</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {votingResults.consensus_action}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(votingResults.overall_confidence || 0)}% Confidence
                  </div>
                </div>
              </div>
            )}

            {/* System Status */}
            <div className="space-y-3">
              <h4 className="font-semibold">System Health</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted/30 rounded">
                  <div className="text-lg font-bold text-green-500">{activeAgents}</div>
                  <div className="text-xs text-muted-foreground">Active Agents</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded">
                  <div className="text-lg font-bold text-blue-500">{avgConfidence}%</div>
                  <div className="text-xs text-muted-foreground">Avg Confidence</div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Risk Level: Medium
              </div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Market volatility detected. Monitor positions carefully.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}