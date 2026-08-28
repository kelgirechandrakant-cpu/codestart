import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, ArrowLeft, Rocket, Sparkles, BookOpen, Terminal, Briefcase, MoreHorizontal, Footprints, Compass, Code2, Brain, Hourglass, Clock, Timer, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '@/contexts/UserProfileContext';
import type { UserGoal, UserLevel, TimeCommitment, UserPath } from '@/contexts/UserProfileContext';

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pathParam = searchParams.get('path');
  
  const { setProfile } = useUserProfile();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');

  const [goal, setGoal] = useState<UserGoal | ''>('');
  const [customGoalText, setCustomGoalText] = useState('');

  const [level, setLevel] = useState<UserLevel | ''>('');
  
  const [time, setTime] = useState<TimeCommitment | ''>('');

  useEffect(() => {
    if (pathParam === 'new-to-coding') setGoal('learn');
    else if (pathParam === 'exam-prep') setGoal('exam');
    else if (pathParam === 'specific-goal') setGoal('other');
  }, [pathParam]);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleComplete();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    const profile = {
      name,
      college,
      year,
      goal: goal as UserGoal,
      goalText: customGoalText,
      level: level as UserLevel,
      timeCommitment: time as TimeCommitment,
      path: pathParam as UserPath,
      onboardingComplete: true,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    };
    setProfile(profile);

    if (level === 'beginner' && goal === 'learn') navigate('/practice');
    else if (goal === 'exam') navigate('/study-plan');
    else if ((level === 'intermediate' || level === 'advanced') && goal === 'practice') navigate('/practice');
    else if (goal === 'upskill') navigate('/dashboard');
    else navigate('/dashboard');
  };

  // Option lists
  const goals = [
    { id: 'learn', icon: Sparkles, title: 'Learn programming from scratch' },
    { id: 'exam', icon: BookOpen, title: 'Prepare for an exam (GATE/university)' },
    { id: 'practice', icon: Terminal, title: 'Practice DSA & coding problems' },
    { id: 'upskill', icon: Briefcase, title: 'Upskill for a job/internship' },
    { id: 'other', icon: MoreHorizontal, title: 'Something else' },
  ];

  const levels = [
    { id: 'beginner', icon: Footprints, title: 'Never coded before', desc: "I don't know what a variable is" },
    { id: 'basic', icon: Compass, title: 'I know the basics', desc: "Variables, loops, if/else — I've seen them" },
    { id: 'intermediate', icon: Code2, title: "I'm intermediate", desc: "I can write functions and solve simple problems" },
    { id: 'advanced', icon: Brain, title: "I'm advanced", desc: "DSA, OOP, system design — bring it on" },
  ];

  const times = [
    { id: '30m', icon: Hourglass, title: '30 minutes/day', desc: 'Perfect for busy schedules' },
    { id: '1h', icon: Clock, title: '1 hour/day', desc: 'Steady progress, great results' },
    { id: '2h+', icon: Timer, title: '2+ hours/day', desc: 'Serious learner mode' },
    { id: 'weekends', icon: Calendar, title: 'Weekends only', desc: 'A few hours on Saturday & Sunday' },
  ];

  const isNextDisabled = () => {
    if (step === 1) return name.trim() === '';
    if (step === 2) return goal === '' || (goal === 'other' && customGoalText.trim() === '');
    if (step === 3) return level === '';
    if (step === 4) return time === '';
    return false;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const [[page, direction], setPage] = useState([step, 0]);
  useEffect(() => {
    setPage((prev) => {
      const dir = step > prev[0] ? 1 : step < prev[0] ? -1 : 0;
      return [step, dir];
    });
  }, [step]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-16">
      <div className="container mx-auto px-4 max-w-xl w-full">
        
        {/* Progress */}
        <div className="mb-12">
          <Progress value={(step / totalSteps) * 100} className="h-1.5 rounded-full bg-muted" />
        </div>

        <div className="relative min-h-[480px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute w-full"
            >
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-8">
                {step === 1 && "What should we call you?"}
                {step === 2 && "What's your main goal?"}
                {step === 3 && "How much do you know already?"}
                {step === 4 && "How much time can you commit?"}
              </h1>
              
              <div className="space-y-6">
                
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Name <span className="text-primary">*</span></label>
                      <Input 
                        placeholder="e.g. Jane Doe" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="h-14 text-lg rounded-2xl bg-muted/30 border-transparent focus-visible:bg-background focus-visible:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">College (Optional)</label>
                      <Input 
                        placeholder="e.g. MIT" 
                        value={college} 
                        onChange={(e) => setCollege(e.target.value)}
                        className="h-14 text-lg rounded-2xl bg-muted/30 border-transparent focus-visible:bg-background focus-visible:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Year</label>
                      <Select onValueChange={setYear} value={year}>
                        <SelectTrigger className="h-14 text-lg rounded-2xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-colors">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                          <SelectItem value="Graduate">Graduate</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    {goals.map((g) => {
                      const Icon = g.icon;
                      const isSelected = goal === g.id;
                      return (
                        <div 
                          key={g.id}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-4 hover:-translate-y-1 ${
                            isSelected 
                              ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                              : 'border-transparent bg-muted/30 hover:bg-muted/50 text-foreground'
                          }`}
                          onClick={() => setGoal(g.id as any)}
                        >
                          <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-primary/10' : 'bg-background shadow-sm'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="font-medium text-lg">{g.title}</div>
                        </div>
                      );
                    })}
                    {goal === 'other' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <Input 
                          autoFocus
                          placeholder="Tell us what you want to achieve..." 
                          value={customGoalText}
                          onChange={(e) => setCustomGoalText(e.target.value)}
                          className="mt-3 h-14 text-lg rounded-2xl bg-muted/30 border-transparent focus-visible:bg-background focus-visible:border-primary transition-colors"
                        />
                      </motion.div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    {levels.map((l) => {
                      const Icon = l.icon;
                      const isSelected = level === l.id;
                      return (
                        <div 
                          key={l.id}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-4 hover:-translate-y-1 ${
                            isSelected 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-transparent bg-muted/30 hover:bg-muted/50'
                          }`}
                          onClick={() => setLevel(l.id as any)}
                        >
                          <div className={`p-2.5 rounded-xl mt-0.5 ${isSelected ? 'bg-primary/10 text-primary' : 'bg-background text-muted-foreground shadow-sm'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className={`font-medium text-lg ${isSelected ? 'text-primary' : 'text-foreground'}`}>{l.title}</div>
                            <div className={`text-sm mt-1 ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}`}>{l.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    {times.map((t) => {
                      const Icon = t.icon;
                      const isSelected = time === t.id;
                      return (
                        <div 
                          key={t.id}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start gap-4 hover:-translate-y-1 ${
                            isSelected 
                              ? 'border-primary bg-primary/5 shadow-sm' 
                              : 'border-transparent bg-muted/30 hover:bg-muted/50'
                          }`}
                          onClick={() => setTime(t.id as any)}
                        >
                          <div className={`p-2.5 rounded-xl mt-0.5 ${isSelected ? 'bg-primary/10 text-primary' : 'bg-background text-muted-foreground shadow-sm'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className={`font-medium text-lg ${isSelected ? 'text-primary' : 'text-foreground'}`}>{t.title}</div>
                            <div className={`text-sm mt-1 ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}`}>{t.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-between items-center w-full relative z-10 pt-4">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={step === 1}
            className={`h-12 px-6 rounded-full transition-opacity ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={isNextDisabled()}
            className="h-12 px-8 rounded-full font-medium"
          >
            {step === totalSteps ? (
              <>
                Complete <Rocket className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
