"use client";

import * as React from "react";
import { BarChart3, Vote, Menu, X, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimpleSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  {
    title: "Coin Analytics",
    icon: BarChart3,
    id: "coin-analytics",
  },
  {
    title: "Decision Hub",
    icon: Vote,
    id: "decision-hub",
  },
  {
    title: "Analysis History",
    icon: History,
    id: "analysis-history",
  },
];

export function SimpleSidebar({ activeTab, setActiveTab }: SimpleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className={cn(
      "flex flex-col bg-[#111111] border-r border-[#2a2a2a] transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start transition-all duration-200",
                isCollapsed ? "px-2" : "px-4",
                activeTab === item.id
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && <span>{item.title}</span>}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}