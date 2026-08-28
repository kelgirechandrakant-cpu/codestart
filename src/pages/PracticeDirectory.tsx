import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { codingQuestions } from "@/data/codingQuestions";
import { curriculum, isChapterUnlocked, type Chapter, type Lesson } from "@/data/curriculum";
import { Question, Language, Difficulty, Topic } from "@/types/coding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Code2, Heart, Trophy, Search, CheckCircle2, 
  BookOpen, Lock, Map, LayoutGrid, TerminalSquare, 
  Compass, Zap
} from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

const getChapterIcon = (id: number) => {
  switch (id) {
    case 1: return <TerminalSquare className="w-5 h-5" />;
    case 2: return <Map className="w-5 h-5" />;
    case 3: return <LayoutGrid className="w-5 h-5" />;
    case 4: return <Compass className="w-5 h-5" />;
    default: return <BookOpen className="w-5 h-5" />;
  }
};

export default function PracticeDirectory() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats from localStorage
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const savedScore = localStorage.getItem('codeStart_score');
    const savedStreak = localStorage.getItem('codeStart_dailyStreak');
    const savedLives = localStorage.getItem('codeStart_lives');
    if (savedScore) setScore(parseInt(savedScore));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLives) setLives(parseInt(savedLives));
  }, []);

  // Guided mode
  const { profile, progress, updateProgress, solvedProblems } = useUserProfile();
  const [guidedMode, setGuidedMode] = useState(() => {
    return progress.guidedMode ?? (profile?.level === 'beginner');
  });
  const completedLessons = progress.completedLessons || [];
  const totalLessons = curriculum.reduce((a, c) => a + c.lessons.length, 0);
  const completionPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const languages = ["All", "C", "Python"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const topics = ["All", "Variables", "Conditions", "Loops", "Functions", "Basic Syntax", "Data Types", "Algorithms"];

  const filteredQuestions = codingQuestions.filter((q) => {
    const matchesLang = selectedLanguage === "All" || q.language === selectedLanguage;
    const matchesDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === "All" || q.topic === selectedTopic;
    const matchesSearch = searchQuery.trim() === "" || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesDiff && matchesTopic && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        
        {/* Clean Hero */}
        <div className="bg-muted/30 rounded-[2rem] p-8 md:p-12 mb-8 flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="max-w-[65ch]">
            <h1 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-4">
              Practice Directory
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Master your coding skills with interactive exercises. Progress through structured lessons in guided mode, or explore problems freely across topics and difficulties.
            </p>
          </div>
          
          {/* User Stats Card */}
          <div className="grid grid-cols-3 gap-6 bg-background rounded-xl p-5 shadow-sm shrink-0 border border-border">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 font-medium">
                <Heart className="w-4 h-4 text-primary" />
                <span>{lives}</span>
              </div>
              <span className="text-sm text-muted-foreground mt-1">Lives</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 font-medium">
                <Zap className="w-4 h-4 text-primary" />
                <span>{streak}</span>
              </div>
              <span className="text-sm text-muted-foreground mt-1">Streak</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 font-medium">
                <Trophy className="w-4 h-4 text-primary" />
                <span>{score}</span>
              </div>
              <span className="text-sm text-muted-foreground mt-1">XP</span>
            </div>
          </div>
        </div>

        {/* Mode Toggle & Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-xl w-fit">
            <button 
              onClick={() => {
                  setGuidedMode(true);
                  updateProgress({ guidedMode: true });
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${guidedMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Guided Path
            </button>
            <button 
              onClick={() => {
                  setGuidedMode(false);
                  updateProgress({ guidedMode: false });
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${!guidedMode ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Free Practice
            </button>
          </div>
          
          {guidedMode && (
            <div className="flex items-center gap-4 text-sm bg-muted/30 py-2.5 px-5 rounded-xl">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedLessons.length} / {totalLessons}</span>
              <Progress value={completionPercent} className="w-32 h-2" />
            </div>
          )}
        </div>

        {/* Guided Chapters View */}
        {guidedMode ? (
          <div className="space-y-8 mb-8">
            {curriculum.map((chapter) => {
              const unlocked = isChapterUnlocked(chapter.id, completedLessons);
              const chapterCompleted = chapter.lessons.every(l => completedLessons.includes(l.id));
              const chapterProgress = chapter.lessons.filter(l => completedLessons.includes(l.id)).length;

              return (
                <div
                  key={chapter.id}
                  className={`bg-muted/30 rounded-[2rem] p-6 sm:p-8 transition-all ${
                    !unlocked ? "opacity-60 grayscale-[0.5]" : ""
                  }`}
                >
                  {/* Chapter Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-background rounded-xl shrink-0 text-primary shadow-sm">
                         {getChapterIcon(chapter.id)}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium text-foreground flex items-center gap-2">
                          {chapter.title}
                          {chapterCompleted && <CheckCircle2 className="w-5 h-5 text-primary" />}
                          {!unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </h3>
                        <p className="text-muted-foreground mt-2 max-w-[65ch] text-sm leading-relaxed">
                          {chapter.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-xl shadow-sm shrink-0">
                      <span className="text-sm font-medium text-foreground">{chapterProgress}</span>
                      <span className="text-sm text-muted-foreground">/ {chapter.lessons.length}</span>
                    </div>
                  </div>

                  {/* Lessons Grid */}
                  {unlocked && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chapter.lessons.map((lesson, idx) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        const problemId = lesson.problemIds[0];

                        return (
                          <Link
                            key={lesson.id}
                            to={`/practice/${problemId}`}
                            className={`group flex flex-col gap-4 p-5 bg-background rounded-xl transition-all hover:-translate-y-1 hover:shadow-md ${isCompleted ? 'border border-primary/20' : 'border border-transparent'}`}
                          >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
                                  Lesson {idx + 1}
                                </span>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                ) : (
                                    <span className="text-xs font-medium text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md">
                                        +{lesson.xpReward} XP
                                    </span>
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{lesson.title}</h4>
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{lesson.concept}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {/* Filter & Search Controls */}
            <div className="bg-muted/30 rounded-[2rem] p-6 sm:p-8 mb-8 flex flex-col gap-8">
              <div className="relative max-w-md">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search problems by keyword..."
                  className="pl-11 h-12 bg-background border-transparent shadow-sm text-base rounded-xl"
                />
              </div>

              <div className="flex flex-wrap gap-8">
                <div className="space-y-3">
                  <span className="text-sm font-medium text-foreground">Language</span>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${
                          selectedLanguage === lang 
                            ? "bg-primary text-primary-foreground shadow-sm font-medium" 
                            : "bg-background text-muted-foreground hover:text-foreground shadow-sm"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-sm font-medium text-foreground">Difficulty</span>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${
                          selectedDifficulty === diff 
                            ? "bg-primary text-primary-foreground shadow-sm font-medium" 
                            : "bg-background text-muted-foreground hover:text-foreground shadow-sm"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-sm font-medium text-foreground">Topic</span>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((top) => (
                      <button
                        key={top}
                        onClick={() => setSelectedTopic(top)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${
                          selectedTopic === top
                            ? "bg-primary text-primary-foreground shadow-sm font-medium"
                            : "bg-background text-muted-foreground hover:text-foreground shadow-sm"
                        }`}
                      >
                        {top}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredQuestions.length === 0 ? (
                <div className="col-span-full py-16 bg-muted/30 rounded-[2rem] text-center text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-4 opacity-50" />
                  <p className="text-base">No coding problems found matching your filters.</p>
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  const isSolved = solvedProblems?.includes(q.id);
                  return (
                    <Link
                      key={q.id}
                      to={`/practice/${q.id}`}
                      className={`group flex flex-col justify-between p-6 bg-muted/20 hover:bg-muted/30 border border-transparent hover:border-primary/20 rounded-[2rem] transition-all hover:-translate-y-1 hover:shadow-md ${isSolved ? 'ring-1 ring-emerald-500/30' : ''}`}
                    >
                      <div>
                        <div className="flex items-start justify-between mb-5">
                          <span className="text-xs font-mono text-muted-foreground bg-background px-3 py-1.5 rounded-lg shadow-sm">
                            #{q.id}
                          </span>
                          <div className="flex items-center gap-2">
                            {isSolved && (
                              <Badge className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 shadow-none border-transparent font-normal px-3 py-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Solved
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs bg-background shadow-sm border-transparent font-normal px-3 py-1">
                              {q.difficulty}
                            </Badge>
                          </div>
                        </div>
                      
                      <h3 className="font-medium text-foreground text-lg mb-3 group-hover:text-primary transition-colors">
                        {q.question || q.title}
                      </h3>
                      
                      {q.type === 'Full Coding Challenge' && (
                        <Badge variant="secondary" className="mb-4 text-xs font-normal bg-primary/10 text-primary hover:bg-primary/20 border-transparent">
                          LeetCode Mode
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border/50 text-sm text-muted-foreground">
                      <span className="bg-background px-3 py-1.5 rounded-lg shadow-sm">{q.language}</span>
                      <span className="bg-background px-3 py-1.5 rounded-lg shadow-sm truncate max-w-[120px]">{q.topic}</span>
                    </div>
                  </Link>
                );
              })}
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
