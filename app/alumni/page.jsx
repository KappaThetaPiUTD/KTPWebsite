import Image from "next/image";
import React from "react";

export const metadata = {
  title: "Kappa Theta Pi UTD - Alumni",
  description: "Kappa Theta Pi Alumni",
};

const alumniMembers = [
  {
    name: "Aamir Mohammed",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683105/image_s3dmun.png",
    linkedin: "",
  },
  {
    name: "Aashay Vishwakarma",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683161/AashayHeadshot_n84axq.png",
    linkedin: "https://www.linkedin.com/in/aashayvishwakarma/",
  },
  {
    name: "Aashna Pathi",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683163/AashnaHeadshot_rwzh2y.png",
    linkedin: "",
  },
  {
    name: "Ajay Kumaran",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683119/image_10_misxan.png",
    linkedin: "https://www.linkedin.com/in/ajay-kumaran",
  },
  {
    name: "Ariha Kothari",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207293/Brother%20Page/Actives/ariha_kothari.jpg",
    linkedin: "https://www.linkedin.com/in/arihak/",
  },
  {
    name: "Arya Thombare",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683105/image_24_gb1tt8.png",
    linkedin: "https://www.linkedin.com/in/arya-thombare-83303225b/",
  },
  {
    name: "Avani Mehrotra",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683156/AvaniHeadshot_sxhzel.png",
    linkedin: "https://www.linkedin.com/in/avanimehrotra",
  },
  {
    name: "Ayaan Khan",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190927/Brother%20Page/Actives/IMG_5520_iyzv9s.jpg",
    linkedin: "https://www.linkedin.com/in/ayaan-r-khan/",
  },
  {
    name: "Ethan Varghese",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190963/Brother%20Page/Actives/IMG_5469_sx1vxt.jpg",
    linkedin: "https://www.linkedin.com/in/pakkuu/",
  },
  {
    name: "Hima Nagi Reddy",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683151/HimaHeadshot_vh7tjm.png",
    linkedin: "https://www.linkedin.com/in/hima-nagi-reddy",
  },
  {
    name: "Ishaan Dhandapani",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771191009/Brother%20Page/Actives/IMG_5372_ntqmj1.jpg",
    linkedin: "http://www.linkedin.com/in/ishaandhandapani",
  },
  {
    name: "Kairavi Pandya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683117/image_15_pgpji4.png",
    linkedin: "https://www.linkedin.com/in/kairavi-pandya",
  },
  {
    name: "Kanishk Garg",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Krisha Amaravathi",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683115/image_18_vlsqgo.png",
    linkedin: "http://www.linkedin.com/in/krisha-amaravathi",
  },
  {
    name: "Laiba Piracha",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683141/image_8_klwk6y.png",
    linkedin: "",
  },
  {
    name: "Manasa Paruchuri",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Mansi Cherukupally",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683085/MansiHeadshot_kyrcjw.png",
    linkedin: "https://www.linkedin.com/in/mansi-cherukupally-b399a6214/",
  },
  {
    name: "Mohamed Afsar Harsath Arif",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771191016/Brother%20Page/Actives/IMG_5341_i545ve.jpg",
    linkedin: "",
  },
  {
    name: "Monish Ravishankar",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715884812/Brother%20Page/Alumni/MONISH_HEADSHOT_om9ujn.jpg",
    linkedin: "",
  },
  {
    name: "Nivedh Koya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683150/image_5_tuqtmk.png",
    linkedin: "https://www.linkedin.com/nivedh-koya",
  },
  {
    name: "Rushil Patel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207853/Brother%20Page/Actives/rushil_patel.jpg",
    linkedin: "",
  },
  {
    name: "Sahaj Dahal",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/in/sahaj-dahal-239433240/",
  },
  {
    name: "Sanjana Shangle",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683105/image_25_r2yumm.png",
    linkedin: "http://www.linkedin.com/in/sanjanashangle",
  },
  {
    name: "Shraddha Gangaram",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190834/Brother%20Page/Actives/IMG_5632_t8zmop.jpg",
    linkedin: "",
  },
  {
    name: "Sumi Suseendrababu",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716401955/Brother%20Page/Alumni/sumi_s_hgs2th.jpg",
    linkedin: "",
  },
  {
    name: "Tariq Mahamid",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683082/TariqHeadshot_condk8.png",
    linkedin: "https://www.linkedin.com/in/tariq-mahamid-b316a520a/",
  },
  {
    name: "Venkat Sagi",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683082/VenkatHeadshot_n9o2km.png",
    linkedin: "https://www.linkedin.com/in/venkat-sagi/",
  },
  {
    name: "Wildan Susanto",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683144/image_2_awllqf.png",
    linkedin: "",
  },
  {
    name: "Yeshas Nath",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683065/YeshasHeadshot_kxpvse.png",
    linkedin: "https://www.linkedin.com/in/yeshasnath",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const Alumni = () => {
  return (
    <div className="w-full h-full bg-white pt-24 text-black">
      <div className="text-primary text-header1 font-bold font-poppins flex text-center justify-center items-center">
        Alumni
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 mt-8 mb-20 justify-items-center max-w-5xl mx-auto px-4">
        {alumniMembers.map((member, index) => (
          <div
            key={index}
            className="text-center"
          >
            <div className="relative w-32 h-40 sm:w-40 sm:h-52 mx-auto bg-gray-400 rounded-lg overflow-hidden">
              <Image
                src={member.src}
                alt={`${member.name}`}
                fill
                className="object-cover"
              />
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                
              />
              )}
            </div>
            <div className="mt-2">{member.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alumni;
