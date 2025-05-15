
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { jobs as mockJobs } from "@/data/mockData";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/data/jobTypes";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
    
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }
    
    setIsAuthorized(true);
    
    // Load job listings
    setIsLoading(true);
    setTimeout(() => {
      setJobs(mockJobs);
      setIsLoading(false);
    }, 500); // Simulate API call
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  };
  
  const handleStatusChange = (jobId: string, newStatus: 'Published' | 'Draft') => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
    
    toast({
      title: "Job status updated",
      description: `Job #${jobId} is now ${newStatus.toLowerCase()}`,
    });
  };
  
  const handleDeleteJob = (jobId: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    
    toast({
      title: "Job deleted",
      description: `Job #${jobId} has been removed`,
      variant: "destructive",
    });
  };

  if (!isAuthorized) {
    return null; // Don't render anything while checking auth
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
            <Button size="sm" className="bg-hragency-blue hover:bg-hragency-blue/90">
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
