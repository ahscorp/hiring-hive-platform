
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { Experience, Industry, Location, SalaryRange } from "@/data/jobTypes";
import { experienceRanges, industries, locations, salaryRanges } from "@/data/mockData";
import { Search, X } from "lucide-react";

interface JobFiltersProps {
  selectedIndustry: string | null;
  setSelectedIndustry: (industry: string | null) => void;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  selectedExperience: string | null;
  setSelectedExperience: (experience: string | null) => void;
  selectedSalary: string | null;
  setSelectedSalary: (salary: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const JobFilters = ({
  selectedIndustry,
  setSelectedIndustry,
  selectedLocation,
  setSelectedLocation,
  selectedExperience,
  setSelectedExperience,
  selectedSalary,
  setSelectedSalary,
  searchQuery,
  setSearchQuery,
}: JobFiltersProps) => {
  const handleClearFilters = () => {
    setSelectedIndustry(null);
    setSelectedLocation(null);
    setSelectedExperience(null);
    setSelectedSalary(null);
    setSearchQuery("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-heading font-semibold mb-2 text-hragency-blue">Find Your Perfect Job</h2>
        <p className="text-gray-600">Use the filters below to find the right opportunity.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="industry-filter">Industry</Label>
          <Select 
            value={selectedIndustry || ""} 
            onValueChange={(value) => setSelectedIndustry(value || null)}
          >
            <SelectTrigger id="industry-filter">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id}>
                  {industry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location-filter">Location</Label>
          <Select 
            value={selectedLocation || ""} 
            onValueChange={(value) => setSelectedLocation(value || null)}
          >
            <SelectTrigger id="location-filter">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.city}, {location.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience-filter">Experience</Label>
          <Select 
            value={selectedExperience || ""} 
            onValueChange={(value) => setSelectedExperience(value || null)}
          >
            <SelectTrigger id="experience-filter">
              <SelectValue placeholder="Any Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Experience</SelectItem>
              {experienceRanges.map((exp) => (
                <SelectItem key={exp.id} value={exp.id}>
                  {exp.range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="salary-filter">Salary Range</Label>
          <Select 
            value={selectedSalary || ""} 
            onValueChange={(value) => setSelectedSalary(value || null)}
          >
            <SelectTrigger id="salary-filter">
              <SelectValue placeholder="Any Salary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Salary</SelectItem>
              {salaryRanges.map((salary) => (
                <SelectItem key={salary.id} value={salary.id}>
                  {salary.range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job titles or skills..."
            className="pl-10 bg-gray-50"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          className="whitespace-nowrap"
        >
          <X className="h-4 w-4 mr-2" /> Clear Filters
        </Button>
      </div>

      {/* Active filters */}
      {(selectedIndustry || selectedLocation || selectedExperience || selectedSalary) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedIndustry && (
            <Badge 
              className="filter-badge-selected cursor-pointer"
              onClick={() => setSelectedIndustry(null)}
            >
              {industries.find(i => i.id === selectedIndustry)?.name}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {selectedLocation && (
            <Badge 
              className="filter-badge-selected cursor-pointer"
              onClick={() => setSelectedLocation(null)}
            >
              {locations.find(l => l.id === selectedLocation)?.city}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {selectedExperience && (
            <Badge 
              className="filter-badge-selected cursor-pointer"
              onClick={() => setSelectedExperience(null)}
            >
              {experienceRanges.find(e => e.id === selectedExperience)?.range}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {selectedSalary && (
            <Badge 
              className="filter-badge-selected cursor-pointer"
              onClick={() => setSelectedSalary(null)}
            >
              {salaryRanges.find(s => s.id === selectedSalary)?.range}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilters;
