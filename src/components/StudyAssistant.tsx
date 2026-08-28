import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Loader2, X, Minimize2, Maximize2, BookOpen, Search, ChevronDown, History, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useChatPersistence, type Message } from "@/hooks/useChatPersistence";
import { ConversationHistory } from "@/components/study-assistant/ConversationHistory";
type Resource = {
  id: string;
  title: string;
  subject: string;
  file_type: string | null;
  departments: {
    name: string;
  } | null;
  subjects: {
    name: string;
  } | null;
  resource_types: {
    name: string;
  } | null;
};
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/study-assistant`;
async function streamChat({
  messages,
  resourceIds,
  onDelta,
  onDone,
  onError
}: {
  messages: Message[];
  resourceIds: string[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
      },
      body: JSON.stringify({
        messages,
        resourceIds
      })
    });
    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${resp.status}`);
    }
    if (!resp.body) throw new Error("No response body");
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    while (!streamDone) {
      const {
        done,
        value
      } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, {
        stream: true
      });
      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          /* ignore */
        }
      }
    }
    onDone();
  } catch (error) {
    onError(error instanceof Error ? error.message : "Failed to connect");
  }
}
export function StudyAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResourcePickerOpen, setIsResourcePickerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    isLoadingConversations,
    isLoadingMessages,
    isAuthenticated,
    createConversation,
    saveMessage,
    deleteConversation,
    startNewConversation,
    selectConversation
  } = useChatPersistence();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Search for resources
  useEffect(() => {
    const searchResources = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      const {
        data,
        error
      } = await supabase.from("resources").select(`
          id,
          title,
          subject,
          file_type,
          departments:department_id(name),
          subjects:subject_id(name),
          resource_types:resource_type_id(name)
        `).eq("is_unsorted", false).or(`title.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%`).limit(10);
      setIsSearching(false);
      if (!error && data) {
        setSearchResults(data as Resource[]);
      }
    };
    const debounce = setTimeout(searchResources, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);
  const toggleResource = (resource: Resource) => {
    setSelectedResources(prev => {
      const exists = prev.find(r => r.id === resource.id);
      if (exists) {
        return prev.filter(r => r.id !== resource.id);
      }
      if (prev.length >= 5) {
        toast({
          title: "Limit reached",
          description: "You can select up to 5 resources at a time.",
          variant: "destructive"
        });
        return prev;
      }
      return [...prev, resource];
    });
  };
  const removeResource = (resourceId: string) => {
    setSelectedResources(prev => prev.filter(r => r.id !== resourceId));
  };
  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;
    const userMsg: Message = {
      role: "user",
      content: trimmedInput
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Handle conversation persistence for authenticated users
    let conversationId = currentConversationId;
    const resourceIds = selectedResources.map(r => r.id);
    if (isAuthenticated) {
      if (!conversationId) {
        conversationId = await createConversation(trimmedInput);
      }
      if (conversationId) {
        await saveMessage(conversationId, "user", trimmedInput, resourceIds);
      }
    }
    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? {
            ...m,
            content: assistantContent
          } : m);
        }
        return [...prev, {
          role: "assistant",
          content: assistantContent
        }];
      });
    };
    await streamChat({
      messages: updatedMessages,
      resourceIds,
      onDelta: updateAssistant,
      onDone: async () => {
        setIsLoading(false);
        // Save assistant message
        if (isAuthenticated && conversationId && assistantContent) {
          await saveMessage(conversationId, "assistant", assistantContent);
        }
      },
      onError: error => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: error,
          variant: "destructive"
        });
      }
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleNewConversation = () => {
    startNewConversation();
    setShowHistory(false);
  };
  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    setShowHistory(false);
  };
  if (!isOpen) {
    return <Button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50" size="icon">
        <Bot className="h-6 w-6" />
      </Button>;
  }
  return <Card className={`fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-200 ${isMinimized ? "w-72 h-14" : "w-[420px] h-[560px]"}`}>
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          {showHistory ? <Button variant="ghost" size="icon" className="h-7 w-7 -ml-1" onClick={() => setShowHistory(false)}>
              <ChevronLeft className="h-4 w-4" />
            </Button> : <Bot className="h-5 w-5 text-primary" />}
          {showHistory ? "History" : "Study Assistant"}
        </CardTitle>
        <div className="flex items-center gap-1">
          {isAuthenticated && !showHistory && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowHistory(true)} title="View conversation history">
              <History className="h-4 w-4" />
            </Button>}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && <CardContent className="flex flex-col h-[calc(100%-56px)] p-0">
          {showHistory ? <div className="p-3 h-full">
              <ConversationHistory conversations={conversations} currentConversationId={currentConversationId} isLoading={isLoadingConversations} onSelect={handleSelectConversation} onDelete={deleteConversation} onNewConversation={handleNewConversation} />
            </div> : <>
              {/* Resource selector */}
              <div className="p-2 border-b bg-muted/30">
                <Popover open={isResourcePickerOpen} onOpenChange={setIsResourcePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between text-xs h-8">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        {selectedResources.length > 0 ? `${selectedResources.length} resource${selectedResources.length > 1 ? "s" : ""} selected` : "Select resources to reference"}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-2" align="start">
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input placeholder="Search resources..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-7 h-8 text-xs" />
                      </div>
                      
                      <ScrollArea className="h-48">
                        {isSearching ? <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div> : searchResults.length > 0 ? <div className="space-y-1">
                            {searchResults.map(resource => {
                      const isSelected = selectedResources.some(r => r.id === resource.id);
                      return <button key={resource.id} onClick={() => toggleResource(resource)} className={`w-full text-left p-2 rounded-md text-xs transition-colors ${isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"}`}>
                                  <div className="font-medium truncate">{resource.title}</div>
                                  <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <span>{resource.subjects?.name || resource.subject}</span>
                                    {resource.resource_types?.name && <>
                                        <span>•</span>
                                        <span>{resource.resource_types.name}</span>
                                      </>}
                                  </div>
                                </button>;
                    })}
                          </div> : searchQuery ? <p className="text-xs text-muted-foreground text-center py-4">
                            No resources found
                          </p> : <p className="text-xs text-muted-foreground text-center py-4">
                            Type to search resources
                          </p>}
                      </ScrollArea>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Selected resources badges */}
                {selectedResources.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
                    {selectedResources.map(resource => <Badge key={resource.id} variant="secondary" className="text-xs py-0.5 pr-1">
                        <span className="truncate max-w-[120px]">{resource.title}</span>
                        <button onClick={() => removeResource(resource.id)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>)}
                  </div>}
              </div>

              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {isLoadingMessages ? <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div> : messages.length === 0 ? <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                    <p className="text-sm">Hi! I'm your study assistant.</p>
                    <p className="text-xs mt-1">
                      {selectedResources.length > 0 ? "Ask me about the selected resources!" : "Select resources above or ask me anything!"}
                    </p>
                    {!isAuthenticated && <p className="text-xs mt-3 text-muted-foreground/80">
                        Sign in to save your conversations
                      </p>}
                  </div> : <div className="space-y-4">
                    {messages.map((msg, i) => <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "assistant" && <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>}
                        <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <p className="whitespace-pre-wrap bg-accent text-secondary text-justify font-semibold text-sm font-serif">{msg.content}</p>
                        </div>
                        {msg.role === "user" && <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>}
                      </div>)}
                    {isLoading && messages[messages.length - 1]?.role === "user" && <div className="flex gap-3 justify-start">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>}
                  </div>}
              </ScrollArea>

              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask a question..." disabled={isLoading} className="flex-1" />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>}
        </CardContent>}
    </Card>;
}