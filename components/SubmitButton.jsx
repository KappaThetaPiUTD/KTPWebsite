import emailjs from "@emailjs/browser";
import ReactToast from "./react-toast";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  normalizePhoneNumber,
  validateEmail,
  validatePhoneNumber,
} from "../functions/validations";

const SubmitButton = ({ inputState, clearForm }) => {
  const { firstName, lastName, email, phoneNumber, message } = inputState;
  const [isSending, setIsSending] = useState(false);

  const validate = () => {
    if (!firstName) {
      toast(<ReactToast title="❌ Please enter your first name." />);
      return false;
    } else if (!lastName) {
      toast(<ReactToast title="❌ Please enter your last name." />);
      return false;
    } else if (!validateEmail(email)) {
      toast(<ReactToast title="❌ Please enter a valid email." />);
      return false;
    } else if (!validatePhoneNumber(phoneNumber)) {
      toast(<ReactToast title="❌ Please enter a valid phone number." />);
      return false;
    } else if (!message) {
      toast(<ReactToast title="❌ Please enter a message." />);
      return false;
    }

    return true;
  };

  const sendEmail = async () => {
    if (isSending) return;

    if (!validate()) return;

    setIsSending(true);

    // Initialize EmailJS once (you can also do this in your app's root)
    emailjs.init("9YS481nKiT3lB8wNY");

    // Template params that match your EmailJS template EXACTLY
    const templateParams = {
      full_name: `${firstName} ${lastName}`,
      email: email,
      phone_number: normalizePhoneNumber(phoneNumber),
      message: message,
    };
    
    console.log('Sending with template params:', templateParams);

    try {
      const result = await emailjs.send(
        "service_2tk18sl",
        "template_qtuflym",
        templateParams
        // Public key is already initialized above, no need to pass again
      );
      
      console.log('EmailJS SUCCESS:', result);
      toast(<ReactToast title="✅ Message sent successfully!" />);
      clearForm();
      
    } catch (error) {
      console.error('EmailJS ERROR Details:', error);
      
      // More specific error handling
      if (error.status === 412) {
        console.error('412 Error - Template variable mismatch or service connection issue');
        toast(<ReactToast title="❌ Email configuration error. Please try again or contact support." />);
      } else if (error.status === 400) {
        console.error('400 Error - Bad request, check template variables');
        toast(<ReactToast title="❌ Invalid form data. Please check your inputs." />);
      } else if (error.status === 402) {
        toast(<ReactToast title="❌ Email quota exceeded. Please try again later." />);
      } else if (error.status === 403) {
        toast(<ReactToast title="❌ Email service access denied." />);
      } else if (error.text?.includes('Gmail_API')) {
        toast(<ReactToast title="❌ Gmail connection issue. Please contact support." />);
      } else {
        toast(<ReactToast title="❌ Failed to send message. Please try again." />);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      className="bg-primary w-[120px] h-[40px] font-poppins text-[#FFFFFF] text-[16px] rounded-[8px] mt-[32px] md:w-[150px] md:h-[50px] md:text-[20px] md:mt-[40px] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      onClick={sendEmail}
      disabled={isSending}
    >
      {isSending ? "Sending..." : "Submit"}
    </button>
  );
};

export default SubmitButton;