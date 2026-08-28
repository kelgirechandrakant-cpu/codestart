import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Department, Subject, ResourceType, generateNormalizedFilename, generateStoragePath } from '@/hooks/useHierarchyData';

interface Props {
  departments: Department[];
  subjects: Subject[];
  resourceTypes: ResourceType[];
  onUpload: () => void;
}

const YEARS = [1, 2, 3, 4];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const ResourceUploader = ({ departments, subjects, resourceTypes, onUpload }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    departmentId: '',
    year: '',
    semester: '',
    subjectId: '',
    resourceTypeId: '',
    title: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const filteredSubjects = subjects.filter(
    (s) =>
      s.department_id === formData.departmentId &&
      s.year === parseInt(formData.year) &&
      s.semester === parseInt(formData.semester)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const { departmentId, year, semester, subjectId, resourceTypeId, title } = formData;
    
    // Check if all required fields are filled for organized upload
    const isComplete = departmentId && year && semester && subjectId && resourceTypeId && title;
    
    if (!isComplete) {
      toast.error('Please fill all required fields');
      return;
    }

    setUploading(true);

    try {
      const department = departments.find((d) => d.id === departmentId);
      const subject = subjects.find((s) => s.id === subjectId);
      const resourceType = resourceTypes.find((rt) => rt.id === resourceTypeId);

      if (!department || !subject || !resourceType) {
        throw new Error('Invalid selection');
      }

      const fileExt = file.name.split('.').pop() || '';
      const normalizedFilename = generateNormalizedFilename(
        department.name,
        parseInt(year),
        parseInt(semester),
        subject.name,
        resourceType.name,
        title,
        fileExt
      );
      const storagePath = generateStoragePath(
        department.name,
        parseInt(year),
        parseInt(semester),
        subject.name,
        resourceType.name,
        normalizedFilename
      );

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Map resourceType name to enum value for backward compatibility
      const resourceTypeMap: Record<string, 'note' | 'assignment' | 'pyq'> = {
        'Notes': 'note',
        'PYQs': 'pyq',
        'Assignments': 'assignment',
        'Books': 'note',
        'Others': 'note',
      };
      const enumType = resourceTypeMap[resourceType.name] || 'note';

      // Create database record
      const { error: dbError } = await supabase.from('resources').insert({
        title: formData.title,
        description: formData.description || null,
        subject: subject.name,
        semester: `Semester ${semester}`,
        resource_type: enumType,
        file_path: storagePath,
        file_size: file.size,
        file_type: fileExt,
      });

      if (dbError) throw dbError;

      toast.success('Resource uploaded successfully!');
      setFormData({
        departmentId: '',
        year: '',
        semester: '',
        subjectId: '',
        resourceTypeId: '',
        title: '',
        description: '',
      });
      setFile(null);
      setFileInputKey(Date.now()); // Reset file input
      onUpload();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Resource
        </CardTitle>
        <CardDescription>
          Upload files with complete metadata for organized storage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(v) => setFormData({ ...formData, departmentId: v, subjectId: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Year *</Label>
              <Select
                value={formData.year}
                onValueChange={(v) => setFormData({ ...formData, year: v, subjectId: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y.toString()}>Year {y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester *</Label>
              <Select
                value={formData.semester}
                onValueChange={(v) => setFormData({ ...formData, semester: v, subjectId: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((s) => (
                    <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject *</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
                disabled={!formData.departmentId || !formData.year || !formData.semester}
              >
                <SelectTrigger>
                  <SelectValue placeholder={filteredSubjects.length ? "Select subject" : "No subjects available"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Resource Type *</Label>
              <Select
                value={formData.resourceTypeId}
                onValueChange={(v) => setFormData({ ...formData, resourceTypeId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((rt) => (
                    <SelectItem key={rt.id} value={rt.id}>{rt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Resource title"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description (optional)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>File *</Label>
            <Input
              key={fileInputKey}
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                setFile(selectedFile);
                if (selectedFile) {
                  console.log('File selected:', selectedFile.name, selectedFile.size);
                }
              }}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
              required
            />
            {file && (
              <p className="text-sm text-primary font-medium">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Supported: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT
            </p>
          </div>

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? 'Uploading...' : 'Upload Resource'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
