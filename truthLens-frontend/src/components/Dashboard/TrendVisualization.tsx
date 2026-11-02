import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip 
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3, Loader2, AlertCircle } from "lucide-react";
import { auth } from "../../firebase/firebaseConfig";

// --- Data structure for Line Chart ---
interface LineChartData {
  time: string;
  reliable: number;
  uncertain: number;
  fake: number;
}

// --- Data structure for Pie Chart ---
interface PieChartData {
  name: string;
  value: number;
  fill: string;
}

// --- Data structure for Topics List ---
interface TrendingTopic {
  topic: string;
  change: string;
  trend: "up" | "down";
}

// Colors for all charts
const COLORS = {
  reliable: "#22c55e",
  uncertain: "#f97316",
  fake: "#ef4444",
};

export default function TrendVisualization() {
  // --- State for Line Chart ---
  const [lineChartData, setLineChartData] = useState<LineChartData[]>([]);
  const [isLineChartLoading, setIsLineChartLoading] = useState(true);
  const [lineChartError, setLineChartError] = useState<string | null>(null);

  // --- State for Pie Chart ---
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
  const [isPieChartLoading, setIsPieChartLoading] = useState(true);
  const [pieChartError, setPieChartError] = useState<string | null>(null);

  // --- State for Topics List ---
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [isTopicsLoading, setIsTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  // --- API fetching logic ---
  const getAuthToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated.");
    return await user.getIdToken();
  };

  useEffect(() => {
    // --- 1. Fetch Line Chart Data ---
    const fetchLineChartData = async () => {
      setIsLineChartLoading(true);
      setLineChartError(null);
      try {
        const token = await getAuthToken();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analysis/trending`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to load trends data.");
        const data: LineChartData[] = await response.json();
        setLineChartData(data);
      } catch (err: any) {
        setLineChartError(err.message);
      } finally {
        setIsLineChartLoading(false);
      }
    };

    // --- 2. Fetch Pie Chart Data ---
    const fetchPieChartData = async () => {
      setIsPieChartLoading(true);
      setPieChartError(null);
      try {
        const token = await getAuthToken();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analysis/distribution`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to load distribution data.");
        const data: { reliable: number; fake: number; uncertain: number } = await response.json();
        const formattedData: PieChartData[] = [
          { name: "Reliable", value: data.reliable, fill: COLORS.reliable },
          { name: "Uncertain", value: data.uncertain, fill: COLORS.uncertain },
          { name: "Fake", value: data.fake, fill: COLORS.fake },
        ].filter(item => item.value > 0); 
        setPieChartData(formattedData);
      } catch (err: any) {
        setPieChartError(err.message);
      } finally {
        setIsPieChartLoading(false);
      }
    };

    // --- 3. Fetch Trending Topics Data ---
    const fetchTrendingData = async () => {
      setIsTopicsLoading(true);
      setTopicsError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analysis/trending`);
        if (!response.ok) throw new Error("Failed to load trending topics.");
        const data: { topic: string, count: number }[] = await response.json();
        const formattedTopics: TrendingTopic[] = data.map(item => ({
          topic: item.topic.length > 25 ? item.topic.substring(0, 25) + '...' : item.topic,
          change: `+${item.count.toLocaleString()}`,
          trend: "up"
        }));
        setTrendingTopics(formattedTopics);
      } catch (err: any) {
        setTopicsError(err.message);
      } finally {
        setIsTopicsLoading(false);
      }
    };

    // Call all fetch functions
    fetchLineChartData();
    fetchPieChartData();
    fetchTrendingData();
  }, []);
  
  // --- Render function for Line Chart ---
  const renderLineChart = () => {
    if (isLineChartLoading) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-3" /> <span>Loading trends...</span>
        </div>
      );
    }
    if (lineChartError) {
      return (
        <div className="flex items-center justify-center h-48 text-red-400">
          <AlertCircle className="w-6 h-6 mr-3" /> <span>Error loading trends.</span>
        </div>
      );
    }
    return (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
              labelStyle={{ color: "#f9fafb" }}
            />
            <Line type="monotone" dataKey="reliable" stroke={COLORS.reliable} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="uncertain" stroke={COLORS.uncertain} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="fake" stroke={COLORS.fake} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // --- Render function for Pie Chart ---
  const renderPieChart = () => {
    if (isPieChartLoading) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-3" /> <span>Loading...</span>
        </div>
      );
    }
    if (pieChartError) {
      return (
        <div className="flex items-center justify-center h-48 text-red-400">
          <AlertCircle className="w-6 h-6 mr-3" /> <span>Error loading chart.</span>
        </div>
      );
    }
    if (pieChartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <span>No processed data.</span>
        </div>
      );
    }
    return (
      <>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={5} dataKey="value">
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 mt-2">
          {pieChartData.map((item) => (
            <div key={item.name} className="flex items-center text-xs">
              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: item.fill }} />
              <span className="text-gray-400">{item.name}</span>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  // --- Render function for Topics List ---
  const renderTopicsList = () => {
    if (isTopicsLoading) {
      return (
        <div className="flex items-center justify-center h-40 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-3" /> <span>Loading topics...</span>
        </div>
      );
    }
    if (topicsError) {
      return (
        <div className="flex items-center justify-center h-40 text-red-400">
          <AlertCircle className="w-6 h-6 mr-3" /> <span>Error loading topics.</span>
        </div>
      );
    }
    if (trendingTopics.length === 0) {
      return (
        <div className="flex items-center justify-center h-40 text-gray-400">
          <span>No trending topics.</span>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
            <span className="text-gray-300 text-sm truncate" title={topic.topic}>{topic.topic}</span>
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">{topic.change}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Truth Score Trends (DYNAMIC) */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-white flex items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-2">
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
            Truth Score Trends (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderLineChart()}
        </CardContent>
      </Card>

      {/* Category Distribution (DYNAMIC) */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-white">Distribution (All Time)</CardTitle>
        </CardHeader>
        <CardContent>
          {renderPieChart()}
        </CardContent>
      </Card>

      {/* Trending Topics (DYNAMIC) */}
      <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-white">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          {renderTopicsList()}
        </CardContent>
      </Card>

      {/* Quick Stats (Static) - You can create an API for this later */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">2.4k</div>
          <div className="text-xs text-gray-400">Articles Today</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">94%</div>
          <div className="text-xs text-gray-400">Accuracy Rate</div>
        </div>
      </div>
    </div>
  );
}