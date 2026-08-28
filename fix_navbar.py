import os

CLASSIC_DIR = "C:\\Users\\CHANDRAKANT\\Downloads\\eduresources_classic"

navbar_tsx_content = """import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, ClipboardList, FolderOpen, Code2 } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Navbar = () => {
  const navLinks = [
    { to: "/practice", icon: Code2, label: "Practice" },
    { to: "/pyqs", icon: FileText, label: "PYQs" },
    { to: "/notes", icon: BookOpen, label: "Notes" },
    { to: "/assignments", icon: ClipboardList, label: "Assignments" },
    { to: "/resources", icon: FolderOpen, label: "Resources" }
  ];

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">EduResources</span>
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
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
"""

with open(os.path.join(CLASSIC_DIR, "src", "components", "Navbar.tsx"), "w", encoding="utf-8") as f:
    f.write(navbar_tsx_content)

print("Fixed Navbar.tsx")
