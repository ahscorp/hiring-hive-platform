import React from 'react';

const AdminJobForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-hragency-blue">Add New Job</h1>
        <p className="text-gray-600">Fill in the details below to post a new job opening.</p>
      </header>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        {/* Placeholder for the form */}
        <p className="text-center text-gray-500">
          Job creation form will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default AdminJobForm;
