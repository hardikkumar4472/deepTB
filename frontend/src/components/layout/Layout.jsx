// // src/components/Layout.jsx
// import React from 'react';
// import Navbar from './Navbar';

// const Layout = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default Layout;
// src/components/Layout.jsx
// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FFF1CB]/10 to-[#C2E2FA]/10">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        {children}
      </main>
    </div>
  );
};

export default Layout;