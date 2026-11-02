import {
  X,
  ExternalLink,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Link as LinkIcon,
  FileText,
  ChevronDown,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface NewsReport {
  id: string;
  title: string;
  source: string;
  url?: string;
  content?: string;
  timestamp: string;
  truthScore: number;
  status: "reliable" | "fake" | "uncertain";
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
  // relatedSources removed — no longer displayed in modal
}

interface NewsReportModalProps {
  report: NewsReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsReportModal({
  report,
  isOpen,
  onClose,
}: NewsReportModalProps) {
  if (!isOpen || !report) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reliable":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "fake":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "uncertain":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reliable":
        return (
          <CheckCircle className="w-6 h-6 text-green-400" />
        );
      case "fake":
        return (
          <AlertTriangle className="w-6 h-6 text-red-400" />
        );
      case "uncertain":
        return <Shield className="w-6 h-6 text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-500/20 overflow-hidden">
        {/* Neon glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 pointer-events-none"></div>

        {/* Header */}
        <div className="relative sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md border-b border-blue-500/20 p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200 border border-gray-700 hover:border-blue-500/50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pr-12">
            <div className="flex items-center space-x-3 mb-3">
              {getStatusIcon(report.status)}
              <Badge
                className={`${getStatusColor(report.status)} border capitalize px-3 py-1`}
              >
                {report.status}
              </Badge>
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {report.timestamp}
              </div>
            </div>

            <h2 className="text-2xl text-white mb-2 leading-tight">
              {report.title}
            </h2>

            <div className="flex items-center text-sm text-gray-400 space-x-4">
              <span className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-1" />
                {report.source}
              </span>
              {report.url && (
                <a
                  href={report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Source
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="h-[calc(90vh-180px)]">
          <div className="relative p-6 space-y-6">
            {/* Truth Score Card */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Overall Truth Score
                </h3>
                <div
                  className={`text-4xl ${getScoreColor(report.truthScore)}`}
                >
                  {report.truthScore}%
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreBgColor(report.truthScore)} rounded-full transition-all duration-500 shadow-lg`}
                    style={{ width: `${report.truthScore}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>

                <p className="text-gray-400 text-sm">
                  {report.summary}
                </p>
              </div>
            </div>

            {/* Analysis Breakdown */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg text-white mb-4 flex items-center">
                <ChevronDown className="w-5 h-5 mr-2 text-blue-400" />
                Detailed Analysis Breakdown
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300 text-sm">
                      Source Credibility
                    </span>
                    <span
                      className={`${getScoreColor(report.analysisDetails.sourceCredibility)}`}
                    >
                      {report.analysisDetails.sourceCredibility}
                      %
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreBgColor(report.analysisDetails.sourceCredibility)} rounded-full transition-all duration-500`}
                      style={{
                        width: `${report.analysisDetails.sourceCredibility}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300 text-sm">
                      Factual Accuracy
                    </span>
                    <span
                      className={`${getScoreColor(report.analysisDetails.factualAccuracy)}`}
                    >
                      {report.analysisDetails.factualAccuracy}%
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreBgColor(report.analysisDetails.factualAccuracy)} rounded-full transition-all duration-500`}
                      style={{
                        width: `${report.analysisDetails.factualAccuracy}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300 text-sm">
                      Bias Detection
                    </span>
                    <span
                      className={`${getScoreColor(report.analysisDetails.biasDetection)}`}
                    >
                      {report.analysisDetails.biasDetection}%
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreBgColor(report.analysisDetails.biasDetection)} rounded-full transition-all duration-500`}
                      style={{
                        width: `${report.analysisDetails.biasDetection}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300 text-sm">
                      Language Analysis
                    </span>
                    <span
                      className={`${getScoreColor(report.analysisDetails.languageAnalysis)}`}
                    >
                      {report.analysisDetails.languageAnalysis}%
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreBgColor(report.analysisDetails.languageAnalysis)} rounded-full transition-all duration-500`}
                      style={{
                        width: `${report.analysisDetails.languageAnalysis}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Findings */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                Key Findings
              </h3>
              <ul className="space-y-2">
                {report.keyFindings.map((finding, index) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-300 text-sm"
                  >
                    <span className="text-blue-400 mr-2 mt-1">
                      •
                    </span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            {report.redFlags.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg text-red-400 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Red Flags Detected
                </h3>
                <ul className="space-y-2">
                  {report.redFlags.map((flag, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-300 text-sm"
                    >
                      <span className="text-red-400 mr-2 mt-1">
                        ⚠
                      </span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Verified Facts */}
            {report.verifiedFacts.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg text-green-400 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verified Facts
                </h3>
                <ul className="space-y-2">
                  {report.verifiedFacts.map((fact, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-300 text-sm"
                    >
                      <span className="text-green-400 mr-2 mt-1">
                        ✓
                      </span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related sources removed from modal per requirement */}

            {/* Article Content */}
            {report.content && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg text-white mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-400" />
                  Article Content
                </h3>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {report.content}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}