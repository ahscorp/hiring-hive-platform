
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
import { Upload, X, FileText } from "lucide-react";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { uploadResume } from "@/utils/fileUploader";

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const initialFormData: ApplicationFormType = {
  fullName: "",
  email: "",
  phone: "",
  yearsOfExperience: "",
  currentCompany: "",
  currentDesignation: "",
  currentCTC: "",
  currentTakeHome: "",
  expectedCTC: "",
  noticePeriod: "",
  location: "",
  department: "",
  otherDepartment: "",
  resume: null,
  jobId: "",
};

const departments = [
  "Human Resources",
  "Account & Finance",
  "Sales & Marketing",
  "Information Technology",
  "Operations",
  "Customer Service",
  "Production",
  "Supply Chain",
  "Quality",
  "Administration",
  "Other"
];

const ApplicationForm = ({ isOpen, onClose, job }: ApplicationFormProps) => {
  console.log("ApplicationForm: Received job prop:", job);
  const [formData, setFormData] = useState<ApplicationFormType>({
    ...initialFormData,
    jobId: job?.id || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [fileError, setFileError] = useState<string | null>(null);

  // Check if this is a generic application
  const isGenericApplication = job?.id === "AHS000";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (file) {
      // Check file type - accepting PDF and DOC/DOCX
      if (
        file.type !== 'application/pdf' && 
        file.type !== 'application/msword' && 
        file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        setFileError('Please upload a PDF or Word document');
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
    
    // Updated validation for ALL required fields (making all mandatory)
    const requiredFields = [
      'fullName', 'email', 'phone', 'yearsOfExperience', 
      'currentCompany', 'currentDesignation', 'currentCTC', 'currentTakeHome',
      'expectedCTC', 'noticePeriod', 'location', 'department'
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
    
    // Check if "Other" department is selected but no description provided
    if (formData.department === "Other" && !formData.otherDepartment) {
      toast({
        title: "Missing Information",
        description: "Please specify the other department",
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
    
    try {
      // STEP 1: Upload resume to server via PHP script (this happens first)
      let uploadedResumeUrl = ""; 
      if (formData.resume) {
        console.log("ApplicationForm handleSubmit: job?.id before resume upload:", job?.id);
        const uploadResult = await uploadResume(
          formData.resume,
          job?.id || 'default',
          formData.fullName
        );

        if (!uploadResult.success || !uploadResult.resume_url) {
          toast({
            title: "Upload Error",
            description: uploadResult.error || "Failed to upload resume. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        // Construct absolute URL
        const relativeResumeUrl = uploadResult.resume_url;
        const pathSegment = relativeResumeUrl.startsWith('/') ? relativeResumeUrl.substring(1) : relativeResumeUrl;
        uploadedResumeUrl = `${window.location.origin}/${pathSegment}`;
      } else {
        toast({
          title: "Resume Missing",
          description: "Resume file is required but was not found during submission process.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // STEP 2: Submit to Google Apps Script (using the uploadedResumeUrl)
      const webhookPayload: { [key: string]: string } = {
        'Full Name': formData.fullName,
        'Email': formData.email,
        'Contact Number': formData.phone,
        'Years Of Experience': formData.yearsOfExperience,
        'Current Company Name': formData.currentCompany,
        'Current Designation': formData.currentDesignation,
        'Current CTC (per annum)': formData.currentCTC,
        'Current Take Home Salary (per month)': formData.currentTakeHome,
        'Expected CTC (per annum)': formData.expectedCTC,
        'What is your notice period ?(in days)': formData.noticePeriod,
        'What is your current location ?': formData.location,
        'In which department are you searching for job ?': formData.department,
        'Other': formData.department === "Other" ? formData.otherDepartment : '',
        'Upload Resume': uploadedResumeUrl,
        'job_id': job?.id || '',
        'job_title': job?.title || '',
        'Date': new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        'Time': new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase(),
        'Page URL': window.location.href,
        'form_name': isGenericApplication ? 'General Profile Submission' : 'Job Application Form'
      };

      const urlEncodedData = Object.keys(webhookPayload)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(webhookPayload[key]))
        .join('&');
      
      const googleScriptUrl = "https://script.google.com/macros/s/AKfycbzesKj5CzNT3KWmNY_-OoVPn36GwS5lc20OvGK3VjvaWraZhqwZ2iF49i0lmOhcbBjN/exechttps://script.google.com/macros/s/AKfycby4dkwDr3suI-QekiOdzOyS6hJ1EYe1iimvTwvHQyE/devhttps://script.google.com/macros/s/AKfycbwL_RX_t9EfypFFEK6bo7IUKOnSlHG-ZujIV8dw47tIGo-ivrIXWgpYRkCSy13e-bZY/exechttps://script.google.com/macros/s/AKfycbxnaR-lK3qmWhxWQz_YRQuwsSgbjUZydE8hBkNoQr6abAPDkI6xrBRKb1Iclor2DjAXNg/exec";
      
      try {
        const response = await fetch(googleScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: urlEncodedData
        });
        console.log("Webhook submission response status:", response.status);
        if (!response.ok) {
          console.error("Webhook submission to webhook.site failed. Status:", response.status);
          const responseText = await response.text();
          console.error("Webhook.site response text:", responseText);
        } else {
          console.log("Webhook submission to webhook.site successful (URL-encoded)");
        }
      } catch (error) {
        console.error("Webhook submission error to webhook.site (URL-encoded):", error);
        // Log and continue
      }
      
      // STEP 3: Store application data in Supabase
      if (isGenericApplication) {
        // Store in general_profiles table for generic applications
        const { error: dbError } = await supabase
          .from('general_profiles')
          .insert({
            fullname: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            yearsofexperience: formData.yearsOfExperience,
            currentcompany: formData.currentCompany,
            currentdesignation: formData.currentDesignation,
            currentctc: formData.currentCTC,
            currenttakehome: formData.currentTakeHome,
            expectedctc: formData.expectedCTC,
            noticeperiod: formData.noticePeriod,
            location: formData.location,
            department: formData.department,
            otherdepartment: formData.department === "Other" ? formData.otherDepartment : null,
            resume_url: uploadedResumeUrl,
            processed: false
          });
          
        if (dbError) {
          console.error('Error saving general profile to database:', dbError);
          toast({
            title: "Database Error",
            description: "Failed to save your profile details. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        // Store in applications table for specific job applications
        let actualJobUUID = null;
        if (job?.id) {
          console.log("ApplicationForm handleSubmit: job?.id before Supabase query:", job?.id);
          const { data: jobData, error: jobFetchError } = await supabase
            .from('jobs')
            .select('id') 
            .eq('jobId', job.id)
            .single();

          console.log("ApplicationForm handleSubmit: Supabase jobData:", jobData, "jobFetchError:", jobFetchError);
          if (jobFetchError || !jobData) {
            console.error('Error fetching job UUID from database:', jobFetchError);
            toast({
              title: "System Error",
              description: "Could not verify job details (UUID fetch failed). Please try again later.",
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
          actualJobUUID = jobData.id;
        }

        console.log("ApplicationForm handleSubmit: actualJobUUID:", actualJobUUID);
        if (!actualJobUUID) {
          toast({
            title: "Invalid Job ID",
            description: "The job ID provided is not valid or could not be found.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        const { error: dbError } = await supabase
          .from('applications')
          .insert({
            job_id: actualJobUUID,
            fullname: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            yearsofexperience: formData.yearsOfExperience,
            currentcompany: formData.currentCompany,
            currentdesignation: formData.currentDesignation,
            currentctc: formData.currentCTC,
            currenttakehome: formData.currentTakeHome,
            expectedctc: formData.expectedCTC,
            noticeperiod: formData.noticePeriod,
            location: formData.location,
            department: formData.department,
            otherdepartment: formData.department === "Other" ? formData.otherDepartment : null,
            resume_url: uploadedResumeUrl,
            processed: false
          });
          
        if (dbError) {
          console.error('Error saving application to database:', dbError);
          toast({
            title: "Database Error",
            description: "Failed to save your application details. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      toast({
        title: isGenericApplication ? "Profile Submitted!" : "Application Submitted!",
        description: isGenericApplication 
          ? "Thank you for submitting your profile. We'll contact you when suitable opportunities arise." 
          : "Thank you for your application. We'll be in touch soon.",
      });
      
      // Reset form and close dialog
      setFormData(initialFormData);
      setIsSubmitting(false);
      onClose();
      
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: "Submission Error",
        description: "An error occurred while submitting your application. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const getFileIcon = () => {
    if (!formData.resume) return null;
    
    if (formData.resume.type === 'application/pdf') {
      return <FileText className="h-5 w-5 mr-2" />;
    } else {
      return <FileText className="h-5 w-5 mr-2" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isGenericApplication ? "Submit Your Profile" : `Apply for ${job?.title}`}
          </DialogTitle>
          {!isGenericApplication && (
            <p className="text-sm text-muted-foreground mt-2">Job ID: {job?.id || 'N/A'}</p>
          )}
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentDesignation">Current Designation <span className="text-red-500">*</span></Label>
                <Input
                  id="currentDesignation"
                  name="currentDesignation"
                  value={formData.currentDesignation}
                  onChange={handleInputChange}
                  placeholder="Enter your current role"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noticePeriod">Notice Period (in days) <span className="text-red-500">*</span></Label>
                <Input
                  id="noticePeriod"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  placeholder="e.g. 30"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentCTC">Current CTC (per annum) <span className="text-red-500">*</span></Label>
                <Input
                  id="currentCTC"
                  name="currentCTC"
                  value={formData.currentCTC}
                  onChange={handleInputChange}
                  placeholder="e.g. 10 LPA"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentTakeHome">Current Take Home (per month) <span className="text-red-500">*</span></Label>
                <Input
                  id="currentTakeHome"
                  name="currentTakeHome"
                  value={formData.currentTakeHome}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  required
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
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formData.department === "Other" && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="otherDepartment">Please specify department <span className="text-red-500">*</span></Label>
                  <Input
                    id="otherDepartment"
                    name="otherDepartment"
                    value={formData.otherDepartment}
                    onChange={handleInputChange}
                    placeholder="Enter department name"
                    required
                  />
                </div>
              )}
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
                      <p className="text-xs text-gray-500">PDF or DOC/DOCX (MAX. 3MB)</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full px-4">
                      <div className="flex items-center">
                        {getFileIcon()}
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
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {fileError && (
                <p className="text-sm text-red-500 mt-1">{fileError}</p>
              )}
              <p className="text-xs text-gray-500">
                PDF or Word documents accepted, maximum size 3MB
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !!fileError}>
              {isSubmitting ? "Submitting..." : isGenericApplication ? "Submit Profile" : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;
