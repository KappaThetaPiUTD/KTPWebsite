"use client"; // Marking this as a client component

import Image from 'next/image';
import React from 'react';

const CompanyCollage = () => {
  const companyLogos = [
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724968751/Brother%20Page/Companies/ec67d703-5819-437f-bce9-83e6c57c2f64.png', alt: 'PWC' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969064/Brother%20Page/Companies/1d4df501-01d7-4885-b096-c44d5c0031aa.png', alt: 'Fannie Mae' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969108/Brother%20Page/Companies/00e1bde0-4462-47b8-b5e2-b0aed36619ba.png', alt: 'Verizon' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969198/Brother%20Page/Companies/7218eb1c-7c7e-45fb-832b-c7d7a2af350f.png', alt: 'JP Morgan Chase' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969392/Brother%20Page/Companies/a355942a-71c5-4484-95d3-b55696403e63.png', alt: 'Amazon' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969467/Brother%20Page/Companies/eb6797b1-82a7-4517-b06d-e9abd9a28dfc.png', alt: 'Optiver' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969509/Brother%20Page/Companies/87ee6052-eb34-4bdd-9595-7e120a66de96.png', alt: 'Anduril' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1728059612/Brother%20Page/Companies/s-l1200_hdhgi0.png', alt: 'Mavs' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969565/Brother%20Page/Companies/843487c4-c03d-4150-b073-4a03c2a27db4.png', alt: 'Keurig Dr Pepper' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969639/Brother%20Page/Companies/cb3f5bb7-2c25-4497-857d-9ca51569325f.png', alt: 'Walmart' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969806/Brother%20Page/Companies/73e21920-9d1d-445c-88ab-a5ab8908adcf.png', alt: 'UT Southwestern Medical Center' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969899/Brother%20Page/Companies/eff0e2f8-0844-44b6-9081-1c93c42fdd6a.png', alt: 'Bank of America' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724970250/Brother%20Page/Companies/90aeb29a-edf1-4efd-9fb6-377089d9e298.png', alt: 'IBM' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969945/Brother%20Page/Companies/ebf5e8b5-3532-4867-9b14-b60a0b74c3f0.png', alt: 'Tenet Health' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724969981/Brother%20Page/Companies/a4d079af-4dd2-4863-ae4d-c9059d4c87c5.png', alt: 'GM Financial' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724970038/Brother%20Page/Companies/0e26ec5c-869d-4e4e-bd91-81bfd7dd164e.png', alt: 'EDP Renewables' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724970081/Brother%20Page/Companies/cfee468d-71ef-4d76-afb2-1da729397e28.png', alt: 'Signet Jewelers' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724970141/Brother%20Page/Companies/ea20ad08-9b3e-4fff-8aec-6a840509837a.png', alt: 'Realtor.com' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724970341/Brother%20Page/Companies/8a5118eb-9d6a-4080-9a3d-c2d67316def4.png', alt: 'Country Financial' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724970218/Brother%20Page/Companies/31fec9f2-f883-4780-97a3-8a18d203fe88.png', alt: 'PNC Bank' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1724970281/Brother%20Page/Companies/0e5a44e6-4799-4780-b860-5e8f4ed3ba1e.png', alt: 'Tech Mahindra' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1725403202/Brother%20Page/Companies/2449d2a8-e771-4c1a-a78c-08729a4d2575.png', alt: '7-11' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1725403247/Brother%20Page/Companies/e486c0c3-8914-406e-888e-3dccf6fa81e8.png', alt: 'OGandE' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1725403289/Brother%20Page/Companies/a9de1dc5-9e31-478d-a6a7-dc319a533de3.png', alt: 'Webacy' },
    //{ src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1728060859/Brother%20Page/Companies/occ-logo-color-rgb_uu8x2t.webp', alt: 'the occ' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1728060859/Brother%20Page/Companies/nsf-white_rqjtb4.png', alt: 'nsf' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1728060858/Brother%20Page/Companies/logo.46ab9870_jxl9nd.png', alt: 'Wise assistant' },
    //{ src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1728060860/Brother%20Page/Companies/CSU.TO_BIG-a8c98406_bkwnxt.png', alt: 'constilation software' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1728060857/Brother%20Page/Companies/Outlier_AI-AI_xe8ohg.png', alt: 'outlier ai' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1728060857/Brother%20Page/Companies/DXC_Technology_logo_2021-768x419_cf8wvr.png', alt: 'constilation software' },
  ];

  const rows = 3;
  const logosPerRow = Math.ceil(companyLogos.length / rows);

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center p-6 bg-black">
      <h2 className="text-header1 font-bold font-poppins text-primary text-center mb-6">Our Companies</h2>
      <div className="relative w-full overflow-hidden bg-gray-100">
        <div className="scroll-container">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="scroll">
              {companyLogos
                .slice(logosPerRow * rowIndex, logosPerRow * (rowIndex + 1))
                .concat(companyLogos.slice(logosPerRow * rowIndex, logosPerRow * (rowIndex + 1))) // Duplicate for smooth scroll
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