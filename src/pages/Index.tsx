import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client"; 
import { Tables } from "@/integrations/supabase/types"; 
import { Job, Location, Experience, Industry, SalaryRange } from "@/data/jobTypes"; 
import JobFilters from "@/components/JobFilters";
import JobList from "@/components/JobList";
import ApplicationForm from "@/components/ApplicationForm";
import { experienceRanges, salaryRanges } from "@/data/mockData"; 
import JobBoardHeader from "@/components/JobBoardHeader";
import { toast } from '@/hooks/use-toast';

// Type for a job row directly from Supabase
type SupabaseJobRow = Tables<'jobs'>;

// Mapping function from SupabaseJobRow to our application's Job type
const mapSupabaseJobToAppJob = (supabaseJob: SupabaseJobRow): Job => {
  // Create location object from string
  const locationText = supabaseJob.location || 'Not Specified';
  const locationParts = locationText.includes(',') ? locationText.split(',') : ['Not Specified', ''];
  const defaultLocation: Location = { 
    id: locationText.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
    city: locationParts[0].trim(), 
    state: locationParts[1]?.trim() || '' 
  };

  // Create experience object from string
  const experienceText = supabaseJob.experience || 'Not Specified';
  const experienceObj = experienceRanges.find(exp => exp.range === experienceText);
  const defaultExperience: Experience = experienceObj || { 
    id: experienceText.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
    range: experienceText, 
    minYears: 0, 
    maxYears: null 
  };

  // Create industry object from string
  const industryText = supabaseJob.industry || 'Not Specified';
  const defaultIndustry: Industry = { 
    id: industryText.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
    name: industryText 
  };
  
  // Use a default salary range for now
  const defaultSalaryRange = salaryRanges[0] || null;

  return {
    id: supabaseJob.jobId || supabaseJob.id,
    title: supabaseJob.position,
    location: defaultLocation,
    experience: defaultExperience,
    industry: defaultIndustry,
    department: supabaseJob.jobId || '',
    keySkills: supabaseJob.keyskills || [],
    description: supabaseJob.description,
    responsibilities: supabaseJob.keyskills || [],
    salaryRange: defaultSalaryRange,
    status: supabaseJob.status as ('Published' | 'Draft'),
    datePosted: supabaseJob.dateposted || new Date().toISOString(),
    ctc: supabaseJob.ctc || null,
  };
};

const Index = () => {
  // States for filtering
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSalary, setSelectedSalary] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterDropdownLocations, setFilterDropdownLocations] = useState<Location[]>([]);
  const [filterDropdownIndustries, setFilterDropdownIndustries] = useState<Industry[]>([]);
  
  // States for job list
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // States for application form
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobForForm, setSelectedJobForForm] = useState<Job | null>(null);

  // Fetch jobs from Supabase on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const { data: supabaseData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'Published');

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
          setFilteredJobs(mappedJobs);
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
      
      if (selectedIndustry && filterDropdownIndustries.length > 0) {
        const industryDetails = filterDropdownIndustries.find(ind => ind.id === selectedIndustry);
        if (industryDetails) {
          result = result.filter(job => job.industry && job.industry.name.toLowerCase() === industryDetails.name.toLowerCase());
        }
      }
      
      if (selectedLocation && filterDropdownLocations.length > 0) {
        const locationDetails = filterDropdownLocations.find(loc => loc.id === selectedLocation);
        if (locationDetails) {
          result = result.filter(job => 
            job.location && 
            job.location.city.toLowerCase() === locationDetails.city.toLowerCase() &&
            (job.location.state?.toLowerCase() || '') === (locationDetails.state?.toLowerCase() || '')
          );
        }
      }
      
      if (selectedExperience) {
        result = result.filter(job => job.experience && job.experience.id === selectedExperience);
      }
      
      if (selectedSalary) {
        result = result.filter(job => 
          job.salaryRange && job.salaryRange.id === selectedSalary
        );
      }

      if (selectedGender) {
        result = result.filter(job => {
          // Find the original job data from Supabase to get the gender field
          const originalJobData = allJobs.find(j => j.id === job.id);
          // If job has no gender preference or gender is "any", it should show for all filters
          // If job has specific gender preference, only show when filter matches or filter is "any"
          const jobGender = (originalJobData as any)?.gender;
          if (!jobGender || jobGender === 'any') return true;
          return jobGender === selectedGender;
        });
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
  }, [selectedIndustry, selectedLocation, selectedExperience, selectedSalary, selectedGender, searchQuery, allJobs, filterDropdownLocations, filterDropdownIndustries]);

  const handleApply = (jobId: string) => {
    const jobToApply = allJobs.find(job => job.id === jobId);
    if (jobToApply) {
      setSelectedJobForForm(jobToApply);
      setSelectedJobId(jobId);
      setIsFormOpen(true);
    } else {
      console.error("Job not found for ID:", jobId);
      toast({ title: "Error", description: "Could not find job details to apply.", variant: "destructive" });
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedJobId(null);
    setSelectedJobForForm(null);
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
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onLocationsFetched={setFilterDropdownLocations}
          onIndustriesFetched={setFilterDropdownIndustries}
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
          job={selectedJobForForm}
        />
      </div>
    </div>
  );
};

export default Index;
