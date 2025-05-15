
import { useEffect, useState } from "react";
import { Job } from "@/data/jobTypes";
import { jobs as mockJobs } from "@/data/mockData";
import JobFilters from "@/components/JobFilters";
import JobList from "@/components/JobList";
import ApplicationForm from "@/components/ApplicationForm";
import { experienceRanges, industries, locations, salaryRanges } from "@/data/mockData";
import JobBoardHeader from "@/components/JobBoardHeader";

const Index = () => {
  // States for filtering
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSalary, setSelectedSalary] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // States for job list
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // States for application form
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Apply filters whenever filter states change
  useEffect(() => {
    const applyFilters = () => {
      setIsLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        let result = [...mockJobs];
        
        // Filter by industry
        if (selectedIndustry) {
          result = result.filter(job => job.industry.id === selectedIndustry);
        }
        
        // Filter by location
        if (selectedLocation) {
          result = result.filter(job => job.location.id === selectedLocation);
        }
        
        // Filter by experience
        if (selectedExperience) {
          const selectedExpRange = experienceRanges.find(exp => exp.id === selectedExperience);
          if (selectedExpRange) {
            result = result.filter(job => job.experience.id === selectedExperience);
          }
        }
        
        // Filter by salary
        if (selectedSalary) {
          result = result.filter(job => 
            job.salaryRange && job.salaryRange.id === selectedSalary
          );
        }
        
        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          result = result.filter(job => 
            job.title.toLowerCase().includes(query) ||
            job.keySkills.some(skill => skill.toLowerCase().includes(query)) ||
            job.description.toLowerCase().includes(query)
          );
        }
        
        setFilteredJobs(result);
        setIsLoading(false);
      }, 500); // Simulate 500ms of loading time
    };
    
    applyFilters();
  }, [selectedIndustry, selectedLocation, selectedExperience, selectedSalary, searchQuery]);

  const handleApply = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedJobId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <JobBoardHeader />
        
        <JobFilters 
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedExperience={selectedExperience}
          setSelectedExperience={setSelectedExperience}
          selectedSalary={selectedSalary}
          setSelectedSalary={setSelectedSalary}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <JobList 
          filteredJobs={filteredJobs}
          onApply={handleApply}
          isLoading={isLoading}
        />
        
        {/* Application Form Dialog */}
        <ApplicationForm 
          isOpen={isFormOpen} 
          onClose={closeForm}
          jobId={selectedJobId}
        />
      </div>
    </div>
  );
};

export default Index;
