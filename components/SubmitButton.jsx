"use client";

import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

import ReactToast from "./react-toast";
import {
  normalizePhoneNumber,
  validateEmail,
  validatePhoneNumber,
} from "../functions/validations";

const SubmitButton = ({ inputState, clearForm }) => {
  const { firstName, lastName, email, phoneNumber, message } = inputState;
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (pk) emailjs.init({ publicKey: pk });
  }, []);

  const validate = () => {
    if (!firstName) return toast(<ReactToast title="❌ Please enter your first name." />), false;
    if (!lastName) return toast(<ReactToast title="❌ Please enter your last name." />), false;
    if (!validateEmail(email)) return toast(<ReactToast title="❌ Please enter a valid email." />), false;
    const phone = normalizePhoneNumber(phoneNumber);
    if (!validatePhoneNumber(phone)) return toast(<ReactToast title="❌ Please enter a valid phone number." />), false;
    if (!message) return toast(<ReactToast title="❌ Please enter a message." />), false;
    return true;
  };

  const sendEmail = async () => {
    if (isSending || !validate()) return;
    setIsSending(true);

    try {
      const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  || "service_2tk18sl";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_qtuflym";
      const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  || "9YS481nKiT3lB8wNY";

      const params = {
        from_name: `${firstName} ${lastName}`,
        from_email: email,
        phone: normalizePhoneNumber(phoneNumber),
        message,
      };

      await emailjs.send(serviceId, templateId, params, { publicKey });
      toast(<ReactToast title="✅ Contacted Successfully!" />);
      clearForm();
    } catch (err) {
      const reason = err?.text || err?.message || "Unknown error";
      console.error("EmailJS error:", err);
      toast(<ReactToast title={`❌ Error Sending Email: ${reason}`} />);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      onClick={sendEmail}
      disabled={isSending}
      className={`bg-primary w-[120px] h-[40px] font-poppins text-white text-[16px] rounded-[8px] mt-[32px] md:w-[150px] md:h-[50px] md:text-[20px] md:mt-[40px] ${
        isSending ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {isSending ? "Sending..." : "Submit"}
    </button>
  );
};

export default SubmitButton;
