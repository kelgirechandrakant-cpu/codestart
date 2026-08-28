import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { GraduationCap, Clock, ArrowRight, ArrowLeft, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp, RotateCcw, LayoutDashboard } from 'lucide-react';
import { ExamConfig, ExamSubject, ExamDifficulty, MockExamQuestion, ExamAttempt, TopicScore } from '@/types/learnercraft';
import { toast } from 'sonner';

const generateExamQuestions = async (config: ExamConfig): Promise<MockExamQuestion[]> => {
  try {
    const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('No API key');
    
    const { GoogleGenAI } = await import('@google/genai');
    const genai = new GoogleGenAI({ apiKey });
    
    let subjectText = config.subject;
    if (config.subject === 'Custom (from PDF)' && config.pdfContext) {
      subjectText = `the following context: ${config.pdfContext.substring(0, 1500)}`; // Trim for simplicity
    }
    
    const prompt = `Generate ${config.numQuestions} multiple choice questions about ${subjectText}.
Difficulty: ${config.difficulty}

Return ONLY a valid JSON array with this exact structure (no markdown, no code fences):
[
  {
    "id": 1,
    "question": "What is the output of...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Because...",
    "topic": "Arrays",
    "difficulty": "Medium"
  }
]`;
    
    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    
    const text = response.text || '';
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    
    // Attempt standard parse if no brackets matched
    return JSON.parse(text);
  } catch (error) {
    console.error('Exam generation error:', error);
    throw error;
  }
};

const subjects: ExamSubject[] = [
  'C Programming', 'Python', 'Data Structures', 'Algorithms', 
  'Operating Systems', 'Database Management', 'Computer Networks', 
  'Object Oriented Programming', 'Custom (from PDF)'
];
const difficulties: ExamDifficulty[] = ['Easy', 'Medium', 'Hard', 'Mixed'];
const questionCounts = [5, 10, 15, 20];
const timeLimits = [
  { label: 'No Limit', value: 0 },
  { label: '10 min', value: 10 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

export default function MockExam() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Config
  const [config, setConfig] = useState<ExamConfig>({
    subject: 'C Programming',
    numQuestions: 10,
    difficulty: 'Medium',
    timeLimitMinutes: 20
  });
  
  // Step 2: Taking Exam
  const [questions, setQuestions] = useState<MockExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  
  // Step 3: Results
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerActive && timeLeft <= 0 && config.timeLimitMinutes > 0) {
      submitExam();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleGenerate = async () => {
    if (config.subject === 'Custom (from PDF)' && !config.pdfContext) {
      toast.error('Please provide some context text or upload a PDF for custom exams.');
      return;
    }
    setIsLoading(true);
    try {
      const generated = await generateExamQuestions(config);
      setQuestions(generated);
      setUserAnswers(new Array(generated.length).fill(null));
      setCurrentIndex(0);
      setStep(2);
      
      if (config.timeLimitMinutes > 0) {
        setTimeLeft(config.timeLimitMinutes * 60);
      }
      setStartTime(Date.now());
      setTimerActive(true);
    } catch (error) {
      toast.error('Failed to generate exam. Please check your API key or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitExam = useCallback(() => {
    setTimerActive(false);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    let score = 0;
    const topicData: Record<string, { correct: number; total: number }> = {};
    
    questions.forEach((q, idx) => {
      if (!topicData[q.topic]) {
        topicData[q.topic] = { correct: 0, total: 0 };
      }
      topicData[q.topic].total += 1;
      
      if (userAnswers[idx] === q.correctIndex) {
        score += 1;
        topicData[q.topic].correct += 1;
      }
    });
    
    const topicBreakdown: TopicScore[] = Object.keys(topicData).map(topic => ({
      topic,
      correct: topicData[topic].correct,
      total: topicData[topic].total,
      percentage: Math.round((topicData[topic].correct / topicData[topic].total) * 100)
    }));
    
    const newAttempt: ExamAttempt = {
      id: Date.now().toString(),
      config,
      questions,
      userAnswers,
      score,
      totalQuestions: questions.length,
      timeTakenSeconds: timeTaken,
      topicBreakdown,
      completedAt: Date.now()
    };
    
    setAttempt(newAttempt);
    
    const saved = localStorage.getItem('learnercraft_exam_results');
    const existing = saved ? JSON.parse(saved) : [];
    localStorage.setItem('learnercraft_exam_results', JSON.stringify([newAttempt, ...existing]));
    
    const examsTaken = parseInt(localStorage.getItem('learnercraft_exams_taken') || '0', 10);
    localStorage.setItem('learnercraft_exams_taken', (examsTaken + 1).toString());
    
    setStep(3);
    toast.success('Exam completed!');
  }, [questions, userAnswers, startTime, config]);

  const toggleQuestionExpanded = (idx: number) => {
    setExpandedQuestions(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-background px-4 md:px-8 pt-24 pb-16 flex justify-center">
      <div className="w-full max-w-4xl">
        
        {step === 1 && (
          <div className="space-y-10">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Exam Configuration</h1>
              <p className="text-muted-foreground max-w-[65ch] leading-relaxed">
                Set your parameters and let AI craft a personalized test for you.
              </p>
            </div>
            
            <div className="rounded-[2rem] bg-muted/30 p-2">
              <div className="bg-background rounded-[1.75rem] p-6 md:p-10 shadow-sm border border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-4">
                    <Label className="text-foreground text-base">Subject</Label>
                    <Select value={config.subject} onValueChange={(val) => setConfig({...config, subject: val as ExamSubject})}>
                      <SelectTrigger className="h-14 rounded-xl bg-muted/20 border-border/50 hover:bg-muted/30 transition-colors">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-foreground text-base">Time Limit</Label>
                    <Select 
                      value={config.timeLimitMinutes.toString()} 
                      onValueChange={(val) => setConfig({...config, timeLimitMinutes: parseInt(val)})}
                    >
                      <SelectTrigger className="h-14 rounded-xl bg-muted/20 border-border/50 hover:bg-muted/30 transition-colors">
                        <SelectValue placeholder="Select time limit" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeLimits.map(t => (
                          <SelectItem key={t.value} value={t.value.toString()}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {config.subject === 'Custom (from PDF)' && (
                    <div className="space-y-4 md:col-span-2">
                      <Label className="text-foreground text-base">Custom Context</Label>
                      <textarea 
                        className="flex min-h-[140px] w-full rounded-xl bg-muted/20 border-border/50 px-4 py-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors hover:bg-muted/30"
                        placeholder="Paste context here..."
                        value={config.pdfContext || ''}
                        onChange={(e) => setConfig({...config, pdfContext: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <Label className="text-foreground text-base">Number of Questions</Label>
                    <RadioGroup 
                      value={config.numQuestions.toString()} 
                      onValueChange={(val) => setConfig({...config, numQuestions: parseInt(val)})}
                      className="grid grid-cols-2 gap-3"
                    >
                      {questionCounts.map(count => (
                        <div key={count} className="relative">
                          <RadioGroupItem value={count.toString()} id={`q-${count}`} className="peer sr-only" />
                          <Label 
                            htmlFor={`q-${count}`}
                            className="flex h-14 w-full items-center justify-center rounded-xl bg-muted/20 border border-border/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary cursor-pointer hover:bg-muted/40 transition-all font-medium text-muted-foreground"
                          >
                            {count}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-foreground text-base">Difficulty</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {difficulties.map(diff => (
                        <Button 
                          key={diff}
                          type="button"
                          variant={config.difficulty === diff ? 'default' : 'secondary'}
                          onClick={() => setConfig({...config, difficulty: diff})}
                          className={`h-14 rounded-xl shadow-none hover:-translate-y-0.5 transition-transform font-medium ${
                            config.difficulty === diff ? '' : 'bg-muted/20 hover:bg-muted/40 text-muted-foreground border border-border/50'
                          }`}
                        >
                          {diff}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-10 mt-10 border-t border-border/50">
                  <Button 
                    onClick={handleGenerate} 
                    className="w-full h-14 rounded-xl text-base font-medium shadow-none hover:-translate-y-1 transition-transform" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Exam...</>
                    ) : (
                      <><GraduationCap className="mr-2 h-5 w-5" /> Start Exam</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && currentQ && (
          <div className="max-w-3xl mx-auto pt-4 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                {config.timeLimitMinutes > 0 && (
                  <div className={`flex items-center font-mono text-sm font-medium px-3 py-1.5 rounded-full bg-muted/30 ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    {formatTime(timeLeft)}
                  </div>
                )}
              </div>
              <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-1.5 bg-muted/40" />
            </div>

            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center mb-6 px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border/50">
                  {currentQ.topic}
                </div>
                <h2 className="text-2xl font-medium leading-relaxed text-foreground max-w-[65ch]">
                  {currentQ.question}
                </h2>
              </div>
              
              <div className="grid gap-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const newAnswers = [...userAnswers];
                      newAnswers[currentIndex] = idx;
                      setUserAnswers(newAnswers);
                    }}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-200 ${
                      userAnswers[currentIndex] === idx 
                        ? 'bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5' 
                        : 'bg-muted/20 hover:bg-muted/40 text-foreground hover:-translate-y-0.5 border border-border/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 text-sm font-medium ${
                        userAnswers[currentIndex] === idx ? 'bg-primary-foreground/20' : 'bg-background text-muted-foreground'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="leading-relaxed">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-8">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                  disabled={currentIndex === 0}
                  className="rounded-xl h-12 px-6"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                
                {currentIndex === questions.length - 1 ? (
                  <Button 
                    onClick={submitExam} 
                    disabled={userAnswers[currentIndex] === null}
                    className="rounded-xl h-12 px-8 shadow-none hover:-translate-y-1 transition-transform"
                  >
                    Submit Exam <CheckCircle2 className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setCurrentIndex(c => Math.min(questions.length - 1, c + 1))}
                    disabled={userAnswers[currentIndex] === null}
                    className="rounded-xl h-12 px-8 shadow-none hover:-translate-y-1 transition-transform"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && attempt && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Exam Results</h1>
              <p className="text-muted-foreground max-w-[65ch] leading-relaxed">
                Subject: <span className="text-foreground font-medium">{attempt.config.subject}</span> • Difficulty: <span className="text-foreground font-medium">{attempt.config.difficulty}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 rounded-[2rem] bg-muted/30 p-8 flex flex-col justify-center border border-border/50">
                <div className="text-sm font-medium text-muted-foreground mb-4">Final Score</div>
                <div className={`text-7xl font-semibold tracking-tighter ${
                  (attempt.score / attempt.totalQuestions) > 0.7 ? 'text-primary' :
                  (attempt.score / attempt.totalQuestions) >= 0.4 ? 'text-amber-600' : 'text-destructive'
                }`}>
                  {Math.round((attempt.score / attempt.totalQuestions) * 100)}<span className="text-3xl text-muted-foreground">%</span>
                </div>
                <div className="text-lg text-muted-foreground mt-2 font-medium">
                  {attempt.score} out of {attempt.totalQuestions} correct
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 rounded-[2rem] bg-muted/30 p-8 border border-border/50">
                <h3 className="font-medium mb-6 text-foreground">Topic Breakdown</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attempt.topicBreakdown} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="topic" type="category" width={140} tick={{ fontSize: 13, fill: 'hsl(var(--foreground))' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        formatter={(val: number) => [`${val}%`, 'Accuracy']}
                        cursor={{fill: 'hsl(var(--muted))', opacity: 0.2}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={24}>
                        {attempt.topicBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="hsl(var(--primary))" className="opacity-80 hover:opacity-100 transition-opacity" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} className="rounded-xl h-12 px-6 hover:-translate-y-1 transition-transform shadow-none">
                <RotateCcw className="mr-2 h-4 w-4" /> Retake Exam
              </Button>
              <Button onClick={() => navigate('/dashboard')} variant="secondary" className="rounded-xl h-12 px-6 hover:-translate-y-1 transition-transform bg-muted/30 hover:bg-muted/50 text-foreground border border-border/50">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </Button>
            </div>

            <div className="space-y-6 pt-6">
              <h3 className="text-xl font-medium text-foreground">Detailed Review</h3>
              <div className="space-y-4">
                {attempt.questions.map((q, idx) => {
                  const userAns = attempt.userAnswers[idx];
                  const isCorrect = userAns === q.correctIndex;
                  const isExpanded = expandedQuestions.includes(idx);
                  
                  return (
                    <div key={idx} className="rounded-2xl bg-muted/20 border border-border/50 overflow-hidden transition-all duration-200">
                      <button 
                        className="w-full p-6 flex gap-6 text-left hover:bg-muted/30 transition-colors"
                        onClick={() => toggleQuestionExpanded(idx)}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isCorrect ? <CheckCircle2 className="text-primary w-6 h-6" /> : <XCircle className="text-destructive w-6 h-6" />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="font-medium text-foreground max-w-[65ch] leading-relaxed">
                            <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                            {q.question}
                          </p>
                          {!isExpanded && (
                            <div className="flex items-center gap-6 text-sm">
                              <span className="text-muted-foreground">Your answer: <span className={`font-medium ${isCorrect ? 'text-primary' : 'text-destructive'}`}>{userAns !== null ? String.fromCharCode(65 + userAns) : 'None'}</span></span>
                              {!isCorrect && <span className="text-muted-foreground">Correct answer: <span className="font-medium text-primary">{String.fromCharCode(65 + q.correctIndex)}</span></span>}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-background/50">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 pl-[4.5rem]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className={`p-4 rounded-xl text-sm flex items-start gap-3 transition-colors ${
                                  oIdx === q.correctIndex ? 'bg-primary/10 text-primary-foreground dark:text-primary font-medium' : 
                                  oIdx === userAns && !isCorrect ? 'bg-destructive/10 text-destructive font-medium' : 
                                  'bg-background text-foreground'
                                }`}>
                                  <span className="font-medium text-muted-foreground">{String.fromCharCode(65 + oIdx)}.</span>
                                  <span className="leading-relaxed">{opt}</span>
                                </div>
                              ))}
                            </div>
                            <div className="bg-background rounded-xl p-6 border border-border/50">
                              <h4 className="text-sm font-medium flex items-center mb-3 text-foreground">
                                <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" /> 
                                Explanation
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed max-w-[65ch]">
                                {q.explanation}
                              </p>
                              <div className="flex gap-2 mt-6">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border/50">
                                  {q.topic}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border/50">
                                  {q.difficulty}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
