import Inputs from "../components-pakku/Inputs";
import SubmitButton from "../components-pakku/SubmitButton";

const ContactUs = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-[#0F0F0F] items-center pt-[52px]">
      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center">
        Contact Us
      </div>
      <div className="text-[#FFFFFF] text-[24px] md:text-header3 mt-[16px]">
        Have a question or concern?
      </div>
      <Inputs />
      <SubmitButton />
    </div>
  );
};

export default ContactUs;
