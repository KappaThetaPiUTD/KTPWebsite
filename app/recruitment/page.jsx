import React from "react";

export const metadata = {
  title: "Kappa Theta Pi UTD - Recruitment",
  description: "Kappa Theta Pi Descripton",
};

const RecruitmentPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-10">
      {" "}
      {/* Added padding-top */}
      <div className="flex flex-col items-center space-y-4 mb-25">
        <div className="text-secondary text-header1 font-bold font-poppins">
          Recruitment
        </div>
        <div className="text-[#FFFFFF] text-[45px]">
          We are looking forward to Fall 2024 recruitment!
        </div>
      </div>
      <div className="flex flex-col items-center space-y-8">
        <div className="text-[#FFFFFF] text-header3">
          Check back here closer to recruitment for rush details.
        </div>
        <div className="text-[#FFFFFF] text-header3">
          Interested in rushing? Complete our interest form for rush emails!
        </div>
      </div>
    </div>
  );
};

export default RecruitmentPage;
