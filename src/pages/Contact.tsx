import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Clock, Linkedin } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto px-4 pt-24 pb-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <MessageSquare className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions, suggestions, or feedback? We'd love to hear from you. 
              Reach out to us and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    For general inquiries and support
                  </p>
                  <a 
                    href="mailto:contact@learnercraft.com" 
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    contact@learnercraft.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Response Time</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    We aim to respond within
                  </p>
                  <span className="text-primary text-sm font-medium">24-48 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="bg-[#0A66C2]/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <Linkedin className="h-7 w-7 text-[#0A66C2]" />
                  </div>
                  <h3 className="font-semibold mb-2">Connect</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Follow us for updates
                  </p>
                  <a 
                    href="https://www.linkedin.com/in/chandrakant-kelgire/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A66C2] hover:underline text-sm font-medium"
                  >
                    LinkedIn
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible. 
                All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={2000}
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.message.length}/2000 characters
                  </p>
                </div>

                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-12 prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6 not-prose">
              <div>
                <h3 className="font-semibold mb-2">How do I access the study resources?</h3>
                <p className="text-muted-foreground">
                  Simply create a free account and log in to browse and download our collection of study materials. 
                  You can navigate through departments, years, and subjects to find exactly what you need.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I contribute resources to the platform?</h3>
                <p className="text-muted-foreground">
                  We're always looking for quality study materials to help students. If you'd like to contribute, 
                  please contact us through this form with details about the resources you'd like to share.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">I found an error in a resource. How can I report it?</h3>
                <p className="text-muted-foreground">
                  Please use the contact form above to report any errors or issues with our resources. Include the 
                  resource name and a description of the error, and we'll work to correct it promptly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Is LearnerCraft free to use?</h3>
                <p className="text-muted-foreground">
                  Yes! LearnerCraft is completely free for students. We believe in making education accessible 
                  to everyone. Our platform is supported by advertisements to keep it running.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
