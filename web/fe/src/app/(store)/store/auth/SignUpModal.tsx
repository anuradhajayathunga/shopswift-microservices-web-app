"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/auth";
import { toast } from "sonner";

export function SignUpModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Full name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Sign up the customer
      await authAPI.signupCustomer(
        formData.email.trim(),
        formData.password,
        formData.name.trim(),
      );

      // Then sign them in
      const { access_token, role } = await authAPI.signin(
        formData.email.trim(),
        formData.password,
      );

      authAPI.saveToken(access_token);

      try {
        const fullUser = await authAPI.getUserByEmail(formData.email.trim());
        authAPI.saveUser(fullUser);
      } catch {
        authAPI.saveUser({
          email: formData.email.trim(),
          name: formData.name.trim(),
          role: role === "admin" ? "admin" : "customer",
        });
      }

      setSuccess(true);
      toast.success("Account created successfully!");
      window.dispatchEvent(new Event("storage"));

      setTimeout(() => {
        router.push("/store");
        router.refresh();
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-6 sm:p-12 !rounded-none border-border/60 shadow-2xl bg-background [&>button]:right-6 [&>button]:top-6 sm:[&>button]:right-10 sm:[&>button]:top-10 [&>button_svg]:size-6 [&>button]:opacity-60 hover:[&>button]:opacity-100">
        <DialogHeader className="mb-8 text-left">
          <DialogTitle className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Create your account
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Welcome to ShopSwift!
            </h3>
            <p className="text-center text-muted-foreground">
              Your account has been created successfully. Redirecting you to the
              store...
            </p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="peer h-14 w-full border-border/60 bg-transparent px-4 pt-5 pb-2 text-base text-foreground shadow-none rounded-none focus-visible:ring-1 focus-visible:ring-foreground transition-all"
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 cursor-text select-none"
              >
                Full Name *
              </label>
            </div>

            {/* Email Input */}
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="peer h-14 w-full border-border/60 bg-transparent px-4 pt-5 pb-2 text-base text-foreground shadow-none rounded-none focus-visible:ring-1 focus-visible:ring-foreground transition-all"
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 cursor-text select-none"
              >
                Email *
              </label>
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder=" "
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="peer h-14 w-full border-border/60 bg-transparent px-4 pt-5 pb-2 text-base text-foreground shadow-none rounded-none focus-visible:ring-1 focus-visible:ring-foreground transition-all"
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 cursor-text select-none"
              >
                Password *
              </label>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Input
                id="confirmPassword"
                type="password"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="peer h-14 w-full border-border/60 bg-transparent px-4 pt-5 pb-2 text-base text-foreground shadow-none rounded-none focus-visible:ring-1 focus-visible:ring-foreground transition-all"
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 cursor-text select-none"
              >
                Confirm Password *
              </label>
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
              <Button
                type="submit"
                variant="outline"
                className="h-12 px-10 rounded-none border-border shadow-sm text-base font-medium hover:bg-muted/50 transition-colors w-full"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-foreground font-medium hover:text-primary transition-colors border-b border-foreground hover:border-primary"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Password Requirements */}
            <div className="bg-muted/30 p-4 rounded-lg mt-6">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                PASSWORD REQUIREMENTS
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-foreground">•</span>
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-foreground">•</span>
                  Passwords must match
                </li>
              </ul>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
