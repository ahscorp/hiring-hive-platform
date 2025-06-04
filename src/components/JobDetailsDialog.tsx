
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Job } from "@/data/jobTypes";
import { Briefcase, Calendar, MapPin, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobDetailsDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailsDialog = ({ job, isOpen, onClose }: JobDetailsDialogProps) => {
  if (!job) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-semibold text-hragency-blue">
            {job.title}
          </DialogTitle>
          <DialogDescription className="font-medium text-sm text-gray-600">
            Job ID: {job.id} • Posted {formatDate(job.datePosted)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-hragency-blue" />
            <div>
              <div className="text-sm font-medium">Industry</div>
              <div className="text-sm text-gray-600">{job.industry.name}</div>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-hragency-blue" />
            <div>
              <div className="text-sm font-medium">Location</div>
              <div className="text-sm text-gray-600">
                {job.location.city}, {job.location.state}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-hragency-blue" />
            <div>
              <div className="text-sm font-medium">Experience</div>
              <div className="text-sm text-gray-600">{job.experience.range}</div>
            </div>
          </div>
        </div>

        {job.ctc && (
          <div className="bg-hragency-lightBlue/20 p-3 rounded-md mb-4">
            <div className="font-medium text-sm">CTC</div>
            <div className="text-hragency-blue font-medium">
              {job.ctc}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-gray-700">{job.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Key Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.keySkills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Department</h3>
            <p className="text-sm text-gray-700">{job.department}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;
