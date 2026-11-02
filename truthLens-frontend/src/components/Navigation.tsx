import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export default function Navigation({ onLoginClick, onSignupClick }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white">
              Truth<span className="text-blue-400">Lens</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">
              Features
            </a>
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-blue-400"
              onClick={onLoginClick}
            >
              Login
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onSignupClick}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 border-t border-gray-800">
              <a
                href="#about"
                className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                About
              </a>
              <a
                href="#features" 
                className="block px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                Features
              </a>
              <div className="px-3 py-2 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-300 hover:text-blue-400"
                  onClick={onLoginClick}
                >
                  Login
                </Button>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={onSignupClick}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}