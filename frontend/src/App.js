// frontend/src/App.js

import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ForecastProvider } from "./contexts/ForecastContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Regular components
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const CropLibrary = lazy(() => import("./pages/CropLibrary"));
const ClimateZones = lazy(() => import("./pages/ClimateZones"));
const Help = lazy(() => import("./pages/Help"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SavedForecasts = lazy(() => import("./pages/SavedForecasts"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback
const PageLoader = () => (
  <div className="page-loader">
    <LoadingSpinner />
    <p>Loading page...</p>
  </div>
);

function App() {
  return (
    <Router>
      <ForecastProvider>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/crops" element={<CropLibrary />} />
                <Route path="/climate-zones" element={<ClimateZones />} />
                <Route path="/help" element={<Help />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved-forecasts"
                  element={
                    <ProtectedRoute>
                      <SavedForecasts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback routes */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </ForecastProvider>
    </Router>
  );
}

export default App;
