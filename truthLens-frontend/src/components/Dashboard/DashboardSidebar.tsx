import { cn } from "../ui/utils";
import { Home, Search, FileText, TrendingUp, Shield, ChevronRight } from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface DashboardSidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

export default function DashboardSidebar({ activeItem, onItemClick }: DashboardSidebarProps) {
  const sidebarItems: SidebarItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
      active: activeItem === "home"
    },
    {
      id: "detect",
      label: "Detect News",
      icon: <Search className="w-5 h-5" />,
      active: activeItem === "detect"
    },
    {
      id: "reports",
      label: "My Reports",
      icon: <FileText className="w-5 h-5" />,
      active: activeItem === "reports"
    },
    {
      id: "trends",
      label: "Trend Visualization",
      icon: <TrendingUp className="w-5 h-5" />,
      active: activeItem === "trends"
    },
    {
      id: "credibility",
      label: "Credibility Scores",
      icon: <Shield className="w-5 h-5" />,
      active: activeItem === "credibility"
    }
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              item.active
                ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 text-white shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-800/50"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
              item.active
                ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                : "bg-gray-700 group-hover:bg-gray-600"
            )}>
              {item.icon}
            </div>
            <span className="font-medium flex-1 text-left">{item.label}</span>
            {item.active && (
              <ChevronRight className="w-4 h-4 text-blue-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mt-8">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Articles Analyzed</span>
              <span className="text-blue-400 font-semibold">127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Accuracy Rate</span>
              <span className="text-green-400 font-semibold">98.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Fake News Detected</span>
              <span className="text-red-400 font-semibold">23</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}