import os

CLASSIC_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources_classic"

app_tsx_content = """import { Toaster } from "@/components/ui/toaster";
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
const NotFound = lazy(() => import("./pages/NotFound"));

import { SupabaseProvider } from "@/integrations/supabase/provider";
import StudyAssistant from "@/components/StudyAssistant";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="/pyqs" element={<PYQs />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/practice" element={<PracticeDirectory />} />
                  <Route path="/practice/:problemId" element={<ProblemArena />} />
                  <Route path="/ai-tutor" element={<AITutor />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<OTPAuth />} />
                  <Route path="/old-login" element={<UserAuth />} />
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
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
"""

with open(os.path.join(CLASSIC_DIR, "src", "App.tsx"), "w", encoding="utf-8") as f:
    f.write(app_tsx_content)

print("Fixed App.tsx")
