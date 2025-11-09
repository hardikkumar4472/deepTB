// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Layout from './components/layout/Layout';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import DoctorLogin from './pages/DoctorLogin';
// import DoctorSignup from './pages/DoctorSignup';
// import Dashboard from './pages/Dashboard';
// import DoctorDashboard from './pages/DoctorDashboard';
// import Prediction from './pages/Prediction';
// import History from './pages/History';
// import Reports from './pages/Reports';
// import ProtectedRoute from './components/layout/ProtectedRoute';
// import PatientManagement from './pages/PatientManagement';
// import './App.css';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Layout>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/doctor/login" element={<DoctorLogin />} />
//             <Route path="/doctor/signup" element={<DoctorSignup />} />

//             {/* Patient Protected Routes */}
//             <Route 
//               path="/dashboard" 
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/predict" 
//               element={
//                 <ProtectedRoute>
//                   <Prediction />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/history" 
//               element={
//                 <ProtectedRoute>
//                   <History />
//                 </ProtectedRoute>
//               } 
//             />

//             {/* Doctor Protected Routes */}
//             <Route 
//               path="/doctor/dashboard" 
//               element={
//                 <ProtectedRoute doctorOnly={true}>
//                   <DoctorDashboard />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/doctor/reports" 
//               element={
//                 <ProtectedRoute doctorOnly={true}>
//                   <Reports />
//                 </ProtectedRoute>
//               } 
//             />
//             <Route 
//               path="/doctor/patients" 
//               element={
//                 <ProtectedRoute doctorOnly={true}>
//                   <PatientManagement />
//                 </ProtectedRoute>
//               } 
//             />
//           </Routes>
//         </Layout>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DoctorLogin from './pages/DoctorLogin';
import DoctorSignup from './pages/DoctorSignup';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Prediction from './pages/Prediction';
import History from './pages/History';
import Reports from './pages/Reports';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PatientManagement from './pages/PatientManagement';
import './App.css';

// Component to track page views
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view when route changes
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-TY5ZVFF2QZ', {
        page_title: document.title,
        page_location: window.location.origin + location.pathname,
        page_path: location.pathname
      });
    }
    
    // Optional: Log page view for debugging
    console.log(`Page view: ${location.pathname}`);
  }, [location]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          {/* Page view tracker component */}
          <PageViewTracker />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor/signup" element={<DoctorSignup />} />

            {/* Patient Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/predict" 
              element={
                <ProtectedRoute>
                  <Prediction />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } 
            />

            {/* Doctor Protected Routes */}
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute doctorOnly={true}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/reports" 
              element={
                <ProtectedRoute doctorOnly={true}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/patients" 
              element={
                <ProtectedRoute doctorOnly={true}>
                  <PatientManagement />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
