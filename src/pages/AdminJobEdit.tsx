
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  industries,
  locations,
  experienceRanges,
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

const formSchema = z.object({
  position: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  jobId: z.string().min(2, {
    message: "Job ID must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Please select a location.",
  }),
  experience: z.string().min(2, {
    message: "Please select an experience range.",
  }),
  industry: z.string().min(2, {
    message: "Please select an industry.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  keySkills: z.string().min(10, {
    message: "Key skills must be at least 10 characters.",
  }),
  status: z.boolean().default(false),
});

const AdminJobEdit: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: "",
      jobId: "",
      location: "",
      experience: "",
      industry: "",
      description: "",
      keySkills: "",
      status: false,
    },
  });

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data && data.session) {
        setIsAuthenticated(true);
        
        // If authenticated and we have a job ID, fetch the job data
        if (id) {
          fetchJobData(id);
        } else {
          setIsInitializing(false);
          navigate('/admin');
          toast({
            title: "Error",
            description: "No job ID provided for editing",
            variant: "destructive",
          });
        }
      } else {
        // Redirect only once to avoid infinite loop
        navigate('/admin/login');
      }
    };
    
    checkAuth();
  }, [id, navigate]);

  const fetchJobData = async (jobId: string) => {
    try {
      const { data: jobData, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error || !jobData) {
        throw new Error(error?.message || "Job not found");
      }

      // Prepare form values from job data
      form.setValue('position', jobData.position);
      form.setValue('jobId', jobData.jobId || '');
      
      // Handle location, experience, and industry (which are JSON objects)
      const locationObj = jobData.location as any;
      if (locationObj && locationObj.id) {
        form.setValue('location', locationObj.id);
      }
      
      const experienceObj = jobData.experience as any;
      if (experienceObj && experienceObj.id) {
        form.setValue('experience', experienceObj.id);
      }
      
      const industryObj = jobData.industry as any;
      if (industryObj && industryObj.id) {
        form.setValue('industry', industryObj.id);
      }
      
      // Set description
      form.setValue('description', jobData.description);
      
      // Convert key skills array to string for textarea
      if (Array.isArray(jobData.keyskills)) {
        form.setValue('keySkills', jobData.keyskills.join('\n'));
      }
      
      // Set status
      form.setValue('status', jobData.status === 'Published');
    } catch (error) {
      console.error("Error fetching job:", error);
      toast({
        title: "Error",
        description: "Failed to fetch job data for editing",
        variant: "destructive",
      });
      navigate('/admin');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to update a job.",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "No job ID specified for updating.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const locationObj = locations.find((l) => l.id === values.location) || locations[0];
      const experienceObj = experienceRanges.find((e) => e.id === values.experience) || experienceRanges[0];
      const industryObj = industries.find((i) => i.id === values.industry) || industries[0];

      // Create job object with the right structure that matches your Supabase table
      const jobData = {
        position: values.position,
        jobId: values.jobId,
        location: locationObj as unknown as Json,
        experience: experienceObj as unknown as Json,
        industry: industryObj as unknown as Json,
        description: values.description,
        keyskills: values.keySkills.split('\n'),
        status: values.status ? 'Published' : 'Draft',
        // Don't update dateposted and user_id on edit
      };

      const { error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Job updated",
        description: "Job updated successfully.",
      });
      navigate('/admin');
    } catch (error: any) {
      console.error("Error updating job:", error);
      toast({
        title: "Error updating job",
        description: error.message || "Failed to update job.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || isInitializing) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-hragency-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-hragency-blue">Edit Job</h1>
        <p className="text-gray-600">Update the job details below.</p>
      </header>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Job Position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Job ID or Department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>{location.city}, {location.state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {experienceRanges.map((experience) => (
                        <SelectItem key={experience.id} value={experience.id}>{experience.range}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.id} value={industry.id}>{industry.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Job Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keySkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Skills</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Key Skills (one per line)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Published</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin')}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    Updating...
                    <svg
                      className="animate-spin h-5 w-5 ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </>
                ) : (
                  "Update Job"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminJobEdit;
