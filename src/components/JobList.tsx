
import { useEffect, useState } from "react";
import { Job } from "@/data/jobTypes";
import JobCard from "./JobCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface JobListProps {
  filteredJobs: Job[];
  onApply: (jobId: string) => void;
  isLoading: boolean;
}

const JobList = ({ 
  filteredJobs, 
  onApply,
  isLoading
}: JobListProps) => {
  const [displayCount, setDisplayCount] = useState(6);
  
  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(6);
  }, [filteredJobs]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-hragency-blue" />
      </div>
    );
  }
  
  if (!filteredJobs || filteredJobs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
        <div className="space-y-4">
          <div className="h-16 bg-gray-100 rounded-md w-3/4 mx-auto"></div>
          <div className="h-16 bg-gray-100 rounded-md w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-hragency-blue">
          {filteredJobs.length} Jobs Found
        </h2>
        <p className="text-sm text-gray-600">
          Showing {Math.min(displayCount, filteredJobs.length)} of {filteredJobs.length} jobs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.slice(0, displayCount).map((job) => (
          <JobCard key={job.id} job={job} onApply={onApply} />
        ))}
      </div>
      
      {displayCount < filteredJobs.length && (
        <div className="mt-6 text-center">
          <Button 
            onClick={() => setDisplayCount(prev => prev + 6)}
            variant="outline"
            className="px-8"
          >
            Load More Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;
