// // src/components/Navbar.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Stethoscope, User, LogOut } from 'lucide-react';

// const Navbar = () => {
//   const { user, doctor, logout, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav className="bg-white shadow-lg border-b">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <Stethoscope className="h-8 w-8 text-medical-600" />
//             <span className="text-xl font-bold text-gray-800">DeepTB</span>
//           </Link>

//           {/* Navigation Links */}
//           <div className="flex items-center space-x-4">
//             {isAuthenticated ? (
//               <>
//                 {doctor ? (
//                   <>
//                     <Link 
//                       to="/doctor/dashboard" 
//                       className="text-gray-700 hover:text-medical-600 px-3 py-2 rounded-md"
//                     >
//                       Dashboard
//                     </Link>
//                     <Link to="/doctor/reports" className="text-gray-700 hover:text-medical-600 px-3 py-2 rounded-md">
//                         Reports
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link 
//                       to="/dashboard" 
//                       className="text-gray-700 hover:text-medical-600 px-3 py-2 rounded-md"
//                     >
//                       Dashboard
//                     </Link>
//                     <Link 
//                       to="/predict" 
//                       className="text-gray-700 hover:text-medical-600 px-3 py-2 rounded-md"
//                     >
//                       Predict TB
//                     </Link>
//                     <Link 
//                       to="/history" 
//                       className="text-gray-700 hover:text-medical-600 px-3 py-2 rounded-md"
//                     >
//                       History
//                     </Link>
//                   </>
//                 )}
                
//                 <div className="flex items-center space-x-2">
//                   <User className="h-5 w-5 text-gray-500" />
//                   <span className="text-gray-700">
//                     {doctor ? `Dr. ${doctor.name}` : user?.name}
//                   </span>
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md"
//                   >
//                     <LogOut className="h-4 w-4" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link 
//                   to="/login" 
//                   className="text-gray-700 hover:text-medical-600 px-3 py-2 rounded-md"
//                 >
//                   Patient Login
//                 </Link>
//                 <Link 
//                   to="/doctor/login" 
//                   className="bg-medical-600 text-white px-4 py-2 rounded-md hover:bg-medical-700"
//                 >
//                   Doctor Portal
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// src/components/Navbar.jsx
// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, doctor, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-lg border-b border-slate-200/40' 
        : 'bg-white/80 backdrop-blur-md border-b border-slate-200/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-light text-slate-800 tracking-wide group-hover:text-[#FF8F8F] transition-colors duration-300">DeepTB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {doctor ? (
                  <>
                    <Link 
                      to="/doctor/dashboard" 
                      className="text-slate-600 hover:text-[#FF8F8F] px-4 py-2 rounded-full hover:bg-[#FF8F8F]/10 transition-all duration-300 text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/doctor/reports" 
                      className="text-slate-600 hover:text-[#B7A3E3] px-4 py-2 rounded-full hover:bg-[#B7A3E3]/10 transition-all duration-300 text-sm font-medium"
                    >
                      Reports
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-slate-600 hover:text-[#FF8F8F] px-4 py-2 rounded-full hover:bg-[#FF8F8F]/10 transition-all duration-300 text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/predict" 
                      className="text-slate-600 hover:text-[#B7A3E3] px-4 py-2 rounded-full hover:bg-[#B7A3E3]/10 transition-all duration-300 text-sm font-medium"
                    >
                      Predict TB
                    </Link>
                    <Link 
                      to="/history" 
                      className="text-slate-600 hover:text-[#C2E2FA] px-4 py-2 rounded-full hover:bg-[#C2E2FA]/10 transition-all duration-300 text-sm font-medium"
                    >
                      History
                    </Link>
                  </>
                )}
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                  <div className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] p-2 rounded-full shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-slate-700 text-sm font-medium">
                    {doctor ? `Dr. ${doctor.name}` : user?.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-slate-600 hover:text-[#FF8F8F] px-3 py-2 rounded-full hover:bg-[#FF8F8F]/10 transition-all duration-300 text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-slate-600 hover:text-[#FF8F8F] px-4 py-2 rounded-full hover:bg-[#FF8F8F]/10 transition-all duration-300 text-sm font-medium"
                >
                  Patient Login
                </Link>
                <Link 
                  to="/doctor/login" 
                  className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm font-medium shadow-lg"
                >
                  Doctor Portal
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg rounded-2xl p-4 mt-2 border border-slate-200/40 shadow-xl animate-fade-in">
            {isAuthenticated ? (
              <div className="space-y-3">
                {doctor ? (
                  <>
                    <Link 
                      to="/doctor/dashboard" 
                      className="block text-slate-600 hover:text-[#FF8F8F] px-4 py-2 rounded-full hover:bg-[#FF8F8F]/10 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/doctor/reports" 
                      className="block text-slate-600 hover:text-[#B7A3E3] px-4 py-2 rounded-full hover:bg-[#B7A3E3]/10 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reports
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="block text-slate-600 hover:text-[#FF8F8F] px-4 py-2 rounded-full hover:bg-[#FF8F8F]/10 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/predict" 
                      className="block text-slate-600 hover:text-[#B7A3E3] px-4 py-2 rounded-full hover:bg-[#B7A3E3]/10 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Predict TB
                    </Link>
                    <Link 
                      to="/history" 
                      className="block text-slate-600 hover:text-[#C2E2FA] px-4 py-2 rounded-full hover:bg-[#C2E2FA]/10 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      History
                    </Link>
                  </>
                )}
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] p-2 rounded-full">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium">
                      {doctor ? `Dr. ${doctor.name}` : user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 text-slate-600 hover:text-[#FF8F8F] px-4 py-2 rounded-full hover:bg-[#FF8F8F]/10 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  className="block text-slate-600 hover:text-[#FF8F8F] px-4 py-2 rounded-full hover:bg-[#FF8F8F]/10 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Patient Login
                </Link>
                <Link 
                  to="/doctor/login" 
                  className="block bg-gradient-to-r from-[#FF8F8F] to-[#B7A3E3] text-white px-4 py-2 rounded-full text-center hover:shadow-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Doctor Portal
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;