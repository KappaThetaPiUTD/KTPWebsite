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
    <div className="relative min-h-screen bg-[#0F0F0F]">
      <div className="w-full pt-24 overflow-auto">
        <div>
          <Quote />
        </div>
        <div>
          <Group />
        </div>
        <div className="pl-10 pr-10 pb-10">
          <div className="flex flex-row justify-center text-primary text-4xl lg:text-header1 font-bold font-georgia pl-10 pr-10 pt-10 mb-8">
            Letter From The President
          </div>
          <div className="flex-row pl-10 pr-10 hidden lg:flex">
            <Letter />
            <Portrait />
          </div>
          <div className="flex flex-col pl-10 pr-10 lg:hidden space-y-12">
            <Portrait />
            <Letter />
          </div>
        </div>
        {/*DO NOT ADD TO PAGE YET
                <div>
                    <Mu/>
                </div> */}
        <div className="flex flex-row justify-center pt-10 pb-24">
          <PieChartComponent />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
