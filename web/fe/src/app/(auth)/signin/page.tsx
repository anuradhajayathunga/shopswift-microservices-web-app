"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
// Make sure this path matches your auth utility location
import { authAPI } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import FullLogo from "@/components/shared/logo/FullLogo";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignInPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

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

    setLoading(true);

    try {
      // Using your existing auth logic from the first code block
      const { access_token, role } = await authAPI.signin(
        formData.email,
        formData.password,
      );
      authAPI.saveToken(access_token);

      try {
        const user = await authAPI.getUserByEmail(formData.email);
        authAPI.saveUser(user);
      } catch {
        authAPI.saveUser({ email: formData.email, role });
      }

      toast.success("Successfully signed in!");
      router.push(role === "customer" ? "/store" : "/");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Sign in failed";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1360px] bg-card rounded-[2rem] shadow-premium border border-border overflow-hidden flex flex-col lg:flex-row min-h-[860px] animate-in fade-in zoom-in-95 duration-500">
        {/* LEFT COLUMN: Form Section */}
        <div className="w-full lg:w-[45%] p-8 lg:p-12 xl:p-16 flex flex-col relative overflow-y-auto">
          {/* <Link href="/signin" className="flex items-center gap-2 mb-12 w-fit"> */}
          {/* <img
              src={
                theme === "dark"
                  ? "/images/logos/hype-dark-logo.svg"
                  : "/images/logos/hype-light-logo.svg"
              }
              alt="Hype Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            /> */}
          {/* </Link> */}
          <div className="mb-12">
            <FullLogo />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your account
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
              <span className="bg-card px-3 text-muted-foreground">or</span>
            </div>
          </div>

          {/* {error && (
            <div className="mb-6 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
              {error}
            </div>
          )} */}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5 flex-1">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-foreground font-medium"
                >
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/50 transition-colors"
              />
              <label
                htmlFor="remember"
                className="text-sm text-foreground font-medium leading-none cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-8 text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} hype.. All rights reserved.
          </div>
        </div>

        {/* RIGHT COLUMN: The Presentation Area */}
        <div className="hidden lg:block w-[55%] p-4">
          <div className="w-full h-full bg-primary rounded-[1.5rem] p-12 flex flex-col relative overflow-hidden shadow-inner">
            {/* Soft background glow to add depth to the solid color */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />

            {/* Header Text */}
            <div className="relative z-10 max-w-lg mt-4">
              <h2 className="text-4xl font-semibold text-primary-foreground mb-6 leading-tight">
                The simplest way to manage your e-commerce
              </h2>
              <p className="text-primary-foreground/60 text-base leading-relaxed">
                Enter your credentials to access your secure hype. dashboard and
                monitor your global sales in real-time.
              </p>
            </div>

            {/* Dashboard Mockup Images */}
            <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-[40%] w-[120%] h-[540px] pointer-events-none">
              <div className="absolute top-0 left-10 w-[84%] h-full rotate-[-2deg] opacity-95">
                <Image
                  src="/images/auth/dashboard-mockup.png"
                  alt="Dashboard mockup"
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(min-width: 1024px) 48vw, 0px"
                  priority
                />
              </div>

              <div className="absolute top-[18%] right-[10%] w-64 h-48 rotate-[3deg]">
                <Image
                  src="/images/auth/action-card.png"
                  alt="Action card"
                  fill
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                  sizes="256px"
                  priority
                />
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
