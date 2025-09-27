"use client";

import * as React from "react";
import { BarChart3, Vote, Menu, X } from "lucide-react";
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
];

export function SimpleSidebar({ activeTab, setActiveTab }: SimpleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className={cn(
      "flex flex-col bg-muted/10 border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Navigation</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
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
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed ? "px-2" : "px-4"
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