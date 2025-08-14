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
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: normalizePhoneNumber(phoneNumber),
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        toast(<ReactToast title="✅ Message Sent!" />);
        clearForm();
      } else {
        toast(<ReactToast title="❌ Error Sending Email" />);
        console.warn("Contact send failed", res.status, data);
      }
    } catch (err) {
      toast(<ReactToast title="❌ Error Sending Email" />);
      console.error("Contact send exception", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      className={`bg-primary w-[120px] h-[40px] font-poppins text-[#FFFFFF] text-[16px] rounded-[8px] mt-[32px] md:w-[150px] md:h-[50px] md:text-[20px] md:mt-[40px] ${
        isSending ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onClick={sendEmail}
      disabled={isSending}
    >
      {isSending ? "Sending..." : "Submit"}
    </button>
  );
};

export default SubmitButton;
