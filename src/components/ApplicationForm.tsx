
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationForm as ApplicationFormType, Job } from "@/data/jobTypes";
import { useToast } from "@/hooks/use-toast";
import { jobs } from "@/data/mockData";
import { Upload, X } from "lucide-react";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
}

const initialFormData: ApplicationFormType = {
  fullName: "",
  email: "",
  phone: "",
  yearsOfExperience: "",
  currentCompany: "",
  currentDesignation: "",
  currentCTC: "",
  expectedCTC: "",
  noticePeriod: "",
  location: "",
  resume: null,
  jobId: "",
};

const ApplicationForm = ({ isOpen, onClose, jobId }: ApplicationFormProps) => {
  const [formData, setFormData] = useState<ApplicationFormType>({
    ...initialFormData,
    jobId: jobId || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [fileError, setFileError] = useState<string | null>(null);

  // Find the job details
  const job = jobs.find(j => j.id === jobId) as Job;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        setFileError('Please upload a PDF file');
        return;
      }
      
      // Check file size (3MB max)
      if (file.size > 3 * 1024 * 1024) {
        setFileError('File size should be less than 3MB');
        return;
      }
      
      setFormData({
        ...formData,
        resume: file,
      });
    }
  };

  const handleClearFile = () => {
    setFormData({
      ...formData,
      resume: null,
    });
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      'fullName', 'email', 'phone', 'yearsOfExperience', 
      'currentCompany', 'expectedCTC', 'location'
    ] as const;
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields`,
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.resume) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Log the form data for now (in a real app, this would be sent to an API)
      console.log('Application submitted:', formData);
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for your application. We'll be in touch soon.",
      });
      
      // Reset form and close dialog
      setFormData(initialFormData);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {job?.title}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Job ID: {jobId}</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="form-section">
            <h3 className="text-md font-medium mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Current Location <span className="text-red-500">*</span></Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="text-md font-medium mb-3">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience <span className="text-red-500">*</span></Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  placeholder="e.g. 3.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentCompany">Current Company <span className="text-red-500">*</span></Label>
                <Input
                  id="currentCompany"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleInputChange}
                  placeholder="Enter your current company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentDesignation">Current Designation</Label>
                <Input
                  id="currentDesignation"
                  name="currentDesignation"
                  value={formData.currentDesignation}
                  onChange={handleInputChange}
                  placeholder="Enter your current role"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noticePeriod">Notice Period (in days)</Label>
                <Input
                  id="noticePeriod"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  placeholder="e.g. 30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentCTC">Current CTC</Label>
                <Input
                  id="currentCTC"
                  name="currentCTC"
                  value={formData.currentCTC}
                  onChange={handleInputChange}
                  placeholder="e.g. 10 LPA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedCTC">Expected CTC <span className="text-red-500">*</span></Label>
                <Input
                  id="expectedCTC"
                  name="expectedCTC"
                  value={formData.expectedCTC}
                  onChange={handleInputChange}
                  placeholder="e.g. 15 LPA"
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3 className="text-md font-medium mb-3">Resume Upload <span className="text-red-500">*</span></h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="resume" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {!formData.resume ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF (MAX. 3MB)</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full px-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {formData.resume.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({Math.round(formData.resume.size / 1024)} KB)
                        </span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleClearFile}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                  <Input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {fileError && (
                <p className="text-sm text-red-500 mt-1">{fileError}</p>
              )}
              <p className="text-xs text-gray-500">
                Only PDF files are accepted, maximum size 3MB
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !!fileError}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;
