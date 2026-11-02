import { useState } from 'react';
import { User, Mail, ArrowLeft, Lock, TrendingUp, Edit2, Check, X, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import NewsReportModal from './NewsReportModal';

interface ProfileProps {
  onBack: () => void;
}

interface AnalysedNews {
  id: string;
  title: string;
  result: 'reliable' | 'fake' | 'uncertain';
  date: string;
  score: number;
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
  // relatedSources removed — not used in profile modal
}

export default function Profile({ onBack }: ProfileProps) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedName, setEditedName] = useState('Alex Thompson');
  const [editedEmail, setEditedEmail] = useState('alex.thompson@email.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedReport, setSelectedReport] = useState<NewsReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    avatar: '',
    totalArticles: 127,
  });

  const handleEditName = () => {
    setEditedName(userData.name);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    setUserData({ ...userData, name: editedName });
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setEditedName(userData.name);
    setIsEditingName(false);
  };

  const handleEditEmail = () => {
    setEditedEmail(userData.email);
    setIsEditingEmail(true);
  };

  const handleSaveEmail = () => {
    setUserData({ ...userData, email: editedEmail });
    setIsEditingEmail(false);
  };

  const handleCancelEmail = () => {
    setEditedEmail(userData.email);
    setIsEditingEmail(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate passwords
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    // Simulate successful password change
    setShowChangePassword(false);
    setShowSuccessModal(true);
    // Clear password fields
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Mock analysed news data
  const analysedNews: AnalysedNews[] = [
    {
      id: '1',
      title: 'Breaking: New Climate Report Shows Rising Temperatures',
      result: 'reliable',
      date: '2025-10-12',
      score: 92,
    },
    {
      id: '2',
      title: 'Miracle Cure Discovered by Local Scientists',
      result: 'fake',
      date: '2025-10-11',
      score: 15,
    },
    {
      id: '3',
      title: 'Tech Company Announces Major Product Launch',
      result: 'reliable',
      date: '2025-10-10',
      score: 88,
    },
    {
      id: '4',
      title: 'Celebrities Endorse Controversial Political Statement',
      result: 'uncertain',
      date: '2025-10-09',
      score: 54,
    },
    {
      id: '5',
      title: 'Global Market Shows Unexpected Recovery',
      result: 'reliable',
      date: '2025-10-08',
      score: 85,
    },
    {
      id: '6',
      title: 'Viral Video Claims Government Conspiracy',
      result: 'fake',
      date: '2025-10-07',
      score: 12,
    },
    {
      id: '7',
      title: 'Study Links Diet to Improved Health Outcomes',
      result: 'uncertain',
      date: '2025-10-06',
      score: 67,
    },
    {
      id: '8',
      title: 'Major Infrastructure Project Approved',
      result: 'reliable',
      date: '2025-10-05',
      score: 91,
    },
  ];

  // Calculate statistics for pie chart
  const reliableCount = analysedNews.filter((news) => news.result === 'reliable').length;
  const fakeCount = analysedNews.filter((news) => news.result === 'fake').length;
  const uncertainCount = analysedNews.filter((news) => news.result === 'uncertain').length;

  const chartData = [
    { name: 'Reliable', value: reliableCount, color: '#10b981' },
    { name: 'Fake', value: fakeCount, color: '#ef4444' },
    { name: 'Uncertain', value: uncertainCount, color: '#eab308' },
  ];

  const getResultBadge = (result: 'reliable' | 'fake' | 'uncertain', score: number) => {
    const variants = {
      reliable: 'bg-green-500/20 text-green-400 border-green-500/50',
      fake: 'bg-red-500/20 text-red-400 border-red-500/50',
      uncertain: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    };

    return (
      <Badge className={`${variants[result]} border capitalize`}>
        {result} • {score}%
      </Badge>
    );
  };

  const convertToReport = (news: AnalysedNews): NewsReport => {
    const timestamp = new Date(news.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      id: news.id,
      title: news.title,
      source: 'Previously Analyzed',
      timestamp,
      truthScore: news.score,
      status: news.result,
      summary: news.result === 'reliable' 
        ? 'Analysis shows high credibility with verified sources and factual consistency.'
        : news.result === 'uncertain'
        ? 'Mixed signals detected. Some claims need additional verification.'
        : 'Multiple red flags detected. Exercise caution with this content.',
      analysisDetails: {
        sourceCredibility: news.result === 'reliable' ? 92 : news.result === 'uncertain' ? 65 : 35,
        factualAccuracy: news.result === 'reliable' ? 88 : news.result === 'uncertain' ? 60 : 25,
        biasDetection: news.result === 'reliable' ? 85 : news.result === 'uncertain' ? 55 : 40,
        languageAnalysis: news.result === 'reliable' ? 90 : news.result === 'uncertain' ? 70 : 30,
      },
      keyFindings: [
        'Content analyzed using advanced NLP algorithms',
        'Cross-referenced with multiple fact-checking databases',
        'Source reputation and historical accuracy assessed',
        'Language patterns and emotional manipulation indicators checked',
      ],
      redFlags: news.result === 'fake' ? [
        'Unverified claims detected in the content',
        'Source has history of unreliable reporting',
        'Sensational language patterns identified',
      ] : news.result === 'uncertain' ? [
        'Some claims require additional verification',
      ] : [],
      verifiedFacts: news.result === 'reliable' ? [
        'Claims supported by reputable sources',
        'Statistical data verified through official channels',
        'No contradictions found with established facts',
      ] : [],
      // relatedSources removed
    };
  };

  const handleViewReport = (news: AnalysedNews) => {
    setSelectedReport(convertToReport(news));
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      <div className="relative min-h-screen">
        {/* Header */}
        <div className="border-b border-blue-500/20 bg-slate-900/50 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Profile Card */}
          <div className="mb-8 rounded-2xl border border-blue-500/30 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm"
               style={{
                 boxShadow: '0 0 40px rgba(59, 130, 246, 0.15)',
               }}>
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-75 blur"></div>
                <Avatar className="relative h-32 w-32 border-4 border-slate-900">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-3xl">
                    {userData.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                {/* Name with Edit */}
                <div className="mb-2 flex items-center justify-center gap-3 md:justify-start">
                  {isEditingName ? (
                    <>
                      <Input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="h-10 max-w-xs border-blue-500/50 bg-slate-800/50 text-white text-xl focus:border-blue-500"
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        className="h-8 w-8 bg-green-600 p-0 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCancelName}
                        variant="outline"
                        className="h-8 w-8 border-slate-600 p-0 hover:border-red-500 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <h1 className="text-white text-3xl">{userData.name}</h1>
                      <Button
                        size="sm"
                        onClick={handleEditName}
                        variant="ghost"
                        className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Email with Edit */}
                <div className="mb-4 flex items-center justify-center gap-3 text-slate-400 md:justify-start">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  {isEditingEmail ? (
                    <>
                      <Input
                        type="email"
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        className="h-8 max-w-xs border-blue-500/50 bg-slate-800/50 text-white text-sm focus:border-blue-500"
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveEmail}
                        className="h-8 w-8 bg-green-600 p-0 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCancelEmail}
                        variant="outline"
                        className="h-8 w-8 border-slate-600 p-0 hover:border-red-500 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span>{userData.email}</span>
                      <Button
                        size="sm"
                        onClick={handleEditEmail}
                        variant="ghost"
                        className="h-8 w-8 p-0 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="mb-6 inline-flex items-center gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 px-6 py-3">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Total Articles Analysed</p>
                    <p className="text-white text-2xl">{userData.totalArticles}</p>
                  </div>
                </div>

                {/* Change Password Button */}
                <div>
                  <Button
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white transition-all duration-300 hover:from-blue-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-blue-500/50"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100"></div>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* News Analysis Section */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* News Analysed List */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-blue-500/30 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-sm"
                   style={{
                     boxShadow: '0 0 30px rgba(59, 130, 246, 0.1)',
                   }}>
                <h2 className="mb-4 text-white text-2xl">News Analysed</h2>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {analysedNews.map((news) => (
                      <div
                        key={news.id}
                        className="group rounded-lg border border-slate-700/50 bg-slate-800/50 p-4 transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                        onClick={() => handleViewReport(news)}
                      >
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <h3 className="flex-1 text-white transition-colors group-hover:text-blue-300">
                            {news.title}
                          </h3>
                          {getResultBadge(news.result, news.score)}
                        </div>
                        <p className="text-slate-500 text-sm">
                          Analysed on {new Date(news.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Pie Chart Visualization */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-blue-500/30 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-sm"
                   style={{
                     boxShadow: '0 0 30px rgba(59, 130, 246, 0.1)',
                   }}>
                <h2 className="mb-6 text-white text-2xl">Analysis Distribution</h2>
                
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Stats Cards */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                    <span className="text-green-400">Reliable</span>
                    <span className="text-white">{reliableCount} articles</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <span className="text-red-400">Fake</span>
                    <span className="text-white">{fakeCount} articles</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                    <span className="text-yellow-400">Uncertain</span>
                    <span className="text-white">{uncertainCount} articles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
             onClick={() => setShowChangePassword(false)}>
          <div className="w-full max-w-md rounded-2xl border border-blue-500/30 bg-slate-900 p-8 shadow-2xl"
               style={{
                 boxShadow: '0 0 50px rgba(59, 130, 246, 0.3)',
               }}
               onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-6 text-white text-2xl">Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-slate-400">Old Password</label>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/50"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-slate-400">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/50"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-slate-400">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/50"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white transition-all hover:from-blue-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-blue-500/50"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
             onClick={() => setShowSuccessModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-green-500/30 bg-slate-900 p-8 shadow-2xl"
               style={{
                 boxShadow: '0 0 50px rgba(16, 185, 129, 0.3)',
               }}
               onClick={(e) => e.stopPropagation()}>
            {/* Success Icon with Glow */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-2 animate-pulse rounded-full bg-green-500/30 blur-xl"></div>
                <div className="relative rounded-full bg-gradient-to-br from-green-500 to-emerald-500 p-4">
                  <CheckCircle2 className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>

            <h2 className="mb-3 text-center text-white text-2xl">Password Changed Successfully</h2>
            <p className="mb-6 text-center text-slate-400">
              Your password has been updated. Please use your new password for future logins.
            </p>

            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white transition-all hover:from-green-500 hover:to-emerald-500 hover:shadow-lg hover:shadow-green-500/50"
            >
              Got It!
            </Button>
          </div>
        </div>
      )}

      {/* News Report Modal */}
      <NewsReportModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
