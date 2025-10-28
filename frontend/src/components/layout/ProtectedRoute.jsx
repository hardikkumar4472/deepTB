// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const ProtectedRoute = ({ children, doctorOnly = false }) => {
//   const { isAuthenticated, isDoctor, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (doctorOnly && !isDoctor) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   if (!doctorOnly && isDoctor) {
//     return <Navigate to="/doctor/dashboard" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, doctorOnly = false }) => {
  const { isAuthenticated, isDoctor, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (doctorOnly && !isDoctor) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!doctorOnly && isDoctor) {
    return <Navigate to="/doctor/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;