
import { Briefcase } from "lucide-react";

const JobBoardHeader = () => {
  return (
    <div className="bg-hragency-blue text-white py-8 px-6 rounded-lg shadow-md mb-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="h-8 w-8" />
          <h1 className="text-3xl font-heading font-bold">HR Agency Careers</h1>
        </div>
        <p className="text-lg max-w-2xl">
          Find your dream job with our curated opportunities. We connect talented professionals with leading companies.
        </p>
      </div>
    </div>
  );
};

export default JobBoardHeader;
