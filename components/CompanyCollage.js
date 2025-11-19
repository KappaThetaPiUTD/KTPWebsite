"use client"; // Marking this as a client component

import Image from "next/image";
import React from "react";

const CompanyCollage = () => {
  const companyLogos = [
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951550/Brother%20Page/Companies/c640688e-d185-4b93-a7d5-f8402a1b9d23.png",
      alt: "PWC",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1732828144/Brother%20Page/Companies/30cd328f-409a-4c74-9100-b24f7a23e382.png",
      alt: "Fannie Mae",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951550/Brother%20Page/Companies/c640688e-d185-4b93-a7d5-f8402a1b9d23.png",
      alt: "Verizon",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951697/Brother%20Page/Companies/f70f7f3b-0d90-4e5f-a131-6db4be2909d7.png",
      alt: "JP Morgan Chase",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951882/Brother%20Page/Companies/c4bb27cd-449d-4f9c-abfc-a84437dadff3.png",
      alt: "Amazon",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951685/Brother%20Page/Companies/bdcbe1d8-afc7-4155-a3a4-054182baebb2.png",
      alt: "Optiver",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951723/Brother%20Page/Companies/243e57cb-0e48-42ca-90e8-2dc0cec525f0.png",
      alt: "Anduril",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1728059612/Brother%20Page/Companies/s-l1200_hdhgi0.png",
      alt: "Mavs",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951988/Brother%20Page/Companies/3efe36d2-be33-4e47-aae7-5ed2fd29e5e9.png",
      alt: "Keurig Dr Pepper",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951949/Brother%20Page/Companies/fe0ac994-e788-497a-8232-42b5d9d701a7.png",
      alt: "Walmart",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724952012/Brother%20Page/Companies/3c46aec1-cc91-41f5-85e6-caf5902a67fd.png",
      alt: "UT Southwestern Medical Center",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951769/Brother%20Page/Companies/e26f7ec5-10b9-4093-88a0-5571c679a39b.png",
      alt: "Bank of America",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724952160/Brother%20Page/Companies/32df115d-171e-44ca-ac93-ce265e21c4b6.png",
      alt: "IBM",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724951937/Brother%20Page/Companies/ca614af7-7363-42d4-87b5-8b39bb9605e7.png",
      alt: "Tenet Health",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724952141/Brother%20Page/Companies/1340d428-8138-43f2-aa00-307cee943900.png",
      alt: "EDP Renewables",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1732828206/Brother%20Page/Companies/49b3e1c0-ff24-442b-936c-00ef845473dd.png",
      alt: "Realtor.com",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724952080/Brother%20Page/Companies/0907984b-0a71-4ba1-89ad-015547341970.png",
      alt: "Country Financial",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1732828570/Brother%20Page/Companies/d60cc0da-e2d2-4efe-ab3e-b1b321dc0c8c.png",
      alt: "PNC Bank",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1724952180/Brother%20Page/Companies/19f10ad0-087e-4534-82be-f6a65ce8de63.png",
      alt: "Tech Mahindra",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1732828415/Brother%20Page/Companies/a0ea4201-ab15-4cd3-903f-2cdb017620c9.png",
      alt: "7-11",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1732828379/Brother%20Page/Companies/07b976d0-8730-454e-9160-673d7fc67721.png",
      alt: "OGandE",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1725403289/Brother%20Page/Companies/a9de1dc5-9e31-478d-a6a7-dc319a533de3.png",
      alt: "Webacy",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1732828448/Brother%20Page/Companies/68f12464-1793-40af-9486-ce8cd69164b9.png",
      alt: "nsf",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1728060858/Brother%20Page/Companies/logo.46ab9870_jxl9nd.png",
      alt: "Wise assistant",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1728060857/Brother%20Page/Companies/Outlier_AI-AI_xe8ohg.png",
      alt: "outlier ai",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1728060860/Brother%20Page/Companies/CSU.TO_BIG-a8c98406_bkwnxt.png",
      alt: "constilation software",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1742586864/Brother%20Page/Companies/Hilton_Worldwide_logo_n6hgix.webp",
      alt: "Hilton",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1742586929/Brother%20Page/Companies/Signet_Jewelers_logo_zfjo2q.png",
      alt: "Signet Jewlers",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741212292/Brother%20Page/Companies/att.svg",
      alt: "AT&T",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741212421/Brother%20Page/Companies/DXC.png",
      alt: "DXC",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1742586688/Brother%20Page/Companies/cb88d061e53db078620db3af24a5b7e7e87a0047_idrbm3.png",
      alt: "Pearson VUE",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741212686/Brother%20Page/Companies/qualitest.png",
      alt: "Qualitest",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741212801/Brother%20Page/Companies/logo_3_iwmseo.png",
      alt: "UTSW",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741212967/Brother%20Page/Companies/Adobe_Corporate_Logo_okf0l4.png",
      alt: "Adobe",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741213052/Brother%20Page/Companies/fidelity-investments-thumb_hxm4wj.png",
      alt: "Fidelity",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741213440/Brother%20Page/Companies/output-onlinepngtools_yyndeg.png",
      alt: "TechMint",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1742586766/Brother%20Page/Companies/PAYCOM_Logo_FullColor_rjguna.png",
      alt: "Paycom",
    },
    {
      src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741213657/Brother%20Page/Companies/USAA-Emblem_qxyr11.png",
      alt: "USAA",
    },
    {
     src: "https://res.cloudinary.com/dha44tosd/image/upload/v1747429844/Brother%20Page/Companies/pepsico-logo-removebg-preview_nlaymk.png",
     alt: "PepsiCo",
    },
    {
     src: "https://res.cloudinary.com/dha44tosd/image/upload/v1747430073/Brother%20Page/Companies/Cognizant-Logo_q3u8qv.png",
     alt: "Cognizant",
    },
    {
     src: "https://res.cloudinary.com/dha44tosd/image/upload/v1747432025/Brother%20Page/Companies/MetroScientific_gz3tpv.png",
     alt: "MetroScientific",
    },
    {
     src: "https://res.cloudinary.com/dha44tosd/image/upload/v1747432126/Brother%20Page/Companies/tcs-logo_ijpgjg.png",
     alt: "Tata Consulting Services",
    },
    {
     src: "https://res.cloudinary.com/dha44tosd/image/upload/v1747432384/Brother%20Page/Companies/ruvati-logo_atqhqp.png",
     alt: "Ruvati",
    },
    {
     src: "https://res.cloudinary.com/dha44tosd/image/upload/v1747432951/Brother%20Page/Companies/oceaneering-logo_isteen.png",
     alt: "Oceaneering",
    },
    {
     src: "https://res.cloudinary.com/dha44tosd/image/upload/v1747432938/Brother%20Page/Companies/l_t-logo_lagqrp.png",
     alt: "L&T Construction",
    },
  ];

  const rows = 3;
  const logosPerRow = Math.ceil(companyLogos.length / rows);

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center p-6 bg-white">
      <h2 className="text-header1 font-bold font-poppins text-primary text-center mb-6">
        Our Companies
      </h2>
      <div className="relative w-full overflow-hidden bg-gray-100">
        <div className="scroll-container">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="scroll">
              {companyLogos
                .slice(logosPerRow * rowIndex, logosPerRow * (rowIndex + 1))
                .concat(
                  companyLogos.slice(
                    logosPerRow * rowIndex,
                    logosPerRow * (rowIndex + 1)
                  )
                ) // Duplicate for smooth scroll
                .map((logo, index) => (
                  <div key={index} className="logo-container">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      style={{ objectFit: "contain" }}
                      className="object-contain"
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .scroll-container {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .scroll {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: scroll 20s linear infinite;
        }
        .logo-container {
          flex-shrink: 0;
          width: 128px;
          height: 128px;
          margin: 1rem;
          position: relative;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .scroll:nth-child(2) {
          animation-delay: 1s;
        }
        .scroll:nth-child(3) {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default CompanyCollage;
