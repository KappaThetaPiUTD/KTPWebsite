//page.jsx

import Image from 'next/image'

const Gallery = () => {
    
    return (
    <div className="w-screen h-screen bg-[#0F0F0F]">
      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center">
        Gallery
      </div>
      <div className="mt-4 mb-8 mx-4">
      <Image src="/white.avif" alt="Afsar" width={500} height={300} />
      </div>
    </div>
  );

}

export default Gallery;