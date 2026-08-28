import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Maximize, Minimize, X, AlertCircle } from "lucide-react";

interface DocumentViewerProps {
  url: string;
  title: string;
  fileType?: string;
  onClose: () => void;
}

// Detect mobile device
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768);
};

export const DocumentViewer = ({ url, title, fileType, onClose }: DocumentViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(isMobileDevice());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine if file is PDF
  const isPDF = fileType?.toLowerCase() === 'pdf' || url.toLowerCase().endsWith('.pdf');
  
  // Determine if file needs Google Docs Viewer (DOCX, PPTX, etc.)
  const needsGoogleViewer = fileType?.toLowerCase() && 
    ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(fileType.toLowerCase());

  // On mobile, use Google Docs Viewer for PDFs too (since native PDF embed doesn't work)
  const useGoogleViewerForPDF = isPDF && isMobile;

  // Build the viewer URL
  const getViewerUrl = () => {
    if (useGoogleViewerForPDF || needsGoogleViewer) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }
    // For desktop PDFs, use direct URL — browser's native PDF viewer handles zoom, text selection, copy/paste
    return url;
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen error:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Exit fullscreen error:', err);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card shadow-sm">
        <h2 className="text-lg font-semibold truncate max-w-[50%]">{title}</h2>
        
        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle - hide on mobile */}
          {!isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
            className="gap-1"
          >
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </Button>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="gap-1 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Close</span>
          </Button>
        </div>
      </div>

      {/* Document Viewer Area */}
      <div className="flex-1 relative bg-muted/30 overflow-auto">
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading document...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-3 text-center px-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h3 className="text-lg font-semibold">Failed to load document</h3>
              <p className="text-muted-foreground max-w-md">
                The document could not be loaded. Please try again or download the file directly.
              </p>
              <Button onClick={onClose} variant="outline">
                Go Back
              </Button>
            </div>
          </div>
        )}

        {/* Iframe Viewer — browser's native PDF viewer provides zoom, text selection & copy/paste */}
        <iframe
          ref={iframeRef}
          src={getViewerUrl()}
          className="w-full h-full border-0"
          style={{ minHeight: '80vh' }}
          title={`Preview of ${title}`}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          referrerPolicy="no-referrer"
          allow="autoplay"
        />
      </div>
    </div>
  );
};
