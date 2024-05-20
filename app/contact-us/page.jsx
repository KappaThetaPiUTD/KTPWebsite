import Inputs from "../../components/Inputs";
import SubmitButton from "../../components/SubmitButton";

const ContactUs = () => {
  return (
    <div className="flex flex-col w-screen h-[2000px] bg-[#0F0F0F] items-center pt-[52px]">
      <div className="text-secondary font-poppins text-[86px] font-bold mb-[0px]">
        Contact Us
      </div>
      <div className="text-[#FFFFFF] text-[45px]">
        Have a question or concern? Hit us up.
      </div>
      <Inputs />
      <SubmitButton />
    </div>
  );
};

export default ContactUs;
