import React from "react";

import NavbarHomePage from "../components/Topic/NavbarHomePage";
import HeaderHomePage from "../components/Topic/HeaderHomePage";
import BenefitsHomePage from "../components/Topic/BenefitsHomePage";
import SilabusPage from "../components/Topic/SilabusPage";
import DeskripsiPage from "../components/Topic/DeskripsiPage";
import RekomendasiPage from "../components/Topic/RekomendasiPage";

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
