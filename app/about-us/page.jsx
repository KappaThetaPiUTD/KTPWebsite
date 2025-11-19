import Portrait from "../../components/image";
import Letter from "../../components/paragraphs";
import Quote from "../../components/slogan";
import PieChartComponent from "../../components/PieChartComponent";

export const metadata = {
  title: "Kappa Theta Pi UTD - About Us",
  description: "Kappa Theta Pi Description",
};

const AboutUs = () => {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Navbar spacing */}
      <div className="w-full pt-16 overflow-auto">
        {/* Header */}
        <div className="flex flex-col items-start px-6 lg:px-28 py-12">
          <h1 className="text-5xl font-bold text-left text-black font-poppins mb-8">
            About Us
          </h1>
          <div className="text-lg text-black text-left leading-relaxed max-w-5xl space-y-6">
            <p>
              At Kappa Theta Pi, we strive to cultivate a community built on
              inclusivity, diversity, and shared passion for technology. With
              members from a range of cultural, academic, and professional
              backgrounds, we champion the belief that everyone has a voice and
              a place in tech.
            </p>
            <p>
              Our chapter is committed to providing opportunities that empower
              members to grow professionally and personally. From engaging
              workshops to vibrant networking events, we foster an environment
              where creativity thrives, and lifelong connections are made. Join
              us as we continue to shape the future of technology and
              innovation.
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-12">
          <Quote />
        </div>

        <div className="px-6 sm:px-10 pb-10 bg-primary">
          <div className="text-center text-white text-3xl sm:text-4xl lg:text-header1 font-bold font-poppins pt-10 mb-8">
            Letter From The President
          </div>
          <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-10">
            <div className="flex justify-center lg:justify-start">
              <Portrait />
            </div>
            <Letter />
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="flex flex-row justify-center pt-10 pb-24">
          <PieChartComponent />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
