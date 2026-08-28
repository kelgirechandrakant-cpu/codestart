import { Link } from "react-router-dom";
import { BookOpen, Mail, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">LearnerCraft</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              LearnerCraft is your AI-powered learning operating system. Practice coding, ace exams, get personalized study plans, and master any subject with your personal team of AI specialists.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Resources
                </Link>
              </li>
              <li>
                <Link to="/notes" className="text-muted-foreground hover:text-primary transition-colors">
                  Study Notes
                </Link>
              </li>
              <li>
                <Link to="/assignments" className="text-muted-foreground hover:text-primary transition-colors">
                  Assignments
                </Link>
              </li>
              <li>
                <Link to="/pyqs" className="text-muted-foreground hover:text-primary transition-colors">
                  Previous Year Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="font-semibold mb-4">Legal & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LearnerCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:contact@learnercraft.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email us"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/chandrakant-kelgire/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
