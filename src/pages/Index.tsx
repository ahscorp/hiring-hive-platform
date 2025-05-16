import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client"; 
import { Tables, Json } from "@/integrations/supabase/types"; 
import { Job, Location, Experience, Industry, SalaryRange } from "@/data/jobTypes"; 
import JobFilters from "@/components/JobFilters";
import JobList from "@/components/JobList";
import ApplicationForm from "@/components/ApplicationForm";
import { experienceRanges, industries, locations, salaryRanges } from "@/data/mockData"; 
import JobBoardHeader from "@/components/JobBoardHeader";
import { toast } from '@/hooks/use-toast';

// Type for a job row directly from Supabase
type SupabaseJobRow = Tables<'jobs'>;

// Mapping function from SupabaseJobRow to our application's Job type
const mapSupabaseJobToAppJob = (supabaseJob: SupabaseJobRow): Job => {
  // Helper function to safely get a typed object from a Json field
  const safeGetTypedObject = <T extends { id: string }>(
    jsonValue: Json | undefined | null,
    defaultValue: T
  ): T => {
    if (
      typeof jsonValue === 'object' &&
      jsonValue !== null &&
      'id' in jsonValue &&
      typeof (jsonValue as any).id === 'string'
    ) {
      return jsonValue as T;
    }
    return defaultValue;
  };

  // Default values for complex types
  const defaultLocation: Location = { id: 'unknown_loc', city: 'Not Specified', state: '' };
  const defaultExperience: Experience = { id: 'unknown_exp', range: 'Not Specified', minYears: 0, maxYears: null };
  const defaultIndustry: Industry = { id: 'unknown_ind', name: 'Not Specified' };
  
  // Find the salary range from our predefined ranges that matches this job
  const salaryFromList = salaryRanges.find(salary => 
    salary.id === (supabaseJob.industry as any)?.salaryRangeId
  ) || null;

  return {
    id: supabaseJob.id,
    title: supabaseJob.position,
    location: safeGetTypedObject<Location>(supabaseJob.location, defaultLocation),
    experience: safeGetTypedObject<Experience>(supabaseJob.experience, defaultExperience),
    industry: safeGetTypedObject<Industry>(supabaseJob.industry, defaultIndustry),
    department: supabaseJob.jobId || '',  // Use jobId as department field
    keySkills: supabaseJob.keyskills || [],
    description: supabaseJob.description,
    responsibilities: supabaseJob.keyskills || [], // Use keyskills as responsibilities temporarily
    salaryRange: salaryFromList, // Use a fixed salary range from our predefined list for now
    status: supabaseJob.status as ('Published' | 'Draft'),
    datePosted: supabaseJob.dateposted || new Date().toISOString(),
  };
};

const Index = () => {
  // States for filtering
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSalary, setSelectedSalary] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // States for job list
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // States for application form
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Fetch jobs from Supabase on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data: supabaseData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'Published'); // Only get published jobs

        if (error) {
          console.error("Error fetching jobs:", error);
          toast({
            title: "Error",
            description: "Failed to load job listings. Please try again.",
            variant: "destructive"
          });
          setAllJobs([]);
        } else {
          console.log("Fetched jobs data:", supabaseData);
          const mappedJobs = supabaseData ? supabaseData.map(mapSupabaseJobToAppJob) : [];
          console.log("Mapped jobs:", mappedJobs);
          setAllJobs(mappedJobs);
          setFilteredJobs(mappedJobs); // Initialize filtered jobs with all jobs
        }
      } catch (err) {
        console.error("Exception fetching jobs:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Apply filters whenever filter states or allJobs change
  useEffect(() => {
    const applyFilters = () => {
      console.log("Applying filters to jobs:", allJobs);
      let result = [...allJobs];
      
      if (selectedIndustry) {
        result = result.filter(job => job.industry && job.industry.id === selectedIndustry);
      }
      
      if (selectedLocation) {
        result = result.filter(job => job.location && job.location.id === selectedLocation);
      }
      
      if (selectedExperience) {
        result = result.filter(job => job.experience && job.experience.id === selectedExperience);
      }
      
      if (selectedSalary) {
        result = result.filter(job => 
          job.salaryRange && job.salaryRange.id === selectedSalary
        );
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(job => 
          job.title.toLowerCase().includes(query) ||
          (job.keySkills && job.keySkills.some(skill => skill.toLowerCase().includes(query))) || 
          job.description.toLowerCase().includes(query)
        );
      }
      
      console.log("Filtered jobs result:", result);
      setFilteredJobs(result);
    };
    
    applyFilters(); 
  }, [selectedIndustry, selectedLocation, selectedExperience, selectedSalary, searchQuery, allJobs]);

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
