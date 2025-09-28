"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, Clock, Minus, Target, TrendingDown, TrendingUp } from "lucide-react";

interface AnalysisResult {
  id: string;
  timestamp: string;
  saved_at: string;
  analysis_type: string;
  market_data: {
    BTC: number;
    ETH: number;
    SOL: number;
    BNB: number;
  };
  intelligence_results: string;
  analysis_results: string;
  tiers_completed: string[];
  agents_involved: {
    tier1: string[];
    tier2: string[];
  };
  status: string;
}

interface AnalysisHistoryProps {
  analysisHistory: AnalysisResult[];
}

export function AnalysisHistory({ analysisHistory }: AnalysisHistoryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getMarketTrend = (marketData: any) => {
    // Simple trend calculation (in real implementation, compare with previous data)
    const btcPrice = marketData?.BTC || 0;
    if (btcPrice > 45000) return 'bullish';
    if (btcPrice < 42000) return 'bearish';
    return 'neutral';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'bearish':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  if (analysisHistory.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-50 text-[#a0a0a0]" />
          <h3 className="text-xl font-semibold mb-2 text-white">No Analysis History</h3>
          <p className="text-[#a0a0a0] mb-4">
            Run some market analysis using the Decision Theater to see results here.
          </p>
          <Badge variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-[#a0a0a0]">
            Analysis results will appear automatically
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0a0a0a] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#2a2a2a]">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Analysis History</h2>
            <p className="text-[#a0a0a0] text-base">
              Previous market intelligence & analysis results from AI agents
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white px-4 py-2 text-sm">
              <Brain className="w-4 h-4 mr-2" />
              {analysisHistory.length} Analysis Results
            </Badge>
          </div>
        </div>

        {/* Analysis Cards Grid */}
        <div className="space-y-6">
          {analysisHistory.map((analysis) => {
            const trend = getMarketTrend(analysis.market_data);

            return (
              <Card
                key={analysis.id}
                className="bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-200 shadow-lg hover:shadow-xl rounded-2xl"
              >
                <CardHeader className="pt-6 pb-6 md:pb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                        <Brain className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white mb-1">
                          Market Intelligence Analysis
                        </CardTitle>
                        <p className="text-sm text-[#a0a0a0] flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(analysis.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`border px-3 py-1 ${getTrendColor(trend)}`}
                      >
                        {getTrendIcon(trend)}
                        <span className="ml-2 capitalize font-medium">{trend}</span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-[#2a2a2a] border-[#3a3a3a] text-[#a0a0a0] px-3 py-1"
                      >
                        <Activity className="w-3 h-3 mr-1" />
                        {analysis.tiers_completed.length} Tiers Completed
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-10 pt-0">
                  {/* Market Data Summary */}
                  <div className="bg-[#0f0f0f] rounded-xl p-7 border border-[#2a2a2a]">
                    <h4 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      Market Snapshot
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {Object.entries(analysis.market_data).map(([symbol, price]) => (
                        <div
                          key={symbol}
                          className="bg-[#1a1a1a] rounded-xl p-5 md:p-6 border border-[#3a3a3a] hover:border-[#4a4a4a] transition-colors"
                        >
                          <div className="text-xs text-[#a0a0a0] mb-2 font-medium">{symbol}</div>
                          <div className="text-2xl font-bold text-white">
                            {formatPrice(price as number)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Intelligence & Analysis Results Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Intelligence Results */}
                    <div className="bg-[#0f0f0f] rounded-xl p-6 md:p-7 border border-[#2a2a2a]">
                      <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Intelligence (Tier 1)
                      </h4>
                      <div className="text-sm text-[#e0e0e0] bg-[#1a1a1a] rounded-lg p-5 border border-[#3a3a3a] leading-relaxed">
                        {analysis.intelligence_results?.slice(0, 250)}
                        {analysis.intelligence_results?.length > 250 && "..."}
                      </div>
                    </div>

                    {/* Analysis Results */}
                    <div className="bg-[#0f0f0f] rounded-xl p-6 md:p-7 border border-[#2a2a2a]">
                      <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Technical Analysis (Tier 2)
                      </h4>
                      <div className="text-sm text-[#e0e0e0] bg-[#1a1a1a] rounded-lg p-5 border border-[#3a3a3a] leading-relaxed">
                        {analysis.analysis_results?.slice(0, 250)}
                        {analysis.analysis_results?.length > 250 && "..."}
                      </div>
                    </div>
                  </div>

                  {/* Agents Involved */}
                  <div className="bg-[#0f0f0f] rounded-xl p-6 md:p-7 border border-[#2a2a2a]">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      AI Agents Involved
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-green-400 font-medium mb-2">Tier 1: Intelligence Gathering</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.agents_involved?.tier1?.map((agent) => (
                            <Badge
                              key={agent}
                              variant="outline"
                              className="bg-green-500/10 border-green-500/30 text-green-400 text-sm px-3 py-1.5"
                            >
                              {agent.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-blue-400 font-medium mb-2">Tier 2: Analysis & Processing</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.agents_involved?.tier2?.map((agent) => (
                            <Badge
                              key={agent}
                              variant="outline"
                              className="bg-blue-500/10 border-blue-500/30 text-blue-400 text-sm px-3 py-1.5"
                            >
                              {agent.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}