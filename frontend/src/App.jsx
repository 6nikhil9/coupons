// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import VolunteerScanPage from './pages/VolunteerScanPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/common/Footer'; // Import the Footer
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col"> {/* Added flex-col here */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<VolunteerScanPage />} />
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
          <Footer /> {/* Footer placed outside Routes, but inside the main flex container */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;