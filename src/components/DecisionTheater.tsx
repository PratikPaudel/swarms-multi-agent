"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Activity, Brain, CheckCircle, Clock, Target, Vote, Zap } from "lucide-react";
import { useState } from "react";

interface AgentThought {
  id: string;
  agentName: string;
  tier: number;
  vote: string;
  reasoning: string;
  confidence: number;
  timestamp: string;
  status: 'thinking' | 'completed' | 'pending';
}

interface DecisionTheaterProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVoting: () => Promise<void>;
  onTriggerAnalysis?: () => Promise<void>;
  onConsensus?: (results: any) => void;
}

export function DecisionTheater({ isOpen, onClose, onStartVoting, onTriggerAnalysis, onConsensus }: DecisionTheaterProps) {
  const [currentPhase, setCurrentPhase] = useState<'init' | 'analysis-only' | 'data-collection' | 'tier1' | 'tier2' | 'tier3' | 'consensus' | 'complete'>('init');
  const [agentThoughts, setAgentThoughts] = useState<AgentThought[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [consensusResult, setConsensusResult] = useState<any>(null);
  const [marketData, setMarketData] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Simulate analysis-only workflow (Tier 1 + 2)
  const simulateAnalysisFlow = async () => {
    setIsVoting(true);
    setCurrentPhase('data-collection');

    // Simulate market data collection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMarketData({
      BTC: { price: 107500, change: -1.92 },
      ETH: { price: 3950, change: -1.75 },
      SOL: { price: 195, change: -4.25 },
      BNB: { price: 950, change: -2.1 }
    });

    // Tier 1: Intelligence Gathering
    setCurrentPhase('tier1');
    const tier1Agents = [
      { id: 'market_data', name: 'Market-Data-Collector', tier: 1 },
      { id: 'sentiment', name: 'Sentiment-Analyzer', tier: 1 },
      { id: 'onchain', name: 'On-Chain-Monitor', tier: 1 }
    ];

    for (const agent of tier1Agents) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const thought: AgentThought = {
        id: agent.id,
        agentName: agent.name,
        tier: agent.tier,
        vote: 'ANALYZING',
        reasoning: `Analyzing current market data: BTC down 1.92%, ETH down 1.75%, SOL down 4.25%. Market showing signs of consolidation with moderate volume. Overall sentiment appears cautious but not bearish.`,
        confidence: Math.floor(Math.random() * 20) + 70,
        timestamp: new Date().toLocaleTimeString(),
        status: 'completed'
      };
      setAgentThoughts(prev => [...prev, thought]);
    }

    // Tier 2: Analysis
    setCurrentPhase('tier2');
    const tier2Agents = [
      { id: 'technical', name: 'Technical-Analyst', tier: 2 },
      { id: 'risk', name: 'Risk-Calculator', tier: 2 },
      { id: 'correlation', name: 'Correlation-Analyzer', tier: 2 }
    ];

    for (const agent of tier2Agents) {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const thought: AgentThought = {
        id: agent.id,
        agentName: agent.name,
        tier: agent.tier,
        vote: 'ANALYSIS',
        reasoning: `The current market data shows a moderate pullback across major cryptocurrencies, suggesting a potential consolidation phase. Technical indicators show oversold conditions but not extreme. Risk assessment indicates prudent approach needed.`,
        confidence: Math.floor(Math.random() * 15) + 70,
        timestamp: new Date().toLocaleTimeString(),
        status: 'completed'
      };
      setAgentThoughts(prev => [...prev, thought]);
    }

    // Analysis complete - no voting
    setCurrentPhase('analysis-only');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = {
      analysis_type: 'intelligence_and_analysis',
      market_data: {
        BTC: { price: 107500, change: -1.92 },
        ETH: { price: 3950, change: -1.75 },
        SOL: { price: 195, change: -4.25 },
        BNB: { price: 950, change: -2.1 }
      },
      tiers_completed: ['tier1_intelligence', 'tier2_analysis'],
      status: 'analysis_complete',
      summary: 'Market analysis complete. Agents have gathered intelligence and performed technical analysis without making trading decisions.'
    };

    setAnalysisResults(analysis);
    setCurrentPhase('complete');
    setIsVoting(false);

    // Call the actual analysis function
    if (onTriggerAnalysis) {
      await onTriggerAnalysis();
    }
  };

  // Simulate the full democratic process (all tiers + voting)
  const simulateAgentFlow = async () => {
    setIsVoting(true);
    setCurrentPhase('data-collection');

    // Simulate market data collection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setMarketData({
      BTC: { price: 107500, change: -1.92 },
      ETH: { price: 3950, change: -1.75 },
      SOL: { price: 195, change: -4.25 },
      BNB: { price: 950, change: -2.1 }
    });

    // Tier 1: Intelligence Gathering
    setCurrentPhase('tier1');
    const tier1Agents = [
      { id: 'market_data', name: 'Market-Data-Collector', tier: 1 },
      { id: 'sentiment', name: 'Sentiment-Analyzer', tier: 1 },
      { id: 'onchain', name: 'On-Chain-Monitor', tier: 1 }
    ];

    for (const agent of tier1Agents) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const thought: AgentThought = {
        id: agent.id,
        agentName: agent.name,
        tier: agent.tier,
        vote: 'ANALYZING',
        reasoning: `Analyzing current market data: BTC down 1.92%, ETH down 1.75%, SOL down 4.25%. Market showing signs of consolidation with moderate volume. Overall sentiment appears cautious but not bearish.`,
        confidence: Math.floor(Math.random() * 20) + 70,
        timestamp: new Date().toLocaleTimeString(),
        status: 'completed'
      };
      setAgentThoughts(prev => [...prev, thought]);
    }

    // Tier 2: Analysis
    setCurrentPhase('tier2');
    const tier2Agents = [
      { id: 'technical', name: 'Technical-Analyst', tier: 2 },
      { id: 'risk', name: 'Risk-Calculator', tier: 2 },
      { id: 'correlation', name: 'Correlation-Analyzer', tier: 2 }
    ];

    for (const agent of tier2Agents) {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const thought: AgentThought = {
        id: agent.id,
        agentName: agent.name,
        tier: agent.tier,
        vote: 'HOLD',
        reasoning: `The current market data shows a moderate pullback across major cryptocurrencies, suggesting a potential consolidation phase. Technical indicators show oversold conditions but not extreme. Risk assessment indicates prudent to hold positions.`,
        confidence: Math.floor(Math.random() * 15) + 70,
        timestamp: new Date().toLocaleTimeString(),
        status: 'completed'
      };
      setAgentThoughts(prev => [...prev, thought]);
    }

    // Tier 3: Strategy & Execution
    setCurrentPhase('tier3');
    const tier3Agents = [
      { id: 'strategy', name: 'Strategy-Synthesizer', tier: 3 },
      { id: 'portfolio', name: 'Portfolio-Optimizer', tier: 3 },
      { id: 'executor', name: 'Trade-Executor', tier: 3 }
    ];

    for (const agent of tier3Agents) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const thought: AgentThought = {
        id: agent.id,
        agentName: agent.name,
        tier: agent.tier,
        vote: 'HOLD',
        reasoning: agent.name === 'Trade-Executor'
          ? `Based on analysis from all agents, executing HOLD strategy. Current market conditions warrant patience. Setting stop-losses at 5% below current levels. Monitoring for better entry points.`
          : `Market consolidation phase detected. Recommend maintaining current positions while monitoring for trend reversal signals. Portfolio allocation remains optimal for current volatility levels.`,
        confidence: Math.floor(Math.random() * 20) + 75,
        timestamp: new Date().toLocaleTimeString(),
        status: 'completed'
      };
      setAgentThoughts(prev => [...prev, thought]);
    }

    // Consensus Phase
    setCurrentPhase('consensus');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const consensus = {
      consensus_action: 'HOLD',
      overall_confidence: 75,
      agent_votes: {
        'market_data': 'HOLD',
        'sentiment': 'HOLD',
        'onchain': 'HOLD',
        'technical': 'HOLD',
        'risk': 'HOLD',
        'correlation': 'HOLD',
        'strategy': 'HOLD',
        'portfolio': 'HOLD',
        'executor': 'HOLD'
      },
      democracy_summary: 'Unanimous HOLD decision based on market consolidation analysis'
    };

    setConsensusResult(consensus);
    if (onConsensus) {
      try {
        onConsensus(consensus);
      } catch (_) {
        // noop
      }
    }
    setCurrentPhase('complete');
    setIsVoting(false);

    // Call the actual voting function
    await onStartVoting();
  };

  const handleStartDemo = () => {
    setAgentThoughts([]);
    setConsensusResult(null);
    setAnalysisResults(null);
    setMarketData(null);
    simulateAgentFlow();
  };

  const handleStartAnalysis = () => {
    setAgentThoughts([]);
    setConsensusResult(null);
    setAnalysisResults(null);
    setMarketData(null);
    simulateAnalysisFlow();
  };

  const resetTheater = () => {
    setCurrentPhase('init');
    setAgentThoughts([]);
    setConsensusResult(null);
    setAnalysisResults(null);
    setMarketData(null);
    setIsVoting(false);
  };

  const getTierIcon = (tier: number) => {
    switch (tier) {
      case 1: return Brain;
      case 2: return Activity;
      case 3: return Zap;
      default: return Target;
    }
  };

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'text-green-400 bg-green-500/20';
      case 2: return 'text-blue-400 bg-blue-500/20';
      case 3: return 'text-purple-400 bg-purple-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-none sm:max-w-none md:max-w-none lg:max-w-none xl:max-w-none 2xl:max-w-none w-screen h-[92vh] overflow-hidden bg-[#0a0a0a] border-[#2a2a2a] text-white flex flex-col"
        style={{ maxWidth: "min(98vw, 1600px)", width: "100vw", height: "92vh" }}
      >
        <DialogHeader className="border-b border-[#2a2a2a] pb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                <Vote className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <span>AI Decision Theater</span>
                <span className="text-sm sm:text-base lg:text-lg font-normal text-gray-400 hidden lg:block">Multi-Agent Consensus in Action</span>
              </div>
            </DialogTitle>
            <div className="flex items-center gap-2 lg:gap-4">
              <Badge variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white px-2 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm">
                Phase: {currentPhase.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Unified Container: Process + Stream */}
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Consensus Process</h3>

                {currentPhase === 'init' && (
                  <div className="text-center py-8 lg:py-12">
                    <div className="mb-6 lg:mb-8">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Vote className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                      <h4 className="text-lg lg:text-xl font-semibold mb-2">Choose Your Analysis Mode</h4>
                      <p className="text-gray-400 text-xs lg:text-sm mb-6 lg:mb-8 px-2">Quick insights or full consensus decision making</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-2xl mx-auto">
                      {/* Trigger Analysis Button */}
                      <div className="bg-[#2a2a2a] rounded-xl p-4 lg:p-6 border border-[#3a3a3a] hover:border-[#4a4a4a] transition-all">
                        <div className="mb-3 lg:mb-4">
                          <Brain className="w-8 h-8 lg:w-10 lg:h-10 text-blue-400 mx-auto mb-2" />
                          <h5 className="font-semibold text-sm lg:text-base">Trigger Analysis</h5>
                          <p className="text-xs lg:text-sm text-gray-400 mt-1">Quick market insights</p>
                        </div>
                        <ul className="text-xs text-gray-300 mb-4 space-y-1">
                          <li>• Tiers 1-2 only (6 agents)</li>
                          <li>• 15-20 seconds</li>
                          <li>• No trading decision</li>
                          <li>• Market intelligence</li>
                        </ul>
                        <Button
                          onClick={handleStartAnalysis}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm"
                          size="sm"
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Start Analysis
                        </Button>
                      </div>

                      {/* Start Consensus Button */}
                      <div className="bg-[#2a2a2a] rounded-xl p-4 lg:p-6 border border-[#3a3a3a] hover:border-[#4a4a4a] transition-all">
                        <div className="mb-3 lg:mb-4">
                          <Vote className="w-8 h-8 lg:w-10 lg:h-10 text-purple-400 mx-auto mb-2" />
                          <h5 className="font-semibold text-sm lg:text-base">Start Consensus</h5>
                          <p className="text-xs lg:text-sm text-gray-400 mt-1">Full consensus process</p>
                        </div>
                        <ul className="text-xs text-gray-300 mb-4 space-y-1">
                          <li>• All 3 tiers (9 agents)</li>
                          <li>• 30+ seconds</li>
                          <li>• BUY/SELL/HOLD decision</li>
                          <li>• Consensus voting</li>
                        </ul>
                        <Button
                          onClick={handleStartDemo}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm"
                          size="sm"
                        >
                          <Vote className="w-4 h-4 mr-2" />
                          Start Consensus
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentPhase !== 'init' && (
                  <div className="space-y-3">
                    {/* Data Collection Phase */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${currentPhase === 'data-collection' ? 'bg-blue-500/20 border border-blue-500/30' :
                      ['tier1', 'tier2', 'tier3', 'consensus', 'complete'].includes(currentPhase) ? 'bg-green-500/10' : 'bg-[#2a2a2a]'
                      }`}>
                      {['tier1', 'tier2', 'tier3', 'consensus', 'complete'].includes(currentPhase) ?
                        <CheckCircle className="w-5 h-5 text-green-400" /> :
                        currentPhase === 'data-collection' ?
                          <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full" /> :
                          <Clock className="w-5 h-5 text-gray-500" />
                      }
                      <span>Data Collection</span>
                    </div>

                    {/* Tier 1 */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${currentPhase === 'tier1' ? 'bg-green-500/20 border border-green-500/30' :
                      ['tier2', 'tier3', 'consensus', 'complete'].includes(currentPhase) ? 'bg-green-500/10' : 'bg-[#2a2a2a]'
                      }`}>
                      {['tier2', 'tier3', 'consensus', 'complete'].includes(currentPhase) ?
                        <CheckCircle className="w-5 h-5 text-green-400" /> :
                        currentPhase === 'tier1' ?
                          <div className="animate-spin w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full" /> :
                          <Clock className="w-5 h-5 text-gray-500" />
                      }
                      <span>Tier 1: Intelligence</span>
                    </div>

                    {/* Tier 2 */}
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${currentPhase === 'tier2' ? 'bg-blue-500/20 border border-blue-500/30' :
                      ['tier3', 'consensus', 'complete'].includes(currentPhase) ? 'bg-green-500/10' : 'bg-[#2a2a2a]'
                      }`}>
                      {['tier3', 'consensus', 'complete'].includes(currentPhase) ?
                        <CheckCircle className="w-5 h-5 text-green-400" /> :
                        currentPhase === 'tier2' ?
                          <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full" /> :
                          <Clock className="w-5 h-5 text-gray-500" />
                      }
                      <span>Tier 2: Analysis</span>
                    </div>

                    {/* Tier 3 - Skip for analysis-only */}
                    {currentPhase !== 'analysis-only' && (
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${currentPhase === 'tier3' ? 'bg-purple-500/20 border border-purple-500/30' :
                        ['consensus', 'complete'].includes(currentPhase) ? 'bg-green-500/10' : 'bg-[#2a2a2a]'
                        }`}>
                        {['consensus', 'complete'].includes(currentPhase) ?
                          <CheckCircle className="w-5 h-5 text-green-400" /> :
                          currentPhase === 'tier3' ?
                            <div className="animate-spin w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full" /> :
                            <Clock className="w-5 h-5 text-gray-500" />
                        }
                        <span>Tier 3: Strategy</span>
                      </div>
                    )}

                    {/* Analysis Complete - For analysis-only mode */}
                    {currentPhase === 'analysis-only' && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full" />
                        <span>Analysis Complete</span>
                      </div>
                    )}

                    {/* Consensus - Skip for analysis-only */}
                    {currentPhase !== 'analysis-only' && (
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-all ${currentPhase === 'consensus' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                        currentPhase === 'complete' ? 'bg-green-500/10' : 'bg-[#2a2a2a]'
                        }`}>
                        {currentPhase === 'complete' ?
                          <CheckCircle className="w-5 h-5 text-green-400" /> :
                          currentPhase === 'consensus' ?
                            <div className="animate-spin w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full" /> :
                            <Clock className="w-5 h-5 text-gray-500" />
                        }
                        <span>Consensus</span>
                      </div>
                    )}
                  </div>
                )}

                {currentPhase === 'complete' && (
                  <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                    <Button
                      onClick={resetTheater}
                      variant="outline"
                      size="sm"
                      className="w-full bg-[#2a2a2a] border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
                    >
                      Reset Theater
                    </Button>
                  </div>
                )}

                {/* Stream directly below, in same container */}
                <div className="mt-8">
                  <div className="pb-4 border-b border-[#2a2a2a]">
                    <h3 className="text-xl font-bold">Live Agent Thinking Stream</h3>
                    <p className="text-gray-400 text-sm mt-1">Real-time multi-agent consensus building</p>
                  </div>

                  {agentThoughts.length === 0 && currentPhase === 'init' && (
                    <div className="text-center py-12 lg:py-20 text-[#a0a0a0]">
                      <Brain className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 opacity-50" />
                      <h4 className="text-lg lg:text-xl font-semibold mb-2">Waiting for Consensus</h4>
                      <p className="text-sm lg:text-lg px-4">Start consensus to see AI agents thinking in real-time</p>
                    </div>
                  )}

                  <div className="space-y-6 pt-6">
                    {agentThoughts.map((thought, index) => {
                      const IconComponent = getTierIcon(thought.tier);
                      return (
                        <div
                          key={thought.id}
                          className="animate-fadeIn opacity-0"
                          style={{
                            animation: `fadeIn 0.5s ease-in-out ${index * 0.2}s forwards`
                          }}
                        >
                          <div className="border border-[#2a2a2a] rounded-xl p-4 lg:p-6 bg-gradient-to-r from-[#1a1a1a] to-[#1f1f1f] hover:border-[#3a3a3a] transition-all hover:shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 lg:mb-4 gap-3">
                              <div className="flex items-center gap-3 lg:gap-4">
                                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${getTierColor(thought.tier)}`}>
                                  <IconComponent className="w-5 h-5 lg:w-6 lg:h-6" />
                                </div>
                                <div>
                                  <div className="font-semibold text-base lg:text-lg">{thought.agentName}</div>
                                  <div className="text-xs lg:text-sm text-[#a0a0a0]">Tier {thought.tier} • {thought.timestamp}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 lg:gap-3 self-start sm:self-center">
                                <Badge
                                  variant="outline"
                                  className={`border-0 font-semibold px-2 lg:px-3 py-1 text-xs lg:text-sm ${thought.vote === 'BUY' ? 'bg-green-500/20 text-green-400' :
                                    thought.vote === 'SELL' ? 'bg-red-500/20 text-red-400' :
                                      thought.vote === 'HOLD' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-blue-500/20 text-blue-400'
                                    }`}
                                >
                                  {thought.vote}
                                </Badge>
                                <div className="text-right">
                                  <div className="text-xs lg:text-sm font-semibold text-white">{thought.confidence}%</div>
                                  <div className="text-xs text-[#a0a0a0]">confidence</div>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm lg:text-base text-[#e0e0e0] leading-relaxed">{thought.reasoning}</p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Analysis Result (for analysis-only mode) */}
                    {analysisResults && (
                      <div className="animate-fadeIn border-2 border-blue-500/30 rounded-2xl p-6 lg:p-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 shadow-2xl">
                        <div className="text-center">
                          <div className="text-3xl lg:text-5xl font-bold text-blue-400 mb-2 lg:mb-3">
                            ANALYSIS COMPLETE
                          </div>
                          <div className="text-lg lg:text-2xl text-white mb-1 lg:mb-2">
                            Market Intelligence Gathered
                          </div>
                          <div className="text-base lg:text-lg text-blue-400 mb-4 lg:mb-6">
                            Tiers 1-2 Analysis Complete
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 mb-4">
                            {analysisResults.agents_involved?.tier1?.map((agent: string) => (
                              <div key={agent} className="text-xs lg:text-sm p-2 lg:p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all">
                                <div className="capitalize font-medium text-green-300">{agent.replace('_', ' ')}</div>
                                <div className="font-bold text-xs text-gray-400">Tier 1</div>
                              </div>
                            ))}
                            {analysisResults.agents_involved?.tier2?.map((agent: string) => (
                              <div key={agent} className="text-xs lg:text-sm p-2 lg:p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all">
                                <div className="capitalize font-medium text-blue-300">{agent.replace('_', ' ')}</div>
                                <div className="font-bold text-xs text-gray-400">Tier 2</div>
                              </div>
                            ))}
                          </div>
                          <div className="text-sm text-gray-300 bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
                            <strong>Summary:</strong> {analysisResults.summary || "Market analysis complete. Ready for decision making if needed."}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Consensus Result */}
                    {consensusResult && (
                      <div className="animate-fadeIn border-2 border-green-500/30 rounded-2xl p-6 lg:p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 shadow-2xl">
                        <div className="text-center">
                          <div className="text-3xl lg:text-5xl font-bold text-green-400 mb-2 lg:mb-3">
                            {consensusResult.consensus_action}
                          </div>
                          <div className="text-lg lg:text-2xl text-white mb-1 lg:mb-2">Consensus Reached</div>
                          <div className="text-base lg:text-lg text-green-400 mb-4 lg:mb-6">
                            {consensusResult.overall_confidence}% Overall Confidence
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                            {Object.entries(consensusResult.agent_votes).map(([agent, vote]) => (
                              <div key={agent} className="text-xs lg:text-sm p-2 lg:p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all">
                                <div className="capitalize font-medium text-gray-300">{agent.replace('_', ' ')}</div>
                                <div className="font-bold text-sm lg:text-lg text-white">{vote as string}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out forwards;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}