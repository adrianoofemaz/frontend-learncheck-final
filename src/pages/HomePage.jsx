import React from "react";

import NavbarHomePage from "../components/NavbarHomePage";
import HeaderHomePage from "../components/HeaderHomePage";
import BenefitsHomePage from "../components/BenefitsHomePage";
import SilabusPage from "../components/SilabusPage";
import DeskripsiPage from "../components/DeskripsiPage";
import RekomendasiPage from "../components/RekomendasiPage";

const HomePage = () => {
  return (
    <div className="">
      <div className="m-0">
        <NavbarHomePage />
      </div>

      <div className="my-10">
        <HeaderHomePage />
        <BenefitsHomePage />
        <SilabusPage />
        <DeskripsiPage />
        <RekomendasiPage />
      </div>
    </div>
  );
};

export default HomePage;
