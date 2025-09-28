"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Activity, Brain, Clock, Download, FileText, Target, TrendingUp, X } from "lucide-react";

interface DetailedAnalysisResult {
  id: string;
  timestamp: string;
  saved_at: string;
  analysis_type: string;
  market_data: any;
  intelligence_results: any;
  analysis_results: any;
  tiers_completed: string[];
  agents_involved: {
    tier1: string[];
    tier2: string[];
    tier3?: string[];
  };
  status: string;
}

interface DetailedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: DetailedAnalysisResult | null;
}

export function DetailedAnalysisModal({ isOpen, onClose, analysis }: DetailedAnalysisModalProps) {
  if (!analysis) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleExportPDF = async () => {
    try {
      // Dynamically import jsPDF to avoid SSR issues
      const { jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addWrappedText = (text: string, y: number, fontSize = 10, maxLineWidth = maxWidth) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxLineWidth);
        lines.forEach((line: string, index: number) => {
          if (y + (index * 5) > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y + (index * 5));
        });
        return y + (lines.length * 5) + 5;
      };

      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Trading Analysis Report', margin, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date(analysis.timestamp).toLocaleString()}`, margin, yPosition);
      yPosition += 10;
      doc.text(`Analysis ID: ${analysis.id}`, margin, yPosition);
      yPosition += 15;

      // Market Data Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Market Data Snapshot', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      if (typeof analysis.market_data === 'object' && analysis.market_data !== null) {
        Object.entries(analysis.market_data).forEach(([key, value]) => {
          if (typeof value === 'number') {
            doc.text(`${key}: ${formatPrice(value)}`, margin, yPosition);
            yPosition += 6;
          } else if (typeof value === 'object' && value !== null) {
            doc.text(`${key}:`, margin, yPosition);
            yPosition += 6;
            Object.entries(value as any).forEach(([subKey, subValue]) => {
              doc.text(`  ${subKey}: ${subValue}`, margin + 10, yPosition);
              yPosition += 5;
            });
            yPosition += 3;
          }
        });
      }
      yPosition += 10;

      // Intelligence Results
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Intelligence Analysis (Tier 1)', margin, yPosition);
      yPosition += 10;

      if (Array.isArray(analysis.intelligence_results)) {
        analysis.intelligence_results.forEach((result: any) => {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          yPosition = addWrappedText(`Agent: ${result.role}`, yPosition, 12);
          yPosition += 3;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          yPosition = addWrappedText(result.content, yPosition);
          yPosition += 8;
        });
      } else if (typeof analysis.intelligence_results === 'string') {
        yPosition = addWrappedText(analysis.intelligence_results, yPosition);
        yPosition += 10;
      }

      // Analysis Results
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Technical Analysis (Tier 2)', margin, yPosition);
      yPosition += 10;

      if (Array.isArray(analysis.analysis_results)) {
        analysis.analysis_results.forEach((result: any) => {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          yPosition = addWrappedText(`Agent: ${result.role}`, yPosition, 12);
          yPosition += 3;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          yPosition = addWrappedText(result.content, yPosition);
          yPosition += 8;
        });
      } else if (typeof analysis.analysis_results === 'string') {
        yPosition = addWrappedText(analysis.analysis_results, yPosition);
        yPosition += 10;
      }

      // Agents Involved
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Agents Involved', margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (analysis.agents_involved.tier1) {
        doc.text(`Tier 1 (Intelligence): ${analysis.agents_involved.tier1.join(', ')}`, margin, yPosition);
        yPosition += 6;
      }
      if (analysis.agents_involved.tier2) {
        doc.text(`Tier 2 (Analysis): ${analysis.agents_involved.tier2.join(', ')}`, margin, yPosition);
        yPosition += 6;
      }
      if (analysis.agents_involved.tier3) {
        doc.text(`Tier 3 (Strategy): ${analysis.agents_involved.tier3.join(', ')}`, margin, yPosition);
        yPosition += 6;
      }

      // Save the PDF
      const fileName = `trading-analysis-${analysis.id.split('_')[1]}-${analysis.id.split('_')[2]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };


  const renderMarketData = (marketData: any) => {
    if (typeof marketData === 'object' && marketData !== null) {
      const entries = Object.entries(marketData);

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(([key, value]) => {
            if (typeof value === 'number') {
              return (
                <div key={key} className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3a3a3a]">
                  <div className="text-xs text-[#a0a0a0] mb-1 font-medium">{key}</div>
                  <div className="text-lg font-bold text-white">{formatPrice(value)}</div>
                </div>
              );
            } else if (typeof value === 'object' && value !== null) {
              return (
                <div key={key} className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3a3a3a] col-span-full">
                  <div className="text-sm text-[#a0a0a0] mb-2 font-medium">{key}</div>
                  <div className="space-y-1 text-xs text-[#e0e0e0]">
                    {Object.entries(value as any).map(([subKey, subValue]) => (
                      <div key={subKey} className="flex justify-between">
                        <span>{subKey}:</span>
                        <span className="font-mono">{String(subValue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return <div className="text-[#a0a0a0]">No market data available</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-none sm:max-w-none md:max-w-none lg:max-w-none xl:max-w-none 2xl:max-w-none w-screen h-[92vh] overflow-hidden bg-[#0a0a0a] border-[#2a2a2a] text-white flex flex-col"
        style={{ maxWidth: "min(98vw, 1600px)", width: "100vw", height: "92vh" }}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-[#2a2a2a] pb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 lg:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
                <span>Detailed Analysis Report</span>
                <span className="text-sm sm:text-base lg:text-lg font-normal text-gray-400 hidden lg:block">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {new Date(analysis.timestamp).toLocaleString()}
                </span>
              </div>
            </DialogTitle>
            <div className="flex items-center gap-2 lg:gap-4">
              <Button
                onClick={handleExportPDF}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button
                onClick={onClose}
                size="sm"
                variant="ghost"
                className="text-[#a0a0a0] hover:text-white px-2 lg:px-4 py-1 lg:py-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Unified Container: Analysis Overview + Detailed Results */}
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Analysis Overview</h3>

                {/* Analysis Info Banner */}
                <div className="bg-[#2a2a2a] rounded-xl p-4 lg:p-6 border border-[#3a3a3a] mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-[#a0a0a0] text-xs">Analysis ID</span>
                      <div className="font-mono text-white text-sm">{analysis.id.split('_').slice(-2).join('_')}</div>
                    </div>
                    <div>
                      <span className="text-[#a0a0a0] text-xs">Status</span>
                      <div className="text-white text-sm capitalize">{analysis.status.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-[#a0a0a0] text-xs">Type</span>
                      <div className="text-white text-sm capitalize">{analysis.analysis_type.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-[#a0a0a0] text-xs">Tiers Completed</span>
                      <div className="flex gap-1 mt-1">
                        {analysis.tiers_completed.map((tier) => (
                          <Badge key={tier} variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 px-2 py-0.5">
                            {tier.replace('tier', '').replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Data Section */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Market Data Snapshot
                  </h4>
                  <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
                    {renderMarketData(analysis.market_data)}
                  </div>
                </div>

                {/* Agent Analysis Stream */}
                <div className="space-y-8">
                  <div className="pb-4 border-b border-[#2a2a2a]">
                    <h3 className="text-xl font-bold">Detailed Agent Analysis</h3>
                    <p className="text-gray-400 text-sm mt-1">Complete agent reports and reasoning</p>
                  </div>

                  {/* Intelligence Results */}
                  {analysis.intelligence_results && (
                    <div>
                      <h4 className="text-lg font-semibold text-green-400 mb-6 flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Intelligence Analysis (Tier 1)
                      </h4>
                      {Array.isArray(analysis.intelligence_results) ? (
                        <div className="space-y-6">
                          {analysis.intelligence_results.map((result: any, index: number) => (
                            <div
                              key={index}
                              className="border border-[#2a2a2a] rounded-xl p-4 lg:p-6 bg-gradient-to-r from-[#1a1a1a] to-[#1f1f1f] hover:border-[#3a3a3a] transition-all hover:shadow-lg"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 lg:mb-4 gap-3">
                                <div className="flex items-center gap-3 lg:gap-4">
                                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center bg-green-500/20">
                                    <Brain className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-base lg:text-lg text-white">{result.role || `Agent ${index + 1}`}</div>
                                    <div className="text-xs lg:text-sm text-[#a0a0a0]">Tier 1 Intelligence</div>
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1 text-xs">
                                  Intelligence
                                </Badge>
                              </div>
                              <div className="text-sm lg:text-base text-[#e0e0e0] leading-relaxed whitespace-pre-wrap bg-[#0a0a0a] rounded-lg p-4 border border-[#3a3a3a]">
                                {result.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-[#2a2a2a] rounded-xl p-6 bg-[#1a1a1a]">
                          <div className="text-sm text-[#e0e0e0] leading-relaxed whitespace-pre-wrap">
                            {analysis.intelligence_results}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Analysis Results */}
                  {analysis.analysis_results && (
                    <div>
                      <h4 className="text-lg font-semibold text-blue-400 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Technical Analysis (Tier 2)
                      </h4>
                      {Array.isArray(analysis.analysis_results) ? (
                        <div className="space-y-6">
                          {analysis.analysis_results.map((result: any, index: number) => (
                            <div
                              key={index}
                              className="border border-[#2a2a2a] rounded-xl p-4 lg:p-6 bg-gradient-to-r from-[#1a1a1a] to-[#1f1f1f] hover:border-[#3a3a3a] transition-all hover:shadow-lg"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 lg:mb-4 gap-3">
                                <div className="flex items-center gap-3 lg:gap-4">
                                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center bg-blue-500/20">
                                    <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-base lg:text-lg text-white">{result.role || `Agent ${index + 1}`}</div>
                                    <div className="text-xs lg:text-sm text-[#a0a0a0]">Tier 2 Analysis</div>
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1 text-xs">
                                  Analysis
                                </Badge>
                              </div>
                              <div className="text-sm lg:text-base text-[#e0e0e0] leading-relaxed whitespace-pre-wrap bg-[#0a0a0a] rounded-lg p-4 border border-[#3a3a3a]">
                                {result.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-[#2a2a2a] rounded-xl p-6 bg-[#1a1a1a]">
                          <div className="text-sm text-[#e0e0e0] leading-relaxed whitespace-pre-wrap">
                            {analysis.analysis_results}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Agents Summary */}
                  <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      AI Agents Involved
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analysis.agents_involved.tier1 && (
                        <div>
                          <p className="text-sm text-green-400 font-medium mb-3">Tier 1: Intelligence Gathering</p>
                          <div className="space-y-2">
                            {analysis.agents_involved.tier1.map((agent) => (
                              <div key={agent} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                <div className="text-sm font-medium text-green-400 capitalize">
                                  {agent.replace('_', ' ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysis.agents_involved.tier2 && (
                        <div>
                          <p className="text-sm text-blue-400 font-medium mb-3">Tier 2: Analysis & Processing</p>
                          <div className="space-y-2">
                            {analysis.agents_involved.tier2.map((agent) => (
                              <div key={agent} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                <div className="text-sm font-medium text-blue-400 capitalize">
                                  {agent.replace('_', ' ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysis.agents_involved.tier3 && (
                        <div>
                          <p className="text-sm text-purple-400 font-medium mb-3">Tier 3: Strategy & Execution</p>
                          <div className="space-y-2">
                            {analysis.agents_involved.tier3.map((agent) => (
                              <div key={agent} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                <div className="text-sm font-medium text-purple-400 capitalize">
                                  {agent.replace('_', ' ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}