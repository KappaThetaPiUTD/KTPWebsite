import Image from 'next/image';
import React from 'react';

export const metadata = {
  title: "Kappa Theta Pi UTD - Gallery",
  description:
    "A page with pictures of our times together",
};

const Gallery = () => {
  // Array of images with their public IDs from Cloudinary
  const images = [
   // { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850376/Austin%20Trip/100_1531_yphg3y.jpg', alt: 'Image 1' },
   // { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850373/Austin%20Trip/100_1532_kyjzgm.jpg', alt: 'Image 2' },
   // { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1720637478/Austin%20Trip/IMG_1585_tariq_exec_image.jpg', alt: 'Image 3' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714854893/Austin%20Trip/leetcode_weekly_session_images_kqkd9s.jpg', alt: 'leetcode' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714854890/Austin%20Trip/leetcode_tariq_teaching_ozyzaj.jpg', alt: 'tariq teaching' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714855358/Austin%20Trip/first_chapter_meeting_e3yoyf.jpg', alt: 'new gen first chapter meeting' },

   // { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850372/Austin%20Trip/100_1536_zdnmmh.jpg', alt: 'Image 5' },
   // { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850372/Austin%20Trip/100_1537_ji9dto.jpg', alt: 'Image 4' },
   // { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850371/Austin%20Trip/100_1541_taziyw.jpg', alt: 'Image 6' },
    //{ src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850371/Austin%20Trip/100_1538_icfqfn.jpg', alt: 'Image 7' },
   // { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850371/Austin%20Trip/100_1543_eo1niy.jpg', alt: 'Image 8' },
   // { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850368/Austin%20Trip/100_1544_ie0r6k.jpg', alt: 'Image 9' },
   // { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850367/Austin%20Trip/100_1547_krukpz.jpg', alt: 'Image 10' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850366/Gallery/100_1549_hhphkv.jpg', alt: 'Image 12' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850366/Austin%20Trip/100_1555_zr1jtr.jpg', alt: 'Image 13' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714850362/Austin%20Trip/100_1560_ayi2vm.jpg', alt: 'Image 14' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714855358/Austin%20Trip/social_legdri.jpg', alt: 'social valentines day 2024' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714855358/Austin%20Trip/happy_ktp_hcb7r6.jpg', alt: 'happy ktp 2024' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714855358/Austin%20Trip/valentines_day_uno_z3tgnz.jpg', alt: 'social valentines day 2024' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1714855359/Austin%20Trip/ktp_valetines_day_social_affiq_pocker_jmm8u1.jpg', alt: 'social valentines day 2024' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148638/Gallery/DSC07036_hdqm5f.jpg', alt: 'Broken Bow 1' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148639/Gallery/DSC07102_qxiins.jpg', alt: 'Broken Bow 2' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148640/Gallery/DSC07255_kdap01.jpg', alt: 'Broken Bow 3' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148642/Gallery/DSC07272_p7zyce.jpg', alt: 'Broken Bow 4' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148662/Gallery/DSC07295_inag6q.jpg', alt: 'Broken Bow 5' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148663/Gallery/DSC07405_a112x3.jpg', alt: 'Broken Bow 6' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148663/Gallery/F14B0698-D79B-4CB8-9E21-C2B369FD96D1-11728-000001EA10514D98_o1zsvt.jpg', alt: 'Broken Bow 7' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148665/Gallery/IMG_2826_yoirgp.jpg', alt: 'Broken Bow 8' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148686/Gallery/IMG_2850_dspjs8.jpg', alt: 'Broken Bow 10' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741203400/Gallery/IMG_5532_kjtadd_qx0gzi.jpg', alt: 'AWS Pres 4' },

    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148687/Gallery/IMG_2851_bod1x9.jpg', alt: 'Broken Bow 11' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741148688/Gallery/IMG_5220_vyju1x.jpg', alt: 'Truck Eating' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741203133/Gallery/IMG_5506_jwp21u_n0gsyy.jpg', alt: 'AWS Pres 1' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741203249/Gallery/IMG_5517_yg2171_n5nu54.jpg', alt: 'AWS Pres 2' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741203326/Gallery/IMG_5523_djd7nm_uz6snk.jpg', alt: 'AWS Pres 3' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741203400/Gallery/IMG_5532_kjtadd_qx0gzi.jpg', alt: 'AWS Pres 4' },
    { src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1741203490/Gallery/IMG_5680_uv7qbu_sgis8b.jpg', alt: 'Halloween' },
    

  ];

  return (
    <div className="w-screen h-full bg-white pt-24">
      <div className="text-primary text-header1 font-bold font-poppins flex justify-center">
        Gallery
      </div>
      <div className="text-accent text-center font-georgia text-header4 mt-2">
        We would like to thank our photographers Tariq Mahamid and Manasa Paruchuri!
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {images.map((img, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg">
            <div className="group relative">
              <Image
                src={img.src}
                alt={img.alt}
                width={500}
                height={300}
                
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
