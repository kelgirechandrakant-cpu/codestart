import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useHierarchyData, generateStoragePath, generateNormalizedFilename } from '@/hooks/useHierarchyData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Edit, Trash2 } from 'lucide-react';

interface UnsortedResource {
  id: string;
  title: string;
  subject: string;
  file_path: string;
  original_filename: string | null;
  migration_status: string | null;
  created_at: string;
}

interface Props {
  onUpdate: () => void;
}

const YEARS = [1, 2, 3, 4];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const UnsortedManager = ({ onUpdate }: Props) => {
  const { departments, subjects, resourceTypes, refetch } = useHierarchyData();
  const [unsortedResources, setUnsortedResources] = useState<UnsortedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<UnsortedResource | null>(null);
  const [formData, setFormData] = useState({
    department: '',
    year: '',
    semester: '',
    subject: '',
    resourceType: '',
    title: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchUnsorted = async () => {
    setLoading(true);
    try {
      // Using any for new columns not in generated types yet
      const { data, error } = await (supabase
        .from('resources') as any)
        .select('id, title, subject, file_path, original_filename, migration_status, created_at')
        .eq('is_unsorted', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUnsortedResources((data || []) as UnsortedResource[]);
    } catch (error) {
      console.error('Error fetching unsorted:', error);
      toast.error('Failed to load unsorted resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnsorted();
  }, []);

  const filteredSubjects = subjects.filter(
    (s) =>
      s.department_id === formData.department &&
      s.year === parseInt(formData.year || '0') &&
      s.semester === parseInt(formData.semester || '0')
  );

  const handleEdit = (resource: UnsortedResource) => {
    setEditingResource(resource);
    setFormData({
      department: '',
      year: '',
      semester: '',
      subject: '',
      resourceType: '',
      title: resource.title
    });
  };

  const handleApprove = async () => {
    if (!editingResource || !formData.department || !formData.year || !formData.semester || 
        !formData.subject || !formData.resourceType || !formData.title) {
      toast.error('Please fill all fields');
      return;
    }

    setSaving(true);
    try {
      const dept = departments.find(d => d.id === formData.department);
      const subj = subjects.find(s => s.id === formData.subject);
      const resType = resourceTypes.find(rt => rt.id === formData.resourceType);

      if (!dept || !subj || !resType) {
        toast.error('Invalid selection');
        return;
      }

      // Generate new path and filename
      const originalExt = editingResource.file_path.split('.').pop() || 'pdf';
      const normalizedFilename = generateNormalizedFilename(
        dept.name,
        parseInt(formData.year),
        parseInt(formData.semester),
        subj.name,
        resType.name,
        formData.title,
        originalExt
      );
      const newPath = generateStoragePath(
        dept.name,
        parseInt(formData.year),
        parseInt(formData.semester),
        subj.name,
        resType.name,
        normalizedFilename
      );

      // Move file in storage
      const { error: moveError } = await supabase.storage
        .from('resources')
        .move(editingResource.file_path, newPath);

      if (moveError) {
        console.error('Move error:', moveError);
        // If move fails, try copy + delete
        const { data: fileData } = await supabase.storage
          .from('resources')
          .download(editingResource.file_path);
        
        if (fileData) {
          await supabase.storage.from('resources').upload(newPath, fileData);
          await supabase.storage.from('resources').remove([editingResource.file_path]);
        }
      }

      // Map resource type to enum
      const typeMap: { [key: string]: 'note' | 'pyq' | 'assignment' } = {
        'Notes': 'note',
        'PYQs': 'pyq',
        'Assignments': 'assignment',
        'Books': 'note',
        'Others': 'note'
      };

      // Update database record
      const { error: updateError } = await supabase
        .from('resources')
        .update({
          title: formData.title,
          department_id: formData.department,
          year: parseInt(formData.year),
          semester: `Semester ${formData.semester}`,
          subject: subj.name,
          subject_id: formData.subject,
          resource_type: typeMap[resType.name] || 'note',
          resource_type_id: formData.resourceType,
          file_path: newPath,
          original_filename: editingResource.original_filename || editingResource.file_path.split('/').pop(),
          is_unsorted: false,
          migration_status: 'approved'
        })
        .eq('id', editingResource.id);

      if (updateError) throw updateError;

      toast.success('Resource approved and organized!');
      setEditingResource(null);
      setFormData({ department: '', year: '', semester: '', subject: '', resourceType: '', title: '' });
      fetchUnsorted();
      onUpdate();
    } catch (error) {
      console.error('Error approving resource:', error);
      toast.error('Failed to approve resource');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (resource: UnsortedResource) => {
    if (!confirm('Delete this unsorted resource permanently?')) return;

    try {
      await supabase.storage.from('resources').remove([resource.file_path]);
      await supabase.from('resources').delete().eq('id', resource.id);
      
      toast.success('Resource deleted');
      fetchUnsorted();
      onUpdate();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete resource');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Unsorted Resources
          </CardTitle>
          <CardDescription>
            Review and organize resources with missing or incomplete metadata
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : unsortedResources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              All resources are properly organized!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Original Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unsortedResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.title}</TableCell>
                    <TableCell>{resource.subject}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {resource.migration_status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(resource.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(resource)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Organize
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(resource)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Organize Resource</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Resource title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(v) => setFormData(prev => ({ 
                    ...prev, 
                    department: v, 
                    subject: '' 
                  }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {departments.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Year</Label>
                <Select 
                  value={formData.year} 
                  onValueChange={(v) => setFormData(prev => ({ 
                    ...prev, 
                    year: v,
                    semester: '',
                    subject: '' 
                  }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {YEARS.map(y => (
                      <SelectItem key={y} value={y.toString()}>Year {y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Semester</Label>
                <Select 
                  value={formData.semester} 
                  onValueChange={(v) => setFormData(prev => ({ 
                    ...prev, 
                    semester: v,
                    subject: '' 
                  }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map(s => (
                      <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subject</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, subject: v }))}
                  disabled={!formData.department || !formData.year || !formData.semester}
                >
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {filteredSubjects.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Resource Type</Label>
              <Select 
                value={formData.resourceType} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, resourceType: v }))}
              >
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {resourceTypes.map(rt => (
                    <SelectItem key={rt.id} value={rt.id}>{rt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingResource(null)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={saving}>
              {saving ? 'Saving...' : 'Approve & Organize'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
