import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Index = lazy(() => import("./pages/Index"));
const Notes = lazy(() => import("./pages/Notes"));
const Assignments = lazy(() => import("./pages/Assignments"));
const PYQs = lazy(() => import("./pages/PYQs"));
const Resources = lazy(() => import("./pages/Resources"));
const Admin = lazy(() => import("./pages/Admin"));
const Auth = lazy(() => import("./pages/Auth"));
const UserAuth = lazy(() => import("./pages/UserAuth"));
const OTPAuth = lazy(() => import("./pages/OTPAuth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PracticeDirectory = lazy(() => import("./pages/PracticeDirectory"));
const ProblemArena = lazy(() => import("./pages/ProblemArena"));
const AITutor = lazy(() => import("./pages/AITutor"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MockExam = lazy(() => import("./pages/MockExam"));
const StudyPlan = lazy(() => import("./pages/StudyPlan"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { StudyAssistant } from "@/components/StudyAssistant";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageSkeleton } from "@/components/PageSkeleton";
import { UserProfileProvider } from "@/contexts/UserProfileContext";

import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="learnercraft-theme">
      <UserProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="/pyqs" element={<PYQs />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/practice" element={<PracticeDirectory />} />
                  <Route path="/practice/:problemId" element={<ProblemArena />} />
                  <Route path="/ai-tutor" element={<AITutor />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/mock-exam" element={<MockExam />} />
                  <Route path="/study-plan" element={<StudyPlan />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/old-login" element={<UserAuth />} />
                  <Route path="/otp-auth" element={<OTPAuth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <StudyAssistant />
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </UserProfileProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
