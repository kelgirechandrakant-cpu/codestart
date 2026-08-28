import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Department } from '@/hooks/useHierarchyData';

interface Props {
  departments: Department[];
  onUpdate: () => void;
}

export const DepartmentManager = ({ departments, onUpdate }: Props) => {
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error('Please enter a department name');
      return;
    }
    setAdding(true);
    try {
      const { error } = await (supabase.from('departments' as any) as any).insert({
        name: newName.trim(),
        display_order: departments.length,
      });
      if (error) throw error;
      toast.success('Department added');
      setNewName('');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add department');
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
      const { error } = await (supabase.from('departments' as any) as any).update({ name: editName.trim() }).eq('id', id);
      if (error) throw error;
      toast.success('Department updated');
      setEditingId(null);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this department? All associated subjects will also be deleted.')) return;
    try {
      const { error } = await (supabase.from('departments' as any) as any).delete().eq('id', id);
      if (error) throw error;
      toast.success('Department deleted');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Departments</CardTitle>
        <CardDescription>Add, edit, or remove departments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="New department name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={adding}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        {departments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No departments yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell>
                    {editingId === dept.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(dept.id)}
                        autoFocus
                      />
                    ) : (
                      dept.name
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === dept.id ? (
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => handleUpdate(dept.id)}>
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
                            setEditingId(dept.id);
                            setEditName(dept.name);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(dept.id)}>
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
