import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  LayoutDashboard,
  Eye,
  EyeOff,
  User,
  Mail,
} from "lucide-react";
import axios from "axios";
import { getGatewayUrl } from "@/lib/auth";
import { toast } from "sonner";

const GATEWAY_URL = getGatewayUrl();

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${GATEWAY_URL}/users`, formData);
      navigate("/signin", {
        state: { message: "Account created successfully. Please sign in." },
      });
      toast.success("Account created successfully! Please sign in.");
    } catch (error) {
      if (!error.response) {
        setError("Unable to reach the server. Please check your connection.");
      } else {
        setError(
          error.response?.data?.detail ||
            "Unable to create account. Try a different email.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* The Main Container Card */}
      <div className="w-full max-w-[1360px] bg-card rounded-[2rem] shadow-2xl border border-border overflow-hidden flex flex-col lg:flex-row min-h-[860px] animate-in fade-in zoom-in-95 duration-500">
        {/* LEFT COLUMN: Form Section */}
        <div className="w-full lg:w-[45%] p-8 lg:p-12 xl:p-16 flex flex-col relative overflow-y-auto">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground mb-10 w-fit"
          >
            <div className="h-8 w-8 rounded-md bg-foreground flex items-center justify-center text-background">
              <LayoutDashboard size={18} />
            </div>
            ShopSwift<span className="text-primary">.</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Create an Account
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your details to create your ShopSwift profile
            </p>
          </div>

          {/* Social Logins (Matching Sign In) */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
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
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
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
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11 pl-10 bg-transparent border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11 pl-10 bg-transparent border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-foreground">
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
                  required
                  className="h-11 pl-3 bg-transparent border-border focus-visible:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-tight"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-foreground hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-foreground hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4 shadow-lg shadow-primary/25"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
          <div className="mt-12 text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} ShopSwift. All rights reserved.
          </div>
        </div>

        {/* RIGHT COLUMN: The Blue Presentation Area (Matches Sign In) */}
        <div className="hidden lg:block w-[55%] p-4">
          <div className="w-full h-full bg-primary rounded-[1.5rem] p-12 flex flex-col relative overflow-hidden">
            {/* Header Text */}
            <div className="relative z-10 max-w-md">
              <h2 className="text-4xl font-semibold text-white mb-4 leading-tight">
                Join the platform powering modern commerce
              </h2>
              <p className="text-primary-foreground/80 text-sm">
                Get started today to access secure checkout, customized order
                management, and powerful platform analytics.
              </p>
            </div>

            {/* CSS Abstract Dashboard Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[120%] h-[500px] pointer-events-none">
              <div className="absolute top-0 left-12 w-[80%] h-full bg-white rounded-xl shadow-2xl p-6 transform rotate-[-2deg] opacity-95">
                <div className="flex items-center justify-between mb-8 border-b pb-4 border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-24 bg-slate-100 rounded-md"></div>
                    <div className="h-6 w-32 bg-slate-100 rounded-md"></div>
                  </div>
                  <div className="h-8 w-24 bg-primary/10 rounded-full"></div>
                </div>
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

              <div className="absolute top-[20%] right-[10%] w-64 bg-white rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] p-4 transform rotate-[3deg]">
                <div className="h-4 w-32 bg-slate-800 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 w-full border border-slate-200 rounded-md"></div>
                  <div className="h-10 w-full bg-primary rounded-md"></div>
                </div>
              </div>
            </div>

            {/* Bottom Partners/Logos */}
            <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between text-white/50 border-t border-white/20 pt-6">
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
