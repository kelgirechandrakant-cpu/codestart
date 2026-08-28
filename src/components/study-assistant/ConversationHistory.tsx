import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Conversation } from "@/hooks/useChatPersistence";

type ConversationHistoryProps = {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewConversation: () => void;
};

export function ConversationHistory({
  conversations,
  currentConversationId,
  isLoading,
  onSelect,
  onDelete,
  onNewConversation,
}: ConversationHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Button
        variant="outline"
        size="sm"
        className="w-full mb-2"
        onClick={onNewConversation}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        New Conversation
      </Button>

      <ScrollArea className="flex-1">
        {conversations.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No previous conversations
          </p>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative rounded-md p-2 cursor-pointer transition-colors ${
                  currentConversationId === conversation.id
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-muted"
                }`}
                onClick={() => onSelect(conversation.id)}
              >
                <p className="text-xs font-medium truncate pr-6">
                  {conversation.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(conversation.updated_at), {
                    addSuffix: true,
                  })}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conversation.id);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
