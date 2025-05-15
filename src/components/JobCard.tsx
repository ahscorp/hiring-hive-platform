
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/data/jobTypes";
import { ArrowRight, Briefcase, Calendar, MapPin, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
}

const JobCard = ({ job, onApply }: JobCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col job-card">
      <div className="mb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-heading font-semibold text-hragency-blue line-clamp-2">
            {job.title}
          </h3>
          <div className="bg-hragency-lightBlue text-hragency-blue px-2 py-1 rounded-md text-xs font-medium">
            {job.id}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 text-gray-600 text-xs mb-3">
          <div className="flex items-center">
            <Briefcase className="h-3 w-3 mr-1" />
            {job.industry.name}
          </div>
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {job.location.city}
          </div>
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            {job.experience.range}
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(job.datePosted)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {job.keySkills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.keySkills.length > 3 && (
            <Badge variant="outline" className="text-xs">+{job.keySkills.length - 3}</Badge>
          )}
        </div>
        
        {job.salaryRange && (
          <div className="text-xs font-medium text-gray-700 mb-2">
            {job.salaryRange.range}
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-2 border-t pt-3 text-sm">
          <p className="text-gray-700 mb-2">{job.description.substring(0, 120)}...</p>
        </div>
      )}

      <div className="mt-auto pt-3 flex justify-between items-center border-t">
        <Button 
          variant="ghost" 
          onClick={() => setExpanded(!expanded)}
          size="sm"
          className="text-xs h-8"
        >
          {expanded ? "View Less" : "View More"}
        </Button>
        <Button 
          onClick={() => onApply(job.id)}
          className="bg-hragency-blue hover:bg-hragency-blue/90 text-xs h-8"
        >
          Apply <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
