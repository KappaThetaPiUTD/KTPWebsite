import { CiLinkedin, CiInstagram, CiLink } from "react-icons/ci";
import MailIcon from "./mail-icon-footer";

const Footer = () => {
  return (
    <footer className="flex flex-col sm:flex-row justify-between items-center bottom-0 w-full z-10 bg-[#0f0f0f] text-[#A9A9A9] p-5">
      <div className="flex flex-col sm:flex-row items-center w-auto">
        <div className="flex items-center">
          <MailIcon />
          <div className="flex flex-col sm:flex-row items-center ml-5">
            <a href="https://www.linkedin.com/company/ktputd" target="_blank">
              <CiLinkedin className="mr-[2px]" size={50} />
            </a>
            <a
              href="https://www.instagram.com/utdktp/"
              target="_blank"
              className="sm:ml-5"
            >
              <CiInstagram className="mr-[2px]" size={50} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-right mt-5 sm:mt-0">
        <div className="text-[25px] font-extralight mb-[1px] font-poppins">
          Kappa Theta Pi - Mu Chapter
        </div>
        <div className="text-[0.8rem] font-extralight mb-[1px] font-poppins">
          Managed by Membership Committee
        </div>
      </div>
    </footer>
  );
};

export default Footer;
