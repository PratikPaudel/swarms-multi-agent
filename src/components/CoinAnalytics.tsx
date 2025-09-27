"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TradingChart } from "@/components/TradingChart";
import NodeGraph from "@/components/NodeGraph";

interface Agent {
  id: string;
  name: string;
  tier: number;
  status: string;
  confidence: number;
  lastAction: string;
  icon: any;
}

interface CoinAnalyticsProps {
  agents: Agent[];
  votingResults: any;
  onTriggerVoting: () => void;
  isVoting: boolean;
}

export function CoinAnalytics({ agents, votingResults, onTriggerVoting, isVoting }: CoinAnalyticsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Top Left: Trading Chart */}
      <div className="flex flex-col">
        <TradingChart />
      </div>

      {/* Top Right: Agent Network */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Agent Network</CardTitle>
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

      {/* Bottom Left: Market Metrics */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Market Metrics</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">$109,701</div>
                <div className="text-sm text-muted-foreground">BTC Price</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">$4,028</div>
                <div className="text-sm text-muted-foreground">ETH Price</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">$204</div>
                <div className="text-sm text-muted-foreground">SOL Price</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">$976</div>
                <div className="text-sm text-muted-foreground">BNB Price</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Right: Risk Analysis */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">Portfolio Risk: Medium</div>
              <div className="text-sm text-muted-foreground">VaR: $9,841.41</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">Market Volatility: High</div>
              <div className="text-sm text-muted-foreground">Max Drawdown: 25.3%</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-lg font-semibold">Correlation Score: 0.82</div>
              <div className="text-sm text-muted-foreground">Cross-asset correlation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}