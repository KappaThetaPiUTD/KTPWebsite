"use client";

import React, { useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { trackEvent } from "../../lib/analytics";

const photos = [
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714854893/Austin%20Trip/leetcode_weekly_session_images_kqkd9s.jpg", width: 3024, height: 4032, alt: "leetcode" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714854890/Austin%20Trip/leetcode_tariq_teaching_ozyzaj.jpg", width: 1130, height: 1506, alt: "tariq teaching" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714855358/Austin%20Trip/first_chapter_meeting_e3yoyf.jpg", width: 1130, height: 1506, alt: "new gen first chapter meeting" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714850366/Gallery/100_1549_hhphkv.jpg", width: 4608, height: 3456, alt: "Image 12" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714850366/Austin%20Trip/100_1555_zr1jtr.jpg", width: 4608, height: 3456, alt: "Image 13" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714850362/Austin%20Trip/100_1560_ayi2vm.jpg", width: 4608, height: 3456, alt: "Image 14" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714855358/Austin%20Trip/social_legdri.jpg", width: 2260, height: 1506, alt: "social valentines day 2024" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714855358/Austin%20Trip/happy_ktp_hcb7r6.jpg", width: 2260, height: 1506, alt: "happy ktp 2024" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714855358/Austin%20Trip/valentines_day_uno_z3tgnz.jpg", width: 2260, height: 1506, alt: "social valentines day 2024" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1714855359/Austin%20Trip/ktp_valetines_day_social_affiq_pocker_jmm8u1.jpg", width: 2260, height: 1506, alt: "social valentines day 2024" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148638/Gallery/DSC07036_hdqm5f.jpg", width: 5472, height: 3648, alt: "Broken Bow 1" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148639/Gallery/DSC07102_qxiins.jpg", width: 5472, height: 3648, alt: "Broken Bow 2" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148640/Gallery/DSC07255_kdap01.jpg", width: 5472, height: 3648, alt: "Broken Bow 3" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148642/Gallery/DSC07272_p7zyce.jpg", width: 5472, height: 3648, alt: "Broken Bow 4" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148662/Gallery/DSC07295_inag6q.jpg", width: 5472, height: 3648, alt: "Broken Bow 5" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148663/Gallery/DSC07405_a112x3.jpg", width: 5472, height: 3648, alt: "Broken Bow 6" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148663/Gallery/F14B0698-D79B-4CB8-9E21-C2B369FD96D1-11728-000001EA10514D98_o1zsvt.jpg", width: 4032, height: 2688, alt: "Broken Bow 7" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148665/Gallery/IMG_2826_yoirgp.jpg", width: 4032, height: 2268, alt: "Broken Bow 8" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148686/Gallery/IMG_2850_dspjs8.jpg", width: 4032, height: 2268, alt: "Broken Bow 10" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741203400/Gallery/IMG_5532_kjtadd_qx0gzi.jpg", width: 4032, height: 3024, alt: "AWS Pres 4" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148687/Gallery/IMG_2851_bod1x9.jpg", width: 4032, height: 2268, alt: "Broken Bow 11" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741148688/Gallery/IMG_5220_vyju1x.jpg", width: 3024, height: 4032, alt: "Truck Eating" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741203133/Gallery/IMG_5506_jwp21u_n0gsyy.jpg", width: 3024, height: 4032, alt: "AWS Pres 1" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741203249/Gallery/IMG_5517_yg2171_n5nu54.jpg", width: 3024, height: 4032, alt: "AWS Pres 2" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741203326/Gallery/IMG_5523_djd7nm_uz6snk.jpg", width: 3024, height: 4032, alt: "AWS Pres 3" },
  { src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741203490/Gallery/IMG_5680_uv7qbu_sgis8b.jpg", width: 3024, height: 4032, alt: "Halloween" },
];

// Full-view slides for the lightbox: cap width for fast loading (Cloudinary
// downscales only, with automatic quality/format).
const slides = photos.map((p) => ({
  src: p.src.replace("/upload/", "/upload/c_limit,w_1920,q_auto,f_auto/"),
  alt: p.alt,
  width: p.width,
  height: p.height,
}));

const Gallery = () => {
  const [index, setIndex] = useState(-1);

  return (
    <div className="w-full h-full bg-white pt-24">
      <div className="text-primary text-header1 font-bold font-poppins flex justify-center">
        Gallery
      </div>
      <div className="text-accent text-center font-georgia text-header4 mt-2 px-4">
        We would like to thank our photographers Tariq Mahamid and Manasa Paruchuri!
      </div>
      <div className="max-w-6xl mx-auto p-4">
        <PhotoAlbum
          layout="rows"
          photos={photos}
          spacing={12}
          targetRowHeight={260}
          defaultContainerWidth={1120}
          renderPhoto={({ photo, layout, renderDefaultPhoto, wrapperStyle }) => (
            <div
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              style={wrapperStyle}
              onClick={() => {
                trackEvent("gallery_open", { photo: photo.alt });
                setIndex(layout.index);
              }}
            >
              {renderDefaultPhoto({ wrapped: true })}
              <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <a
                  href={photo.src.replace("/upload/", "/upload/fl_attachment/")}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex text-white rounded-full p-2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100 transition-colors"
                  aria-label={`Download ${photo.alt}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </svg>
                </a>
              </div>
            </div>
          )}
        />
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom, Counter]}
      />
    </div>
  );
};

export default Gallery;
