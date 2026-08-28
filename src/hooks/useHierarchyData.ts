import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Department {
  id: string;
  name: string;
  display_order: number;
}

export interface Subject {
  id: string;
  department_id: string;
  year: number;
  semester: number;
  name: string;
  display_order: number;
}

export interface ResourceType {
  id: string;
  name: string;
  display_order: number;
  is_default: boolean;
}

export interface YearSemesterMapping {
  id: string;
  year: number;
  semester: number;
}

export const useHierarchyData = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [yearSemesterMappings, setYearSemesterMappings] = useState<YearSemesterMapping[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Using any type assertions since new tables aren't in generated types yet
      const [deptRes, subRes, typeRes, mapRes] = await Promise.all([
        supabase.from('departments' as any).select('*').order('display_order').order('name'),
        supabase.from('subjects' as any).select('*').order('display_order').order('name'),
        supabase.from('resource_types' as any).select('*').order('display_order'),
        supabase.from('year_semester_mappings' as any).select('*').order('year').order('semester'),
      ]);

      if (deptRes.data) setDepartments(deptRes.data as unknown as Department[]);
      if (subRes.data) setSubjects(subRes.data as unknown as Subject[]);
      if (typeRes.data) setResourceTypes(typeRes.data as unknown as ResourceType[]);
      if (mapRes.data) setYearSemesterMappings(mapRes.data as unknown as YearSemesterMapping[]);
    } catch (error) {
      console.error('Error fetching hierarchy data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getSubjectsForDeptYearSem = (departmentId: string, year: number, semester: number) => {
    return subjects.filter(
      (s) => s.department_id === departmentId && s.year === year && s.semester === semester
    );
  };

  const getSemestersForYear = (year: number) => {
    return yearSemesterMappings.filter((m) => m.year === year).map((m) => m.semester);
  };

  return {
    departments,
    subjects,
    resourceTypes,
    yearSemesterMappings,
    loading,
    refetch: fetchAll,
    getSubjectsForDeptYearSem,
    getSemestersForYear,
  };
};

// Helper to generate normalized filename
export const generateNormalizedFilename = (
  department: string,
  year: number,
  semester: number,
  subject: string,
  resourceType: string,
  title: string,
  originalExt: string
): string => {
  const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  const timestamp = Date.now();
  return `${sanitize(department)}__Y${year}__S${semester}__${sanitize(subject)}__${sanitize(resourceType)}__${timestamp}__${sanitize(title)}.${originalExt}`;
};

// Helper to generate storage path
export const generateStoragePath = (
  department: string,
  year: number,
  semester: number,
  subject: string,
  resourceType: string,
  filename: string
): string => {
  const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  return `${sanitize(department)}/Year_${year}/Sem_${semester}/${sanitize(subject)}/${sanitize(resourceType)}/${filename}`;
};
