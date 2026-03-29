import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Core Components
import DashboardLayout from "./components/DashboardLayout";

// Application Pages
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// Utilities
import { TOKEN_STORAGE_KEY } from "./lib/auth";

/**
 * 🛡️ Protected Route Wrapper
 * Redirects unauthenticated users to the Sign In page.
 */
const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

/**
 * 🚪 Public Route Wrapper
 * Prevents authenticated users from accidentally accessing auth pages.
 */
const PublicRoute = ({ token, children }) => {
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  // Initialize state from local storage to persist sessions across refreshes
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));

  // Centralized login handler
  const handleLogin = (newToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
  };

  // Centralized logout handler
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  };

  return (
    // The root div establishes the off-white/navy theme across the entire app
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
      <Router>
        <Routes>
          
          {/* ==========================================
              PUBLIC ROUTES (Full Screen, Glassmorphic)
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
                <SignUp />
              </PublicRoute>
            } 
          />

          {/* ==========================================
              PROTECTED ROUTES (Wrapped in Sidebar Layout)
              ========================================== */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute token={token}>
                <DashboardLayout handleLogout={handleLogout}>
                  {/* The Dashboard page is rendered inside the layout's 'children' prop */}
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* You can easily add more protected routes here later:
            <Route path="/inventory" element={<ProtectedRoute token={token}><DashboardLayout handleLogout={handleLogout}><InventoryPage /></DashboardLayout></ProtectedRoute>} />
          */}

          {/* ==========================================
              FALLBACK ROUTE (404 / Redirect)
              ========================================== */}
          <Route 
            path="*" 
            element={<Navigate to={token ? "/" : "/signin"} replace />} 
          />
          
        </Routes>
      </Router>
    </div>
  );
}