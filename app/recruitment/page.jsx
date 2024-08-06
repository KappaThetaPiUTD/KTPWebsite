import React from "react";
import Script from 'next/script'
import FormPage from "./form";

export const metadata = {
  title: "Kappa Theta Pi UTD - Recruitment",
  description: "Kappa Theta Pi Descripton",
};

const RecruitmentPage = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-start pt-24 px-4 md:px-8">
      <FormPage />
    </div>
  );
};

export default RecruitmentPage;
