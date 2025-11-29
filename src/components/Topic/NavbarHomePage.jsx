import React from "react";

const NavbarHomePage = () => {
  return (
    <div className="bg-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-4">
        <img
          src="/assets/images/logo-nav-dicoding.png"
          alt="Logo Navbar"
          className="w-20"
        />
      </div>
      <div className="flex items-center space-x-6">
        <a href="beranda" className="text-sm text-gray-500">
          Beranda
        </a>
        <div className="border-l border-gray-300 pl-4 flex items-center space-x-4">
          <a href="">
            <img src="/assets/images/icon darkmode.png" alt="" />
          </a>
          <a href="">
            <img src="/assets/images/icon profile.png" alt="" />
          </a>
        </div>
      </div>
    </div>
  );
};
export default NavbarHomePage;
