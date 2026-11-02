import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search, Settings, LogOut, User } from "lucide-react";

interface DashboardNavbarProps {
  onLogout: () => void;
  onProfileClick: () => void;
  onHomeClick?: () => void;
}

export default function DashboardNavbar({ onLogout, onProfileClick, onHomeClick }: DashboardNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="h-16 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-white">
          Truth<span className="text-blue-400">Lens</span>
        </div>
        {onHomeClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onHomeClick}
            className="text-gray-400 hover:text-blue-400 text-sm"
          >
            Home
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search articles, URLs, or enter content to analyze..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 w-full"
            />
          </div>
        </form>
      </div>

      {/* Right Side - Profile */}
      <div className="flex items-center space-x-4">
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-gray-600 hover:border-blue-400 transition-colors">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-white">John Doe</p>
                <p className="w-[200px] truncate text-sm text-gray-400">
                  john.doe@example.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={onProfileClick}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="text-red-400 hover:text-red-300 hover:bg-gray-700"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}