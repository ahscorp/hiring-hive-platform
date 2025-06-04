import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Trash, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Job, Location, Experience, Industry, SalaryRange } from "@/data/jobTypes"; // Import all necessary types
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-context"; // Import useAuth
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client
import { Tables, Json } from "@/integrations/supabase/types"; // Import Supabase types
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Type for a job row directly from Supabase
type SupabaseJobRow = Tables<'jobs'>;

// Type for an application from Supabase
type Application = Tables<'applications'>;

// Mapping function from SupabaseJobRow to our application's Job type - simplified for admin view
const mapSupabaseJobToAppJob = (supabaseJob: SupabaseJobRow): Job => {
  // Create location object from string - use actual values
  const locationText = supabaseJob.location || '';
  const locationParts = locationText.includes(',') ? locationText.split(',') : [locationText, ''];
  const defaultLocation: Location = { 
    id: locationText.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
    city: locationParts[0].trim() || 'Not Specified', 
    state: locationParts[1]?.trim() || '' 
  };

  // Create experience object from string - use actual values
  const experienceText = supabaseJob.experience || '';
  const defaultExperience: Experience = { 
    id: experienceText.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
    range: experienceText || 'Not Specified', 
    minYears: 0, 
    maxYears: null 
  };

  // Create industry object from string - use actual values
  const industryText = supabaseJob.industry || '';
  const defaultIndustry: Industry = { 
    id: industryText.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
    name: industryText || 'Not Specified'
  };

  return {
    id: supabaseJob.id,
    title: supabaseJob.position,
    location: defaultLocation,
    experience: defaultExperience,
    industry: defaultIndustry,
    department: supabaseJob.jobId || '',
    keySkills: supabaseJob.keyskills || [],
    description: supabaseJob.description,
    responsibilities: supabaseJob.keyskills || [],
    salaryRange: null,
    status: supabaseJob.status as ('Published' | 'Draft'),
    datePosted: supabaseJob.dateposted || new Date().toISOString(),
    ctc: supabaseJob.ctc || null,
    gender: supabaseJob.gender as ('male' | 'female' | 'any') || null,
  };
};

const Admin = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Get logout function and user from context
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Record<string, Application[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

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
          
          // Fetch applications for each job
          await fetchApplicationsForJobs(supabaseData?.map(job => job.id) || []);
        }
        setIsLoading(false);
      };
      fetchJobs();
    }
  }, [user]); // Re-fetch if user changes (e.g., on logout, though ProtectedRoute handles redirect)

  const fetchApplicationsForJobs = async (jobIds: string[]) => {
    if (jobIds.length === 0) return;
    
    setIsLoadingApplications(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .in('job_id', jobIds);
      
      if (error) {
        console.error("Error fetching applications:", error);
        toast({ title: "Error", description: "Failed to fetch applications.", variant: "destructive" });
      } else {
        // Group applications by job_id
        const appsByJob: Record<string, Application[]> = {};
        data?.forEach(app => {
          const jobId = app.job_id || '';
          if (!appsByJob[jobId]) {
            appsByJob[jobId] = [];
          }
          appsByJob[jobId].push(app);
        });
        
        setApplications(appsByJob);
      }
    } catch (err) {
      console.error("Exception fetching applications:", err);
    } finally {
      setIsLoadingApplications(false);
    }
  };

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

  // Add edit job function
  const handleEditJob = (jobId: string) => {
    navigate(`/admin/jobs/edit/${jobId}`);
  };

  // Mark application as processed
  const toggleApplicationProcessed = async (appId: string, currentValue: boolean | null) => {
    const newValue = !currentValue;
    
    const { error } = await supabase
      .from('applications')
      .update({ processed: newValue })
      .eq('id', appId);
      
    if (error) {
      toast({ 
        title: "Error", 
        description: `Failed to update application status: ${error.message}`, 
        variant: "destructive" 
      });
      return;
    }
    
    // Update local state
    setApplications(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(jobId => {
        updated[jobId] = updated[jobId].map(app => 
          app.id === appId ? { ...app, processed: newValue } : app
        );
      });
      return updated;
    });
    
    toast({
      title: "Application updated",
      description: `Application marked as ${newValue ? 'processed' : 'unprocessed'}`,
    });
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
              <Accordion type="single" collapsible className="w-full">
                {jobs.map(job => (
                  <AccordionItem key={job.id} value={job.id}>
                    <div className="border-b hover:bg-gray-50">
                      <div className="flex items-center">
                        <AccordionTrigger className="py-3 flex-grow">
                          <div className="grid grid-cols-5 w-full text-left">
                            <div className="truncate">{job.department || 'N/A'}</div>
                            <div className="truncate">{job.title}</div>
                            <div className="truncate">{job.location.city}{job.location.state ? `, ${job.location.state}` : ''}</div>
                            <div>{new Date(job.datePosted).toLocaleDateString()}</div>
                            <div>
                              <Badge 
                                variant={job.status === 'Published' ? 'default' : 'secondary'}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(
                                    job.id, 
                                    job.status === 'Published' ? 'Draft' : 'Published'
                                  );
                                }}
                              >
                                {job.status}
                              </Badge>
                              {applications[job.id]?.length > 0 && (
                                <Badge variant="outline" className="ml-2">
                                  <User className="h-3 w-3 mr-1" /> 
                                  {applications[job.id].length}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <div className="flex gap-2 pr-4">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditJob(job.id)}
                          >
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
                      </div>
                      
                      <AccordionContent>
                        <div className="pt-3 pb-6">
                          <h3 className="font-medium mb-3">Applications</h3>
                          
                          {isLoadingApplications ? (
                            <div className="py-4 flex justify-center">
                              <div className="animate-spin h-5 w-5 border-2 border-hragency-blue border-t-transparent rounded-full"></div>
                            </div>
                          ) : applications[job.id]?.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-gray-100">
                                    <th className="px-2 py-2 text-left">Name</th>
                                    <th className="px-2 py-2 text-left">Email</th>
                                    <th className="px-2 py-2 text-left">Phone</th>
                                    <th className="px-2 py-2 text-left">Location</th>
                                    <th className="px-2 py-2 text-left">Experience</th>
                                    <th className="px-2 py-2 text-left">Department</th>
                                    <th className="px-2 py-2 text-left">Status</th>
                                    <th className="px-2 py-2 text-left">Resume</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {applications[job.id].map(app => (
                                    <tr key={app.id} className="border-t hover:bg-gray-50">
                                      <td className="px-2 py-2">{app.fullname}</td>
                                      <td className="px-2 py-2">{app.email}</td>
                                      <td className="px-2 py-2">{app.phone}</td>
                                      <td className="px-2 py-2">{app.location}</td>
                                      <td className="px-2 py-2">{app.yearsofexperience}</td>
                                      <td className="px-2 py-2">{app.department}</td>
                                      <td className="px-2 py-2">
                                        <Badge 
                                          variant={app.processed ? "default" : "secondary"}
                                          className="cursor-pointer"
                                          onClick={() => toggleApplicationProcessed(app.id, app.processed)}
                                        >
                                          {app.processed ? "Processed" : "New"}
                                        </Badge>
                                      </td>
                                      <td className="px-2 py-2">
                                        {app.resume_url ? (
                                          <a 
                                            href={app.resume_url} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-hragency-blue hover:underline"
                                          >
                                            <FileText className="h-4 w-4 mr-1" />
                                            View
                                          </a>
                                        ) : (
                                          <span className="text-gray-400">No resume</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">No applications for this job yet</p>
                          )}
                        </div>
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
