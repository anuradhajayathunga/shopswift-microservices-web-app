import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { getGatewayUrl } from '@/lib/auth';

const GATEWAY_URL = getGatewayUrl();

export default function SignIn({ setToken }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message || '';

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${GATEWAY_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      const token = res.data.access_token;

      setToken(token);
      navigate('/');
    } catch (error) {
      if (!error.response) {
        setError('Unable to reach the server. Check if gateway is running on port 8000 and CORS is enabled.');
      } else {
        setError(error.response?.data?.detail || 'Unable to sign in. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:px-8 lg:pt-14">
      <section className="hidden rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur lg:block">
        <p className="mb-3 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
          Secure Login
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Sign in to continue shopping smarter.</h1>
        <p className="mt-4 max-w-xl text-slate-600">
          Access your account, manage orders, and enjoy a streamlined checkout powered by the ShopSwift microservices backend.
        </p>
      </section>

      <Card className="w-full border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-semibold tracking-tight text-slate-900">Welcome back</CardTitle>
          <CardDescription className="text-slate-600">
            Use your email and password to sign in.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {successMessage && (
            <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ishiwara@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-teal-700 hover:underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}