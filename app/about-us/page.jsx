import Portrait from "../../components/image";
import Letter from "../../components/paragraphs";
import Quote from "../../components/slogan";
import Group from "../../components/group-image";
import PieChartComponent from "../../components/PieChartComponent";
import Majors from "../../components/majors";
import Classes from "../../components/class-level";

export const metadata = {
  title: "Kappa Theta Pi UTD - About Us",
  description: "Kappa Theta Pi Descripton",
};

const AboutUs = () => {
  return (
    <div>
      <style>
        {`
          ::-webkit-scrollbar {
            width: 4px; 
            height: 6px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #363636;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-track {
            background-color: #0F0F0F;
          }
          ::-webkit-scrollbar-button {
            display: none;
          }
        `}
      </style>
      <div className="fixed w-screen h-full bg-[#0F0F0F] pt-24 overflow-auto">
        <div>
          <Quote />
        </div>
        <div>
          <Group />
        </div>
        <div className="pl-5 pr-5 pb-10 sm:pl-10 sm:pr-10">
          <div className="flex justify-center text-primary text-header1 font-bold font-georgia pt-10">
            Letter From The President
          </div>
          <div className="flex flex-col sm:flex-row pl-5 pr-5 sm:pl-10 sm:pr-10">
            <Letter />
            <Portrait />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center pt-10 pb-24">
          <PieChartComponent />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
