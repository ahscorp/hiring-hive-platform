
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client
import { Tables, Json } from "@/integrations/supabase/types"; // Import Supabase types, ADD Json
import { Job, Location, Experience, Industry, SalaryRange } from "@/data/jobTypes"; // Import Job and related types
import JobFilters from "@/components/JobFilters";
import JobList from "@/components/JobList";
import ApplicationForm from "@/components/ApplicationForm";
// Mock data for filters will be kept for now, ideally fetched from Supabase or distinct values from jobs
import { experienceRanges, industries, locations, salaryRanges } from "@/data/mockData"; 
import JobBoardHeader from "@/components/JobBoardHeader";

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
      typeof (jsonValue as any).id === 'string' // Check if id is a string
    ) {
      // Add more checks here if needed for other properties of T
      return jsonValue as T;
    }
    return defaultValue;
  };

  // Helper function specifically for SalaryRange as it can be null
  const safeGetSalaryRange = (
    jsonValue: Json | undefined | null
  ): SalaryRange | null => {
    if (
      typeof jsonValue === 'object' &&
      jsonValue !== null &&
      !Array.isArray(jsonValue) // Ensure it's an object, not an array
    ) {
      // Cast to a more specific object type for easier property access
      const obj = jsonValue as { [key: string]: Json | undefined };
      
      const id = obj.id;
      const range = obj.range;
      const min = obj.min;
      const max = obj.max; // max can be number, null, or undefined if not present

      if (
        typeof id === 'string' &&
        typeof range === 'string' &&
        typeof min === 'number' &&
        ('max' in obj ? (typeof max === 'number' || max === null) : true) // If max exists, it must be number or null. If it doesn't exist, that's also fine if the type allows optional or null.
                                                                        // SalaryRange expects max: number | null, so it must exist.
      ) {
         // Re-check 'max' presence for SalaryRange
        if ('max' in obj && (typeof obj.max === 'number' || obj.max === null)) {
            return {
                id: id,
                range: range,
                min: min,
                max: obj.max as number | null, // Cast after check
            };
        }
      }
    }
    return null;
  };

  // Define default values for complex types if parsing fails or data is missing
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
    keySkills: supabaseJob.keyskills || [], // Supabase: keyskills -> app: keySkills
    description: supabaseJob.description,
    responsibilities: supabaseJob.responsibilities || [],
    salaryRange: safeGetSalaryRange(supabaseJob.salaryrange), // Supabase: salaryrange -> app: salaryRange
    status: supabaseJob.status as ('Published' | 'Draft'), // Ensure status values align
    datePosted: supabaseJob.dateposted || new Date().toISOString(), // Supabase: dateposted -> app: datePosted
  };
};

const Index = () => {
  // States for filtering
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSalary, setSelectedSalary] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // States for job list - now using the app's Job type
  const [allJobs, setAllJobs] = useState<Job[]>([]); // Store all fetched and mapped jobs
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]); // Jobs after filtering
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true
  
  // States for application form
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Fetch jobs from Supabase on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      const { data: supabaseData, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active'); // Assuming 'active' is a status for open jobs

      if (error) {
        console.error("Error fetching jobs:", error);
        setAllJobs([]);
      } else {
        const mappedJobs = supabaseData ? supabaseData.map(mapSupabaseJobToAppJob) : [];
        setAllJobs(mappedJobs);
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, []);

  // Apply filters whenever filter states or allJobs change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...allJobs]; // allJobs is now Job[]
      
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
          job.salaryRange && job.salaryRange.id === selectedSalary // Use job.salaryRange
        );
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(job => 
          job.title.toLowerCase().includes(query) ||
          (job.keySkills && job.keySkills.some(skill => skill.toLowerCase().includes(query))) || // Use job.keySkills
          job.description.toLowerCase().includes(query)
        );
      }
      
      setFilteredJobs(result);
    };
    
    // No need to check allJobs.length > 0 if setIsLoading(false) is handled correctly after fetch
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
