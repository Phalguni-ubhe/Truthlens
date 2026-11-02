// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Textarea } from "../ui/textarea";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { Link, FileText, Loader2 } from "lucide-react";
// import NewsReportModal from "../NewsReportModal";

// interface NewsReport {
//   id: string;
//   title: string;
//   source: string;
//   url?: string;
//   content?: string;
//   timestamp: string;
//   truthScore: number;
//   status: 'reliable' | 'fake' | 'uncertain';
//   summary: string;
//   analysisDetails: {
//     sourceCredibility: number;
//     factualAccuracy: number;
//     biasDetection: number;
//     languageAnalysis: number;
//   };
//   keyFindings: string[];
//   redFlags: string[];
//   verifiedFacts: string[];
//   // relatedSources removed — submit card doesn't provide related resources
// }

// export default function SubmitCard() {
//   const [url, setUrl] = useState("");
//   const [text, setText] = useState("");
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [selectedReport, setSelectedReport] = useState<NewsReport | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const generateMockReport = (title: string, source: string, url?: string, content?: string): NewsReport => {
//     const truthScore = Math.floor(Math.random() * 100);
//     const status: 'reliable' | 'fake' | 'uncertain' = 
//       truthScore >= 80 ? 'reliable' : truthScore >= 60 ? 'uncertain' : 'fake';

//     return {
//       id: `report-${Date.now()}`,
//       title,
//       source,
//       url,
//       content,
//       timestamp: 'Just now',
//       truthScore,
//       status,
//       summary: status === 'reliable' 
//         ? 'Analysis shows high credibility with verified sources and factual consistency.'
//         : status === 'uncertain'
//         ? 'Mixed signals detected. Some claims need additional verification.'
//         : 'Multiple red flags detected. Exercise caution with this content.',
//       analysisDetails: {
//         sourceCredibility: Math.floor(Math.random() * 100),
//         factualAccuracy: Math.floor(Math.random() * 100),
//         biasDetection: Math.floor(Math.random() * 100),
//         languageAnalysis: Math.floor(Math.random() * 100),
//       },
//       keyFindings: [
//         'Content analyzed using advanced NLP algorithms',
//         'Cross-referenced with multiple fact-checking databases',
//         'Source reputation and historical accuracy assessed',
//         'Language patterns and emotional manipulation indicators checked',
//       ],
//       redFlags: status === 'fake' ? [
//         'Unverified claims detected in the content',
//         'Source has history of unreliable reporting',
//         'Sensational language patterns identified',
//       ] : [],
//       verifiedFacts: status === 'reliable' ? [
//         'Claims supported by reputable sources',
//         'Statistical data verified through official channels',
//         'No contradictions found with established facts',
//       ] : [],
//       // relatedSources removed
//     };
//   };

//   const handleAnalyzeUrl = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!url.trim()) return;
    
//     setIsAnalyzing(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     const report = generateMockReport(
//       'Article from ' + new URL(url).hostname,
//       new URL(url).hostname,
//       url
//     );
    
//     setSelectedReport(report);
//     setIsModalOpen(true);
//     setIsAnalyzing(false);
//     setUrl("");
//   };

//   const handleAnalyzeText = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!text.trim()) return;
    
//     setIsAnalyzing(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     const title = text.split('\n')[0].substring(0, 100) + (text.length > 100 ? '...' : '');
//     const report = generateMockReport(
//       title || 'Analyzed Text Content',
//       'Direct Text Input',
//       undefined,
//       text
//     );
    
//     setSelectedReport(report);
//     setIsModalOpen(true);
//     setIsAnalyzing(false);
//     setText("");
//   };

//   return (
//     <Card className="bg-gray-800/50 border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
//       <CardHeader className="pb-4">
//         <CardTitle className="text-xl text-white flex items-center">
//           <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
//             <FileText className="w-4 h-4 text-white" />
//           </div>
//           Submit an Article or URL
//         </CardTitle>
//         <CardDescription className="text-gray-400">
//           Analyze news articles, social media posts, or any content for authenticity and credibility
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <Tabs defaultValue="url" className="space-y-4">
//           <TabsList className="grid w-full grid-cols-2 bg-gray-700">
//             <TabsTrigger value="url" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
//               <Link className="w-4 h-4 mr-2" />
//               URL Analysis
//             </TabsTrigger>
//             <TabsTrigger value="text" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
//               <FileText className="w-4 h-4 mr-2" />
//               Text Analysis
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="url" className="space-y-4">
//             <form onSubmit={handleAnalyzeUrl} className="space-y-4">
//               <div>
//                 <Input
//                   type="url"
//                   placeholder="https://example.com/news-article"
//                   value={url}
//                   onChange={(e) => setUrl(e.target.value)}
//                   className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
//                   disabled={isAnalyzing}
//                 />
//               </div>
//               <Button
//                 type="submit"
//                 disabled={!url.trim() || isAnalyzing}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
//               >
//                 {isAnalyzing ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Analyzing...
//                   </>
//                 ) : (
//                   "Analyze URL"
//                 )}
//               </Button>
//             </form>
//           </TabsContent>

//           <TabsContent value="text" className="space-y-4">
//             <form onSubmit={handleAnalyzeText} className="space-y-4">
//               <div>
//                 <Textarea
//                   placeholder="Paste the article text or content you want to analyze..."
//                   value={text}
//                   onChange={(e) => setText(e.target.value)}
//                   className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 min-h-[120px] resize-none"
//                   disabled={isAnalyzing}
//                 />
//               </div>
//               <Button
//                 type="submit"
//                 disabled={!text.trim() || isAnalyzing}
//                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
//               >
//                 {isAnalyzing ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Analyzing...
//                   </>
//                 ) : (
//                   "Analyze Text"
//                 )}
//               </Button>
//             </form>
//           </TabsContent>
//         </Tabs>

//         {/* Quick Tips */}
//         <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
//           <h4 className="text-sm font-semibold text-white mb-2">Analysis Tips:</h4>
//           <ul className="text-xs text-gray-400 space-y-1">
//             <li>• URLs are analyzed for source credibility and content authenticity</li>
//             <li>• Text analysis checks for misinformation patterns and bias indicators</li>
//             <li>• Results include credibility scores and detailed breakdowns</li>
//           </ul>
//         </div>
//       </CardContent>

//       <NewsReportModal
//         report={selectedReport}
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </Card>
//   );
// }

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Link, FileText, Loader2 } from "lucide-react";
// We no longer need the modal or mock data, so those imports are removed

// --- MODIFIED: Define the props we get from Dashboard.tsx ---
interface SubmitCardProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

export default function SubmitCard({ onSubmit, isLoading }: SubmitCardProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  // --- REMOVED: All local state for analyzing, modal, and reports ---
  // const [isAnalyzing, setIsAnalyzing] = useState(false); (now comes from props)
  // const [selectedReport, setSelectedReport] = useState<NewsReport | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // --- REMOVED: Mock report generation function ---

  // --- MODIFIED: This form now calls the 'onSubmit' prop ---
  const handleAnalyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    // Pass the URL string to the parent (Dashboard) for API submission
    onSubmit(url); 
    setUrl("");
  };

  // --- MODIFIED: This form now calls the 'onSubmit' prop ---
  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Pass the text string to the parent (Dashboard) for API submission
    onSubmit(text);
    setText("");
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-white flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
            <FileText className="w-4 h-4 text-white" />
          </div>
          Submit an Article or URL
        </CardTitle>
        <CardDescription className="text-gray-400">
          Analyze news articles, social media posts, or any content for authenticity and credibility
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="url" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="url" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Link className="w-4 h-4 mr-2" />
              URL Analysis
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Text Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <form onSubmit={handleAnalyzeUrl} className="space-y-4">
              <div>
                <Input
                  type="url"
                  placeholder="https://example.com/news-article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading} // <-- Use prop
                />
              </div>
              <Button
                type="submit"
                disabled={!url.trim() || isLoading} // <-- Use prop
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              >
                {isLoading ? ( // <-- Use prop
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze URL"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <form onSubmit={handleAnalyzeText} className="space-y-4">
              <div>
                <Textarea
                  placeholder="Paste the article text or content you want to analyze..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 min-h-[120px] resize-none"
                  disabled={isLoading} // <-- Use prop
                />
              </div>
              <Button
                type="submit"
                disabled={!text.trim() || isLoading} // <-- Use prop
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              >
                {isLoading ? ( // <-- Use prop
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Text"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Quick Tips (unchanged) */}
        <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
          <h4 className="text-sm font-semibold text-white mb-2">Analysis Tips:</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• URLs are analyzed for source credibility and content authenticity</li>
            <li>• Text analysis checks for misinformation patterns and bias indicators</li>
            <li>• Results include credibility scores and detailed breakdowns</li>
          </ul>
        </div>
      </CardContent>

      {/* --- REMOVED: NewsReportModal --- */}
      {/* The Dashboard component now handles showing the results */}
    </Card>
  );
}