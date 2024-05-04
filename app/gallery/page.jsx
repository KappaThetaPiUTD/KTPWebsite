import Image from 'next/image';
import React from 'react';

const Gallery = () => {
  // Array of images with their public IDs from Cloudinary
  const images = [
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850376/Austin%20Trip/100_1531_yphg3y.jpg', alt: 'Image 1' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850373/Austin%20Trip/100_1532_kyjzgm.jpg', alt: 'Image 2' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850372/Austin%20Trip/100_1535_kyvpmo.jpg', alt: 'Image 3' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850372/Austin%20Trip/100_1537_ji9dto.jpg', alt: 'Image 4' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850372/Austin%20Trip/100_1536_zdnmmh.jpg', alt: 'Image 5' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850371/Austin%20Trip/100_1541_taziyw.jpg', alt: 'Image 6' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850371/Austin%20Trip/100_1538_icfqfn.jpg', alt: 'Image 7' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850371/Austin%20Trip/100_1543_eo1niy.jpg', alt: 'Image 8' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850368/Austin%20Trip/100_1544_ie0r6k.jpg', alt: 'Image 9' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850367/Austin%20Trip/100_1547_krukpz.jpg', alt: 'Image 10' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850366/Austin%20Trip/100_1549_hhphkv.jpg', alt: 'Image 12' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850366/Austin%20Trip/100_1555_zr1jtr.jpg', alt: 'Image 13' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850362/Austin%20Trip/100_1560_ayi2vm.jpg', alt: 'Image 14' },
  ];

  return (
    <div className="w-screen h-full bg-[#0F0F0F]">
      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center">
        Gallery
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="relative overflow-hidden rounded-lg flex justify-center items-center">
          <div className="text-white bg-gray-800 p-4 rounded-lg border border-white">
            <p className="text-center">Our Photographers</p>
          </div>
        </div>
                <div className="relative overflow-hidden rounded-lg flex justify-center items-center">
          <div className="text-white bg-gray-800 p-4 rounded-lg border border-white">
            <p className="text-center">KTP Retreat</p>
          </div>
        </div>
        {images.map((img, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg">
            <div className="group relative">
              <Image
                src={img.src}
                alt={img.alt}
                width={500}
                height={300}
                layout='responsive'
                className="transition-all duration-300 rounded-lg group-hover:brightness-100"
              />
              <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <a href={img.src} download={img.alt} className="text-white rounded-full p-2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;