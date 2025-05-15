
import { Experience, Industry, Job, Location, SalaryRange } from "./jobTypes";

// Industry data
export const industries: Industry[] = [
  { id: "tech", name: "Technology" },
  { id: "finance", name: "Finance" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "retail", name: "Retail" },
];

// Location data
export const locations: Location[] = [
  { id: "mum", city: "Mumbai", state: "Maharashtra" },
  { id: "blr", city: "Bangalore", state: "Karnataka" },
  { id: "del", city: "Delhi", state: "Delhi" },
  { id: "hyd", city: "Hyderabad", state: "Telangana" },
  { id: "che", city: "Chennai", state: "Tamil Nadu" },
  { id: "pun", city: "Pune", state: "Maharashtra" },
];

// Experience ranges
export const experienceRanges: Experience[] = [
  { id: "fresher", range: "0-1 years", minYears: 0, maxYears: 1 },
  { id: "junior", range: "1-3 years", minYears: 1, maxYears: 3 },
  { id: "mid", range: "3-5 years", minYears: 3, maxYears: 5 },
  { id: "senior", range: "5-10 years", minYears: 5, maxYears: 10 },
  { id: "lead", range: "10+ years", minYears: 10, maxYears: null },
];

// Salary ranges
export const salaryRanges: SalaryRange[] = [
  { id: "entry", range: "3-5 LPA", min: 300000, max: 500000 },
  { id: "mid", range: "5-10 LPA", min: 500000, max: 1000000 },
  { id: "senior", range: "10-15 LPA", min: 1000000, max: 1500000 },
  { id: "lead", range: "15-25 LPA", min: 1500000, max: 2500000 },
  { id: "executive", range: "25+ LPA", min: 2500000, max: null },
];

// Mock job data
export const jobs: Job[] = [
  {
    id: "J1001",
    title: "Senior Software Engineer",
    location: locations[1], // Bangalore
    experience: experienceRanges[3], // 5-10 years
    industry: industries[0], // Technology
    department: "Engineering",
    keySkills: ["React", "Node.js", "TypeScript", "AWS"],
    description: "We're looking for an experienced Software Engineer to join our growing team.",
    responsibilities: [
      "Design and develop high-quality software solutions",
      "Collaborate with cross-functional teams to define, design, and ship new features",
      "Work with outside data sources and APIs",
      "Unit-test code for robustness, including edge cases, usability, and general reliability",
    ],
    salaryRange: salaryRanges[3], // 15-25 LPA
    status: "Published",
    datePosted: "2025-05-10",
  },
  {
    id: "J1002",
    title: "Financial Analyst",
    location: locations[0], // Mumbai
    experience: experienceRanges[2], // 3-5 years
    industry: industries[1], // Finance
    department: "Finance",
    keySkills: ["Financial Modeling", "Excel", "Data Analysis", "SQL"],
    description: "Seeking a detail-oriented Financial Analyst to support our finance team.",
    responsibilities: [
      "Prepare financial forecasts and reports",
      "Analyze financial data and create financial models",
      "Support budget planning and forecasting activities",
      "Identify trends and provide recommendations for process improvements",
    ],
    salaryRange: salaryRanges[2], // 10-15 LPA
    status: "Published",
    datePosted: "2025-05-08",
  },
  {
    id: "J1003",
    title: "HR Manager",
    location: locations[3], // Hyderabad
    experience: experienceRanges[3], // 5-10 years
    industry: industries[0], // Technology
    department: "Human Resources",
    keySkills: ["Recruitment", "Employee Relations", "Performance Management", "HRIS"],
    description: "Looking for an experienced HR Manager to lead our HR initiatives.",
    responsibilities: [
      "Develop and implement HR strategies and initiatives aligned with the overall business strategy",
      "Bridge management and employee relations by addressing demands, grievances or other issues",
      "Manage the recruitment and selection process",
      "Support performance management and improvement systems",
    ],
    salaryRange: salaryRanges[2], // 10-15 LPA
    status: "Published",
    datePosted: "2025-05-11",
  },
  {
    id: "J1004",
    title: "Product Manager",
    location: locations[1], // Bangalore
    experience: experienceRanges[3], // 5-10 years
    industry: industries[0], // Technology
    department: "Product",
    keySkills: ["Product Strategy", "Agile", "User Experience", "Market Research"],
    description: "We're hiring a Product Manager to drive our product vision and roadmap.",
    responsibilities: [
      "Define the product vision, strategy, and roadmap",
      "Work with engineering to deliver products and features that solve customer problems",
      "Gather and analyze feedback from customers, stakeholders, and other teams",
      "Define and monitor KPIs for product features",
    ],
    salaryRange: salaryRanges[3], // 15-25 LPA
    status: "Published",
    datePosted: "2025-05-07",
  },
  {
    id: "J1005",
    title: "Frontend Developer",
    location: locations[5], // Pune
    experience: experienceRanges[1], // 1-3 years
    industry: industries[0], // Technology
    department: "Engineering",
    keySkills: ["JavaScript", "React", "HTML", "CSS"],
    description: "Seeking a talented Frontend Developer to create responsive web applications.",
    responsibilities: [
      "Implement responsive web design and ensure cross-browser compatibility",
      "Optimize application for maximum speed and scalability",
      "Collaborate with back-end developers and web designers",
      "Stay up-to-date with emerging technologies",
    ],
    salaryRange: salaryRanges[1], // 5-10 LPA
    status: "Published",
    datePosted: "2025-05-12",
  },
  {
    id: "J1006",
    title: "Data Scientist",
    location: locations[1], // Bangalore
    experience: experienceRanges[2], // 3-5 years
    industry: industries[0], // Technology
    department: "Data Science",
    keySkills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
    description: "Join our data science team to solve complex problems with data-driven solutions.",
    responsibilities: [
      "Develop machine learning models and algorithms",
      "Process, clean, and verify the integrity of data used for analysis",
      "Conduct complex data analysis and present findings",
      "Create data visualizations and dashboards",
    ],
    salaryRange: salaryRanges[2], // 10-15 LPA
    status: "Published",
    datePosted: "2025-05-09",
  },
  {
    id: "J1007",
    title: "Marketing Manager",
    location: locations[0], // Mumbai
    experience: experienceRanges[3], // 5-10 years
    industry: industries[5], // Retail
    department: "Marketing",
    keySkills: ["Digital Marketing", "Brand Management", "Market Research", "Campaign Management"],
    description: "Looking for a Marketing Manager to develop and implement marketing strategies.",
    responsibilities: [
      "Develop and implement marketing strategies to reach the target audience",
      "Create and manage marketing campaigns across various channels",
      "Analyze market trends and competitor activities",
      "Manage the marketing budget and allocate resources efficiently",
    ],
    salaryRange: salaryRanges[2], // 10-15 LPA
    status: "Published",
    datePosted: "2025-05-06",
  },
  {
    id: "J1008",
    title: "Operations Manager",
    location: locations[4], // Chennai
    experience: experienceRanges[3], // 5-10 years
    industry: industries[4], // Manufacturing
    department: "Operations",
    keySkills: ["Operations Management", "Process Improvement", "Supply Chain", "Team Leadership"],
    description: "Seeking an experienced Operations Manager to optimize our operational processes.",
    responsibilities: [
      "Plan, direct and coordinate operations activities",
      "Improve operational systems, processes, and policies",
      "Manage production scheduling and inventory",
      "Ensure operational efficiency and productivity",
    ],
    salaryRange: salaryRanges[2], // 10-15 LPA
    status: "Published",
    datePosted: "2025-05-05",
  },
];
