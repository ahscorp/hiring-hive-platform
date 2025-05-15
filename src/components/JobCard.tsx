
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 job-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-heading font-semibold mb-2 text-hragency-blue">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-2 text-gray-600 text-sm mb-3">
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              {job.industry.name}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {job.location.city}, {job.location.state}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {job.experience.range}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(job.datePosted)}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {job.keySkills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="mr-1">
                {skill}
              </Badge>
            ))}
            {job.keySkills.length > 4 && (
              <Badge variant="outline">+{job.keySkills.length - 4}</Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="bg-hragency-lightBlue text-hragency-blue px-3 py-1 rounded-md text-sm font-medium mb-2">
            {job.id}
          </div>
          {job.salaryRange && (
            <div className="text-sm font-medium text-gray-700">
              {job.salaryRange.range}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t pt-4 animate-fade-in">
          <p className="text-gray-700 mb-3">{job.description}</p>
          <div className="mb-4">
            <h4 className="font-medium mb-2">Key Responsibilities:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {job.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Department:</h4>
            <p className="text-gray-700">{job.department}</p>
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => setExpanded(!expanded)}
          size="sm"
        >
          {expanded ? "View Less" : "View More"}
        </Button>
        <Button 
          onClick={() => onApply(job.id)}
          className="bg-hragency-blue hover:bg-hragency-blue/90"
        >
          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
