"use client";

import { AnalysisHistory } from "@/components/AnalysisHistory";
import { DecisionTheater } from "@/components/DecisionTheater";
import { ModernCoinAnalytics } from "@/components/ModernCoinAnalytics";
import { ModernDecisionHub } from "@/components/ModernDecisionHub";
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
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const triggerMarketAnalysis = (data?: any) => console.log("Using REST API instead of WebSocket", data);
  const reconnect = () => {
    setConnectionStatus("Connecting...");
    fetchAgentData().then(() => {
      setConnectionStatus("Connected");
    }).catch(() => {
      setConnectionStatus("Disconnected");
    });
  };

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
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  const [agents, setAgents] = useState([
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

  const fetchAgentData = async () => {
    try {
      const response = await fetch('http://localhost:8000/agents/status');
      if (response.ok) {
        const data = await response.json();
        if (data.agents) {
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

  const fetchTradingDecisions = async () => {
    try {
      const response = await fetch('http://localhost:8000/trading/decisions');
      if (response.ok) {
        const data = await response.json();
        if (data.decisions && data.decisions.length > 0) {
          setTradingDecisions(data.decisions.slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Failed to fetch trading decisions:', error);
    }
  };

  const fetchAnalysisHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/analysis/history?limit=10');
      if (response.ok) {
        const data = await response.json();
        if (data.analysis_results && data.analysis_results.length > 0) {
          setAnalysisHistory(data.analysis_results);
        }
      }
    } catch (error) {
      console.error('Failed to fetch analysis history:', error);
    }
  };

  const [tradingDecisions, setTradingDecisions] = useState([
    { timestamp: "Connecting...", asset: "...", action: "...", confidence: 0, reasoning: "Loading recent trading decisions from backend..." },
  ]);

  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [votingResults, setVotingResults] = useState<any>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showDecisionTheater, setShowDecisionTheater] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const marketData = {
        test: "trigger_real_data",
        timestamp: new Date().toISOString()
      };

      if (connectionStatus === 'Connected') {
        triggerMarketAnalysis(marketData);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [connectionStatus, triggerMarketAnalysis]);

  useEffect(() => {
    fetchAgentData();
    fetchTradingDecisions();
    fetchAnalysisHistory();

    const agentInterval = setInterval(fetchAgentData, 5000);
    const decisionsInterval = setInterval(fetchTradingDecisions, 10000);
    const analysisInterval = setInterval(fetchAnalysisHistory, 15000);

    return () => {
      clearInterval(agentInterval);
      clearInterval(decisionsInterval);
      clearInterval(analysisInterval);
    };
  }, []);



  const handleTriggerVoting = () => {
    setShowDecisionTheater(true);
  };

  const handleTriggerAnalysis = async () => {
    try {
      // Get current market prices like we do for voting
      let marketData;
      try {
        const priceResponse = await fetch('http://localhost:8000/market/current');
        const priceData = await priceResponse.json();

        if (priceData.prices) {
          marketData = {
            ...priceData.prices,
            symbol: 'BTC/USDT',
            timestamp: new Date().toISOString(),
            trigger: 'manual_analysis_with_real_prices'
          };
        } else {
          throw new Error('Price fetch failed');
        }
      } catch (priceError) {
        marketData = {
          BTC: 43000,
          ETH: 2900,
          SOL: 99,
          BNB: 310,
          symbol: 'BTC/USDT',
          timestamp: new Date().toISOString(),
          trigger: 'manual_analysis_fallback'
        };
      }

      const response = await fetch('http://localhost:8000/trading/analyze', {
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
        const data = await response.json();
        console.log('Analysis results:', data);
        // Refresh analysis history after successful analysis
        setTimeout(() => {
          fetchAnalysisHistory();
        }, 1000);
      } else {
        console.error('Analysis failed:', await response.text());
      }
    } catch (error) {
      console.error('Error triggering analysis:', error);
    }
  };

  const handleDecisionTheaterVoting = async (onVotingComplete: (results: any) => void) => {
    try {
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
        } else {
          throw new Error('Price fetch failed');
        }
      } catch (priceError) {
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
        const votingData = {
          consensus_action: data.consensus_action,
          overall_confidence: data.overall_confidence,
          agent_votes: data.agent_votes,
          democracy_summary: data.risk_assessment
        };

        setVotingResults(votingData);

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

        onVotingComplete(votingData);
      } else {
        console.error('Failed to trigger voting:', response.status);
        onVotingComplete(null);
      }
    } catch (error) {
      console.error('Error triggering voting:', error);
      onVotingComplete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <SimpleSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-[#2a2a2a] bg-[#0a0a0a] p-6">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Autonomous Trading Floor</h1>
              <p className="text-[#a0a0a0] text-sm">AI-powered multi-agent trading system</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`border-0 font-medium ${connectionStatus === "Connected"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
                  } flex items-center gap-2`}
              >
                <div className={`w-2 h-2 rounded-full ${connectionStatus === "Connected" ? "bg-green-400" : "bg-red-400"}`} />
                {connectionStatus}
              </Badge>
              {connectionStatus !== "Connected" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={reconnect}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reconnect
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleTriggerAnalysis}
                disabled={connectionStatus !== "Connected"}
                className="bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                <Zap className="w-4 h-4 mr-2" />
                Trigger Analysis
              </Button>
              <Button
                size="sm"
                onClick={handleTriggerVoting}
                disabled={connectionStatus !== "Connected"}
                variant="outline"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
              >
                <Gavel className="w-4 h-4 mr-2" />
                Start Democracy
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#0a0a0a]">
          {activeTab === "coin-analytics" && (
            <ModernCoinAnalytics />
          )}
          {activeTab === "decision-hub" && (
            <ModernDecisionHub
              agents={agents}
              decisions={tradingDecisions}
              votingResults={votingResults}
            />
          )}

          {activeTab === "analysis-history" && (
            <AnalysisHistory
              analysisHistory={analysisHistory}
            />
          )}
        </div>

        {/* Decision Theater Modal */}
        <DecisionTheater
          isOpen={showDecisionTheater}
          onClose={() => setShowDecisionTheater(false)}
          onStartVoting={async () => {
            return new Promise((resolve) => {
              handleDecisionTheaterVoting(resolve);
            });
          }}
          onTriggerAnalysis={handleTriggerAnalysis}
          onConsensus={(results) => {
            try {
              setVotingResults(results);
              if (results?.consensus_action) {
                const newDecision = {
                  timestamp: new Date().toLocaleString(),
                  asset: 'BTC',
                  action: results.consensus_action,
                  confidence: Math.round(results.overall_confidence || 0),
                  reasoning: results.democracy_summary || 'Democratic consensus reached'
                };
                setTradingDecisions(prev => [newDecision, ...prev.slice(0, 4)]);
              }
            } catch (e) {
              // ignore
            }
          }}
        />
      </div>
    </div>
  );
}