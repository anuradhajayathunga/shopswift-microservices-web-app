import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard"; // This will be your main app view
import DashboardLayout from "./components/DashboardLayout"; // The layout with the sidebar/header

// Import auth utilities
import { TOKEN_STORAGE_KEY } from "./lib/auth";

/**
 * 🛡️ Protected Route Wrapper
 * This component checks if a token exists. If not, it kicks the user to /signin.
 * If yes, it renders the protected component (like your Dashboard).
 */
const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

/**
 * 🚪 Public Route Wrapper
 * This prevents logged-in users from accidentally going back to the login page.
 */
const PublicRoute = ({ token, children }) => {
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  // Initialize state from local storage so the user stays logged in after a refresh
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));

  // A clean way to handle logins across the app
  const handleLogin = (newToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
  };

  // A clean way to handle logouts across the app
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  };

  return (
    // We apply your global background and foreground colors here at the very root.
    // This ensures your entire app inherits that off-white and deep navy theme.
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary-foreground">
      <Router>
        <Routes>
          {/* ==========================================
              PUBLIC ROUTES (No Sidebar, Full Screen)
              ========================================== */}
          <Route 
            path="/signin" 
            element={
              <PublicRoute token={token}>
                <SignIn setToken={handleLogin} />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute token={token}>
                <SignUp setToken={handleLogin} />
              </PublicRoute>
            } 
          />

          {/* ==========================================
              PROTECTED ROUTES (Wrapped in DashboardLayout)
              ========================================== */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute token={token}>
                {/* The Layout provides the Sidebar and Header */}
                <DashboardLayout handleLogout={handleLogout}>
                  {/* The actual page content goes here */}
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* You can add more protected routes here later, like: */}
          {/* <Route path="/orders" element={<ProtectedRoute token={token}><DashboardLayout><OrdersPage /></DashboardLayout></ProtectedRoute>} /> */}

          {/* Catch-all route for 404s or redirects */}
          <Route path="*" element={<Navigate to={token ? "/" : "/signin"} replace />} />
        </Routes>
      </Router>
    </div>
  );
}