"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vote } from "lucide-react";
import { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  tier: number;
  status: string;
  confidence: number;
  lastAction: string;
  icon: any;
  vote?: string;
}

interface VotingResults {
  consensus_action?: string;
  overall_confidence?: number;
  agent_votes?: Record<string, string>;
  vote_breakdown?: Record<string, number>;
  democracy_summary?: string;
}

interface NodeGraphProps {
  agents: Agent[];
  votingResults?: VotingResults;
  onTriggerVoting: () => void;
  isVoting: boolean;
}

export default function NodeGraph({ agents, votingResults, onTriggerVoting, isVoting }: NodeGraphProps) {
  const [animatedVotes, setAnimatedVotes] = useState<Record<string, string>>({});

  // Animate vote visualization when voting results come in
  useEffect(() => {
    if (votingResults?.agent_votes) {
      const votes = votingResults.agent_votes;
      setAnimatedVotes({});

      // Animate votes one by one for visual effect
      Object.keys(votes).forEach((agentId, index) => {
        setTimeout(() => {
          setAnimatedVotes(prev => ({
            ...prev,
            [agentId]: votes[agentId]
          }));
        }, index * 200);
      });
    }
  }, [votingResults]);

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return "from-emerald-500 to-green-600";
      case 2: return "from-blue-500 to-indigo-600";
      case 3: return "from-purple-500 to-pink-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case 'BUY': return "bg-green-500";
      case 'SELL': return "bg-red-500";
      case 'HOLD': return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const tierAgents = {
    1: agents.filter(a => a.tier === 1),
    2: agents.filter(a => a.tier === 2),
    3: agents.filter(a => a.tier === 3)
  };

  return (
    <div className="w-full h-screen bg-gray-900 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Consensus Trading Floor</h1>
          <p className="text-gray-400">AI-Powered Multi-Agent Voting System</p>
        </div>

        <div className="flex items-center gap-4">
          {votingResults && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Vote className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-lg font-bold text-white">
                      {votingResults.consensus_action || 'PENDING'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {votingResults.overall_confidence || 0}% Confidence
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getVoteColor(votingResults.consensus_action || '')}`} />
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={onTriggerVoting}
            disabled={isVoting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isVoting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Voting...
              </>
            ) : (
              <>
                <Vote className="w-4 h-4 mr-2" />
                Start Consensus
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Node Graph Layout */}
      <div className="grid grid-cols-4 gap-6 h-[calc(100vh-120px)]">
        {/* Tier 1: Intelligence */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            Tier 1: Intelligence
          </h3>
          {tierAgents[1].map((agent, index) => (
            <AgentNode
              key={agent.id}
              agent={agent}
              tier={1}
              vote={animatedVotes[agent.id]}
              isVoting={isVoting}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Tier 2: Analysis */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            Tier 2: Analysis
          </h3>
          {tierAgents[2].map((agent, index) => (
            <AgentNode
              key={agent.id}
              agent={agent}
              tier={2}
              vote={animatedVotes[agent.id]}
              isVoting={isVoting}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Tier 3: Strategy */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            Tier 3: Strategy
          </h3>
          {tierAgents[3].map((agent, index) => (
            <AgentNode
              key={agent.id}
              agent={agent}
              tier={3}
              vote={animatedVotes[agent.id]}
              isVoting={isVoting}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Consensus Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Vote className="w-5 h-5 text-yellow-500" />
            Consensus
          </h3>

          {votingResults && (
            <div className="space-y-4">
              {/* Vote Breakdown */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">Vote Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['BUY', 'SELL', 'HOLD'].map(action => {
                      const count = Object.values(votingResults.agent_votes || {}).filter(v => v === action).length;
                      const percentage = count > 0 ? (count / 9) * 100 : 0;
                      return (
                        <div key={action} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getVoteColor(action)}`} />
                          <span className="text-white text-sm font-medium w-12">{action}</span>
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getVoteColor(action)}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Consensus Summary */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm">AI Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300 text-sm">
                    {votingResults.democracy_summary || votingResults.consensus_summary || "Awaiting consensus analysis..."}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AgentNodeProps {
  agent: Agent;
  tier: number;
  vote?: string;
  isVoting: boolean;
  delay: number;
}

function AgentNode({ agent, tier, vote, isVoting, delay }: AgentNodeProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const IconComponent = agent.icon;

  useEffect(() => {
    if (isVoting) {
      setTimeout(() => setIsAnimating(true), delay);
    } else {
      setIsAnimating(false);
    }
  }, [isVoting, delay]);

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return "from-emerald-500 to-green-600";
      case 2: return "from-blue-500 to-indigo-600";
      case 3: return "from-purple-500 to-pink-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case 'BUY': return "bg-green-500";
      case 'SELL': return "bg-red-500";
      case 'HOLD': return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className={`bg-gray-800 border-gray-700 transition-all duration-300 hover:scale-105 ${isAnimating ? 'ring-2 ring-blue-500 animate-pulse' : ''
      }`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getTierColor(tier)}`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm truncate">
              {agent.name}
            </div>
            <div className="text-gray-400 text-xs truncate">
              {agent.lastAction}
            </div>
          </div>
          {vote && (
            <div className={`w-6 h-6 rounded-full ${getVoteColor(vote)} flex items-center justify-center animate-bounce`}>
              <span className="text-white text-xs font-bold">
                {vote.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Confidence</span>
            <span className="text-white text-sm font-medium">{agent.confidence}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full bg-gradient-to-r ${getTierColor(tier)} transition-all duration-500`}
              style={{ width: `${agent.confidence}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}