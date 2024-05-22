"use client";

import { useReducer } from "react";
import Inputs from "../../components/Inputs";
import SubmitButton from "../../components/SubmitButton";
import Head from "next/head";

const reducer = (state, action) => {
  switch (action.type) {
    case "firstName":
      return { ...state, firstName: action.payload.value };
    case "lastName":
      return { ...state, lastName: action.payload.value };
    case "email":
      return { ...state, email: action.payload.value };
    case "phoneNumber":
      return { ...state, phoneNumber: action.payload.value };
    case "message":
      return { ...state, message: action.payload.value };
    case "clear":
      return {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: "",
      };
    default:
      return state;
  }
};

const ContactUs = () => {
  // Reducer that holds first name, last name, email, phone number, and message
  const [state, dispatch] = useReducer(reducer, {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  return (
    <>
      <title>Kappa Theta Pi UTD - Contact Us</title>
      <meta
        name="description"
        content="Have a question or concern? Hit us up."
      />
      <div className="flex flex-col w-screen h-[2000px] bg-[#0F0F0F] items-center pt-[52px]">
        <div className="text-secondary font-poppins text-[86px] font-bold mb-[0px]">
          Contact Us
        </div>
        <div className="text-[#FFFFFF] text-[45px]">
          Have a question or concern? Hit us up.
        </div>
        <Inputs inputState={state} inputDispatch={dispatch} />
        <SubmitButton
          inputState={state}
          clearForm={() =>
            dispatch({
              type: "clear",
            })
          }
        />
      </div>
    </>
  );
};

export default ContactUs;
