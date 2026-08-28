import re

with open('src/pages/statsarthi/Landing.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add User icon to imports
content = content.replace('ArrowRight, Brain, Target, Shield, Users, BarChart3, GraduationCap', 'ArrowRight, Brain, Target, Shield, Users, User, BarChart3, GraduationCap')

old_buttons = """          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg" asChild>
              <Link to="/onboarding">
                Set Up Official Profile <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white" asChild>
              <Link to="/admin">
                Admin Dashboard
              </Link>
            </Button>
          </div>"""

new_cards = """          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12 text-left">
            
            {/* Learner Persona Card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-primary/20 shadow-xl hover:border-primary transition-all relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">I am a MoSPI Official</h3>
                <p className="text-slate-600 mb-8 h-12">Identify your competency gaps and get your personalized iGOT learning pathway.</p>
                <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-md group-hover:shadow-lg transition-all" asChild>
                  <Link to="/onboarding">
                    Enter Learner Portal <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Trainer/Admin Persona Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:border-slate-300 transition-all relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-32 h-32 text-slate-900" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">I am an NSSTA Trainer</h3>
                <p className="text-slate-600 mb-8 h-12">Analyze workforce gaps and use AI to generate new training content and quizzes.</p>
                <Button size="lg" variant="outline" className="w-full h-14 text-lg border-2 hover:bg-slate-50 transition-all" asChild>
                  <Link to="/admin">
                    Enter Admin Portal <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

          </div>"""

content = content.replace(old_buttons, new_cards)

with open('src/pages/statsarthi/Landing.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
