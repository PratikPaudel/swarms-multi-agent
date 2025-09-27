"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  tier: number;
  status: string;
  confidence: number;
  lastAction: string;
  icon: LucideIcon;
}

interface AgentGridProps {
  agents: Agent[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "processing":
      return "bg-yellow-500";
    case "deciding":
      return "bg-blue-500";
    case "standby":
      return "bg-gray-500";
    default:
      return "bg-red-500";
  }
};

const getTierTitle = (tier: number) => {
  switch (tier) {
    case 1:
      return "Tier 1: Intelligence";
    case 2:
      return "Tier 2: Analysis";
    case 3:
      return "Tier 3: Strategy";
    default:
      return "Unknown Tier";
  }
};

export function AgentGrid({ agents }: AgentGridProps) {
  const agentsByTier = agents.reduce((acc, agent) => {
    if (!acc[agent.tier]) acc[agent.tier] = [];
    acc[agent.tier].push(agent);
    return acc;
  }, {} as Record<number, Agent[]>);

  return (
    <div className="space-y-6">
      {Object.entries(agentsByTier)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([tier, tierAgents]) => (
          <div key={tier}>
            <h3 className="text-lg font-semibold mb-3">{getTierTitle(Number(tier))}</h3>
            <div className="space-y-3">
              {tierAgents.map((agent) => {
                const IconComponent = agent.icon;
                return (
                  <Card key={agent.id} className="relative overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <CardTitle className="text-sm">{agent.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                          <Badge variant="outline" className="text-xs">
                            {agent.confidence}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          {agent.lastAction}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Confidence</span>
                            <span>{agent.confidence}%</span>
                          </div>
                          <Progress value={agent.confidence} className="h-1" />
                        </div>
                      </div>
                    </CardContent>
                    {/* Pulse effect for active agents */}
                    {agent.status === "active" && (
                      <div className="absolute -inset-0.5 bg-green-500/20 rounded-lg animate-pulse" />
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}