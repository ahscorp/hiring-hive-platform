
export interface Industry {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  city: string;
  state: string;
}

export interface Experience {
  id: string;
  range: string;
  minYears: number;
  maxYears: number | null;
}

export interface SalaryRange {
  id: string;
  range: string;
  min: number;
  max: number | null;
}

export interface Job {
  id: string;
  title: string;
  location: Location;
  experience: Experience;
  industry: Industry;
  department: string;
  keySkills: string[];
  description: string;
  responsibilities: string[];
  salaryRange: SalaryRange | null;
  status: 'Published' | 'Draft';
  datePosted: string;
  ctc?: string | null;
}

export interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  yearsOfExperience: string;
  currentCompany: string;
  currentDesignation: string;
  currentCTC: string;
  currentTakeHome: string;
  expectedCTC: string;
  noticePeriod: string;
  location: string;
  department: string;
  otherDepartment: string;
  resume: File | null;
  jobId: string;
}
