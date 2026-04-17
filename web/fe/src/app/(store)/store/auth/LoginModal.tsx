"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/auth";
import { toast } from "sonner";

export function LoginModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (isSignUp && !formData.name.trim()) {
      setError("Name is required for sign up");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await authAPI.signupCustomer(
          formData.email.trim(),
          formData.password,
          formData.name.trim(),
        );
      }

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
          name: formData.name.trim() || undefined,
          role: role === "admin" ? "admin" : "customer",
        });
      }

      toast.success(isSignUp ? "Customer account created" : "Logged in");
      window.dispatchEvent(new Event("storage"));
      router.push("/store");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      {/* The Trigger (Wraps whatever button/icon you pass to it) */}
      <DialogTrigger asChild>{children}</DialogTrigger>

      {/* Modal Content 
        - Using sm:max-w-[600px] for a wide, spacious feel
        - !rounded-none forces sharp corners like the screenshot
        - Customizing the close button positioning via Tailwind arbitrary variants
      */}
      <DialogContent className="sm:max-w-[700px] p-6 sm:p-12 !rounded-none border-border/60 shadow-2xl bg-background [&>button]:right-6 [&>button]:top-6 sm:[&>button]:right-10 sm:[&>button]:top-10 [&>button_svg]:size-6 [&>button]:opacity-60 hover:[&>button]:opacity-100">
        <DialogHeader className="mb-8 text-left">
          <DialogTitle className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            {isSignUp ? "Register" : "Log in"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isSignUp
              ? "Create a new hype customer account."
              : "Log in to your hype customer account."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isSignUp && (
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
          )}

          {/* Floating Label Input: Email */}
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

          {/* Floating Label Input: Password */}
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

          {/* Forgot Password Link */}
          {!isSignUp && (
            <div className="pt-2">
              <Link
                href="/forgot-password"
                className="text-[15px] text-muted-foreground hover:text-foreground transition-colors border-b border-muted-foreground/40 hover:border-foreground pb-0.5"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Bottom Actions Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6">
            <Button
              type="submit"
              variant="outline"
                  className="mt-4 rounded-none border-gray-300 hover:bg-gray-800 h-12 px-8 fade-in animate-in duration-300"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isSignUp
                  ? "Register"
                  : "Log in"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setIsSignUp((prev) => !prev);
              }}
              className="group flex items-center text-[15px] font-medium text-foreground border-b border-foreground pb-0.5 hover:text-primary hover:border-primary transition-all shrink-0"
            >
              {isSignUp
                ? "Already have an account? Log in"
                : "New customer? Create your account"}
              <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
