import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/integrations/firebase/auth";
import { toast } from "sonner";
import { Bot, Loader2, ArrowRight } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useUserProfile();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // If already logged in via Firebase, redirect to dashboard
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        toast.success("Welcome back!");
      } else {
        await signUpWithEmail(email, password);
        toast.success("Account created successfully! Progress synced.");
      }
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Successfully signed in with Google! Progress synced.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground">
      
      {/* Left Side - Brand & Pitch (Hidden on small mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-muted/30 border-r border-border flex-col p-12 justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">LearnerCraft</span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your AI team is waiting.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[35ch] leading-relaxed">
            Create an account to save your progress, unlock advanced AI mock exams, and keep your learning streak alive across all devices.
          </p>
        </div>

        <div>
          <div className="bg-background border border-border p-6 rounded-[2rem] shadow-sm">
            <p className="italic text-muted-foreground mb-4">
              "LearnerCraft figured out my weak spots in Python within 3 practice questions. The generated study plan saved my finals."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div>
                <p className="font-semibold text-sm">Alex Chen</p>
                <p className="text-xs text-muted-foreground">Computer Science Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
        
        {/* Mobile Header */}
        <Link to="/" className="flex md:hidden items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight">LearnerCraft</span>
        </Link>

        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isLogin 
              ? "Enter your details to sign in to your account" 
              : "Sign up to sync your guest progress to the cloud"}
          </p>

          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl gap-3 text-base font-medium border-border hover:bg-muted/50 transition-colors"
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="h-14 rounded-2xl border-border bg-background"
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <Link to="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-2xl border-border bg-background"
                required 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-base mt-4 group"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-medium hover:underline text-foreground"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
