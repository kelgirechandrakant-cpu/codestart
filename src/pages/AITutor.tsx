import React, { useState, useEffect, useRef } from "react";
import { geminiService } from "@/services/geminiService";
import { Message } from "@/types/coding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bot, Send, Upload, FileText, Image as ImageIcon, X, Loader2, 
  Sparkles, Key, Check, Trash2,
  Headphones, ListChecks, FileQuestion, Layers
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I am your LearnerCraft AI Study Mentor. Upload any **Previous Year Question Paper (PYQ)** or **Study Notes PDF**, and I will tutor you strictly based on your syllabus! Or upload an image of a math/coding problem for step-by-step KaTeX explanations.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comprehensionMode, setComprehensionMode] = useState<'standard' | 'analogy' | 'step_by_step' | 'exam_precision'>('standard');

  const handleNotebookLMAction = async (type: 'podcast' | 'guide' | 'faq') => {
    if (isLoading) return;
    setIsLoading(true);

    const titleMap = {
      podcast: "Generating Audio Overview Script...",
      guide: "Compiling Deep-Dive Study Guide...",
      faq: "Building Socratic FAQ & Flashcard Matrix..."
    };

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `Please generate a ${type === 'podcast' ? 'Audio Overview Script' : type === 'guide' ? 'Deep-Dive Study Guide & PYQ Predictor' : 'High-Yield Socratic FAQ & Flashcards'} from the attached syllabus context.`,
        timestamp: Date.now()
      },
      {
        role: "model",
        content: titleMap[type],
        timestamp: Date.now()
      }
    ]);

    try {
      let resultText = "";
      if (type === 'podcast') {
        resultText = await geminiService.generateNotebookLMPodcast(uploadedPdfData || undefined);
      } else if (type === 'guide') {
        resultText = await geminiService.generateDeepDiveGuide(uploadedPdfData || undefined);
      } else if (type === 'faq') {
        resultText = await geminiService.generateSocraticFAQ(uploadedPdfData || undefined);
      }

      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "model",
          content: resultText,
          timestamp: Date.now()
        };
        return copy;
      });
      setIsLoading(false);
      toast.success(`Generated ${type === 'podcast' ? 'Audio Overview' : type === 'guide' ? 'Study Guide' : 'FAQ Matrix'}`);
    } catch (err: any) {
      setIsLoading(false);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "model",
          content: `Failed to generate synthesis. Error: ${err.message || 'API error'}`,
          timestamp: Date.now()
        };
        return copy;
      });
    }
  };

  // File Upload states
  const [uploadedPdfData, setUploadedPdfData] = useState<string | null>(null);
  const [uploadedPdfName, setUploadedPdfName] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // API Key modal/setting
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKeySetting, setShowApiKeySetting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Data = (event.target?.result as string).split(',')[1];
        setUploadedPdfData(base64Data);
        setUploadedPdfName(file.name);
        toast.success(`Context loaded: ${file.name}`);
        
        setMessages(prev => [
          ...prev,
          {
            role: 'user',
            content: `[System]: Attached syllabus context "${file.name}". Please ground all future explanations on this document.`,
            timestamp: Date.now()
          }
        ]);
      } catch (err) {
        toast.error("Failed to parse PDF.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removePdf = () => {
    setUploadedPdfData(null);
    setUploadedPdfName(null);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    toast.success("Syllabus context removed.");
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    if (!geminiService.hasApiKey()) {
      setShowApiKeySetting(true);
      return;
    }

    const userText = input.trim();
    let promptWithMode = userText;

    if (comprehensionMode === 'analogy') {
      promptWithMode = `(Explain this using an analogy from daily life, simple enough for a beginner) ${userText}`;
    } else if (comprehensionMode === 'step_by_step') {
      promptWithMode = `(Explain this step-by-step logically, showing the math/logic progression) ${userText}`;
    } else if (comprehensionMode === 'exam_precision') {
      promptWithMode = `(Answer this with precise terminology, bullet points, and high-yield facts expected in a university exam) ${userText}`;
    }

    const currentImagePreview = imagePreview;
    
    setInput("");
    removeImage();
    
    const newUserMsg: Message = { 
      role: 'user', 
      content: userText || "[Image Attached]", 
      timestamp: Date.now(),
      imagePreview: currentImagePreview || undefined
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      let imageBase64 = undefined;
      if (selectedImage) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(selectedImage);
        });
      }

      const response = await geminiService.sendMessageStream(
        promptWithMode, 
        uploadedPdfData || undefined,
        imageBase64
      );
      
      const newModelMsg: Message = { role: 'model', content: response, timestamp: Date.now() };
      setMessages(prev => [...prev, newModelMsg]);
    } catch (error: any) {
      toast.error(error.message || "Failed to get response");
      setMessages(prev => [
        ...prev, 
        { role: 'model', content: "Sorry, I encountered an error. Please try again.", timestamp: Date.now() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col selection:bg-primary/20">
      <div className="container mx-auto px-6 pt-24 pb-16 flex-1 flex flex-col max-w-5xl">
        
        {/* API Key Modal */}
        {showApiKeySetting && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border p-8 rounded-3xl w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Key className="w-6 h-6 text-primary" /> Setup AI Key
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                LearnerCraft runs on Google Gemini. Enter your free Gemini API key to power the AI Tutor.
              </p>
              <Input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="mb-4 h-12 rounded-xl"
              />
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowApiKeySetting(false)} className="rounded-full">Cancel</Button>
                <Button 
                  className="rounded-full px-6"
                  onClick={() => {
                    if (apiKeyInput.trim()) {
                      geminiService.setApiKey(apiKeyInput.trim());
                      setShowApiKeySetting(false);
                      toast.success("API Key saved");
                    }
                  }}
                >
                  Save Key
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Clean Header (Taste-skill: Left aligned, no eyebrow) */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">AI Study Mentor</h1>
          </div>
          <p className="text-lg text-muted-foreground mt-3 max-w-[55ch]">
            Your personal TA. Ask questions, upload your syllabus for contextual answers, or generate audio study guides.
          </p>
        </div>

        {/* NotebookLM Studio Features & Context (Taste-Skill Grid) */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Syllabus Context Card */}
          <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 text-foreground font-semibold mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h2>Syllabus Context</h2>
            </div>
            
            {uploadedPdfName ? (
              <div className="flex items-center justify-between bg-muted/50 border border-border p-4 rounded-2xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold truncate">{uploadedPdfName}</p>
                    <p className="text-xs text-muted-foreground">Context actively loaded</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removePdf} className="shrink-0 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  ref={pdfInputRef}
                  onChange={handlePdfUpload}
                />
                <Button 
                  variant="outline" 
                  className="w-full h-16 rounded-2xl border-dashed hover:border-primary/50 bg-background hover:bg-muted/50 transition-colors group"
                  onClick={() => pdfInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  Upload Course Notes or PYQ (PDF)
                </Button>
              </div>
            )}
          </div>

          {/* AI Features Card */}
          <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-foreground font-semibold mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2>Learning Materials</h2>
            </div>
            <div className="grid gap-3">
              <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => handleNotebookLMAction('podcast')}
                className="h-12 justify-start gap-3 rounded-xl hover:border-primary/50"
              >
                <Headphones className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium">Audio Overview Script</span>
              </Button>
              <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => handleNotebookLMAction('guide')}
                className="h-12 justify-start gap-3 rounded-xl hover:border-primary/50"
              >
                <ListChecks className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium">Deep-Dive Study Guide</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages Box */}
        <div className="flex-1 bg-card border border-border rounded-[2rem] p-6 overflow-y-auto mb-6 max-h-[600px] min-h-[420px] space-y-6 shadow-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] rounded-3xl p-5 text-[15px] leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                  : "mr-auto bg-muted/30 border border-border/50 text-foreground rounded-bl-sm"
              }`}
            >
              {msg.imagePreview && (
                <div className="mb-4">
                  <img src={msg.imagePreview} alt="Uploaded problem" className="max-h-64 rounded-xl border border-border object-contain bg-background" />
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background/80 prose-pre:border prose-pre:border-border">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mr-auto bg-muted/30 border border-border/50 rounded-3xl rounded-bl-sm p-5 text-[15px] text-muted-foreground flex items-center gap-3 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin shrink-0 text-primary" />
              <span>Analyzing context and compiling explanation...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview bar if selected */}
        {imagePreview && (
          <div className="bg-card border border-border rounded-2xl p-3 mb-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-border" />
              <div>
                <div className="text-sm font-semibold text-foreground">Image Attached</div>
                <div className="text-xs text-muted-foreground">Ready to send for math OCR or code explanation</div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeImage} className="text-muted-foreground hover:text-destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Understand-Anything Comprehension Selector */}
        <div className="bg-card border border-border rounded-2xl p-3 mb-4 flex items-center gap-4 flex-wrap shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground ml-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Comprehension Level:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'standard', label: 'Standard' },
              { id: 'analogy', label: 'Explain with Analogy' },
              { id: 'step_by_step', label: 'Step-by-Step' },
              { id: 'exam_precision', label: 'Exam Precision' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setComprehensionMode(mode.id as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  comprehensionMode === mode.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-end gap-3">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-14 w-14 shrink-0 rounded-2xl bg-card hover:bg-muted"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question, paste code, or type a math problem..."
              className="h-14 pr-14 text-base rounded-2xl bg-card border-border shadow-sm focus-visible:ring-primary/20"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="absolute right-2 top-2 h-10 w-10 rounded-xl"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
