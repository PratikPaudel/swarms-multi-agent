"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";

interface Decision {
  timestamp: string;
  asset: string;
  action: string;
  confidence: number;
  reasoning: string;
}

interface DecisionPanelProps {
  decisions: Decision[];
}

const getActionIcon = (action: string) => {
  switch (action.toUpperCase()) {
    case "BUY":
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "SELL":
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    case "HOLD":
      return <Minus className="w-4 h-4 text-yellow-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

const getActionColor = (action: string) => {
  switch (action.toUpperCase()) {
    case "BUY":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "SELL":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "HOLD":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 85) return "text-green-500";
  if (confidence >= 70) return "text-yellow-500";
  return "text-red-500";
};

export function DecisionPanel({ decisions }: DecisionPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Trading Decisions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {decisions.map((decision, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getActionIcon(decision.action)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{decision.asset}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getActionColor(decision.action)}`}
                        >
                          {decision.action}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {decision.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getConfidenceColor(decision.confidence)}`}>
                      {decision.confidence}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      confidence
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Agent Reasoning:
                  </div>
                  <div className="text-sm">{decision.reasoning}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}