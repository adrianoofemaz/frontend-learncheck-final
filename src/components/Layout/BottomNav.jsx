// /**
//  * BottomNav Component
//  * Bottom navigation bar untuk mobile
//  */

// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   HomeIcon,
//   BookOpenIcon,
//   SparklesIcon,
// } from "@heroicons/react/24/outline";

// const BottomNav = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navItems = [
//     { label: "Beranda", path: "/home", icon: HomeIcon },
//     { label: "Materi", path: "/learning", icon: BookOpenIcon },
//     { label: "Profile", path: "/profile", icon: SparklesIcon },
//   ];

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
//       <div className="flex items-center justify-around h-16">
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = location.pathname === item.path;

//           return (
//             <button
//               key={item.path}
//               onClick={() => navigate(item.path)}
//               className={`flex flex-col items-center gap-1 px-4 py-2 transition ${
//                 isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               <Icon className="w-6 h-6" />
//               <span className="text-xs font-medium">{item.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </nav>
//   );
// };

// export default BottomNav;
