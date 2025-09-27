"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentGrid } from "@/components/AgentGrid";
import { Progress } from "@/components/ui/progress";

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

interface DecisionHubProps {
  agents: Agent[];
  decisions: Decision[];
  votingResults: any;
}

export function DecisionHub({ agents, decisions, votingResults }: DecisionHubProps) {
  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Top Left: Trading Decisions */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Trading Decisions</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          {decisions.map((decision, index) => (
            <div key={index} className="p-3 border rounded-lg bg-muted/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{decision.asset}</span>
                <span className="text-xs text-muted-foreground">{decision.timestamp}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-bold ${
                  decision.action === 'BUY' ? 'text-green-500' :
                  decision.action === 'SELL' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {decision.action}
                </span>
                <span className="text-sm">{decision.confidence}%</span>
              </div>
              <p className="text-xs text-muted-foreground">{decision.reasoning}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Right: Voting Results */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Democratic Voting</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          {votingResults ? (
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{votingResults.consensus_action}</div>
                <div className="text-sm text-muted-foreground">Consensus Action</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Confidence</span>
                  <span>{Math.round(votingResults.overall_confidence || 0)}%</span>
                </div>
                <Progress value={Math.round(votingResults.overall_confidence || 0)} className="h-2" />
              </div>
              {votingResults.agent_votes && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Agent Votes:</div>
                  {Object.entries(votingResults.agent_votes).map(([agent, vote]) => (
                    <div key={agent} className="flex justify-between text-xs">
                      <span className="capitalize">{agent.replace('_', ' ')}</span>
                      <span className="font-medium">{vote as string}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              No voting results yet. Trigger democracy to see results.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Left: Agent Status */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Agent Status</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <AgentGrid agents={agents} />
        </CardContent>
      </Card>

      {/* Bottom Right: System Analytics */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>System Analytics</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
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
            <div className="pt-4">
              <div className="text-sm text-muted-foreground">Active Agents: {agents.filter(a => a.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Total Decisions: {decisions.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}