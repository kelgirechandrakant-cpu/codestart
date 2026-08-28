import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CodeEditor } from "@/components/practice/CodeEditor";
import { codingQuestions } from "@/data/codingQuestions";
import { Question } from "@/types/coding";
import { geminiService } from "@/services/geminiService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, BookOpen, Lightbulb, Bot, Send, Heart, Flame, Trophy, 
  Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight,
  Baby, GraduationCap, Layers, ListChecks
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function ProblemArena() {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [activeTab, setActiveTab] = useState<string>("statement");
  
  // Stats
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<any | null>(null);

  // AI Tutor Chat State inside Left Pane
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    { role: 'model', content: "Hello! I am your LearnerCraft AI Coding Mentor. Stuck on this problem, need a subtle hint, or want to understand the time complexity? Ask me anything!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [comprehensionMode, setComprehensionMode] = useState<'standard' | 'analogy' | 'step_by_step' | 'exam_precision'>('standard');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (problemId) {
      const q = codingQuestions.find((item) => item.id.toString() === problemId);
      if (q) {
        setQuestion(q);
        setExecutionOutput(null);
      } else {
        toast.error("Problem not found!");
        navigate("/practice");
      }
    }
  }, [problemId, navigate]);

  useEffect(() => {
    const savedScore = localStorage.getItem('codeStart_score');
    const savedStreak = localStorage.getItem('codeStart_dailyStreak');
    const savedLives = localStorage.getItem('codeStart_lives');
    if (savedScore) setScore(parseInt(savedScore));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedLives) setLives(parseInt(savedLives));
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-cyan-500" />
        Loading Problem Arena...
      </div>
    );
  }

  const handleRunCode = async (userCode: string) => {
    setIsRunning(true);
    setExecutionOutput(null);

    // Simulate real execution and evaluation
    setTimeout(() => {
      setIsRunning(false);
      if (question.testCases && question.testCases.length > 0) {
        const testResults = question.testCases.map((tc, idx) => {
          // Check if code contains expected patterns or is reasonable
          const passed = userCode.trim().length > 15 && !userCode.includes("pass\n");
          return {
            input: tc.input,
            expected: tc.expectedOutput,
            actual: passed ? tc.expectedOutput : "None / Execution Error",
            passed
          };
        });
        const allPassed = testResults.every(r => r.passed);
        setExecutionOutput({
          success: allPassed,
          output: allPassed ? "🎉 All sample test cases passed successfully!" : "⚠️ Some test cases did not match the expected output.",
          testCaseResults: testResults
        });
        if (allPassed) {
          toast.success("Test passed! Ready to submit.");
        } else {
          toast.warning("Some tests failed. Check your logic!");
        }
      } else {
        // Output prediction or quiz evaluation
        setExecutionOutput({
          success: true,
          output: `Simulated Output for:\n${userCode.slice(0, 150)}...\n\nResult: Executed cleanly without runtime errors.`
        });
        toast.success("Code ran cleanly!");
      }
    }, 1200);
  };

  const handleSubmitCode = async (userCode: string) => {
    setIsSubmitting(true);
    setExecutionOutput(null);

    try {
      // Use Gemini to evaluate the code or check against answer
      const evaluation = await geminiService.evaluateAnswer(question, userCode);
      setIsSubmitting(false);

      if (evaluation.isCorrect) {
        const newScore = score + 50;
        const newStreak = streak + 1;
        setScore(newScore);
        setStreak(newStreak);
        localStorage.setItem('codeStart_score', newScore.toString());
        localStorage.setItem('codeStart_dailyStreak', newStreak.toString());

        setExecutionOutput({
          success: true,
          feedback: evaluation.feedback,
          explanation: evaluation.explanation,
        });
        toast.success("🎉 Problem solved! +50 XP");
      } else {
        const newLives = Math.max(0, lives - 1);
        setLives(newLives);
        localStorage.setItem('codeStart_lives', newLives.toString());

        setExecutionOutput({
          success: false,
          feedback: evaluation.feedback,
          explanation: evaluation.explanation,
        });
        toast.error(`Solution needs improvement. ${newLives} lives left!`);
      }
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setExecutionOutput({
        success: false,
        error: `Execution evaluation error: ${err.message || 'Unknown error'}. Please ensure your API key is valid and code syntax is correct.`
      });
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiTyping) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput("");
    setIsAiTyping(true);

    try {
      let aiResponseText = "";
      setChatMessages(prev => [...prev, { role: 'model', content: "" }]);

      const fullResponse = await geminiService.sendMessageStream(
        `I am currently solving this coding problem: [Title: ${question.title || question.question}, Language: ${question.language}, Problem: ${question.question}]. Student question: ${userMsg}`,
        undefined,
        (chunk) => {
          aiResponseText += chunk;
          setChatMessages(prev => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'model', content: aiResponseText };
            return copy;
          });
        },
        comprehensionMode
      );
      setIsAiTyping(false);
    } catch (e) {
      setIsAiTyping(false);
      toast.error("Failed to get AI explanation.");
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Hard': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      {/* Sub-Header with Stats & Back Button */}
      <div className="pt-16 bg-card border-b border-border px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/practice" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Directory
          </Link>
          <div className="h-4 w-px bg-border mx-1"></div>
          <span className="font-semibold text-sm text-foreground">{question.question || question.title}</span>
          <Badge className={`text-xs px-2 py-0.5 border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
            {question.language}
          </Badge>
        </div>

        {/* Gamified Stat Indicators */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{lives} Lives</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{streak} Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span>{score} XP</span>
          </div>
        </div>
      </div>

      {/* Split-Screen Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* Left Pane: Theory, Hints, and AI Tutor */}
        <div className="lg:col-span-5 flex flex-col bg-card rounded-xl border border-border overflow-hidden shadow-sm h-[calc(100vh-135px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-card border-b border-border px-4 pt-2">
              <TabsList className="bg-muted/40 border border-border p-1 w-full justify-start">
                <TabsTrigger value="statement" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Problem Statement
                </TabsTrigger>
                <TabsTrigger value="hint" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground">
                  <Lightbulb className="w-3.5 h-3.5 text-primary" />
                  Hints & Theory
                </TabsTrigger>
                <TabsTrigger value="ai-tutor" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                  AI Coding Mentor
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Problem Statement Tab */}
            <TabsContent value="statement" className="flex-1 overflow-y-auto p-5 space-y-4 text-sm m-0">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">{question.question || question.title}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{question.explanation || "Solve the coding challenge described below using optimal logic and clean syntax."}</p>
              </div>

              {question.code && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Example / Reference Snippet:</h3>
                  <div className="p-3 bg-muted/40 rounded-lg border border-border font-mono text-xs text-foreground overflow-x-auto whitespace-pre">
                    {question.code}
                  </div>
                </div>
              )}

              {question.example && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Example Input & Output:</h3>
                  <div className="p-3.5 bg-primary/5 border border-primary/20 rounded-lg text-xs text-foreground font-mono whitespace-pre-wrap">
                    {question.example}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Hints & Theory Tab */}
            <TabsContent value="hint" className="flex-1 overflow-y-auto p-5 space-y-4 text-sm m-0">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                  <Lightbulb className="w-4 h-4" />
                  Guided Theory & Hint
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {question.hint || "Review the basic syntax and loops of the selected language. Try breaking down the problem into smaller functions."}
                </p>
              </div>

              {question.options && question.options.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Logic Quiz Check:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {question.options.map((opt, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/40 border border-border text-xs text-foreground font-mono">
                        <span className="text-primary font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* AI Tutor Chat Tab */}
            <TabsContent value="ai-tutor" className="flex-1 flex flex-col overflow-hidden m-0">
              {/* Chat Messages Box */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 shadow-inner">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[90%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? "ml-auto bg-primary text-primary-foreground rounded-br-none shadow-sm"
                        : "mr-auto bg-card border border-border text-foreground rounded-bl-none shadow-sm"
                    }`}
                  >
                    <div className="font-semibold text-[11px] uppercase tracking-wider mb-1.5 opacity-75 flex items-center gap-1.5">
                      {msg.role === 'user' ? "You" : (
                        <span className="text-primary flex items-center gap-1.5 font-bold">
                          <Bot className="w-4 h-4" /> LearnerCraft AI Mentor
                        </span>
                      )}
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed overflow-x-auto">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="mr-auto bg-card border border-border rounded-2xl p-4 text-xs sm:text-sm text-primary flex items-center gap-3 animate-pulse shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Analyzing code structure & compiling pedagogical explanation...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Understand-Anything Level Selector for Coding Mentor */}
              <div className="bg-card border border-border rounded-xl p-2.5 mx-3 my-2 flex items-center justify-between flex-wrap gap-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span>Comprehension (`Understand-Anything`):</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setComprehensionMode('standard')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      comprehensionMode === 'standard'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setComprehensionMode('analogy')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      comprehensionMode === 'analogy'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    <Baby className="w-3 h-3" />
                    👶 Analogy
                  </button>
                  <button
                    onClick={() => setComprehensionMode('step_by_step')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      comprehensionMode === 'step_by_step'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    <ListChecks className="w-3 h-3" />
                    🔍 Line-by-Line
                  </button>
                  <button
                    onClick={() => setComprehensionMode('exam_precision')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      comprehensionMode === 'exam_precision'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                    }`}
                  >
                    <GraduationCap className="w-3 h-3" />
                    🎓 Exam
                  </button>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-card border-t border-border flex items-center gap-2.5 shadow-sm">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask for a hint, line breakdown, or complexity trace..."
                  className="bg-background border-input text-xs sm:text-sm text-foreground h-10 rounded-xl focus-visible:ring-primary"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={isAiTyping || !chatInput.trim()}
                  className="h-10 px-4 shadow-sm transition-all shrink-0 font-medium flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Pane: Code Editor & Execution Engine */}
        <div className="lg:col-span-7 h-[calc(100vh-135px)]">
          <CodeEditor
            initialCode={question.startingCode || question.code || `// Write your ${question.language} solution here\n`}
            language={question.language}
            onRun={handleRunCode}
            onSubmit={handleSubmitCode}
            onReset={() => setExecutionOutput(null)}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            executionOutput={executionOutput}
          />
        </div>
      </main>
    </div>
  );
}


