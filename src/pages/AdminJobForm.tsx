
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/lib/form-utils";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  experienceRanges,
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth-context";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  position: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  jobId: z.string().min(2, {
    message: "Job ID must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  experience: z.string().min(2, {
    message: "Please select an experience range.",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  keySkills: z.string().min(10, {
    message: "Key skills must be at least 10 characters.",
  }),
  ctc: z.string().optional(),
  status: z.boolean().default(false),
});

const AdminJobForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data && data.session) {
        setIsAuthenticated(true);
      } else {
        // Redirect only once to avoid infinite loop
        navigate('/admin/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

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
      ctc: "",
      status: false,
    },
  });

  // Function to add location to database if it doesn't exist
  const addLocationIfNotExists = async (locationText: string) => {
    if (!locationText.includes(',')) {
      throw new Error('Location must be in format: City, State');
    }

    const [city, state] = locationText.split(',').map(s => s.trim());
    
    try {
      const { error } = await supabase
        .from('locations')
        .insert({ city, state })
        .select();
      
      if (error && !error.message.includes('duplicate')) {
        throw error;
      }
    } catch (error) {
      console.log('Location already exists or error adding:', error);
    }
  };

  // Function to add industry to database if it doesn't exist
  const addIndustryIfNotExists = async (industryName: string) => {
    try {
      const { error } = await supabase
        .from('industries')
        .insert({ name: industryName })
        .select();
      
      if (error && !error.message.includes('duplicate')) {
        throw error;
      }
    } catch (error) {
      console.log('Industry already exists or error adding:', error);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to create a job.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Add location and industry to their respective tables if they don't exist
      await addLocationIfNotExists(values.location);
      await addIndustryIfNotExists(values.industry);

      // Create job object with the right structure that matches your Supabase table
      const jobData = {
        position: values.position,
        jobId: values.jobId,
        location: values.location,
        experience: values.experience,
        industry: values.industry,
        description: values.description,
        keyskills: values.keySkills.split('\n'),
        ctc: values.ctc || null,
        status: values.status ? 'Published' : 'Draft',
        dateposted: new Date().toISOString(),
        user_id: user.id,
      };

      const { error } = await supabase
        .from('jobs')
        .insert(jobData);

      if (error) {
        throw error;
      }

      toast({
        title: "Job created",
        description: "Job created successfully.",
      });
      navigate('/admin');
    } catch (error: unknown) {
      console.error("Error creating job:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create job.";
      toast({
        title: "Error creating job",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-hragency-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-hragency-blue">Add New Job</h1>
        <p className="text-gray-600">Fill in the details below to post a new job opening.</p>
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
                  <FormControl>
                    <Input placeholder="City, State (e.g., Mumbai, Maharashtra)" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {experienceRanges.map((experience) => (
                        <SelectItem key={experience.id} value={experience.range}>{experience.range}</SelectItem>
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
                  <FormControl>
                    <Input placeholder="Industry (e.g., Technology, Healthcare)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ctc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CTC (Cost to Company)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 8-12 LPA" {...field} />
                  </FormControl>
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
            <Button disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  Creating...
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
                "Create Job"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminJobForm;
