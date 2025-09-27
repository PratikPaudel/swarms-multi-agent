"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TradingChart } from "@/components/TradingChart";
import { DecisionPanel } from "@/components/DecisionPanel";
import NodeGraph from "@/components/NodeGraph";
import { Activity, Brain, TrendingUp, Shield, Target, Zap, RefreshCw, Vote } from "lucide-react";

interface TradingDecisionResponse {
  decisions?: any[];
  consensus_action?: string;
  overall_confidence?: number;
  risk_assessment?: string;
  timestamp?: string;
  agent_votes?: Record<string, string>;
  voting_results?: {
    consensus_action?: string;
    overall_confidence?: number;
    agent_votes?: Record<string, string>;
    democracy_summary?: string;
  };
}

export default function TradingFloor() {
  // Temporarily disable WebSocket to avoid connection loops - using REST API instead
  const connectionStatus = "Connected"; // Mock connected status
  const triggerMarketAnalysis = (data?: any) => console.log("Using REST API instead of WebSocket", data);
  const reconnect = () => console.log("Using REST API instead of WebSocket");

  const [agents, setAgents] = useState([
    // Initial fallback data - will be replaced with real backend data
    { id: "market_data", name: "Market Data Collector", tier: 1, status: "active", confidence: 0, lastAction: "Connecting to backend...", icon: Activity },
    { id: "sentiment", name: "Sentiment Analyzer", tier: 1, status: "active", confidence: 0, lastAction: "Connecting to backend...", icon: Brain },
    { id: "onchain", name: "On-Chain Monitor", tier: 1, status: "active", confidence: 0, lastAction: "Connecting to backend...", icon: Target },
    { id: "technical", name: "Technical Analyst", tier: 2, status: "processing", confidence: 0, lastAction: "Connecting to backend...", icon: TrendingUp },
    { id: "risk", name: "Risk Calculator", tier: 2, status: "active", confidence: 0, lastAction: "Connecting to backend...", icon: Shield },
    { id: "correlation", name: "Correlation Analyzer", tier: 2, status: "active", confidence: 0, lastAction: "Connecting to backend...", icon: Brain },
    { id: "strategy", name: "Strategy Synthesizer", tier: 3, status: "deciding", confidence: 0, lastAction: "Connecting to backend...", icon: Zap },
    { id: "portfolio", name: "Portfolio Optimizer", tier: 3, status: "active", confidence: 0, lastAction: "Connecting to backend...", icon: Target },
    { id: "executor", name: "Trade Executor", tier: 3, status: "standby", confidence: 0, lastAction: "Connecting to backend...", icon: Activity },
  ]);

  // Fetch real agent data from backend
  const fetchAgentData = async () => {
    try {
      console.log('Fetching agent data from backend...');
      const response = await fetch('http://localhost:8000/agents/status');
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data);
        if (data.agents) {
          // Create new agent array with updated data
          setAgents(currentAgents => {
            return currentAgents.map(frontendAgent => {
              const backendAgent = data.agents.find((a: any) => a.id === frontendAgent.id);
              if (backendAgent) {
                return {
                  ...frontendAgent,
                  name: backendAgent.name,
                  tier: backendAgent.tier,
                  status: backendAgent.status,
                  confidence: Math.round(backendAgent.confidence),
                  lastAction: backendAgent.last_action,
                };
              }
              return frontendAgent;
            });
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch agent data:', error);
    }
  };

  const [tradingDecisions, setTradingDecisions] = useState([
    { timestamp: "2024-01-20 14:23:15", asset: "BTC", action: "BUY", confidence: 85, reasoning: "Technical breakout confirmed by 7/9 agents" },
    { timestamp: "2024-01-20 14:18:32", asset: "ETH", action: "HOLD", confidence: 72, reasoning: "Mixed signals, risk manager recommends patience" },
    { timestamp: "2024-01-20 14:15:07", asset: "SOL", action: "SELL", confidence: 91, reasoning: "Whale movement detected, sentiment turning negative" },
  ]);

  const [votingResults, setVotingResults] = useState<any>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Note: WebSocket temporarily disabled - using REST API for decisions

  // Enable periodic market data trigger for real analysis
  useEffect(() => {
    const interval = setInterval(() => {
      const marketData = {
        test: "trigger_real_data", // This will trigger the backend to fetch real CoinGecko data
        timestamp: new Date().toISOString()
      };

      if (connectionStatus === 'Connected') {
        triggerMarketAnalysis(marketData);
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [connectionStatus, triggerMarketAnalysis]);

  // Fetch real agent data on mount and periodically
  useEffect(() => {
    // Initial fetch immediately
    fetchAgentData();

    // Set up periodic fetching of real agent data
    const interval = setInterval(fetchAgentData, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleTriggerAnalysis = () => {
    const currentMarketData = {
      BTC: 42150,
      ETH: 2850,
      SOL: 98,
      trigger: "manual",
      timestamp: new Date().toISOString()
    };
    triggerMarketAnalysis(currentMarketData);
  };

  const handleTriggerVoting = async () => {
    setIsVoting(true);
    try {
      console.log('Triggering democratic voting...');
      const response = await fetch('http://localhost:8000/trading/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          market_data: {
            symbol: 'BTC/USDT',
            timestamp: new Date().toISOString(),
            trigger: 'manual_voting'
          },
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data: TradingDecisionResponse = await response.json();
        console.log('Voting results:', data);

        // Extract voting results from the response
        const votingData = {
          consensus_action: data.consensus_action,
          overall_confidence: data.overall_confidence,
          agent_votes: data.agent_votes,
          democracy_summary: data.risk_assessment
        };

        setVotingResults(votingData);

        // Update trading decisions with new result
        if (votingData.consensus_action) {
          const newDecision = {
            timestamp: new Date().toLocaleString(),
            asset: 'BTC',
            action: votingData.consensus_action,
            confidence: Math.round(votingData.overall_confidence || 0),
            reasoning: votingData.democracy_summary || 'Democratic consensus reached'
          };
          setTradingDecisions(prev => [newDecision, ...prev.slice(0, 4)]);
        }
      } else {
        console.error('Failed to trigger voting:', response.status);
      }
    } catch (error) {
      console.error('Error triggering voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Autonomous Trading Floor</h1>
            <p className="text-muted-foreground">AI-powered multi-agent trading system</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={connectionStatus === "Connected" ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              <div className={`w-2 h-2 rounded-full ${connectionStatus === "Connected" ? "bg-green-500" : "bg-red-500"}`} />
              {connectionStatus}
            </Badge>
            {connectionStatus !== "Connected" && (
              <Button size="sm" variant="outline" onClick={reconnect}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Reconnect
              </Button>
            )}
            <Button size="sm" onClick={handleTriggerAnalysis} disabled={connectionStatus !== "Connected"}>
              <Zap className="w-4 h-4 mr-1" />
              Trigger Analysis
            </Button>
            <Button size="sm" onClick={handleTriggerVoting} disabled={isVoting || connectionStatus !== "Connected"} variant="outline">
              {isVoting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                  Voting...
                </>
              ) : (
                <>
                  <Vote className="w-4 h-4 mr-1" />
                  Start Democracy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content - Node Graph Visualization */}
        <Tabs defaultValue="nodeview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="nodeview">Democratic Floor</TabsTrigger>
            <TabsTrigger value="chart">Trading Chart</TabsTrigger>
            <TabsTrigger value="decisions">Decisions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="nodeview" className="mt-4">
            <NodeGraph
              agents={agents}
              votingResults={votingResults}
              onTriggerVoting={handleTriggerVoting}
              isVoting={isVoting}
            />
          </TabsContent>

          <TabsContent value="chart" className="mt-4">
            <TradingChart />
          </TabsContent>

          <TabsContent value="decisions" className="mt-4">
            <DecisionPanel decisions={tradingDecisions} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Decision Latency</span>
                      <span>87ms</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Agent Consensus</span>
                      <span>{Math.round(votingResults?.overall_confidence || 78)}%</span>
                    </div>
                    <Progress value={Math.round(votingResults?.overall_confidence || 78)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Score</span>
                      <span>Medium (6.2/10)</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
