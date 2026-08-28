import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Trophy, Flame, Code2, GraduationCap, Bot, BookOpen, ArrowRight, LayoutDashboard, Clock, Zap } from 'lucide-react';
import { ActivityLogEntry, TopicScore } from '@/types/learnercraft';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { curriculum } from '@/data/curriculum';

const DEFAULT_TOPICS: TopicScore[] = [
  { topic: "Arrays", score: 45 },
  { topic: "Loops", score: 60 },
  { topic: "Functions", score: 55 },
  { topic: "Recursion", score: 30 },
  { topic: "Strings", score: 50 },
  { topic: "Sorting", score: 40 },
];

export default function Dashboard() {
  const { profile, progress, activityLog } = useUserProfile();
  
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [examsTaken, setExamsTaken] = useState(0);
  
  const [topicAccuracy, setTopicAccuracy] = useState<TopicScore[]>(DEFAULT_TOPICS);
  const [hasRealData, setHasRealData] = useState(false);

  useEffect(() => {
    // Basic stats are still stored in localStorage by individual features,
    // though in a full prod app these would be in the user profile context.
    const storedXp = localStorage.getItem('codeStart_score');
    if (storedXp) setXp(parseInt(storedXp, 10));

    const storedStreak = localStorage.getItem('codeStart_dailyStreak');
    if (storedStreak) setStreak(parseInt(storedStreak, 10));

    const storedProblems = localStorage.getItem('learnercraft_problems_solved');
    if (storedProblems) setProblemsSolved(parseInt(storedProblems, 10));

    const storedExams = localStorage.getItem('learnercraft_exams_taken');
    if (storedExams) setExamsTaken(parseInt(storedExams, 10));

    // Read topic accuracy
    const storedTopics = localStorage.getItem('learnercraft_topic_accuracy');
    if (storedTopics) {
      try {
        const parsed = JSON.parse(storedTopics);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTopicAccuracy(parsed);
          setHasRealData(true);
        }
      } catch (e) {
        console.error("Failed to parse topic accuracy", e);
      }
    }
  }, []);

  // Determine Smart Actions based on progress
  const currentChapterData = curriculum.find(c => c.id === progress.currentChapter) || curriculum[0];


  const formatRelativeTime = (timestamp: string) => {
    const parsedTime = parseInt(timestamp, 10);
    const date = new Date(isNaN(parsedTime) ? timestamp : parsedTime);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    if (diffInMins < 60) return `${diffInMins}m ago`;
    
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays === 1) return `1 day ago`;
    return `${diffInDays} days ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam': return <GraduationCap className="h-5 w-5 text-primary" />;
      case 'practice': return <Code2 className="h-5 w-5 text-primary" />;
      case 'plan': return <BookOpen className="h-5 w-5 text-primary" />;
      default: return <Zap className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="container mx-auto px-6 pt-24 pb-20 max-w-7xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Overview</h1>
        </div>

        {/* Top Stats Row: Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="md:col-span-2 p-8 rounded-xl bg-muted/30 flex flex-col justify-between group hover:bg-muted/50 transition-colors">
            <Trophy className="h-8 w-8 text-primary mb-12" />
            <div>
              <h3 className="text-5xl font-bold tracking-tight">{xp}</h3>
              <p className="text-muted-foreground mt-2 text-lg">Total Experience</p>
            </div>
          </div>
          
          <div className="p-8 rounded-xl bg-muted/30 flex flex-col justify-between group hover:bg-muted/50 transition-colors">
            <Flame className="h-8 w-8 text-primary mb-12" />
            <div>
              <h3 className="text-5xl font-bold tracking-tight">{streak}</h3>
              <p className="text-muted-foreground mt-2 text-lg">Day Streak</p>
            </div>
          </div>
          
          <div className="grid grid-rows-2 gap-6">
            <div className="px-6 py-4 rounded-xl bg-muted/30 flex flex-col justify-center group hover:bg-muted/50 transition-colors h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Solved</p>
                  <h3 className="text-3xl font-bold">{problemsSolved}</h3>
                </div>
                <Code2 className="h-6 w-6 text-primary opacity-80" />
              </div>
            </div>
            <div className="px-6 py-4 rounded-xl bg-muted/30 flex flex-col justify-center group hover:bg-muted/50 transition-colors h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Exams</p>
                  <h3 className="text-3xl font-bold">{examsTaken}</h3>
                </div>
                <GraduationCap className="h-6 w-6 text-primary opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Left Column: Topic Accuracy Radar Chart */}
          <div className="lg:col-span-7 p-8 rounded-xl bg-muted/30 flex flex-col min-h-[400px]">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight">Topic Mastery</h2>
              {!hasRealData && (
                <p className="text-muted-foreground mt-2 max-w-lg">
                  Showing sample data. Take a mock exam to establish your baseline.
                </p>
              )}
            </div>
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={topicAccuracy}>
                  <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.15} />
                  <PolarAngleAxis 
                    dataKey="topic" 
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 500 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Radar
                    name="Accuracy"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="hsl(var(--primary))"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Quick Actions */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Jump Back In</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 flex-1">
              
              {/* SMART ACTION: Context-aware continue button */}
              <Link to={`/practice`} className="group p-6 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:-translate-y-1 transition-all flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-primary transition-colors">Continue: {currentChapterData.title}</h3>
                  <p className="text-primary/80 mt-1 leading-relaxed">Resume your guided practice path</p>
                </div>
              </Link>

              <Link to="/mock-exam" className="group p-6 rounded-xl bg-muted/30 hover:bg-muted/50 hover:-translate-y-1 transition-all flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">Start Mock Exam</h3>
                  <p className="text-muted-foreground mt-1 leading-relaxed">Test your knowledge with an AI assessment</p>
                </div>
              </Link>

              <Link to="/study-plan" className="group p-6 rounded-xl bg-muted/30 hover:bg-muted/50 hover:-translate-y-1 transition-all flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">Study Plan</h3>
                  <p className="text-muted-foreground mt-1 leading-relaxed">View your personalized schedule</p>
                </div>
              </Link>

              <Link to="/ai-tutor" className="group p-6 rounded-xl bg-muted/30 hover:bg-muted/50 hover:-translate-y-1 transition-all flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">AI Mentor</h3>
                  <p className="text-muted-foreground mt-1 leading-relaxed">Get unblocked on difficult concepts</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Activity Feed */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
          </div>
          
          <div className="p-4 sm:p-6 rounded-xl bg-muted/30">
            {activityLog.length > 0 ? (
              <div className="flex flex-col gap-3">
                {activityLog.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="font-medium text-lg">{activity.title}</p>
                        <p className="text-muted-foreground mt-0.5">{formatRelativeTime(activity.timestamp.toString())}</p>
                      </div>
                    </div>
                    {activity.xpEarned && (
                      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-2">
                        +{activity.xpEarned} <Trophy className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start justify-center py-16 px-8">
                <div className="h-16 w-16 rounded-2xl bg-background shadow-sm flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-2">No activity yet</h3>
                <p className="text-muted-foreground text-lg max-w-md mb-8">
                  Start your learning journey. Build your first project, take a mock exam, or practice some coding challenges.
                </p>
                <div className="flex gap-6">
                  <Link to="/mock-exam" className="group flex items-center gap-2 text-lg font-medium text-primary hover:text-primary/80 transition-colors">
                    Take Mock Exam <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/practice" className="group flex items-center gap-2 text-lg font-medium text-primary hover:text-primary/80 transition-colors">
                    Practice Coding <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
