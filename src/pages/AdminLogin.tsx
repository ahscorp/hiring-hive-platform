
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context"; // Import useAuth
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Briefcase } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState(""); // Changed username to email
  const [password, setPassword] = useState("");
  const { login, user, loading: authLoading } = useAuth(); // Use auth context
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/admin"); // Redirect if already logged in
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await login(email, password);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
      navigate("/admin"); // Navigate on successful login from context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-hragency-blue flex items-center justify-center">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-heading font-bold text-hragency-blue">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label> {/* Changed username to email */}
              <Input
                id="email"
                name="email"
                type="email" // Changed type to email
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-hragency-blue hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-hragency-blue hover:bg-hragency-blue/90"
            disabled={authLoading} // Use authLoading from context
          >
            {authLoading ? "Signing in..." : "Sign in"}
          </Button>

          {/* Removed demo credentials as we are using real auth */}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
