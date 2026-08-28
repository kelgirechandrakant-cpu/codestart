import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to comment out all EduResources routes.
# The StatSarthi routes are grouped at the top. Let's find where the old routes start.

old_routes = """                  <Route path="/" element={<Index />} />
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
                  <Route path="*" element={<NotFound />} />"""

commented_routes = """                  {/* === EduResources Preserved Routes (Hidden for SIH) === */}
                  {/* 
                  <Route path="/" element={<Index />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="/pyqs" element={<PYQs />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/practice" element={<PracticeDirectory />} />
                  <Route path="/practice/:problemId" element={<ProblemArena />} />
                  <Route path="/ai-tutor" element={<AITutor />} />
                  <Route path="/admin-old" element={<Admin />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login-old" element={<OTPAuth />} />
                  <Route path="/old-login" element={<UserAuth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  */}
                  <Route path="*" element={<NotFound />} />"""

if old_routes in content:
    content = content.replace(old_routes, commented_routes)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed App.tsx")
else:
    print("Could not find exact block, let's try regex")
