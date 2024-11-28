import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import MailIcon from "./mail-icon-footer";

const Footer = () => {
  return (
    <footer className="flex flex-col sm:flex-row justify-between items-center bottom-0 w-full z-10 bg-primary text-[#ffffff] p-5 font-poppins">
    <div className="text-center sm:text-right mt-5 sm:mt-0">
      <div className="font-regular font-poppins">
            The University of Texas at Dallas
          </div>
        <div className="text-[20px] sm:text-[25px] font-bold mb-1 font-poppins">
          Kappa Theta Pi - Mu Chapter
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
        <div className="flex items-center">
          <div className="flex flex-col sm:flex-row items-center ml-0 sm:ml-5 mt-5 sm:mt-0">
            <a href="https://www.linkedin.com/company/ktputd" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="mr-0 sm:mr-[2px] text-[#ffffff]" size={40} />
            </a>
            <a href="https://www.instagram.com/utdktp/" target="_blank" rel="noopener noreferrer" className="sm:ml-5">
              <FaInstagram className="mr-0 sm:mr-[2px] text-[#ffffff]" size={40} />
            </a>
            <a href="mailto:kappathetapiutd@gmail.com" className="sm:ml-5">
              <FaEnvelope className="mr-0 sm:mr-[2px] text-[#ffffff]" size={40} />
            </a>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;