import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { ResourceType } from '@/hooks/useHierarchyData';

interface Props {
  resourceTypes: ResourceType[];
  onUpdate: () => void;
}

export const ResourceTypeManager = ({ resourceTypes, onUpdate }: Props) => {
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) {
      toast.error('Please enter a name');
      return;
    }
    setAdding(true);
    try {
      const { error } = await (supabase.from('resource_types' as any) as any).insert({
        name: newName.trim(),
        display_order: resourceTypes.length,
        is_default: false,
      });
      if (error) throw error;
      toast.success('Resource type added');
      setNewName('');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add');
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
      const { error } = await (supabase.from('resource_types' as any) as any).update({ name: editName.trim() }).eq('id', id);
      if (error) throw error;
      toast.success('Updated');
      setEditingId(null);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update');
    }
  };

  const handleDelete = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error('Cannot delete default resource types');
      return;
    }
    if (!confirm('Delete this resource type?')) return;
    try {
      const { error } = await (supabase.from('resource_types' as any) as any).delete().eq('id', id);
      if (error) throw error;
      toast.success('Deleted');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Resource Types</CardTitle>
        <CardDescription>Customize resource categories (Notes, PYQs, etc.)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="New resource type"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={adding}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resourceTypes.map((rt) => (
              <TableRow key={rt.id}>
                <TableCell>
                  {editingId === rt.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate(rt.id)}
                      autoFocus
                    />
                  ) : (
                    rt.name
                  )}
                </TableCell>
                <TableCell>
                  {rt.is_default ? (
                    <Badge variant="secondary">Default</Badge>
                  ) : (
                    <Badge variant="outline">Custom</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === rt.id ? (
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => handleUpdate(rt.id)}>
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
                          setEditingId(rt.id);
                          setEditName(rt.name);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(rt.id, rt.is_default)}
                        disabled={rt.is_default}
                      >
                        <Trash2 className={`h-4 w-4 ${rt.is_default ? 'text-muted' : 'text-destructive'}`} />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
