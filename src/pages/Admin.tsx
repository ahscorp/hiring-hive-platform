
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Job, Location, Experience, Industry, SalaryRange } from "@/data/jobTypes"; // Import all necessary types
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client
import { Tables, Json } from "@/integrations/supabase/types"; // Import Supabase types

// Type for a job row directly from Supabase
type SupabaseJobRow = Tables<'jobs'>;

// Mapping function from SupabaseJobRow to our application's Job type (similar to Index.tsx)
const mapSupabaseJobToAppJob = (supabaseJob: SupabaseJobRow): Job => {
  const safeGetTypedObject = <T extends { id: string }>(
    jsonValue: Json | undefined | null,
    defaultValue: T
  ): T => {
    if (typeof jsonValue === 'object' && jsonValue !== null && 'id' in jsonValue && typeof (jsonValue as any).id === 'string') {
      return jsonValue as T;
    }
    return defaultValue;
  };
  const safeGetSalaryRange = (jsonValue: Json | undefined | null): SalaryRange | null => {
    if (typeof jsonValue === 'object' && jsonValue !== null && !Array.isArray(jsonValue)) {
      const obj = jsonValue as { [key: string]: Json | undefined };
      const id = obj.id; const range = obj.range; const min = obj.min;
      if (typeof id === 'string' && typeof range === 'string' && typeof min === 'number' && ('max' in obj && (typeof obj.max === 'number' || obj.max === null))) {
        return { id: id, range: range, min: min, max: obj.max as number | null };
      }
    }
    return null;
  };
  const defaultLocation: Location = { id: 'unknown_loc', city: 'Not Specified', state: '' };
  const defaultExperience: Experience = { id: 'unknown_exp', range: 'Not Specified', minYears: 0, maxYears: null };
  const defaultIndustry: Industry = { id: 'unknown_ind', name: 'Not Specified' };

  return {
    id: supabaseJob.id,
    title: supabaseJob.title,
    location: safeGetTypedObject<Location>(supabaseJob.location, defaultLocation),
    experience: safeGetTypedObject<Experience>(supabaseJob.experience, defaultExperience),
    industry: safeGetTypedObject<Industry>(supabaseJob.industry, defaultIndustry),
    department: supabaseJob.department,
    keySkills: supabaseJob.keyskills || [],
    description: supabaseJob.description,
    responsibilities: supabaseJob.responsibilities || [],
    salaryRange: safeGetSalaryRange(supabaseJob.salaryrange),
    status: supabaseJob.status as ('Published' | 'Draft'),
    datePosted: supabaseJob.dateposted || new Date().toISOString(),
  };
};


const Admin = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Get logout function and user from context
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auth is handled by ProtectedRoute, user object from useAuth indicates logged-in state
    // Fetch jobs if user is logged in
    if (user) {
      const fetchJobs = async () => {
        setIsLoading(true);
        const { data: supabaseData, error } = await supabase
          .from('jobs')
          .select('*')
          .order('dateposted', { ascending: false }); // Fetch all jobs, order by date

        if (error) {
          console.error("Error fetching jobs for admin:", error);
          toast({ title: "Error", description: "Failed to fetch jobs.", variant: "destructive" });
          setJobs([]);
        } else {
          const mappedJobs = supabaseData ? supabaseData.map(mapSupabaseJobToAppJob) : [];
          setJobs(mappedJobs);
        }
        setIsLoading(false);
      };
      fetchJobs();
    }
  }, [user]); // Re-fetch if user changes (e.g., on logout, though ProtectedRoute handles redirect)

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin/login"); // Navigate after successful logout
    }
  };

  const handleAddNewJob = () => {
    navigate("/admin/jobs/new");
  };
  
  const handleStatusChange = async (jobId: string, newStatus: 'Published' | 'Draft') => {
    setIsLoading(true); // Optional: show loading state during update
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', jobId);

    if (error) {
      toast({ title: "Error", description: `Failed to update job status: ${error.message}`, variant: "destructive" });
    } else {
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
      toast({
        title: "Job status updated",
        description: `Job #${jobId.substring(0,8)} is now ${newStatus.toLowerCase()}`,
      });
    }
    setIsLoading(false);
  };
  
  const handleDeleteJob = async (jobId: string) => {
    setIsLoading(true); // Optional: show loading state during delete
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) {
      toast({ title: "Error", description: `Failed to delete job: ${error.message}`, variant: "destructive" });
    } else {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      toast({
        title: "Job deleted",
        description: `Job #${jobId.substring(0,8)} has been removed`,
      });
    }
    setIsLoading(false);
  };

  // ProtectedRoute handles unauthorized access, so no need for !isAuthorized check here
  // If user is null and loading is false, ProtectedRoute would have redirected.
  // We might still want a loading state for the initial job fetch if user is present.
  if (isLoading && jobs.length === 0) { // Show loading spinner if fetching initial jobs
     return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-4 border-hragency-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-hragency-blue">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </header>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Job Listings Management</h2>
            <Button size="sm" className="bg-hragency-blue hover:bg-hragency-blue/90" onClick={handleAddNewJob}>
              <Plus className="h-4 w-4 mr-2" /> Add New Job
            </Button>
          </div>
          
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-hragency-blue border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium">ID</th>
                    <th className="py-3 text-left font-medium">Title</th>
                    <th className="py-3 text-left font-medium">Location</th>
                    <th className="py-3 text-left font-medium">Date Posted</th>
                    <th className="py-3 text-left font-medium">Status</th>
                    <th className="py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">{job.id}</td>
                      <td className="py-3">{job.title}</td>
                      <td className="py-3">{job.location.city}, {job.location.state}</td>
                      <td className="py-3">{new Date(job.datePosted).toLocaleDateString()}</td>
                      <td className="py-3">
                        <Badge 
                          variant={job.status === 'Published' ? 'default' : 'secondary'}
                          className="cursor-pointer"
                          onClick={() => handleStatusChange(
                            job.id, 
                            job.status === 'Published' ? 'Draft' : 'Published'
                          )}
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
