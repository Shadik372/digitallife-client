"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "../../lib/auth-client";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Card from "../../components/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Live tracking booleans
  const hasLength = formData.password.length >= 6;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);

  const validatePassword = (password) => {
    if (!hasLength) return "Password must be at least 6 characters.";
    if (!hasUpper) return "Password must contain an uppercase letter.";
    if (!hasLower) return "Password must contain a lowercase letter.";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        photoURL: formData.photoURL || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else {
        toast.success("Registration successful! Welcome.");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      });
    } catch (err) {
      toast.error("Google login failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh]">
      <Card className="w-full max-w-md p-8">
        <Heading level={2} className="text-center mb-6">Create an Account</Heading>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Photo URL (Optional)</label>
            <input 
              type="url" 
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
              value={formData.photoURL}
              onChange={(e) => setFormData({...formData, photoURL: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            
            {/* Live Password Tracker */}
            <div className="mt-3 space-y-1.5 p-3 bg-[--bg] border border-[--border] rounded-lg">
              <p className={`text-xs flex items-center gap-2 transition-colors ${hasUpper ? "text-green-500 font-medium" : "text-[--text-muted]"}`}>
                <span>{hasUpper ? "✅" : "⭕"}</span> One uppercase letter
              </p>
              <p className={`text-xs flex items-center gap-2 transition-colors ${hasLower ? "text-green-500 font-medium" : "text-[--text-muted]"}`}>
                <span>{hasLower ? "✅" : "⭕"}</span> One lowercase letter
              </p>
              <p className={`text-xs flex items-center gap-2 transition-colors ${hasLength ? "text-green-500 font-medium" : "text-[--text-muted]"}`}>
                <span>{hasLength ? "✅" : "⭕"}</span> At least 6 characters
              </p>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-[--border] w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-[--text-muted] uppercase">Or continue with</span>
          <span className="border-b border-[--border] w-1/5 lg:w-1/4"></span>
        </div>

        <Button 
          variant="secondary" 
          className="w-full mt-4 flex items-center justify-center gap-2" 
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </Button>

        <p className="mt-6 text-center text-sm text-[--text-muted]">
          Already have an account?{" "}
          <Link href="/login" className="text-[--accent] hover:underline font-medium">
            Log in here
          </Link>
        </p>
      </Card>
    </div>
  );
}