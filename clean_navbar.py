with open("src/components/Navbar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines_to_remove = [
    "// Original EduResources Links (HIDDEN FOR SIH)",
    "// { to: \"/practice\", icon: Code2, label: \"Practice\" },",
    "// { to: \"/pyqs\", icon: FileText, label: \"PYQs\" },",
    "// { to: \"/notes\", icon: BookOpen, label: \"Notes\" },",
    "// { to: \"/assignments\", icon: ClipboardList, label: \"Assignments\" },",
    "// { to: \"/resources\", icon: FolderOpen, label: \"Resources\" }",
    "Code2,",
    "FileText,",
    "BookOpen,",
    "ClipboardList,",
    "FolderOpen"
]

for line in lines_to_remove:
    content = content.replace(line, "")

with open("src/components/Navbar.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Cleaned Navbar.tsx")
