import { Link } from "react-router-dom";
import { Bot, Mail, Linkedin, Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight">LearnerCraft</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              Your AI-powered learning operating system. Practice coding, ace exams, get personalized study plans, and master any subject with a personal team of AI specialists.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:hello@learnercraft.com" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Email us">
                <Mail className="h-4 w-4" />
              </a>
              <a href="https://github.com/kelgirechandrakant-cpu" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/in/chandrakant-kelgire/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Product Links */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/practice" className="text-muted-foreground hover:text-foreground transition-colors">Coding Practice</Link>
              </li>
              <li>
                <Link to="/mock-exam" className="text-muted-foreground hover:text-foreground transition-colors">AI Mock Exams</Link>
              </li>
              <li>
                <Link to="/study-plan" className="text-muted-foreground hover:text-foreground transition-colors">Study Planner</Link>
              </li>
              <li>
                <Link to="/ai-tutor" className="text-muted-foreground hover:text-foreground transition-colors">Document Tutor</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="font-semibold text-foreground mb-4">Legal & Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About the Project</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LearnerCraft. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">Built with React & Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
