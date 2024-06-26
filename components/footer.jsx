import { CiLinkedin, CiInstagram, CiMail } from "react-icons/ci";
import MailIcon from "./mail-icon-footer";

const Footer = () => {
  return (
    <footer className="flex flex-col sm:flex-row justify-between items-center bottom-0 w-full z-10 bg-[#0f0f0f] text-[#ffffff] p-5">
      <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
        <div className="flex items-center">
          <MailIcon className="hidden sm:block w-10 h-10 text-[#ffffff]" />
          <div className="flex flex-col sm:flex-row items-center ml-0 sm:ml-5 mt-5 sm:mt-0">
            <a href="https://www.linkedin.com/company/ktputd" target="_blank" rel="noopener noreferrer">
              <CiLinkedin className="mr-0 sm:mr-[2px] text-[#ffffff]" size={50} />
            </a>
            <a href="https://www.instagram.com/utdktp/" target="_blank" rel="noopener noreferrer" className="sm:ml-5">
              <CiInstagram className="mr-0 sm:mr-[2px] text-[#ffffff]" size={50} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center sm:text-right mt-5 sm:mt-0">
        <div className="text-[20px] sm:text-[25px] font-extralight mb-1 font-poppins">
          Kappa Theta Pi - Mu Chapter
        </div>
        <div className="text-[0.8rem] font-extralight mb-1 font-poppins">
          Managed by Membership Committee
        </div>
      </div>
    </footer>
  );
};

export default Footer;
