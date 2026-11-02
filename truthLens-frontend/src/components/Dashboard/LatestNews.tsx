import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, ExternalLink, Eye } from "lucide-react";
import NewsReportModal from "../NewsReportModal";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  timestamp: string;
  truthScore: number;
  status: 'reliable' | 'fake' | 'uncertain';
  summary: string;
}

interface NewsReport {
  id: string;
  title: string;
  source: string;
  url?: string;
  content?: string;
  timestamp: string;
  truthScore: number;
  status: 'reliable' | 'fake' | 'uncertain';
  summary: string;
  analysisDetails: {
    sourceCredibility: number;
    factualAccuracy: number;
    biasDetection: number;
    languageAnalysis: number;
  };
  keyFindings: string[];
  redFlags: string[];
  verifiedFacts: string[];
  // relatedSources removed — not required for latest news modal
}

export default function LatestNews() {
  const [selectedReport, setSelectedReport] = useState<NewsReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "Breaking: Local Election Results Show Record Turnout",
      source: "Metro News Daily",
      url: "https://example.com/news1",
      timestamp: "2 hours ago",
      truthScore: 92,
      status: "reliable",
      summary: "Verified information from official election commission with multiple source confirmation."
    },
    {
      id: "2", 
      title: "Scientists Discover Revolutionary Energy Source",
      source: "Tech Today",
      url: "https://example.com/news2",
      timestamp: "4 hours ago",
      truthScore: 45,
      status: "uncertain",
      summary: "Claims require peer review. Some sources cite preliminary research without official confirmation."
    },
    {
      id: "3",
      title: "Celebrity Scandal Rocks Entertainment Industry",
      source: "Gossip Central",
      url: "https://example.com/news3", 
      timestamp: "6 hours ago",
      truthScore: 15,
      status: "fake",
      summary: "Multiple factual inconsistencies detected. No credible sources found to support claims."
    },
    {
      id: "4",
      title: "New Study Links Diet to Improved Memory",
      source: "Health Science Journal",
      url: "https://example.com/news4",
      timestamp: "8 hours ago",
      truthScore: 88,
      status: "reliable",
      summary: "Peer-reviewed research published in reputable medical journal with proper methodology."
    },
    {
      id: "5",
      title: "Market Volatility Expected Due to Policy Changes",
      source: "Financial Insider",
      url: "https://example.com/news5",
      timestamp: "10 hours ago",
      truthScore: 67,
      status: "uncertain",
      summary: "Based on speculation and unofficial sources. Awaiting official policy announcements."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reliable':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'fake':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'uncertain':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const convertToReport = (item: NewsItem): NewsReport => {
    return {
      id: item.id,
      title: item.title,
      source: item.source,
      url: item.url,
      timestamp: item.timestamp,
      truthScore: item.truthScore,
      status: item.status,
      summary: item.summary,
      analysisDetails: {
        sourceCredibility: item.status === 'reliable' ? 92 : item.status === 'uncertain' ? 65 : 35,
        factualAccuracy: item.status === 'reliable' ? 88 : item.status === 'uncertain' ? 60 : 25,
        biasDetection: item.status === 'reliable' ? 85 : item.status === 'uncertain' ? 55 : 40,
        languageAnalysis: item.status === 'reliable' ? 90 : item.status === 'uncertain' ? 70 : 30,
      },
      keyFindings: [
        'Content analyzed using advanced NLP algorithms',
        'Cross-referenced with multiple fact-checking databases',
        'Source reputation and historical accuracy assessed',
        'Language patterns and emotional manipulation indicators checked',
      ],
      redFlags: item.status === 'fake' ? [
        'Unverified claims detected in the content',
        'Source has history of unreliable reporting',
        'Sensational language patterns identified',
      ] : item.status === 'uncertain' ? [
        'Some claims require additional verification',
      ] : [],
      verifiedFacts: item.status === 'reliable' ? [
        'Claims supported by reputable sources',
        'Statistical data verified through official channels',
        'No contradictions found with established facts',
      ] : [],
      // relatedSources removed
    };
  };

  const handleViewDetails = (item: NewsItem) => {
    setSelectedReport(convertToReport(item));
    setIsModalOpen(true);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-white flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <Eye className="w-4 h-4 text-white" />
          </div>
          Latest Analyzed News
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="group p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-blue-500/50 hover:bg-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
            onClick={() => handleViewDetails(item)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <span>{item.source}</span>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.timestamp}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className={`text-lg font-bold ${getScoreColor(item.truthScore)}`}>
                  {item.truthScore}%
                </div>
                <Badge className={`${getStatusColor(item.status)} border capitalize font-medium`}>
                  {item.status}
                </Badge>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {item.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < Math.floor(item.truthScore / 20)
                          ? item.truthScore >= 80
                            ? 'bg-green-400'
                            : item.truthScore >= 60
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">Confidence</span>
              </div>

              <button 
                className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors group-hover:scale-105 transform duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(item);
                }}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Details
              </button>
            </div>
          </div>
        ))}

        <div className="text-center pt-4">
          <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
            View All Analyzed Articles →
          </button>
        </div>
      </CardContent>

      <NewsReportModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
}