"use client"; // Marking this as a client component

import Image from 'next/image';
import React from 'react';

const CompanyCollage = () => {
  const companyLogos = [
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721741774/Brother%20Page/Companies/a0efc1c5-0849-416b-b066-f0c8a13bfc50.png', alt: 'PWC' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721866520/Brother%20Page/Companies/36df9108-2cc6-4485-a25a-069aba492aad.png', alt: 'Fannie Mae' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740563/Brother%20Page/Companies/60481dda-7ef5-4542-81e8-3871074f8052.png', alt: 'Verizon' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721868503/Brother%20Page/Companies/0272b14d-e99c-4896-9603-b4325910b605.png', alt: 'JP Morgan Chase' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721866901/Brother%20Page/Companies/e81c2cab-3c7b-4f9b-a27e-f02aa2500ccd.png', alt: 'Amazon' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721866119/Brother%20Page/Companies/4524b24c-b052-4788-872e-b6cf4013be49.png', alt: 'Optiver' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721866020/Brother%20Page/Companies/c0bd8d55-5632-4461-8bdb-3705920e7524.png', alt: 'Anduril' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721867795/Brother%20Page/Companies/1bb74288-111a-4296-80fb-9bb52cab969f.png', alt: 'Keurig Dr Pepper' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721867216/Brother%20Page/Companies/6e0a9e8e-795d-4c91-8c28-8cfcb40c958d.png', alt: 'Walmart' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721867842/Brother%20Page/Companies/11607b70-e4f2-453e-92d2-915b11cd5ead.png', alt: 'UT Southwestern Medical Center' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721866167/Brother%20Page/Companies/5cda8adf-8bb0-4a3c-b701-196bc1788b84.png', alt: 'Bank of America' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721867014/Brother%20Page/Companies/f08657ba-e04f-40c0-a3fe-346d8201bd0d.png', alt: 'Tenet Health' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721867733/Brother%20Page/Companies/5c3a3033-846f-4514-bd22-55edc80efd17.png', alt: 'GM Financial' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721868033/Brother%20Page/Companies/cdf49055-2e52-4390-a25a-ae4b416bcb5a.png', alt: 'EDP Renewables' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721867895/Brother%20Page/Companies/d1c3a3c0-a4ee-4681-8afa-7b99aa006306.png', alt: 'Signet Jewelers' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721866976/Brother%20Page/Companies/db09a23a-c4b8-4c73-8864-d2b45621271f.png', alt: 'Realtor.com' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721867966/Brother%20Page/Companies/b9d5c613-4dc7-4a77-8f91-76692dc26870.png', alt: 'Country Financial' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721866217/Brother%20Page/Companies/42f28b13-b68e-4999-8d4b-3f9d5fd0422b.png', alt: 'PNC Bank' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721868146/Brother%20Page/Companies/01020bca-981b-4549-98d2-4f5fcd1edb05.png', alt: 'IBM' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721868322/Brother%20Page/Companies/abc1a8dd-6b9d-4fa5-86c7-05061e779830.png', alt: 'PNC Bank' },
  ];

  const rows = 3;
  const logosPerRow = Math.ceil(companyLogos.length / rows);

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center p-6 bg-gray-100">
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