import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHierarchyData } from "@/hooks/useHierarchyData";
import { DepartmentManager } from "@/components/admin/DepartmentManager";
import { SubjectManager } from "@/components/admin/SubjectManager";
import { ResourceTypeManager } from "@/components/admin/ResourceTypeManager";
import { ResourceUploader } from "@/components/admin/ResourceUploader";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { UnsortedManager } from "@/components/admin/UnsortedManager";
import { MigrationTool } from "@/components/admin/MigrationTool";

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string>("");
  
  const {
    departments,
    subjects,
    resourceTypes,
    loading: hierarchyLoading,
    refetch,
  } = useHierarchyData();

  useEffect(() => {
    let isMounted = true;
    
    const checkAdminAccess = async (session: any) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      
      try {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (!isMounted) return;
        
        if (roleError) {
          console.error("Admin role check error:", roleError);
          toast.error(`Access verification failed: ${roleError.message}`);
          navigate("/");
          return;
        }
        
        if (!roleData) {
          toast.error("You don't have admin access to this page");
          navigate("/");
          return;
        }
        
        setAdminEmail(session.user.email || "");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Admin access check failed:", error);
        if (!isMounted) return;
        toast.error("An error occurred. Please log in again.");
        navigate("/auth");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Set up listener FIRST (prevents deadlock)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        navigate("/auth");
        return;
      }
      
      // Defer the async call to prevent deadlock
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setLoading(true);
        setTimeout(() => checkAdminAccess(session), 0);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        checkAdminAccess(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Logged out successfully");
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Logged in as: <span className="font-medium">{adminEmail}</span>
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="unsorted">Unsorted</TabsTrigger>
            <TabsTrigger value="migration">Migration</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="types">Types</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            {hierarchyLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : departments.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted-foreground">
                  Please add at least one department before uploading resources.
                </p>
                <Button onClick={() => document.querySelector('[value="departments"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
                  Add Department
                </Button>
              </div>
            ) : (
              <ResourceUploader
                departments={departments}
                subjects={subjects}
                resourceTypes={resourceTypes}
                onUpload={refetch}
              />
            )}
          </TabsContent>

          <TabsContent value="resources">
            <ResourceManager departments={departments} onUpdate={refetch} />
          </TabsContent>

          <TabsContent value="unsorted">
            <UnsortedManager onUpdate={refetch} />
          </TabsContent>

          <TabsContent value="migration">
            <MigrationTool onComplete={refetch} />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentManager departments={departments} onUpdate={refetch} />
          </TabsContent>

          <TabsContent value="subjects">
            <SubjectManager departments={departments} subjects={subjects} onUpdate={refetch} />
          </TabsContent>

          <TabsContent value="types">
            <ResourceTypeManager resourceTypes={resourceTypes} onUpdate={refetch} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
