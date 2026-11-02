import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroProps {
  onSignupClick?: () => void;
}

export default function Hero({ onSignupClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-900">
      {/* Background gradient glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              See the Truth,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Not the Noise
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Cut through misinformation with AI-powered fact-checking. TruthLens analyzes news sources, 
              detects fake content, and provides credibility scores to help you make informed decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg shadow-lg shadow-blue-500/25"
                onClick={onSignupClick}
              >
                Get Started
              </Button>
              {/* Removed "Learn More" button per request */}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581089778998-5266350efc71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHRlY2hub2xvZ3klMjBzY2FubmluZyUyMGRhdGF8ZW58MXx8fHwxNzU5MjA1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="AI technology scanning and analyzing data"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating elements for AI feel */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-70 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}