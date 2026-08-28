import { useEffect, useState } from "react";
import { ResourceCard } from "@/components/ResourceCard";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Notes() {
  const [resources, setResources] = useState<any[]>([]);
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = resources.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources);
    }
  }, [searchTerm, resources]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('resource_type', 'note')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
      setFilteredResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto px-4 pt-24 pb-12 flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Notes</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Browse and download study notes for various subjects
          </p>
          <Input
            type="text"
            placeholder="Search by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No notes available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                id={resource.id}
                title={resource.title}
                description={resource.description}
                subject={resource.subject}
                semester={resource.semester}
                filePath={resource.file_path}
                fileType={resource.file_type}
                downloadCount={resource.download_count}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
