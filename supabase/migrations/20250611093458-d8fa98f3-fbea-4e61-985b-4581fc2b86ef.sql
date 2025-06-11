
-- Create a table for general profile submissions (independent of specific jobs)
CREATE TABLE public.general_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fullname TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  yearsofexperience TEXT NOT NULL,
  currentcompany TEXT NOT NULL,
  currentdesignation TEXT,
  currentctc TEXT,
  currenttakehome TEXT,
  expectedctc TEXT NOT NULL,
  noticeperiod TEXT,
  location TEXT NOT NULL,
  department TEXT NOT NULL,
  otherdepartment TEXT,
  resume_url TEXT,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (optional - since this is for general submissions)
ALTER TABLE public.general_profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert general profiles
CREATE POLICY "Anyone can submit general profiles" 
  ON public.general_profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Create a policy for reading (if needed for admin purposes)
CREATE POLICY "Anyone can view general profiles" 
  ON public.general_profiles 
  FOR SELECT 
  USING (true);
