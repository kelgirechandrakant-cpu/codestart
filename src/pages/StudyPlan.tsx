import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Target, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  LayoutDashboard, 
  CheckCircle2, 
  Lightbulb 
} from 'lucide-react';
import { StudyPlanConfig, StudyPlan, StudyPlanWeek } from '@/types/learnercraft';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const generatePlan = async (config: StudyPlanConfig): Promise<StudyPlan> => {
  const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('No API key');
  
  const { GoogleGenAI } = await import('@google/genai');
  const genai = new GoogleGenAI({ apiKey });
  const prompt = `You are a world-class academic advisor. Create a detailed, week-by-week study plan.

Student Profile:
- Goal: ${config.goal}
- Current Level: ${config.currentLevel}
- Available Hours/Day: ${config.hoursPerDay}
- Deadline: ${config.deadlineWeeks} weeks
- Previous attempts: ${config.previousAttempts || 'None mentioned'}

Return ONLY valid JSON (no markdown, no code fences) with this structure:
{
  "title": "Your Study Plan Title",
  "overview": "2-3 sentence overview of the plan approach",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1: Foundations",
      "objective": "What you'll achieve this week",
      "dailyTasks": [
        { "day": "Monday", "tasks": ["Task 1", "Task 2"], "estimatedHours": 2 },
        { "day": "Tuesday", "tasks": ["Task 1", "Task 2"], "estimatedHours": 2 }
      ],
      "milestone": "By end of week, you should be able to..."
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;
  
  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });
  const text = response.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      id: Date.now().toString(),
      config,
      ...parsed,
      createdAt: Date.now()
    };
  }
  throw new Error('Failed to parse study plan');
};

export default function StudyPlanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  // Form State
  const [goal, setGoal] = useState('');
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [hoursPerDay, setHoursPerDay] = useState([2]);
  const [deadlineWeeks, setDeadlineWeeks] = useState(4);
  const [previousAttempts, setPreviousAttempts] = useState('');

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const config: StudyPlanConfig = {
        goal,
        currentLevel,
        hoursPerDay: hoursPerDay[0],
        deadlineWeeks,
        previousAttempts
      };
      const generatedPlan = await generatePlan(config);
      setPlan(generatedPlan);
      toast.success('Study plan created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = () => {
    if (!plan) return;
    try {
      const existing = localStorage.getItem('learnercraft_study_plans');
      const plans: StudyPlan[] = existing ? JSON.parse(existing) : [];
      plans.push(plan);
      localStorage.setItem('learnercraft_study_plans', JSON.stringify(plans));
      toast.success('Study plan saved to dashboard!');
    } catch (e) {
      toast.error('Failed to save study plan');
    }
  };

  const resetForm = () => {
    setPlan(null);
    setStep(1);
    setGoal('');
    setCurrentLevel('Beginner');
    setHoursPerDay([2]);
    setDeadlineWeeks(4);
    setPreviousAttempts('');
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-background container mx-auto px-4 pt-32 pb-16 max-w-4xl flex flex-col items-start justify-center">
        <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-8 border border-border/50">
           <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
        <h2 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Architecting your plan</h2>
        <p className="text-xl text-muted-foreground max-w-[65ch] leading-relaxed">
          Analyzing your goals, current level, and constraints to build the perfect week-by-week timeline. This will just take a moment.
        </p>
      </div>
    );
  }

  if (plan) {
    return (
      <div className="min-h-screen bg-background container mx-auto px-4 pt-24 pb-24 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-[65ch]">
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">{plan.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{plan.overview}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button variant="outline" onClick={handleSavePlan} className="rounded-xl px-5">
              <Save className="mr-2 h-4 w-4" /> Save Plan
            </Button>
            <Button onClick={() => navigate('/')} className="rounded-xl px-5">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {plan.weeks.map((week) => (
            <div key={week.weekNumber} className="bg-card rounded-[2rem] overflow-hidden border border-border/40 shadow-sm transition-all hover:border-border/80">
              <div 
                className="p-6 md:p-8 cursor-pointer flex items-start sm:items-center justify-between gap-6 hover:bg-muted/20 transition-colors"
                onClick={() => setExpandedWeek(expandedWeek === week.weekNumber ? null : week.weekNumber)}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-muted font-medium text-sm rounded-lg text-foreground">
                      Week {week.weekNumber}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {week.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{week.objective}</p>
                </div>
                <div className="h-10 w-10 shrink-0 bg-muted/50 rounded-full flex items-center justify-center transition-colors">
                  {expandedWeek === week.weekNumber ? (
                    <ChevronUp className="h-5 w-5 text-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-foreground" />
                  )}
                </div>
              </div>
              
              <AnimatePresence initial={false}>
                {expandedWeek === week.weekNumber && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-muted/10 border-t border-border/40"
                  >
                    <div className="p-6 md:p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                        {week.dailyTasks.map((day, idx) => (
                          <div key={idx} className="bg-background p-5 rounded-2xl border border-border/50 shadow-sm hover:-translate-y-0.5 transition-transform">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/40">
                              <span className="font-semibold text-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground"/> 
                                {day.day}
                              </span>
                              <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                                {day.estimatedHours}h
                              </span>
                            </div>
                            <div className="space-y-3">
                              {day.tasks.map((task, tIdx) => (
                                <div key={tIdx} className="flex items-start gap-3">
                                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <span className="text-sm text-foreground/80 leading-relaxed">{task}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-6 bg-primary text-primary-foreground rounded-2xl flex flex-col sm:flex-row items-start gap-4">
                        <div className="p-3 bg-primary-foreground/10 rounded-xl shrink-0">
                          <Target className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">Weekly Milestone</h4>
                          <p className="text-primary-foreground/90 leading-relaxed">{week.milestone}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3">
            <div className="p-2 bg-muted rounded-xl">
              <Lightbulb className="w-5 h-5 text-foreground" />
            </div>
            Pro Tips for Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.tips.map((tip, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground mb-4">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
          
        <div className="flex justify-start pt-16">
          <Button variant="ghost" onClick={resetForm} className="rounded-xl text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 pt-24 pb-24 max-w-4xl flex flex-col">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-muted rounded-2xl">
            <BookOpen className="h-6 w-6 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Study Plan Architect</h1>
        </div>
        
        <div className="flex gap-2 mb-8 max-w-md">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} 
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Step {step} of 5</p>
      </div>

      <div className="w-full relative flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card border border-border/40 rounded-[2rem] p-8 md:p-12 shadow-sm">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">What's your learning goal?</h2>
                <p className="text-lg text-muted-foreground mb-8">Be specific (e.g., "Master DSA for GATE", "Learn Python from scratch")</p>
                
                <div className="space-y-8">
                  <Input 
                    placeholder="Enter your goal..." 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="text-xl py-8 px-6 rounded-2xl border-border/50 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-all shadow-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && goal.trim().length > 0) handleNext();
                    }}
                  />
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleNext} disabled={goal.trim().length === 0} size="lg" className="rounded-xl px-8">
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card border border-border/40 rounded-[2rem] p-8 md:p-12 shadow-sm">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">What's your current level?</h2>
                <p className="text-lg text-muted-foreground mb-8">Where are you starting from?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button 
                      key={lvl}
                      onClick={() => setCurrentLevel(lvl as any)}
                      className={`p-6 rounded-2xl border text-left transition-all hover:-translate-y-1 ${
                        currentLevel === lvl 
                          ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary' 
                          : 'border-border/50 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className={`font-semibold text-lg mb-1 ${currentLevel === lvl ? 'text-primary' : 'text-foreground'}`}>{lvl}</div>
                      <div className="text-sm">
                        {lvl === 'Beginner' && 'Starting from scratch'}
                        {lvl === 'Intermediate' && 'Have some basic knowledge'}
                        {lvl === 'Advanced' && 'Looking to master the topic'}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-border/40">
                  <Button variant="ghost" onClick={handleBack} className="rounded-xl text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} size="lg" className="rounded-xl px-8">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card border border-border/40 rounded-[2rem] p-8 md:p-12 shadow-sm">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">How many hours per day can you commit?</h2>
                <p className="text-lg text-muted-foreground mb-8">Be realistic to avoid burnout.</p>
                
                <div className="space-y-12 mb-12">
                  <div className="flex items-baseline gap-3">
                    <span className="text-7xl font-bold tracking-tight text-foreground">{hoursPerDay[0]}</span>
                    <span className="text-xl text-muted-foreground font-medium">hours / day</span>
                  </div>
                  <Slider 
                    value={hoursPerDay} 
                    onValueChange={setHoursPerDay} 
                    max={8} 
                    min={1} 
                    step={1}
                    className="w-full py-4"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-border/40">
                  <Button variant="ghost" onClick={handleBack} className="rounded-xl text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} size="lg" className="rounded-xl px-8">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card border border-border/40 rounded-[2rem] p-8 md:p-12 shadow-sm">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">What's your deadline?</h2>
                <p className="text-lg text-muted-foreground mb-8">How long do you have to achieve this goal?</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[2, 4, 8, 12].map((weeks) => (
                    <button 
                      key={weeks}
                      onClick={() => setDeadlineWeeks(weeks)}
                      className={`p-6 rounded-2xl border text-center transition-all hover:-translate-y-1 ${
                        deadlineWeeks === weeks 
                          ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                          : 'border-border/50 bg-muted/30 hover:border-border hover:bg-muted/50'
                      }`}
                    >
                      <div className={`font-bold text-3xl mb-1 ${deadlineWeeks === weeks ? 'text-primary' : 'text-foreground'}`}>{weeks}</div>
                      <div className={`text-sm font-medium ${deadlineWeeks === weeks ? 'text-primary/80' : 'text-muted-foreground'}`}>Weeks</div>
                    </button>
                  ))}
                  <button 
                    onClick={() => setDeadlineWeeks(24)}
                    className={`col-span-2 md:col-span-4 p-6 rounded-2xl border text-center transition-all hover:-translate-y-1 ${
                      deadlineWeeks === 24 
                        ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                        : 'border-border/50 bg-muted/30 hover:border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className={`font-semibold text-lg ${deadlineWeeks === 24 ? 'text-primary' : 'text-foreground'}`}>
                      No strict deadline (24 weeks)
                    </div>
                  </button>
                </div>

                <div className="flex justify-between pt-4 border-t border-border/40">
                  <Button variant="ghost" onClick={handleBack} className="rounded-xl text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} size="lg" className="rounded-xl px-8">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card border border-border/40 rounded-[2rem] p-8 md:p-12 shadow-sm">
                <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">What have you tried before?</h2>
                <p className="text-lg text-muted-foreground mb-8">Optional: Tell us what didn't work so we can avoid it.</p>
                
                <div className="space-y-8 mb-8">
                  <textarea 
                    placeholder="e.g. Tried watching YouTube tutorials but got stuck on advanced concepts..."
                    value={previousAttempts}
                    onChange={(e) => setPreviousAttempts(e.target.value)}
                    className="w-full min-h-[160px] text-lg p-6 rounded-2xl border border-border/50 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none focus-visible:bg-background transition-all resize-none shadow-sm text-foreground"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-border/40">
                  <Button variant="ghost" onClick={handleBack} className="rounded-xl text-muted-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleGenerate} size="lg" className="rounded-xl px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate My Study Plan
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
