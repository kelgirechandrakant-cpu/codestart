import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Message, ExamTopic, QuizQuestion, QuizResult } from "../types/coding";

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private chatInstance: Chat | null = null;
  private currentPdfData: string | null = null;

  private getAI(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || localStorage.getItem('gemini_api_key') || '';
      if (!apiKey) {
        console.warn("No Gemini API key found in VITE_GEMINI_API_KEY or localStorage.");
      }
      this.ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
    }
    return this.ai;
  }

  public setApiKey(key: string) {
    localStorage.setItem('gemini_api_key', key);
    this.ai = new GoogleGenAI({ apiKey: key });
    this.chatInstance = null;
  }

  public async createChat(history: Message[] = [], pdfData?: string) {
    this.currentPdfData = pdfData || null;
    const ai = this.getAI();
    
    let formattedHistory: any[] = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    if (pdfData) {
      const match = pdfData.match(/^data:(application\/pdf);base64,(.*)$/);
      if (match) {
        formattedHistory.unshift({
          role: 'user',
          parts: [
            { text: "Here are my study notes/syllabus. Please base all future answers, hints, and code practice exclusively on this material." },
            { inlineData: { data: match[2], mimeType: match[1] } }
          ]
        });
        formattedHistory.splice(1, 0, {
          role: 'model',
          parts: [{ text: "Understood. I have reviewed your notes and will restrict my teaching and problem generation to the scope and patterns covered in this material." }]
        });
      }
    }

    const chatConfig: any = {
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction: `You are LearnerCraft AI, an expert Software Engineering & Coding Tutor specializing in interactive practice (Coddy/LeetCode style), system design, and programming languages. 
        Your goal is to help students write clean, efficient code, understand complex algorithms, and master their course curriculum.
        
        Guidelines:
        1. Always be encouraging, patient, and pedagogical.
        2. When a student asks about a coding problem or gets a syntax error, provide guided hints instead of the full solution immediately.
        3. Use Markdown for formatting (bolding key terms, using code blocks with syntax highlighting).
        4. Focus on time and space complexity (Big O notation) when discussing algorithms.
        5. If a student submits an image of code or a math equation, analyze it step-by-step and use KaTeX math formatting if needed.`,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    };

    if (formattedHistory.length > 0) {
      chatConfig.history = formattedHistory;
    }

    this.chatInstance = ai.chats.create(chatConfig);
  }

  public async sendMessageStream(
    message: string, 
    imageData: string | undefined, 
    onChunk: (chunk: string) => void,
    mode: 'standard' | 'analogy' | 'step_by_step' | 'exam_precision' = 'standard'
  ) {
    if (!this.chatInstance) {
      await this.createChat();
    }

    try {
      let promptPrefix = "";
      if (mode === 'analogy') {
        promptPrefix = "[Understand-Anything Mode: ≡ƒæ╢ Feynman / Analogy Mode. Please explain the following concept, problem, or code using intuitive, relatable real-world analogies suitable for a 5-year-old or beginner, avoiding dry technical jargon initially before gently bridging to the technical truth.]\n\n";
      } else if (mode === 'step_by_step') {
        promptPrefix = "[Understand-Anything Mode: ≡ƒöì Step-by-Step Execution Trace. Please break down the following concept, math proof, or code line-by-line, showing exact memory/variable changes or step-by-step mathematical logic clearly numbered.]\n\n";
      } else if (mode === 'exam_precision') {
        promptPrefix = "[Understand-Anything Mode: ≡ƒÄô University Exam Precision Mode. Please give the formal academic definition, key bullet points, theorems/complexity proofs, and high-yield scoring keywords tailored for scoring 100% on a university engineering exam.]\n\n";
      }

      let messageContent: any[] = [{ text: promptPrefix + message }];
      
      if (imageData) {
        const match = imageData.match(/^data:(image\/\w+);base64,(.*)$/);
        if (match) {
          messageContent.push({ inlineData: { data: match[2], mimeType: match[1] } });
        }
      }

      const result = await this.chatInstance!.sendMessageStream({ message: messageContent });
      let fullText = "";
      
      for await (const chunk of result) {
        const textChunk = chunk.text || "";
        fullText += textChunk;
        onChunk(textChunk);
      }
      
      return fullText;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  public async generateNotebookLMPodcast(pdfData?: string): Promise<string> {
    const ai = this.getAI();
    const promptText = `Generate a captivating, engaging 2-person educational podcast script (Audio Overview style, inspired by Google NotebookLM) based on the provided study notes/syllabus.
    
    Host 1 (Alex): An enthusiastic, curious engineering student who asks insightful questions and reacts naturally.
    Host 2 (Dr. Sam): A friendly, brilliant professor who explains complex topics with crystal clarity and real-world intuition.
    
    Format the output in clean Markdown with **Alex:** and **Dr. Sam:** dialogue turns. Cover the highest-yield concepts, key definitions, and practical intuition from the material. If no PDF is attached, generate a sample engaging discussion about Computer Science & Software Engineering foundations.`;

    let contents: any[] = [{ text: promptText }];
    if (pdfData || this.currentPdfData) {
      const activeData = pdfData || this.currentPdfData;
      if (activeData) {
        const match = activeData.match(/^data:(application\/pdf);base64,(.*)$/);
        if (match) {
          contents.push({ inlineData: { data: match[2], mimeType: match[1] } });
        }
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: { temperature: 0.8 }
    });
    return response.text || "Failed to generate podcast script.";
  }

  public async generateDeepDiveGuide(pdfData?: string): Promise<string> {
    const ai = this.getAI();
    const promptText = `Create a comprehensive **Deep-Dive Study Guide & PYQ Predictor** (inspired by Google NotebookLM synthesis) based on the provided syllabus or notes.
    
    Please structure your response into these exact Markdown sections:
    ### ≡ƒÄ» 1. Executive Topic Summary
    A concise overview of the core subject and its practical engineering importance.
    
    ### ≡ƒöæ 2. Core Definitions & Key Formulas / Syntax
    The must-memorize definitions, mathematical equations (formatted in KaTeX $...$ or $$...$$), or critical code patterns.
    
    ### ≡ƒö« 3. High-Yield PYQ Prediction Matrix
    List the top 3 to 5 most likely exam questions derived from these notes, complete with expected point values and grading criteria.
    
    ### ≡ƒÆí 4. Common Student Pitfalls & Pro Tips
    Where students typically lose marks on this topic and how to avoid those mistakes.`;

    let contents: any[] = [{ text: promptText }];
    if (pdfData || this.currentPdfData) {
      const activeData = pdfData || this.currentPdfData;
      if (activeData) {
        const match = activeData.match(/^data:(application\/pdf);base64,(.*)$/);
        if (match) {
          contents.push({ inlineData: { data: match[2], mimeType: match[1] } });
        }
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: { temperature: 0.7 }
    });
    return response.text || "Failed to generate study guide.";
  }

  public async generateSocraticFAQ(pdfData?: string): Promise<string> {
    const ai = this.getAI();
    const promptText = `Generate a **High-Yield Socratic FAQ & Flashcard Matrix** based on the provided syllabus document or topic notes.
    
    Format each item clearly:
    ### Γ¥ô Q1: [Thought-provoking concept question]
    **≡ƒÆí Socratic Hint:** A guided question to make the student think before checking the answer.
    **Γ£à Master Answer:** The precise, full-credit explanation with key terms bolded.
    **≡ƒÅ╖∩╕Å Difficulty:** \`Easy\` | \`Medium\` | \`Hard\`
    
    Generate at least 5 distinct, high-impact Q&A pairs covering the breadth of the material.`;

    let contents: any[] = [{ text: promptText }];
    if (pdfData || this.currentPdfData) {
      const activeData = pdfData || this.currentPdfData;
      if (activeData) {
        const match = activeData.match(/^data:(application\/pdf);base64,(.*)$/);
        if (match) {
          contents.push({ inlineData: { data: match[2], mimeType: match[1] } });
        }
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: { temperature: 0.7 }
    });
    return response.text || "Failed to generate FAQ matrix.";
  }

  public async generateQuizQuestion(topic: ExamTopic | string, subTopic?: string, pdfData?: string): Promise<QuizQuestion> {
    const ai = this.getAI();
    const topicText = `${topic}${subTopic ? ` (specifically focusing on: ${subTopic})` : ''}`;
    const promptText = `Generate a LeetCode-style coding problem for a student practicing ${topicText}. 
    ${pdfData ? "The problem MUST be strictly based on the concepts, patterns, and code covered in the provided PDF notes." : "The problem should be challenging but approachable (Medium difficulty)."}
    Do NOT include the solution.`;

    let contents: any[] = [{ text: promptText }];
    
    if (pdfData) {
      const match = pdfData.match(/^data:(application\/pdf);base64,(.*)$/);
      if (match) {
        contents.push({ inlineData: { data: match[2], mimeType: match[1] } });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            problemStatement: { type: Type.STRING },
            exampleInputOutput: { type: Type.STRING, description: "Examples formatted in markdown, e.g. Input: ... Output: ..." },
            startingCode: { type: Type.STRING, description: "A class or function signature to get the student started." }
          },
          required: ["id", "title", "problemStatement", "exampleInputOutput", "startingCode"]
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}") as QuizQuestion;
    } catch (error) {
      console.error("Failed to parse quiz question:", error);
      throw new Error("Failed to generate a valid coding problem.");
    }
  }

  public async evaluateAnswer(question: QuizQuestion | { title: string; problemStatement?: string; question?: string; example?: string }, userAnswer: string): Promise<QuizResult> {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `You are an expert code reviewer and tutor. A student has submitted code for the following problem:
      
      Problem Title: ${question.title || (question as any).question}
      Description: ${(question as any).problemStatement || (question as any).question}
      Examples: ${(question as any).exampleInputOutput || (question as any).example || ''}
      
      Student's Code:
      \`\`\`
      ${userAnswer}
      \`\`\`
      
      Evaluate the student's code. Does it correctly solve the problem? Are there syntax errors or major inefficiencies?
      Provide constructive feedback and a brief explanation of the optimal approach.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN, description: "True if the code correctly solves the problem or is conceptually very close." },
            feedback: { type: Type.STRING, description: "A short, encouraging 1-sentence feedback (e.g., 'Great job! Your logic is correct.')" },
            explanation: { type: Type.STRING, description: "A detailed explanation of issues found, space/time complexity, and the optimal solution." }
          },
          required: ["isCorrect", "feedback", "explanation"]
        }
      }
    });

    try {
      const rawText = response.text || "{}";
      const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText) as QuizResult;
    } catch (error) {
      console.error("Failed to parse evaluation. Raw response:", response.text);
      throw new Error("Failed to evaluate the answer.");
    }
  }
}

export const geminiService = new GeminiService();

