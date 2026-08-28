import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DocumentViewer } from "./DocumentViewer";


interface ResourceCardProps {
  id: string;
  title: string;
  description?: string;
  subject: string;
  semester?: string;
  filePath: string;
  fileType?: string;
  downloadCount: number;
}

export const ResourceCard = ({
  id,
  title,
  description,
  subject,
  semester,
  filePath,
  fileType,
  downloadCount
}: ResourceCardProps) => {
  const navigate = useNavigate();
  const [showViewer, setShowViewer] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handlePreview = async () => {
    try {
      // Check if user is authenticated
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login to preview resources");
        navigate("/login");
        return;
      }
      setLoadingPreview(true);

      // Get signed URL for preview (valid for 1 hour)
      const {
        data,
        error
      } = await supabase.storage.from('resources').createSignedUrl(filePath, 3600);
      if (error) throw error;
      
      setPreviewUrl(data.signedUrl);
      setShowViewer(true);
    } catch (error) {
      console.error('Preview error:', error);
      toast.error("Failed to load preview");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setPreviewUrl(null);
  };

  return (
    <>
      <Card className="group hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 border-0">
              <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">{description}</CardDescription>
            </div>
            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{subject}</Badge>
            {semester && <Badge variant="outline">{semester}</Badge>}
            {fileType && <Badge variant="outline">{fileType}</Badge>}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">
            {downloadCount} downloads
          </span>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate("/ai-tutor", { state: { resourceTitle: title, subject } })} 
              variant="outline" 
              size="sm" 
              className="gap-1.5 text-xs text-cyan-500 border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-400"
              title="Ask AI Tutor about this resource"
            >
              <Bot className="h-3.5 w-3.5" />
              Ask AI
            </Button>
            <Button onClick={handlePreview} size="sm" className="gap-2 text-xs" disabled={loadingPreview}>
              <Eye className="h-4 w-4" />
              {loadingPreview ? "Loading..." : "Access Document"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Inline Document Viewer */}
      {showViewer && previewUrl && (
        <DocumentViewer
          url={previewUrl}
          title={title}
          fileType={fileType}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
};