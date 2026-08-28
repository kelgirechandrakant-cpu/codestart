import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Target, Users, GraduationCap, Heart, Lightbulb } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto px-4 pt-24 pb-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">About LearnerCraft</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted companion for academic success. We're dedicated to making quality educational 
              resources accessible to every student.
            </p>
          </div>

          {/* Main Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
              <p>
                LearnerCraft is a comprehensive educational platform created by students, for students. We understand 
                the challenges of academic life – the late-night study sessions, the scramble to find reliable resources, 
                and the stress of exam preparation. That's why we built LearnerCraft: to be the one-stop destination 
                for all your study material needs.
              </p>
              <p>
                Our platform brings together a vast collection of study notes, assignments, and previous year question 
                papers, all organized by department, year, semester, and subject. Whether you're preparing for your 
                first semester exams or tackling final year projects, LearnerCraft has you covered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p>
                Our mission is simple yet powerful: to democratize access to educational resources. We believe that 
                every student deserves access to quality study materials, regardless of their background or circumstances. 
                By curating and organizing educational content, we aim to level the playing field and help students 
                achieve their full academic potential.
              </p>
              <p>
                We're committed to maintaining a platform that is user-friendly, regularly updated, and completely 
                focused on the needs of students. Our goal is to reduce the time you spend searching for resources 
                and maximize the time you spend actually learning.
              </p>
            </section>
          </div>

          {/* Values Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality First</h3>
                  <p className="text-sm text-muted-foreground">
                    We curate only high-quality, relevant study materials that genuinely help students succeed.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Student-Centric</h3>
                  <p className="text-sm text-muted-foreground">
                    Every feature we build is designed with students in mind, based on real feedback and needs.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Free Access</h3>
                  <p className="text-sm text-muted-foreground">
                    We believe education should be accessible to all, which is why our resources are free to use.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What We Offer */}
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Comprehensive Study Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed notes covering all major subjects and topics, organized by department and semester.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Previous Year Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      Exam papers from previous years to help you understand patterns and prepare effectively.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Assignments & Solutions</h4>
                    <p className="text-sm text-muted-foreground">
                      Sample assignments with solutions to help you practice and understand key concepts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Organized Structure</h4>
                    <p className="text-sm text-muted-foreground">
                      Easy navigation through departments, years, semesters, and subjects to find what you need.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
              <p>
                LearnerCraft is more than just a resource platform – it's a growing community of students helping 
                students. We encourage you to make the most of our platform, share it with your classmates, and 
                reach out to us with any suggestions or feedback. Together, we can make education more accessible 
                and effective for everyone.
              </p>
              <p>
                Have questions or want to contribute? Visit our{" "}
                <a href="/contact" className="text-primary hover:underline">Contact Us</a> page to get in touch. 
                We'd love to hear from you!
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
