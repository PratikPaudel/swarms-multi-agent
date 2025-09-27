"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, TrendingUp, TrendingDown, Target, Activity, Users, Brain, Zap } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  tier: number;
  status: string;
  confidence: number;
  lastAction: string;
  icon: any;
}

interface Decision {
  timestamp: string;
  asset: string;
  action: string;
  confidence: number;
  reasoning: string;
}

interface ModernDecisionHubProps {
  agents: Agent[];
  decisions: Decision[];
  votingResults: any;
}

export function ModernDecisionHub({ agents, decisions, votingResults }: ModernDecisionHubProps) {
  const recentDecisions = decisions.slice(0, 3);
  const activeAgents = agents.filter(a => a.status === 'active');
  const processingAgents = agents.filter(a => a.status === 'processing');

  // Calculate performance metrics
  const avgConfidence = Math.round(agents.reduce((sum, a) => sum + a.confidence, 0) / agents.length);
  const buyDecisions = decisions.filter(d => d.action === 'BUY').length;
  const sellDecisions = decisions.filter(d => d.action === 'SELL').length;
  const holdDecisions = decisions.filter(d => d.action === 'HOLD').length;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Decision Hub</h1>
        <p className="text-[#a0a0a0] text-lg">
          AI-powered democratic trading decisions and system intelligence
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl hover:bg-[#1f1f1f] transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">Active Agents</p>
                <p className="text-white text-2xl font-bold">{activeAgents.length}<span className="text-lg text-[#a0a0a0]">/9</span></p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl hover:bg-[#1f1f1f] transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">Avg Confidence</p>
                <p className="text-white text-2xl font-bold">{avgConfidence}%</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl hover:bg-[#1f1f1f] transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">Total Decisions</p>
                <p className="text-white text-2xl font-bold">{decisions.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl hover:bg-[#1f1f1f] transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#a0a0a0] text-xs font-medium uppercase tracking-wide">Processing</p>
                <p className="text-white text-2xl font-bold">{processingAgents.length}</p>
              </div>
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Decision - Takes 2 columns */}
        <Card className="lg:col-span-2 bg-[#1a1a1a] border-[#2a2a2a] rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Latest Democratic Decision
            </CardTitle>
          </CardHeader>
          <CardContent>
            {votingResults ? (
              <div className="space-y-6">
                {/* Main Decision Display */}
                <div className="text-center p-6 bg-[#111111] rounded-xl border border-[#2a2a2a]">
                  <div className={`text-5xl font-bold mb-3 ${
                    votingResults.consensus_action === 'BUY' ? 'text-green-400' :
                    votingResults.consensus_action === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {votingResults.consensus_action}
                  </div>
                  <div className="text-white text-lg mb-2">
                    {Math.round(votingResults.overall_confidence || 0)}% Consensus
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(votingResults.overall_confidence || 0)}%` }}
                    />
                  </div>
                </div>

                {/* Agent Votes Grid */}
                {votingResults.agent_votes && (
                  <div>
                    <h4 className="text-white font-medium mb-3">Agent Votes</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(votingResults.agent_votes).slice(0, 9).map(([agent, vote]) => (
                        <div
                          key={agent}
                          className={`p-2 rounded-lg text-center text-xs font-medium ${
                            vote === votingResults.consensus_action
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-[#111111] text-[#a0a0a0] border border-[#2a2a2a]'
                          }`}
                        >
                          <div className="capitalize">{agent.replace('_', ' ')}</div>
                          <div className="font-bold">{vote as string}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 text-[#a0a0a0]">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No voting results yet</p>
                <p className="text-sm">Trigger democracy to see consensus decisions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Decision Statistics */}
        <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg font-bold">Decision Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">BUY</span>
                </div>
                <span className="text-green-400 font-bold text-lg">{buyDecisions}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium">SELL</span>
                </div>
                <span className="text-red-400 font-bold text-lg">{sellDecisions}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">HOLD</span>
                </div>
                <span className="text-yellow-400 font-bold text-lg">{holdDecisions}</span>
              </div>
            </div>

            {/* Top Agents */}
            <div className="pt-4 border-t border-[#2a2a2a]">
              <h5 className="text-white font-medium mb-3">Top Confidence Agents</h5>
              <div className="space-y-2">
                {agents
                  .sort((a, b) => b.confidence - a.confidence)
                  .slice(0, 4)
                  .map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-2 bg-[#111111] rounded-lg">
                      <span className="text-[#a0a0a0] text-sm">{agent.name.split(' ')[0]}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          agent.status === 'active' ? 'bg-green-400' :
                          agent.status === 'processing' ? 'bg-yellow-400' : 'bg-gray-500'
                        }`} />
                        <span className="text-white font-medium text-sm">{agent.confidence}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Decisions History */}
      <Card className="bg-[#1a1a1a] border-[#2a2a2a] rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-lg font-bold">Recent Decision History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {recentDecisions.map((decision, index) => (
                <div key={index} className="p-4 bg-[#111111] rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`border-0 font-medium ${
                          decision.action === 'BUY' ? 'bg-green-500/20 text-green-400' :
                          decision.action === 'SELL' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {decision.action}
                      </Badge>
                      <span className="text-white font-medium">{decision.asset}</span>
                    </div>
                    <span className="text-[#a0a0a0] text-sm">{decision.confidence}% confidence</span>
                  </div>
                  <p className="text-[#a0a0a0] text-sm mb-2">{decision.reasoning}</p>
                  <div className="text-xs text-[#707070]">{decision.timestamp}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}