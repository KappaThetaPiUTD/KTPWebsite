// components/CompanyCollage.js

import Image from 'next/image';
import React from 'react';

const CompanyCollage = () => {
  const companyLogos = [
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740339/Brother%20Page/Companies/40b1d663-d54a-4289-b1a5-60ea9fcb1127.png', alt: 'PWC' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740481/Brother%20Page/Companies/4eaf6b35-4359-4a9e-bdf1-251a207ca19b.png', alt: 'Fannie Mae' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740563/Brother%20Page/Companies/60481dda-7ef5-4542-81e8-3871074f8052.png', alt: 'Verizon' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740401/Brother%20Page/Companies/85c55d3f-cf56-4f9e-a9b9-e51c41834262.png', alt: 'JP Morgan Chase' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740478/Brother%20Page/Companies/aaaf8636-8187-47b8-b03d-3707330e4d2b.png', alt: 'Amazon' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740442/Brother%20Page/Companies/ce95be8c-7b09-4dee-a2e8-621ab9b57be3.png', alt: 'Optiver' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740424/Brother%20Page/Companies/d72e07fb-f448-416e-adb8-d252a456e68d.png', alt: 'Anduril' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740610/Brother%20Page/Companies/5972485c-25e0-4b26-ba4d-ea433c96dec2.png', alt: 'Keurig Dr Pepper' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740712/Brother%20Page/Companies/c7ba39aa-2dee-4dee-9c22-303c52f7067d.png', alt: 'Walmart' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740693/Brother%20Page/Companies/85c3c177-3e32-4847-a082-9cd5f9cb3191.png', alt: 'UT Southwestern Medical Center' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740509/Brother%20Page/Companies/3b9ed2eb-d667-4084-8c5e-ee1fbfa35f5a.png', alt: 'Bank of America' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740277/Brother%20Page/Companies/0454a610-02b9-476f-a1cd-f80328d57e88.png', alt: 'Tenet Health' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740650/Brother%20Page/Companies/1a83e626-bf83-4d80-91bb-2050dcff8dc9.png', alt: 'GM Financial' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740776/Brother%20Page/Companies/199a3005-7b61-4fc4-8d37-6355541ba9aa.png', alt: 'EDP Renewables' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740774/Brother%20Page/Companies/41489de2-087f-4a61-b688-f57f6b793b36.png', alt: 'Signet Jewelers' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740753/Brother%20Page/Companies/cf302150-18b3-4ff7-9480-80234c730ea6.png', alt: 'Realtor.com' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1721740690/Brother%20Page/Companies/5d721243-71b8-41f2-9dd7-2eef3bba9a57.png', alt: 'Country Financial' },


  ];

  return (
    <div className="w-screen h-full flex flex-col justify-center items-center p-6 bg-gray-100">
      <h2 className="text-header2 font-bold font-poppins text-primary text-center mb-6">Alumni</h2>
      <div className="w-screen h-fill bg-gray flex flex-wrap justify-center items-center p-6">
        {companyLogos.map((logo, index) => (
          <div
            key={index}
            className="w-32 h-32 relative m-4 transform transition duration-300 hover:scale-105"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              layout="fill"
              objectFit="contain"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyCollage;