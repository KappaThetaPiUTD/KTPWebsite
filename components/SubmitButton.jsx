"use client";
import emailjs from "@emailjs/browser";
import ReactToast from "./react-toast";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  normalizePhoneNumber,
  validateEmail,
  validatePhoneNumber,
} from "../functions/validations";

const SubmitButton = ({ inputState, clearForm }) => {
  const { firstName, lastName, email, phoneNumber, message } = inputState;
  const [isSending, setIsSending] = useState(false);

  // Initialize EmailJS once
  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (pk) emailjs.init({ publicKey: pk });
  }, []);

  const validate = () => {
    if (!firstName) return toast(<ReactToast title="❌ Please enter your first name." />), false;
    if (!lastName)  return toast(<ReactToast title="❌ Please enter your last name." />), false;
    if (!validateEmail(email)) return toast(<ReactToast title="❌ Please enter a valid email." />), false;
    const phone = normalizePhoneNumber(phoneNumber);
    if (!validatePhoneNumber(phone)) return toast(<ReactToast title="❌ Please enter a valid phone number." />), false;
    if (!message) return toast(<ReactToast title="❌ Please enter a message." />), false;
    return true;
  };

  const sendEmail = async () => {
    if (isSending) return;
    if (!validate()) return;

    setIsSending(true);
    try {
      const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  || "service_2tk18sl";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_qtuflym";
      const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  || "9YS481nKiT3lB8wNY";

      // ⚠️ Use the EXACT variable names defined in your EmailJS template:
      const params = {
        from_name: `${firstName} ${lastName}`,
        from_email: email,
        phone: normalizePhoneNumber(phoneNumber),
        message,
        // reply_to: email, // add if your template uses it
      };

      // Pass options object for the 4th param
      await emailjs.send(serviceId, templateId, params, { publicKey });

      toast(<ReactToast title="✅ Contacted Successfully!" />);
      clearForm();
    } catch (err) {
      // Surface the actual reason
      const reason = err?.text || err?.message || "Unknown error";
      console.error("EmailJS error:", err);
      toast(<ReactToast title={`❌ Error Sending Email: ${reason}`} />);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      className="bg-primary w-[120px] h-[40px] font-poppins text-white text-[16px] rounded-[8px] mt-[32px] md:w-[150px] md:h-[50px] md:text-[20px] md:mt-[40px] disabled:opacity-60"
      onClick={sendEmail}
      disabled={isSending}
    >
      {isSending ? "Sending..." : "Submit"}
    </button>
  );
};

export default SubmitButton;

