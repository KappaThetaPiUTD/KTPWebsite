//form.jsx
'use client'
import React from "react";
import Script from 'next/script'

const FormPage = () => {
  return (
      <div className="flex flex-col items-center space-y-4 mb-10">
        <div className="text-paragraph text-gray-400 text-center mt-8">
        Interest form is also available in our Instagram bio.
      </div>
        <div className="h-[800px] md:h-[705px] w-[300px] md:w-[600px] bg-white p-8 rounded-md">
        <iframe data-tally-src="https://tally.so/embed/npGyb1?alignLeft=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="400" frameborder="0" marginheight="0" marginwidth="0" title="KTP Interest Form"></iframe>
            <Script
                src="https://tally.so/widgets/embed.js"
                onLoad={() => Tally.loadEmbeds()}
            />
        </div>
      </div>
  );
};

export default FormPage;
