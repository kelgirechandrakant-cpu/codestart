import re

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update navLinks to clearly separate Learner and Admin tools
old_nav = """  const navLinks = [
    // StatSarthi Links
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/assessment", icon: Brain, label: "Gap Assessment" },
    { to: "/pathway", icon: GraduationCap, label: "iGOT Pathway" },
    { to: "/quiz", icon: PenTool, label: "Quiz Generator" },"""

new_nav = """  const navLinks = [
    // Learner Journey
    { to: "/dashboard", icon: LayoutDashboard, label: "My Dashboard" },
    { to: "/assessment", icon: Brain, label: "My Diagnostics" },
    { to: "/pathway", icon: GraduationCap, label: "My Pathway" },
    
    // NSSTA Trainer / Admin Journey
    { to: "/quiz", icon: PenTool, label: "AI Content Creator" },
    { to: "/admin", icon: LayoutDashboard, label: "Admin Hub" },"""

content = content.replace(old_nav, new_nav)

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
