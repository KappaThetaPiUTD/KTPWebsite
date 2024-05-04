//app/gallery/page.jsx
import Image from 'next/image';
import React from 'react';
import cloudinary from '/Users/kairavipandya/Documents/Coding Projects/KTPWebsite/utils/cloudinary.js'; // Path to your Cloudinary configuration


const Gallery = () => {
  // Array of images with their public IDs from Cloudinary
  const images = [
      { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714846766/first_picture_signne.png', alt: 'First Picture' },
      { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714846761/last_one_mlvdhv.png', alt: 'Last One' },
      { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714846762/Rushil_Patel_n0y7xc.png', alt: 'Rushil Patel' },
      { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714846763/Laiba_Piracha_p1zoqv.png', alt: 'Laiba Piracha' },
      { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714846763/Tariq_Mahamid_nr6jli.png', alt: 'Tariq Mahamid' }
  ];

  return (
      <div className="w-screen h-screen bg-[#0F0F0F]">
          <div className="text-secondary text-header1 font-bold font-poppins flex justify-center">
              Gallery
          </div>
          <div className="grid grid-cols-3 gap-4 p-4">
              {images.map((img, index) => (
                  <div key={index} className="overflow-hidden">
                      <Image src={img.src} alt={img.alt} width={500} height={300} layout='responsive' />
                  </div>
              ))}
          </div>
      </div>
  );
}
export default Gallery;
