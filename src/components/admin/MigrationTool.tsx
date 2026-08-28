import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useHierarchyData } from '@/hooks/useHierarchyData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Play, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface MigrationResult {
  total: number;
  matched: number;
  unsorted: number;
  errors: number;
}

interface Props {
  onComplete: () => void;
}

export const MigrationTool = ({ onComplete }: Props) => {
  const { departments, subjects, resourceTypes } = useHierarchyData();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const parseFilename = (filename: string) => {
    // Try to extract metadata from filename patterns
    // Common patterns:
    // - BCA__Y1__S1__DBMS__Notes__timestamp__title.pdf
    // - DBMS_Notes_2024.pdf
    // - Subject_Name-Assignment-1.pdf
    
    const patterns = [
      // Normalized format: Dept__Year__Sem__Subject__Type__timestamp__title.ext
      /^([^_]+)__Y(\d)__S(\d)__([^_]+)__([^_]+)__\d+__(.+)\.(\w+)$/i,
      // Simple format: Subject_Type_anything.ext
      /^([^_-]+)[_-]([^_-]+)[_-].*\.(\w+)$/i,
    ];

    for (const pattern of patterns) {
      const match = filename.match(pattern);
      if (match) {
        if (pattern === patterns[0]) {
          return {
            department: match[1].replace(/_/g, ' '),
            year: parseInt(match[2]),
            semester: parseInt(match[3]),
            subject: match[4].replace(/_/g, ' '),
            resourceType: match[5].replace(/_/g, ' '),
            title: match[6].replace(/_/g, ' ')
          };
        }
      }
    }
    
    return null;
  };

  const findBestMatch = (parsed: any) => {
    // Try to match department
    const dept = departments.find(d => 
      d.name.toLowerCase().includes(parsed.department?.toLowerCase()) ||
      parsed.department?.toLowerCase().includes(d.name.toLowerCase())
    );

    if (!dept) return null;

    // Try to match subject
    const subj = subjects.find(s => 
      s.department_id === dept.id &&
      (s.name.toLowerCase().includes(parsed.subject?.toLowerCase()) ||
       parsed.subject?.toLowerCase().includes(s.name.toLowerCase()))
    );

    // Try to match resource type
    const resType = resourceTypes.find(rt =>
      rt.name.toLowerCase().includes(parsed.resourceType?.toLowerCase()) ||
      parsed.resourceType?.toLowerCase().includes(rt.name.toLowerCase())
    );

    if (subj && resType) {
      return {
        departmentId: dept.id,
        departmentName: dept.name,
        subjectId: subj.id,
        subjectName: subj.name,
        year: subj.year,
        semester: subj.semester,
        resourceTypeId: resType.id,
        resourceTypeName: resType.name
      };
    }

    return null;
  };

  const runMigration = async () => {
    setRunning(true);
    setProgress(0);
    setResult(null);
    setLogs([]);

    addLog('Starting migration scan...');

    try {
      // Fetch all resources that need migration (using any for new columns)
      const { data: resources, error } = await (supabase
        .from('resources') as any)
        .select('*')
        .or('migration_status.is.null,migration_status.eq.pending');

      if (error) throw error;

      if (!resources || resources.length === 0) {
        addLog('No resources need migration.');
        setResult({ total: 0, matched: 0, unsorted: 0, errors: 0 });
        setRunning(false);
        return;
      }

      addLog(`Found ${resources.length} resources to process.`);

      let matched = 0;
      let unsorted = 0;
      let errors = 0;

      for (let i = 0; i < resources.length; i++) {
        const resource = resources[i];
        const filename = resource.file_path.split('/').pop() || '';
        
        setProgress(Math.round(((i + 1) / resources.length) * 100));

        try {
          // Try to parse filename for metadata
          const parsed = parseFilename(filename);
          
          if (parsed) {
            const match = findBestMatch(parsed);
            
            if (match) {
              // Update resource with matched metadata (using any for new columns)
              await (supabase
                .from('resources') as any)
                .update({
                  department_id: match.departmentId,
                  subject_id: match.subjectId,
                  resource_type_id: match.resourceTypeId,
                  year: match.year,
                  is_unsorted: false,
                  migration_status: 'matched'
                })
                .eq('id', resource.id);

              addLog(`✓ Matched: ${resource.title} → ${match.departmentName}/${match.subjectName}`);
              matched++;
              continue;
            }
          }

          // Could not match - mark as unsorted (using any for new columns)
          await (supabase
            .from('resources') as any)
            .update({
              is_unsorted: true,
              migration_status: 'needs_review'
            })
            .eq('id', resource.id);

          addLog(`? Unsorted: ${resource.title} - needs manual review`);
          unsorted++;

        } catch (err) {
          addLog(`✗ Error processing: ${resource.title}`);
          errors++;
        }
      }

      setResult({
        total: resources.length,
        matched,
        unsorted,
        errors
      });

      addLog(`Migration complete: ${matched} matched, ${unsorted} need review, ${errors} errors`);
      toast.success('Migration scan complete!');
      onComplete();

    } catch (error) {
      console.error('Migration error:', error);
      addLog('Migration failed with an error.');
      toast.error('Migration failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Resource Migration Tool
        </CardTitle>
        <CardDescription>
          Scan existing resources and automatically organize them into the hierarchy. 
          Files that can't be matched will be moved to Unsorted for manual review.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={runMigration} disabled={running}>
            <Play className="h-4 w-4 mr-2" />
            {running ? 'Running...' : 'Run Migration Scan'}
          </Button>
          
          {result && (
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" />
                {result.matched} matched
              </Badge>
              <Badge variant="outline" className="bg-yellow-50">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {result.unsorted} unsorted
              </Badge>
              {result.errors > 0 && (
                <Badge variant="destructive">
                  {result.errors} errors
                </Badge>
              )}
            </div>
          )}
        </div>

        {running && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground">{progress}% complete</p>
          </div>
        )}

        {logs.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="font-mono text-xs space-y-1">
              {logs.map((log, i) => (
                <div key={i} className={
                  log.includes('✓') ? 'text-green-600' :
                  log.includes('✗') ? 'text-destructive' :
                  log.includes('?') ? 'text-yellow-600' :
                  'text-foreground'
                }>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
