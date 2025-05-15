
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
    
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }
    
    setIsAuthorized(true);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  };

  if (!isAuthorized) {
    return null; // Don't render anything while checking auth
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-hragency-blue">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </header>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Job Listings Management</h2>
          <p className="text-gray-600">
            Welcome to the admin panel. Here you can manage job listings and view applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
