import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export function useChatPersistence() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
      if (!session?.user) {
        setConversations([]);
        setCurrentConversationId(null);
        setMessages([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load conversations when user is authenticated
  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    if (!userId) return;
    
    setIsLoadingConversations(true);
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("id, title, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50);

    setIsLoadingConversations(false);
    
    if (error) {
      console.error("Failed to load conversations:", error);
      return;
    }
    
    setConversations(data || []);
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setIsLoadingMessages(false);
    
    if (error) {
      console.error("Failed to load messages:", error);
      return;
    }
    
    setMessages((data as Message[]) || []);
  };

  const createConversation = useCallback(async (firstMessage: string): Promise<string | null> => {
    if (!userId) return null;

    // Generate title from first message (first 50 chars)
    const title = firstMessage.length > 50 
      ? firstMessage.substring(0, 47) + "..." 
      : firstMessage;

    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({ user_id: userId, title })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return null;
    }

    const newConversation: Conversation = {
      id: data.id,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(data.id);
    return data.id;
  }, [userId]);

  const saveMessage = useCallback(async (
    conversationId: string,
    role: "user" | "assistant",
    content: string,
    resourceIds: string[] = []
  ) => {
    const { error } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        role,
        content,
        resource_ids: resourceIds,
      });

    if (error) {
      console.error("Failed to save message:", error);
    }

    // Update conversation's updated_at
    await supabase
      .from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  }, []);

  const deleteConversation = useCallback(async (conversationId: string) => {
    const { error } = await supabase
      .from("chat_conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
      return;
    }

    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
      setMessages([]);
    }
  }, [currentConversationId]);

  const startNewConversation = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
  }, []);

  return {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    isLoadingConversations,
    isLoadingMessages,
    isAuthenticated: !!userId,
    createConversation,
    saveMessage,
    deleteConversation,
    startNewConversation,
    selectConversation,
    refreshConversations: loadConversations,
  };
}
