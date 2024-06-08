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
        <div className="pl-10 pr-10 pb-10">
          <div className="flex flex-row justify-center text-primary text-header1 font-bold font-georgia pl-10 pr-10 pt-10">
            Letter From The President
          </div>
          <div className="flex flex-row pl-10 pr-10">
            <Letter />
            <Portrait />
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
