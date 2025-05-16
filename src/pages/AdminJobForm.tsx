import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Label } from "@/components/ui/label"
import {
  industries,
  locations,
  experienceRanges,
  salaryRanges,
} from "@/data/mockData";
import { Job } from '@/data/jobTypes';
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
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
  salaryRange: z.string().min(2, {
    message: "Please select a salary range.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  responsibilities: z.string().min(10, {
    message: "Responsibilities must be at least 10 characters.",
  }),
  status: z.boolean().default(false),
});

const AdminJobForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast()
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      experience: "",
      industry: "",
      salaryRange: "",
      description: "",
      responsibilities: "",
      status: false,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to create a job.",
        variant: "destructive",
      });
      return;
    }

    const locationObj = locations.find((l) => l.id === values.location) || locations[0];
    const experienceObj = experienceRanges.find((e) => e.id === values.experience) || experienceRanges[0];
    const industryObj = industries.find((i) => i.id === values.industry) || industries[0];
    const salaryRangeObj = salaryRanges.find((s) => s.id === values.salaryRange) || salaryRanges[0];

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            position: values.title, // Map title to position
            location: locationObj ? JSON.stringify(locationObj) : null,
            experience: experienceObj ? JSON.stringify(experienceObj) : null,
            industry: industryObj ? JSON.stringify(industryObj) : null,
            jobId: values.department, // Map department to jobId
            keyskills: values.responsibilities.split('\n'), // Use for both keyskills and responsibilities
            description: values.description,
            status: values.status ? 'Published' : 'Draft',
            dateposted: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error("Error creating job:", error);
        toast({
          title: "Error creating job",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Job created",
          description: "Job created successfully.",
        });
        navigate('/admin');
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Error creating job",
        description: "Failed to create job.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Job Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Department" {...field} />
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
                  <Select onValueChange={field.onChange}>
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
                  <Select onValueChange={field.onChange}>
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
                  <Select onValueChange={field.onChange}>
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
              name="salaryRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a salary range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {salaryRanges.map((salaryRange) => (
                        <SelectItem key={salaryRange.id} value={salaryRange.id}>{salaryRange.range}</SelectItem>
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
              name="responsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Job Responsibilities (one per line)" {...field} />
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
