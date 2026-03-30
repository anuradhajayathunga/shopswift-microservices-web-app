"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LayoutDashboard, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  return null;
};

export default function SignUpPage() {
  const router = useRouter();

  // State management
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (formData.fullName.trim().length < 2) {
      setError("Full name must be at least 2 characters");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!formData.confirmPassword) {
      setError("Please confirm your password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authAPI.signup(
        formData.email,
        formData.password,
        formData.fullName,
      );

      // Auto sign in after signup
      const { access_token } = await authAPI.signin(
        formData.email,
        formData.password,
      );
      authAPI.saveToken(access_token);

      try {
        const user = await authAPI.getUserByEmail(formData.email);
        authAPI.saveUser(user);
      } catch {
        authAPI.saveUser({
          name: formData.fullName.trim(),
          email: formData.email,
        });
      }

      toast.success("Account created and signed in successfully!");
      router.push("/"); // Redirects to your new Dashboard Layout
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Sign up failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* The Main Container Card */}
      <div className="w-full max-w-[1360px] bg-card rounded-[2rem] shadow-premium border border-border overflow-hidden flex flex-col lg:flex-row min-h-[860px] animate-in fade-in zoom-in-95 duration-500">
        {/* LEFT COLUMN: Form Section */}
        <div className="w-full lg:w-[45%] p-8 lg:p-12 xl:p-16 flex flex-col relative overflow-y-auto">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground mb-10 w-fit"
          >
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              <LayoutDashboard size={18} />
            </div>
            ShopSwift<span className="text-primary">.</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm">
              Get started with ShopSwift and scale your business today.
            </p>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.91 3.56-.75 1.45.13 2.58.74 3.25 1.83-2.79 1.58-2.28 5.25.5 6.36-.63 1.84-1.45 3.65-2.39 4.73zm-3.8-15.5c-.32-1.91 1.3-3.66 3.12-3.78.36 2.03-1.5 3.82-3.12 3.78z" />
              </svg>
              Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-medium">
              <span className="bg-card px-3 text-muted-foreground">
                or sign up with email
              </span>
            </div>
          </div>

          {/* Error Alert */}
          {/* {error && (
            <div className="mb-6 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
              {error}
            </div>
          )} */}

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4 flex-1">
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-foreground font-medium text-sm"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                required
                className="h-11 bg-background border-border focus-visible:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-foreground font-medium text-sm"
              >
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                className="h-11 bg-background border-border focus-visible:ring-primary shadow-sm"
              />
            </div>

            {/* Password Grid for slightly more compact layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium text-sm"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="h-11 bg-background border-border focus-visible:ring-primary pr-10 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-foreground font-medium text-sm"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="h-11 bg-background border-border focus-visible:ring-primary pr-10 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin" // Note: change to /login if that's what you named the route
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-8 text-xs text-muted-foreground/60">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </div>
        </div>

        {/* RIGHT COLUMN: The Presentation Area */}
        <div className="hidden lg:block w-[55%] p-4">
          <div className="w-full h-full bg-primary rounded-[1.5rem] p-12 flex flex-col relative overflow-hidden shadow-inner">
            {/* Soft background glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            {/* Header Text */}
            <div className="relative z-10 max-w-md mt-8">
              <h2 className="text-4xl font-semibold text-primary-foreground mb-6 leading-tight">
                Join thousands of businesses scaling globally
              </h2>
              <p className="text-primary-foreground/80 text-base leading-relaxed">
                ShopSwift gives you the analytics, inventory management, and AI
                forecasting tools to dominate your market.
              </p>
            </div>

            {/* CSS Abstract Dashboard Mockup */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-[40%] w-[120%] h-[500px] pointer-events-none">
              <div className="absolute top-0 left-12 w-[80%] h-full bg-white rounded-xl shadow-2xl p-6 transform rotate-[-2deg] opacity-95">
                {/* Mock Header */}
                <div className="flex items-center justify-between mb-8 border-b pb-4 border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-24 bg-slate-100 rounded-md"></div>
                    <div className="h-6 w-32 bg-slate-100 rounded-md"></div>
                  </div>
                  <div className="h-8 w-24 bg-primary/10 rounded-full"></div>
                </div>
                {/* Mock Content */}
                <div className="flex gap-6 mb-8">
                  <div className="flex-1 h-32 bg-slate-50 border border-slate-100 rounded-lg p-4 flex flex-col justify-between">
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    <div className="h-8 w-32 bg-slate-800 rounded"></div>
                  </div>
                  <div className="flex-1 h-32 bg-slate-50 border border-slate-100 rounded-lg p-4 flex flex-col justify-between">
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    <div className="h-8 w-24 bg-slate-800 rounded"></div>
                  </div>
                </div>
                {/* Mock List */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                        <div className="h-4 w-32 bg-slate-200 rounded"></div>
                      </div>
                      <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Small Floating Action Card */}
              <div className="absolute top-[20%] right-[10%] w-64 bg-white rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] p-4 transform rotate-[3deg]">
                <div className="h-4 w-32 bg-slate-800 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 w-full border border-slate-200 rounded-md"></div>
                  <div className="h-10 w-full bg-primary rounded-md"></div>
                </div>
              </div>
            </div>

            {/* Bottom Partners/Logos */}
            <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between text-primary-foreground/50 border-t border-primary-foreground/20 pt-6">
              <span className="font-semibold tracking-wider text-sm flex items-center gap-1">
                <LayoutDashboard size={14} /> STRIPE
              </span>
              <span className="font-semibold tracking-wider text-sm flex items-center gap-1">
                <LayoutDashboard size={14} /> GOOGLE
              </span>
              <span className="font-semibold tracking-wider text-sm flex items-center gap-1">
                <LayoutDashboard size={14} /> PAYPAL
              </span>
              <span className="font-semibold tracking-wider text-sm flex items-center gap-1">
                <LayoutDashboard size={14} /> AWS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
