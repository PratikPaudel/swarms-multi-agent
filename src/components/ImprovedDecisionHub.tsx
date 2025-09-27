"use client";

import { AgentGrid } from "@/components/AgentGrid";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Target, TrendingDown, TrendingUp } from "lucide-react";

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

interface ImprovedDecisionHubProps {
  agents: Agent[];
  decisions: Decision[];
  votingResults: any;
}

export function ImprovedDecisionHub({ agents, decisions, votingResults }: ImprovedDecisionHubProps) {
  const recentDecisions = decisions.slice(0, 3);
  const activeAgents = agents.filter(a => a.status === 'active');
  const processingAgents = agents.filter(a => a.status === 'processing');

  // Calculate performance metrics
  const avgConfidence = Math.round(agents.reduce((sum, a) => sum + a.confidence, 0) / agents.length);
  const buyDecisions = decisions.filter(d => d.action === 'BUY').length;
  const sellDecisions = decisions.filter(d => d.action === 'SELL').length;
  const holdDecisions = decisions.filter(d => d.action === 'HOLD').length;

  return (
    <div className="space-y-6">
      {/* Top Section: Decision Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latest Decision Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Latest Democratic Decision
            </CardTitle>
          </CardHeader>
          <CardContent>
            {votingResults ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border">
                  <div className="text-4xl font-bold mb-2">{votingResults.consensus_action}</div>
                  <div className="text-lg text-muted-foreground mb-3">
                    {Math.round(votingResults.overall_confidence || 0)}% Consensus Confidence
                  </div>
                  <Progress value={Math.round(votingResults.overall_confidence || 0)} className="h-2 mb-4" />

                  {votingResults.agent_votes && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {Object.entries(votingResults.agent_votes).slice(0, 9).map(([agent, vote]) => (
                        <Badge
                          key={agent}
                          variant={vote === votingResults.consensus_action ? "default" : "outline"}
                          className="text-xs"
                        >
                          {agent.replace('_', ' ')}: {vote as string}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No voting results yet.</p>
                <p className="text-sm">Trigger democracy to see consensus decisions.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Decision Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">BUY</span>
                </div>
                <span className="font-bold text-green-500">{buyDecisions}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm">SELL</span>
                </div>
                <span className="font-bold text-red-500">{sellDecisions}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">HOLD</span>
                </div>
                <span className="font-bold text-yellow-500">{holdDecisions}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{avgConfidence}%</div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Recent Decisions & Agent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Decisions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {recentDecisions.map((decision, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            decision.action === 'BUY' ? 'default' :
                              decision.action === 'SELL' ? 'destructive' : 'secondary'
                          }
                        >
                          {decision.action}
                        </Badge>
                        <span className="font-medium">{decision.asset}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{decision.confidence}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{decision.reasoning}</p>
                    <div className="text-xs text-muted-foreground">{decision.timestamp}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Agent Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-500/10 rounded-lg">
                  <div className="text-lg font-bold text-green-500">{activeAgents.length}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                  <div className="text-lg font-bold text-yellow-500">{processingAgents.length}</div>
                  <div className="text-xs text-muted-foreground">Processing</div>
                </div>
                <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                  <div className="text-lg font-bold text-blue-500">{agents.length}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>

              {/* Top Performing Agents */}
              <div>
                <h4 className="font-medium mb-3">Top Confidence Agents</h4>
                <div className="space-y-2">
                  {agents
                    .sort((a, b) => b.confidence - a.confidence)
                    .slice(0, 5)
                    .map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <span className="text-sm">{agent.name.split(' ')[0]}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' :
                              agent.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                          <span className="text-sm font-medium">{agent.confidence}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Detailed Agent Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Agent Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <AgentGrid agents={agents} />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}