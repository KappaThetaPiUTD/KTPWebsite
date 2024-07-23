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

    await emailjs
      .send(
        "service_2tk18sl",
        "template_qtuflym",
        {
          full_name: `${firstName} ${lastName}`,
          email,
          phone_number: normalizePhoneNumber(phoneNumber),
          message,
        },
        "9YS481nKiT3lB8wNY"
      )
      .then(
        (result) => {
          toast(<ReactToast title="✅ Contacted Successfully!" />);
        },
        (error) => {
          toast(<ReactToast title="❌ Error Sending Email :(" />);
        }
      );

    clearForm();
    setIsSending(false);
  };

  return (
    <button
      className="bg-primary w-[120px] h-[40px] font-poppins text-[#FFFFFF] text-[16px] rounded-[8px] mt-[32px] md:w-[150px] md:h-[50px] md:text-[20px] md:mt-[40px]"
      onClick={sendEmail}
    >
      Submit
    </button>
  );
};

export default SubmitButton;
