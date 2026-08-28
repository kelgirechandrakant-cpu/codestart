import re

with open("src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Lines to remove entirely
lines_to_remove = [
    "const Index = lazy(() => import(\"./pages/Index\"));",
    "const Notes = lazy(() => import(\"./pages/Notes\"));",
    "const Assignments = lazy(() => import(\"./pages/Assignments\"));",
    "const PYQs = lazy(() => import(\"./pages/PYQs\"));",
    "const Resources = lazy(() => import(\"./pages/Resources\"));",
    "const Admin = lazy(() => import(\"./pages/Admin\"));",
    "const Auth = lazy(() => import(\"./pages/Auth\"));",
    "const UserAuth = lazy(() => import(\"./pages/UserAuth\"));",
    "const OTPAuth = lazy(() => import(\"./pages/OTPAuth\"));",
    "const AuthCallback = lazy(() => import(\"./pages/AuthCallback\"));",
    "const PrivacyPolicy = lazy(() => import(\"./pages/PrivacyPolicy\"));",
    "const About = lazy(() => import(\"./pages/About\"));",
    "const Contact = lazy(() => import(\"./pages/Contact\"));",
    "const PracticeDirectory = lazy(() => import(\"./pages/PracticeDirectory\"));",
    "const ProblemArena = lazy(() => import(\"./pages/ProblemArena\"));",
    "const AITutor = lazy(() => import(\"./pages/AITutor\"));",
    "// Original EduResources Pages (HIDDEN FOR SIH)",
    "// <Route path=\"/practice\" element={<PracticeDirectory />} />",
    "// <Route path=\"/practice/:language\" element={<ProblemArena />} />",
    "// <Route path=\"/pyqs\" element={<PYQs />} />",
    "// <Route path=\"/notes\" element={<Notes />} />",
    "// <Route path=\"/assignments\" element={<Assignments />} />",
    "// <Route path=\"/resources\" element={<Resources />} />",
    "// <Route path=\"/admin\" element={<Admin />} />",
    "// <Route path=\"/auth\" element={<Auth />} />",
    "// <Route path=\"/auth/callback\" element={<AuthCallback />} />",
    "// <Route path=\"/about\" element={<About />} />",
    "// <Route path=\"/contact\" element={<Contact />} />",
    "// <Route path=\"/privacy\" element={<PrivacyPolicy />} />",
    "// <Route path=\"/ai-tutor\" element={<AITutor />} />",
    "import StudyAssistant from \"@/components/StudyAssistant\";",
    "import { SupabaseProvider } from \"@/integrations/supabase/provider\";",
    "{/* <StudyAssistant /> */}",
]

for line in lines_to_remove:
    content = content.replace(line, "")

# Clean up empty lines
content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

# Remove SupabaseProvider wrapper
content = content.replace("<SupabaseProvider>", "")
content = content.replace("</SupabaseProvider>", "")

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Cleaned App.tsx")
