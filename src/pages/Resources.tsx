import { ResourceBrowser } from "@/components/ResourceBrowser";
import { FolderOpen } from "lucide-react";

export default function Resources() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto px-4 pt-24 pb-12 flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FolderOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Browse Resources</h1>
          </div>
          <p className="text-muted-foreground">
            Navigate through departments, years, and subjects to find your study materials
          </p>
        </div>

        <ResourceBrowser />
      </main>
    </div>
  );
}
