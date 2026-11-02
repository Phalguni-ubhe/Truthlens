import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Shield, BarChart3, Search } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Search className="w-12 h-12 text-blue-400" />,
      title: "Fake News Detection",
      description: "Advanced AI algorithms analyze content patterns, source reliability, and cross-reference facts to identify misinformation in real-time."
    },
    {
      icon: <Shield className="w-12 h-12 text-cyan-400" />,
      title: "Source Credibility Scoring", 
      description: "Get instant credibility ratings for news sources based on historical accuracy, editorial standards, and transparency metrics."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-purple-400" />,
      title: "Trend Visualization",
      description: "Interactive dashboards show misinformation patterns, trending false narratives, and fact-check statistics across topics."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powered by <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI Intelligence</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our cutting-edge technology combines machine learning, natural language processing, 
            and real-time data analysis to combat misinformation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-500/20"
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-xl text-white mb-2">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group">
            <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">
              99.2%
            </div>
            <div className="text-gray-400">Accuracy Rate</div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
              50M+
            </div>
            <div className="text-gray-400">Articles Analyzed</div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">
              1.2s
            </div>
            <div className="text-gray-400">Avg Response Time</div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">
              24/7
            </div>
            <div className="text-gray-400">Real-time Monitoring</div>
          </div>
        </div>
      </div>
    </section>
  );
}