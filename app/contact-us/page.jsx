"use client";

import { useReducer } from "react";
import Inputs from "../../components/Inputs";
import SubmitButton from "../../components/SubmitButton";

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
      <div className="flex flex-col w-screen h-[1000px] bg-[#0F0F0F] items-center pt-24">
        <div className="text-primary font-poppins text-header1 font-bold mb-[0px]">
          Contact Us
        </div>
        <div className="text-[#FFFFFF] text-header4 md:text-header2">
          Have a question or concern?
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