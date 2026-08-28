import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  GraduationCap, 
  Calendar, 
  Bot, 
  Laptop, 
  Terminal,
  Target,
  BookOpen
} from "lucide-react";

export default function Index() {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem("learnercraft_profile");
    if (profile) {
      setHasProfile(true);
    }
  }, []);

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      
      {/* HERO SECTION: Split layout, min-100dvh, left-aligned, real image placeholder */}
      <section className="relative min-h-[100dvh] flex items-center pt-24 pb-16 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="max-w-[45ch]"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-foreground leading-[1.05]"
            >
              Stop studying alone. Start building skills.
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[40ch]"
            >
              Your AI team of tutors, examiners, and study planners. Free, personalized, and built for students.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-base rounded-full shadow-sm hover:-translate-y-0.5 transition-transform">
                <Link to="/practice">Try It Free</Link>
              </Button>
              <Button variant="ghost" size="lg" className="h-14 px-6 text-base rounded-full hover:bg-muted" onClick={scrollToHowItWorks}>
                See how it works
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual Asset */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted border border-border/50 shadow-2xl lg:ml-auto lg:max-w-md"
          >
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
              alt="Students collaborating" 
              className="object-cover w-full h-full opacity-90 transition-opacity hover:opacity-100"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10 rounded-[2rem]" />
          </motion.div>
        </div>
        
        {/* Subtle background gradient to break plain white/black */}
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] opacity-20 dark:opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen translate-x-1/3 -translate-y-1/4" />
        </div>
      </section>

      {/* START WHERE YOU ARE: Bento Grid */}
      <section className="px-6 py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={fadeInUp} 
            className="mb-12 max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Start where you are.</h2>
            <p className="text-lg text-muted-foreground">Everyone's journey is different. Pick the path that matches your current goal.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* New to Coding - Large Accent Tile */}
            <motion.div variants={fadeInUp} className="md:col-span-2">
              <Link to="/onboarding?path=new-to-coding" className="group block h-full">
                <div className="h-full bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-10 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-lg">
                  <div>
                    <Terminal className="h-10 w-10 mb-6 opacity-80" />
                    <h3 className="text-2xl font-semibold mb-3">I'm new to coding</h3>
                    <p className="text-primary-foreground/80 text-lg max-w-[40ch]">
                      Start from zero with guided lessons. We'll teach you step by step, no experience needed.
                    </p>
                  </div>
                  <div className="mt-12 flex items-center gap-2 font-medium">
                    <span>Begin learning</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Exam Prep - Secondary Tile */}
            <motion.div variants={fadeInUp} className="md:col-span-1">
              <Link to="/onboarding?path=exam-prep" className="group block h-full">
                <div className="h-full bg-muted/50 border border-border/50 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-md hover:bg-muted">
                  <div>
                    <BookOpen className="h-10 w-10 mb-6 text-foreground/70" />
                    <h3 className="text-xl font-semibold mb-3">I'm studying for an exam</h3>
                    <p className="text-muted-foreground">
                      Upload your syllabus, get a study plan, and take AI-powered mock exams.
                    </p>
                  </div>
                  <div className="mt-12 flex items-center gap-2 font-medium text-foreground">
                    <span>Prepare now</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Specific Goal */}
            <motion.div variants={fadeInUp} className="md:col-span-1">
              <Link to="/onboarding?path=specific-goal" className="group block h-full">
                <div className="h-full bg-muted/50 border border-border/50 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-md hover:bg-muted">
                  <div>
                    <Target className="h-10 w-10 mb-6 text-foreground/70" />
                    <h3 className="text-xl font-semibold mb-3">I have a specific goal</h3>
                    <p className="text-muted-foreground">
                      Tell us what you want to achieve and we'll build your personalized path.
                    </p>
                  </div>
                  <div className="mt-12 flex items-center gap-2 font-medium text-foreground">
                    <span>Set my goal</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Returning User */}
            {hasProfile && (
              <motion.div variants={fadeInUp} className="md:col-span-2">
                <Link to="/dashboard" className="group block h-full">
                  <div className="h-full bg-secondary text-secondary-foreground rounded-[2rem] p-8 md:p-10 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-lg">
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">Continue where you left off</h3>
                      <p className="text-secondary-foreground/80 text-lg">
                        Welcome back! Pick up from your last session and keep your streak alive.
                      </p>
                    </div>
                    <div className="mt-12 flex items-center gap-2 font-medium">
                      <span>Go to Dashboard</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FEATURE SHOWCASE: Asymmetric Layout */}
      <section className="px-6 py-24 md:py-32 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={fadeInUp} 
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Meet your AI learning team.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Feature 1: Wide */}
            <div className="md:col-span-8 bg-background border border-border/60 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col justify-between">
              <div>
                <GraduationCap className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-3">Mock Exams</h3>
                <p className="text-muted-foreground text-lg max-w-[45ch]">
                  AI generates exams from any subject. Timed, graded, with detailed feedback and performance tracking over time.
                </p>
              </div>
            </div>

            {/* Feature 2: Narrow */}
            <div className="md:col-span-4 bg-background border border-border/60 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col justify-between">
              <div>
                <Calendar className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-3">Study Plans</h3>
                <p className="text-muted-foreground">
                  Answer 5 questions, get a week-by-week personalized plan.
                </p>
              </div>
            </div>

            {/* Feature 3: Narrow */}
            <div className="md:col-span-5 bg-background border border-border/60 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col justify-between">
              <div>
                <Bot className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-3">AI Tutor</h3>
                <p className="text-muted-foreground">
                  Upload your PDF, get tutored on YOUR syllabus. Ask anything, anytime.
                </p>
              </div>
            </div>

            {/* Feature 4: Wide */}
            <div className="md:col-span-7 bg-background border border-border/60 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col justify-between">
              <div>
                <Laptop className="h-8 w-8 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-3">Coding Arena</h3>
                <p className="text-muted-foreground text-lg max-w-[45ch]">
                  65+ problems across C, Python, JavaScript. From absolute beginner to interview-ready.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS: Sparse typography-led section */}
      <section id="how-it-works" className="px-6 py-32 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={fadeInUp}
              className="sticky top-32"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">How it works</h2>
              <p className="text-xl text-muted-foreground max-w-[30ch]">
                Three simple steps to transition from passive reading to active skill-building.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={staggerContainer}
              className="space-y-16"
            >
              {[
                { step: "01", title: "Tell us your goal", desc: "New to coding? Preparing for GATE? Just pick your path and we'll adapt the curriculum." },
                { step: "02", title: "AI creates your plan", desc: "Get a personalized study plan with daily tasks, achievable milestones, and curated resources." },
                { step: "03", title: "Practice & grow", desc: "Take mock exams, solve coding problems, and track your progress. Your AI team adapts as you improve." },
              ].map((item, idx) => (
                <motion.div key={idx} variants={fadeInUp} className="relative pl-12 border-l border-border/50">
                  <div className="absolute -left-5 top-0 w-10 h-10 bg-background border border-border/60 rounded-full flex items-center justify-center font-mono text-sm font-semibold text-primary">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA: Clean, high contrast */}
      <section className="px-6 py-32 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Start learning in 30 seconds.</h2>
            <p className="text-xl text-background/70 mb-12 max-w-[40ch] mx-auto">
              No credit card. No signup required. Just start building your skills today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild size="lg" className="h-14 px-10 text-lg rounded-full bg-background text-foreground hover:bg-background/90 w-full sm:w-auto">
                <Link to="/onboarding">Get started free</Link>
              </Button>
              <Link to="/login" className="text-background/70 hover:text-background font-medium underline underline-offset-4 transition-colors">
                Already have an account?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
