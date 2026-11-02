import { useState } from "react";
import { auth } from "../firebase/firebaseConfig"; 
import DashboardNavbar from "./Dashboard/DashboardNavbar";
import DashboardSidebar from "./Dashboard/DashboardSidebar";
import SubmitCard from "./Dashboard/SubmitCard";
import LatestNews from "./Dashboard/LatestNews";
import TrendVisualization from "./Dashboard/TrendVisualization";

// --- 1. IMPORT new components for the report ---
import { 
  Loader2, AlertCircle, CheckCircle, 
  Brain, Search, Clock // Add new icons
} from "lucide-react";
import { Badge } from "./ui/badge"; // Add Badge
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Add Card components
import { Label } from "./ui/label"; // Add Label
import { Separator } from "./ui/separator"; // Add Separator

// (Interface definitions - no changes)
interface AnalysisData {
  status: string;
  createdAt: string;
  credibilityScore: number | null;
  isFake: boolean | null;
  isVerified: boolean | null;
  content?: string;
  // Add nested types based on your JSON structure
  google_fact_check?: {
    message: string;
    status: string;
  };
  model_prediction?: {
    confidence: string;
    prediction: string;
  };
  prediction_source?: string;
}

interface DashboardProps {
  onLogout: () => void;
  onProfileClick: () => void;
  onHomeClick?: () => void;
}

export default function Dashboard({ onLogout, onProfileClick, onHomeClick }: DashboardProps) {
  // (State and API functions - no changes)
  const [activeItem, setActiveItem] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  
  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated. Please log in again.");
    }
    return await user.getIdToken();
  };
  
  const pollForResult = async (id: string) => {
    try {
      const token = await getAuthToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/detect/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch analysis status.");
      }

      const result = await response.json();

      switch (result.status) {
        case "completed":
          setIsLoading(false);
          setError(null);
          setAnalysisResult(result.data as AnalysisData);
          break;
        case "pending":
          setTimeout(() => pollForResult(id), 3000);
          break;
        case "error":
          setIsLoading(false);
          setError(result.error_details || "An error occurred during analysis.");
          break;
        default:
          // Handle the case where the status field doesn't exist yet
          setTimeout(() => pollForResult(id), 3000);
          break;
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  const handleNewsSubmit = async (content: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const token = await getAuthToken();

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submitNews`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit news.");
      }

      const data = await response.json(); 

      if (data.id) {
        pollForResult(data.id);
      } else {
        throw new Error("Did not receive an ID from the server.");
      }

    } catch (err: any) {
      setIsLoading(false);
      setError(err.message);
    }
  };


  const handleSidebarItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  // --- 2. MODIFY this component ---
  const renderMainContent = () => {
    
    // --- THIS IS THE COMPONENT TO CHANGE ---
    // const AnalysisResultDisplay = () => (
    //   <div className="mt-6">
    //     {isLoading && (
    //       <div className="flex items-center justify-center p-6 bg-gray-900/50 rounded-lg border border-gray-700 text-white">
    //         <Loader2 className="w-6 h-6 animate-spin mr-3" />
    //         <span>Analyzing... Please wait. This may take a moment.</span>
    //       </div>
    //     )}
    //     {error && (
    //       <div className="flex items-center p-4 bg-red-900/50 rounded-lg border border-red-700 text-red-300">
    //         <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
    //         <span>{error}</span>
    //       </div>
    //     )}

    //     {/* --- REPLACED <pre> TAG WITH THIS CARD --- */}
    //     {analysisResult && (
    //       <Card className="bg-gray-900/50 border-gray-700 text-white shadow-lg animate-in fade-in-50">
    //         <CardHeader>
    //           <CardTitle className="text-xl font-bold flex items-center justify-between">
    //             <div className="flex items-center">
    //               <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
    //               Analysis Complete
    //             </div>
    //             <span
    //               className={`text-lg font-semibold tracking-wide ${ // Slightly larger and bolder
    //                 analysisResult.model_prediction?.prediction === "REAL"
    //                   ? "text-green-400" // Bright green text
    //                   : "text-red-400" // Bright red text
    //               }`}
    //             >
    //               {analysisResult.model_prediction?.prediction || "N/A"}
    //             </span>
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent className="space-y-6">
              
    //           {/* Prediction Confidence */}
    //           <div>
    //             <Label className="text-sm text-gray-400">Truth Score (Model Confidence)</Label>
    //             <div className="flex items-center mt-2">
    //               <div className="w-full bg-gray-700 rounded-full h-2.5"> {/* Reverted to h-2.5 */}
    //                 <div 
    //                   className={`h-full rounded-full transition-all duration-700 ease-out 
    //                               bg-gradient-to-r from-blue-500 to-cyan-500`} // <-- CHANGED TO BLUE/CYAN GRADIENT
    //                   style={{ width: `${parseFloat(analysisResult.model_prediction?.confidence || "0") * 100}%` }}
    //                 ></div>
    //               </div>
    //               <span className="text-sm font-medium text-white ml-3 w-12 text-right"> {/* Reverted to text-sm */}
    //                 {(parseFloat(analysisResult.model_prediction?.confidence || "0") * 100).toFixed(0)}%
    //               </span>
    //             </div>
    //           </div>
              
    //           {/* Original Content */}
    //           <div className="space-y-2">
    //             <Label htmlFor="analyzed-content" className="text-sm text-gray-400">Analyzed Content</Label>
    //             <p 
    //               id="analyzed-content"
    //               className="text-gray-200 bg-gray-800 p-4 rounded-md border border-gray-700 max-h-32 overflow-y-auto"
    //             >
    //               {analysisResult.content}
    //             </p>
    //           </div>

    //           <Separator className="bg-gray-700" />

    //           {/* Details Grid */}
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
    //             {/* Google Fact Check */}
    //             <div className="space-y-2">
    //               <Label className="text-sm text-gray-400 flex items-center">
    //                 <Search className="w-4 h-4 mr-2" /> Google Fact Check
    //               </Label>
    //               <p className={`text-sm p-3 rounded-md border ${
    //                 analysisResult.google_fact_check?.status === 'not_found' 
    //                   ? "bg-yellow-900/30 border-yellow-700 text-yellow-300"
    //                   : "bg-gray-800 border-gray-700 text-gray-300"
    //               }`}>
    //                 {analysisResult.google_fact_check?.message || "No data"}
    //               </p>
    //             </div>

    //             {/* Model Details */}
    //            <div className="space-y-2">
    //               <Label className="text-sm text-gray-400 flex items-center">
    //                 <Brain className="w-4 h-4 mr-2" /> Analysis Model
    //               </Label>
    //               <p className="text-sm p-3 rounded-md border bg-gray-800 border-gray-700 text-gray-300">
    //                 {analysisResult.prediction_source === "BERT_MODEL" 
    //                   ? "TruthLens AI Model" 
    //                   : (analysisResult.prediction_source || "N/A")}
    //               </p>
    //             </div>
    //           </div>

    //           {/* Timestamp */}
    //           <div className="flex items-center text-xs text-gray-500 pt-4 border-t border-gray-700">
    //             <Clock className="w-3 h-3 mr-2" />
    //             Analyzed on: {new Date(analysisResult.createdAt).toLocaleString()}
    //           </div>
              
    //         </CardContent>
    //       </Card>
    //     )}
    //   </div>
    // );
    const AnalysisResultDisplay = () => {
      // Return null if there's no result to show
      if (!analysisResult) return null;

      // --- 1. Get all the data and check what exists ---
      const { 
        model_prediction, 
        google_fact_check, 
        prediction_source, 
        content, 
        createdAt 
      } = analysisResult;

      // Check if we have a model prediction to show
      const hasModelPrediction = model_prediction && model_prediction.prediction;
      
      // Determine the source
      let analysisSource = "N/A";
      if (prediction_source === "BERT_MODEL") {
        analysisSource = "TruthLens AI Model";
      } else if (google_fact_check?.status === 'found' && !prediction_source) {
        // If Google found something AND no model ran, list Google as the source
        analysisSource = "Google Fact Check";
      } else if (prediction_source) {
        // Fallback for other models
        analysisSource = prediction_source;
      }

      // Determine prediction and confidence
      const prediction = model_prediction?.prediction;
      const confidence = parseFloat(model_prediction?.confidence || "0") * 100;
      
      // Determine color for the prediction text
      let predictionColor = "text-gray-400"; // Default for N/A
      if (prediction === "REAL") predictionColor = "text-green-400";
      if (prediction === "FAKE") predictionColor = "text-red-400";

      return (
        <div className="mt-6">
          {isLoading && (
            <div className="flex items-center justify-center p-6 bg-gray-900/50 rounded-lg border border-gray-700 text-white">
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              <span>Analyzing... Please wait. This may take a moment.</span>
            </div>
          )}
          {error && (
            <div className="flex items-center p-4 bg-red-900/50 rounded-lg border border-red-700 text-red-300">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* --- This is the updated Card --- */}
          {analysisResult && !isLoading && (
            <Card className="bg-gray-900/50 border-gray-700 text-white shadow-lg animate-in fade-in-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                    Analysis Complete
                  </div>
                  
                  {/* --- 2. Conditionally show the prediction --- */}
                  <span className={`text-lg font-semibold tracking-wide ${predictionColor}`}>
                    {prediction || "N/A"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* --- 3. Conditionally show the Truth Score bar --- */}
                {/* This entire block will be hidden if there is no model prediction */}
                {hasModelPrediction && (
                  <div>
                    <Label className="text-sm text-gray-400">Truth Score (Model Confidence)</Label>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ease-out 
                                      bg-gradient-to-r from-blue-500 to-cyan-500`}
                          style={{ width: `${confidence.toFixed(0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-white ml-3 w-12 text-right">
                        {confidence.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Original Content */}
                <div className="space-y-2">
                  <Label htmlFor="analyzed-content" className="text-sm text-gray-400">Analyzed Content</Label>
                  <p 
                    id="analyzed-content"
                    className="text-gray-200 bg-gray-800 p-4 rounded-md border border-gray-700 max-h-32 overflow-y-auto"
                  >
                    {content}
                  </p>
                </div>

                <Separator className="bg-gray-700" />

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Google Fact Check */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400 flex items-center">
                      <Search className="w-4 h-4 mr-2" /> Google Fact Check
                    </Label>
                    <p className={`text-sm p-3 rounded-md border ${
                      google_fact_check?.status === 'not_found' 
                        ? "bg-yellow-900/30 border-yellow-700 text-yellow-300"
                        : "bg-gray-800 border-gray-700 text-gray-300"
                    }`}>
                      {google_fact_check?.message || "No data"}
                    </p>
                  </div>

                  {/* Model Details */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400 flex items-center">
                      <Brain className="w-4 h-4 mr-2" /> Analysis Source
                    </Label>
                    <p className="text-sm p-3 rounded-md border bg-gray-800 border-gray-700 text-gray-300">
                      {/* --- 4. Use our new smart variable --- */}
                      {analysisSource}
                    </p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center text-xs text-gray-500 pt-4 border-t border-gray-700">
                  <Clock className="w-3 h-3 mr-2" />
                  Analyzed on: {new Date(createdAt).toLocaleString()}
                </div>
                
              </CardContent>
            </Card>
          )}
        </div>
      );
    };
    // --- END OF COMPONENT TO CHANGE ---


    switch (activeItem) {
      case "home":
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* --- 3. PASS PROPS to SubmitCard --- */}
              <SubmitCard onSubmit={handleNewsSubmit} isLoading={isLoading} />
              <AnalysisResultDisplay />
              <LatestNews />
            </div>
            <div className="xl:col-span-1">
              <TrendVisualization />
            </div>
          </div>
        );
      case "detect":
        return (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-6">Detect News</h2>
            {/* --- 3. PASS PROPS to SubmitCard --- */}
            <SubmitCard onSubmit={handleNewsSubmit} isLoading={isLoading} />
            <AnalysisResultDisplay />
          </div>
        );
      // (Rest of switch cases are unchanged)
      case "reports":
        return (
          <div className="max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-6">My Reports</h2>
            <LatestNews />
          </div>
        );
      case "trends":
        return (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-6">Trend Visualization</h2>
            <TrendVisualization />
          </div>
        );
      case "credibility":
        return (
          <div className="max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-6">Credibility Scores</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LatestNews />
              <TrendVisualization />
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* --- 3. PASS PROPS to SubmitCard --- */}
              <SubmitCard onSubmit={handleNewsSubmit} isLoading={isLoading} />
              <AnalysisResultDisplay />
              <LatestNews />
            </div>
            <div className="xl:col-span-1">
              <TrendVisualization />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* (Background Pattern is unchanged) */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
          `
        }}></div>
      </div>

      <div className="relative z-10">
        <DashboardNavbar onLogout={onLogout} onProfileClick={onProfileClick} onHomeClick={onHomeClick} />
        
        <div className="flex">
          <DashboardSidebar 
            activeItem={activeItem} 
            onItemClick={handleSidebarItemClick} 
          />
          
          <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </div>
  );
}