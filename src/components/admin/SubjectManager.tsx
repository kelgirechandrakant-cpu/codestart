import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Department, Subject } from '@/hooks/useHierarchyData';

interface Props {
  departments: Department[];
  subjects: Subject[];
  onUpdate: () => void;
}

const YEARS = [1, 2, 3, 4];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const SubjectManager = ({ departments, subjects, onUpdate }: Props) => {
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const filteredSubjects = subjects.filter((s) => {
    if (selectedDept && s.department_id !== selectedDept) return false;
    if (selectedYear && s.year !== parseInt(selectedYear)) return false;
    if (selectedSemester && s.semester !== parseInt(selectedSemester)) return false;
    return true;
  });

  const handleAdd = async () => {
    if (!selectedDept || !selectedYear || !selectedSemester || !newName.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    setAdding(true);
    try {
      const { error } = await (supabase.from('subjects' as any) as any).insert({
        department_id: selectedDept,
        year: parseInt(selectedYear),
        semester: parseInt(selectedSemester),
        name: newName.trim(),
        display_order: filteredSubjects.length,
      });
      if (error) throw error;
      toast.success('Subject added');
      setNewName('');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add subject');
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) {
      toast.error('Please enter a name');
      return;
    }
    try {
      const { error } = await (supabase.from('subjects' as any) as any).update({ name: editName.trim() }).eq('id', id);
      if (error) throw error;
      toast.success('Subject updated');
      setEditingId(null);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subject?')) return;
    try {
      const { error } = await (supabase.from('subjects' as any) as any).delete().eq('id', id);
      if (error) throw error;
      toast.success('Subject deleted');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    }
  };

  const getDeptName = (id: string) => departments.find((d) => d.id === id)?.name || 'Unknown';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Subjects</CardTitle>
        <CardDescription>Add subjects for each department, year, and semester</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger>
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>Year {y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              {SEMESTERS.map((s) => (
                <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              placeholder="Subject name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={adding}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredSubjects.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            {selectedDept ? 'No subjects for this selection' : 'Select a department to view subjects'}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubjects.map((subj) => (
                <TableRow key={subj.id}>
                  <TableCell>
                    {editingId === subj.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(subj.id)}
                        autoFocus
                      />
                    ) : (
                      subj.name
                    )}
                  </TableCell>
                  <TableCell>{getDeptName(subj.department_id)}</TableCell>
                  <TableCell>Year {subj.year}</TableCell>
                  <TableCell>Sem {subj.semester}</TableCell>
                  <TableCell className="text-right">
                    {editingId === subj.id ? (
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => handleUpdate(subj.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(subj.id);
                            setEditName(subj.name);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(subj.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
