import { Separator } from "./ui/separator";
import { Twitter, Facebook, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">
              Truth<span className="text-blue-400">Lens</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering truth through AI-powered fact-checking and source verification. 
              Join the fight against misinformation with cutting-edge technology.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>contact@truthlens.ai</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-800 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 TruthLens. All rights reserved. | 
            <a href="#" className="hover:text-blue-400 transition-colors ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-blue-400 transition-colors ml-1">Terms of Service</a>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}