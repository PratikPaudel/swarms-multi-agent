"use client";

import { CoinAnalytics } from "@/components/CoinAnalytics";
import { DecisionHub } from "@/components/DecisionHub";
import { SimpleSidebar } from "@/components/SimpleSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Gavel, RefreshCw, Shield, Target, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [activeTab, setActiveTab] = useState("coin-analytics");
  // Real WebSocket connection status
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const triggerMarketAnalysis = (data?: any) => console.log("Using REST API instead of WebSocket", data);
  const reconnect = () => {
    setConnectionStatus("Connecting...");
    // Try to reconnect by fetching agent data
    fetchAgentData().then(() => {
      setConnectionStatus("Connected");
    }).catch(() => {
      setConnectionStatus("Disconnected");
    });
  };

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          setConnectionStatus("Connected");
        } else {
          setConnectionStatus("Disconnected");
        }
      } catch (error) {
        setConnectionStatus("Disconnected");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, []);

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

  // Fetch real trading decisions from backend
  const fetchTradingDecisions = async () => {
    try {
      console.log('Fetching trading decisions from backend...');
      const response = await fetch('http://localhost:8000/trading/decisions');
      if (response.ok) {
        const data = await response.json();
        console.log('Received trading decisions:', data);
        if (data.decisions && data.decisions.length > 0) {
          setTradingDecisions(data.decisions.slice(0, 5)); // Keep last 5 decisions
        }
      }
    } catch (error) {
      console.error('Failed to fetch trading decisions:', error);
      // Keep existing fallback data if fetch fails
    }
  };

  const [tradingDecisions, setTradingDecisions] = useState([
    { timestamp: "Connecting...", asset: "...", action: "...", confidence: 0, reasoning: "Loading recent trading decisions from backend..." },
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

  // Fetch real data on mount and periodically
  useEffect(() => {
    // Initial fetch immediately
    fetchAgentData();
    fetchTradingDecisions();

    // Set up periodic fetching of real data
    const agentInterval = setInterval(fetchAgentData, 5000); // Every 5 seconds
    const decisionsInterval = setInterval(fetchTradingDecisions, 10000); // Every 10 seconds

    return () => {
      clearInterval(agentInterval);
      clearInterval(decisionsInterval);
    };
  }, []);

  const handleTriggerAnalysis = async () => {
    try {
      // Fetch real current market prices
      const response = await fetch('http://localhost:8000/market/current');
      let currentMarketData;

      if (response.ok) {
        const data = await response.json();
        currentMarketData = {
          ...data.prices,
          BNB: data.prices.BNB, // Include BNB in the analysis
          trigger: "manual",
          timestamp: new Date().toISOString()
        };
        console.log('Using real market prices for analysis:', currentMarketData);
      } else {
        // Fallback to basic prices if API fails
        currentMarketData = {
          BTC: 43000,
          ETH: 2900,
          SOL: 99,
          BNB: 310,
          trigger: "manual_fallback",
          timestamp: new Date().toISOString()
        };
        console.log('Using fallback prices for analysis:', currentMarketData);
      }

      triggerMarketAnalysis(currentMarketData);
    } catch (error) {
      console.error('Error fetching current prices for analysis:', error);
      // Use fallback data if fetch fails
      const fallbackData = {
        BTC: 43000,
        ETH: 2900,
        SOL: 99,
        BNB: 310,
        trigger: "manual_error_fallback",
        timestamp: new Date().toISOString()
      };
      triggerMarketAnalysis(fallbackData);
    }
  };

  const handleTriggerVoting = async () => {
    setIsVoting(true);
    try {
      console.log('Triggering democratic voting...');

      // Fetch real current market prices for voting
      let marketData;
      try {
        const priceResponse = await fetch('http://localhost:8000/market/current');
        if (priceResponse.ok) {
          const priceData = await priceResponse.json();
          marketData = {
            ...priceData.prices,
            symbol: 'BTC/USDT',
            timestamp: new Date().toISOString(),
            trigger: 'manual_voting_with_real_prices'
          };
          console.log('Using real market prices for voting:', marketData);
        } else {
          throw new Error('Price fetch failed');
        }
      } catch (priceError) {
        console.log('Failed to fetch real prices, using fallback for voting');
        marketData = {
          BTC: 43000,
          ETH: 2900,
          SOL: 99,
          BNB: 310,
          symbol: 'BTC/USDT',
          timestamp: new Date().toISOString(),
          trigger: 'manual_voting_fallback'
        };
      }

      const response = await fetch('http://localhost:8000/trading/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          market_data: marketData,
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
    <div className="flex min-h-screen bg-background">
      <SimpleSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Autonomous Trading Floor</h1>
              <p className="text-muted-foreground text-sm">AI-powered multi-agent trading system</p>
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
                    <Gavel className="w-4 h-4 mr-1" />
                    Start Democracy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "coin-analytics" && (
            <CoinAnalytics
              agents={agents}
              votingResults={votingResults}
              onTriggerVoting={handleTriggerVoting}
              isVoting={isVoting}
            />
          )}
          {activeTab === "decision-hub" && (
            <DecisionHub
              agents={agents}
              decisions={tradingDecisions}
              votingResults={votingResults}
            />
          )}
        </div>
      </div>
    </div>
  );
}
