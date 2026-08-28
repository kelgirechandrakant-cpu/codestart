import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHierarchyData } from '@/hooks/useHierarchyData';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResourceCard } from '@/components/ResourceCard';
import { 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  Search, 
  Home,
  BookOpen,
  GraduationCap,
  Calendar,
  FileText
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  semester: string | null;
  file_path: string;
  file_type: string | null;
  download_count: number;
  department_id: string | null;
  year: number | null;
  subject_id: string | null;
  resource_type_id: string | null;
  resource_type: string;
  created_at: string;
}

type BreadcrumbLevel = 'root' | 'department' | 'year' | 'semester' | 'subject' | 'resourceType';

interface BreadcrumbItem {
  level: BreadcrumbLevel;
  id?: string;
  name: string;
}

export const ResourceBrowser = () => {
  const navigate = useNavigate();
  const { departments, subjects, resourceTypes, loading: hierarchyLoading } = useHierarchyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { level: 'root', name: 'All Resources' }
  ]);

  const currentLevel = breadcrumbs[breadcrumbs.length - 1];

  // Fetch resources (using any for new columns not in generated types yet)
  const { data: resources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ['browser-resources'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('resources') as any)
        .select('*')
        .eq('is_unsorted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as Resource[];
    }
  });

  // Navigation handlers
  const navigateTo = (item: BreadcrumbItem) => {
    setBreadcrumbs(prev => [...prev, item]);
  };

  const navigateBack = (index: number) => {
    setBreadcrumbs(prev => prev.slice(0, index + 1));
  };

  // Get current selection context
  const getSelectionContext = () => {
    const context: {
      departmentId?: string;
      year?: number;
      semester?: number;
      subjectId?: string;
      resourceTypeId?: string;
    } = {};

    for (const crumb of breadcrumbs) {
      if (crumb.level === 'department') context.departmentId = crumb.id;
      if (crumb.level === 'year') context.year = parseInt(crumb.id || '0');
      if (crumb.level === 'semester') context.semester = parseInt(crumb.id || '0');
      if (crumb.level === 'subject') context.subjectId = crumb.id;
      if (crumb.level === 'resourceType') context.resourceTypeId = crumb.id;
    }

    return context;
  };

  const context = getSelectionContext();

  // Filter resources based on current navigation and search
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Apply hierarchy filters
    if (context.departmentId) {
      filtered = filtered.filter(r => r.department_id === context.departmentId);
    }
    if (context.year) {
      filtered = filtered.filter(r => r.year === context.year);
    }
    if (context.semester) {
      const semStr = `Semester ${context.semester}`;
      filtered = filtered.filter(r => r.semester === semStr || r.semester === context.semester.toString());
    }
    if (context.subjectId) {
      filtered = filtered.filter(r => r.subject_id === context.subjectId);
    }
    if (context.resourceTypeId) {
      filtered = filtered.filter(r => r.resource_type_id === context.resourceTypeId);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(term) ||
        r.subject.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [resources, context, searchTerm]);

  // Get items to display based on current level
  const getNavigationItems = () => {
    switch (currentLevel.level) {
      case 'root':
        return departments
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(d => ({
            id: d.id,
            name: d.name,
            nextLevel: 'department' as BreadcrumbLevel,
            icon: <Folder className="h-5 w-5" />,
            count: resources.filter(r => r.department_id === d.id).length
          }));
      
      case 'department':
        return [1, 2, 3, 4].map(year => ({
          id: year.toString(),
          name: `Year ${year}`,
          nextLevel: 'year' as BreadcrumbLevel,
          icon: <GraduationCap className="h-5 w-5" />,
          count: resources.filter(r => 
            r.department_id === context.departmentId && r.year === year
          ).length
        }));
      
      case 'year':
        const yearNum = context.year || 1;
        const semesterStart = (yearNum - 1) * 2 + 1;
        return [semesterStart, semesterStart + 1].map(sem => ({
          id: sem.toString(),
          name: `Semester ${sem}`,
          nextLevel: 'semester' as BreadcrumbLevel,
          icon: <Calendar className="h-5 w-5" />,
          count: resources.filter(r => 
            r.department_id === context.departmentId && 
            r.year === context.year &&
            (r.semester === `Semester ${sem}` || r.semester === sem.toString())
          ).length
        }));
      
      case 'semester':
        const deptSubjects = subjects.filter(s => 
          s.department_id === context.departmentId &&
          s.year === context.year &&
          s.semester === context.semester
        ).sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name));
        
        return deptSubjects.map(s => ({
          id: s.id,
          name: s.name,
          nextLevel: 'subject' as BreadcrumbLevel,
          icon: <BookOpen className="h-5 w-5" />,
          count: resources.filter(r => r.subject_id === s.id).length
        }));
      
      case 'subject':
        return resourceTypes
          .sort((a, b) => a.display_order - b.display_order)
          .map(rt => ({
            id: rt.id,
            name: rt.name,
            nextLevel: 'resourceType' as BreadcrumbLevel,
            icon: <FileText className="h-5 w-5" />,
            count: resources.filter(r => 
              r.subject_id === context.subjectId && r.resource_type_id === rt.id
            ).length
          }));
      
      default:
        return [];
    }
  };

  const navItems = getNavigationItems();
  const showResources = currentLevel.level === 'resourceType' || searchTerm.length > 0;

  if (hierarchyLoading || resourcesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm flex-wrap">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <Button
              variant={index === breadcrumbs.length - 1 ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigateBack(index)}
              className="gap-1"
            >
              {index === 0 && <Home className="h-4 w-4" />}
              {crumb.name}
            </Button>
          </div>
        ))}
      </nav>

      {/* Navigation Items or Resources */}
      {!showResources ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {navItems.map(item => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigateTo({ 
                level: item.nextLevel, 
                id: item.id, 
                name: item.name 
              })}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {item.icon}
                    </div>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="outline">{item.count} resources</Badge>
              </CardContent>
            </Card>
          ))}
          {navItems.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No items found at this level. 
              {currentLevel.level === 'semester' && ' Add subjects in the admin panel.'}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description || undefined}
                  subject={resource.subject}
                  semester={resource.semester || undefined}
                  filePath={resource.file_path}
                  fileType={resource.file_type || undefined}
                  downloadCount={resource.download_count}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No resources found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
