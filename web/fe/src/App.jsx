import { useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { TOKEN_STORAGE_KEY, decodeJwtPayload } from "./lib/auth";

function HomePage({ token, onLogout }) {
  const jwtPayload = useMemo(() => decodeJwtPayload(token), [token]);
  const email = jwtPayload?.email || "signed in user";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <Card className="border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-slate-900">
            Welcome to ShopSwift
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Authentication is connected to your backend through the API gateway.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              Signed in as{" "}
              <span className="font-semibold text-slate-900">{email}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Create Another User
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={onLogout}
              className="w-full sm:w-auto"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));

  const handleLogin = (nextToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-app text-slate-900">
        <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              className="text-2xl font-semibold tracking-tight text-slate-900"
            >
              ShopSwift
            </Link>

            {token ? (
              <Button variant="destructive" onClick={handleLogout}>
                Sign Out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              token ? (
                <HomePage token={token} onLogout={handleLogout} />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          <Route
            path="/signin"
            element={
              token ? (
                <Navigate to="/" replace />
              ) : (
                <SignIn setToken={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/" replace /> : <SignUp />}
          />
          <Route
            path="*"
            element={<Navigate to={token ? "/" : "/signin"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
