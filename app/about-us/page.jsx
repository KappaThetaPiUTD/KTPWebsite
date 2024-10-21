import Portrait from "../../components/image";
import Letter from "../../components/paragraphs";
import Quote from "../../components/slogan";
import PieChartComponent from "../../components/PieChartComponent";

export const metadata = {
  title: "Kappa Theta Pi UTD - About Us",
  description: "Kappa Theta Pi Descripton",
};

const AboutUs = () => {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="w-full pt-16 overflow-auto">
        <div>
          <Quote />
        </div>
        <div className="pl-10 pr-10 pb-10 bg-primary">
          <div className="flex flex-row justify-center text-white text-4xl lg:text-header1 font-bold font-poppins pl-10 pr-10 pt-10 mb-8 text-center bg-primary">
            Letter From The President
          </div>
          <div className="flex-row pl-10 pr-10 hidden lg:flex">
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
