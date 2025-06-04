
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

export interface Industry {
  id: string;
  name: string;
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
  gender?: 'male' | 'female' | 'any' | null;
}
