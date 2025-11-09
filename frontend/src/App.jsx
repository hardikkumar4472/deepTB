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

 import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
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

// ✅ Initialize Google Analytics (GA4)
const TRACKING_ID = "G-TY5ZVFF2QZ";

// ✅ Track page views when route changes
const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
};

function App() {
  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <TrackPageView />
        <Layout>
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
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/predict"
              element={<ProtectedRoute><Prediction /></ProtectedRoute>}
            />
            <Route
              path="/history"
              element={<ProtectedRoute><History /></ProtectedRoute>}
            />

            {/* Doctor Protected Routes */}
            <Route
              path="/doctor/dashboard"
              element={<ProtectedRoute doctorOnly={true}><DoctorDashboard /></ProtectedRoute>}
            />
            <Route
              path="/doctor/reports"
              element={<ProtectedRoute doctorOnly={true}><Reports /></ProtectedRoute>}
            />
            <Route
              path="/doctor/patients"
              element={<ProtectedRoute doctorOnly={true}><PatientManagement /></ProtectedRoute>}
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
