
const JobBoardHeader = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 text-white py-[50px] rounded-lg shadow-xl mb-8 w-full">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 px-4 sm:px-6 lg:px-8">
          {/* Left Column: Text Content */}
          <div className="md:w-3/5 lg:w-2/3 text-center md:text-left">
            <h1 className="text-[40px] font-bold font-heading mb-6 leading-tight">
              Real Jobs. Real Companies.
              <br />
              Right Here.
            </h1>
            <p className="text-[18px] mb-6 max-w-2xl mx-auto md:mx-0">
              Explore job openings curated by AHS Corp for top companies across
              manufacturing, logistics, BFSI, healthcare, retail, and more. We don’t
              just list jobs — we connect the right people with the right roles. Every
              opening is verified and managed by our recruitment experts to ensure
              authenticity and relevance.
            </p>
            <p className="text-[20px] font-semibold">
              Your next opportunity starts now.
            </p>
          </div>

          {/* Right Column: Illustration */}
          <div className="md:w-2/5 lg:w-1/3 mt-8 md:mt-0">
            <img
              src="/successful-business-deal-employee-hiring-recruiting-service-job-offer-letter-international-volunteer-program-permanent-contract-concept-1536x1024.png"
              alt="Job Offer Illustration"
              className="w-full h-auto rounded-lg object-contain max-h-96"
            />
          </div>
        </div>
    </div>
  );
};

export default JobBoardHeader;
