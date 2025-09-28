// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import VolunteerScanPage from './pages/VolunteerScanPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/common/Footer';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Protected Route for Volunteers (and Admins for testing) */}
              <Route
                path="/scan"
                element={
                  <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                    <VolunteerScanPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Route for Admins */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;