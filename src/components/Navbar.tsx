import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, LayoutDashboard, GraduationCap, Target, Bot, LogOut } from "lucide-react";
import { useUserProfile } from "@/contexts/UserProfileContext";

export const Navbar = () => {
  const { user, profile, logout } = useUserProfile();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/mock-exam", icon: GraduationCap, label: "Mock Exam" },
    { to: "/study-plan", icon: Target, label: "Study Plan" },
    { to: "/practice", icon: Code2, label: "Practice" },
    { to: "/ai-tutor", icon: Bot, label: "AI Tutor" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span className="font-bold text-xl tracking-tight">LearnerCraft</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.to} to={link.to} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline-block">
                {profile?.name || user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button asChild variant="default" className="rounded-full px-6">
              <Link to="/login">Sign In / Save Progress</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
