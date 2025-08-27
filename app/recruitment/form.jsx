"use client";
import React from "react";
import Script from "next/script";

const FormPage = () => {
  return (
    <div className="flex flex-col items-center space-y-4 mb-10">
      <div className="w-full max-w-[720px] bg-white p-4 md:p-6 rounded-md shadow">
        {/* Google Form */}
        <iframe
          title="KTP Recruitment Form"
          src="https://docs.google.com/forms/d/e/1FAIpQLSfv3EUhso2iIs51kqR9rRUvOsTSvx6gs287xIO7A9RDwKGTaw/viewform?embedded=true"
          className="w-full"
          width="100%"
          height="1622"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
        >
          Loading…
        </iframe>

        {/* Tally embed (safe load) */}
        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="afterInteractive"
          onLoad={() => {
            if (typeof window !== "undefined" && window.Tally) {
              window.Tally.loadEmbeds();
            }
          }}
        />
      </div>
    </div>
  );
};

export default FormPage;
