import Image from "next/image";
import React from "react";
import { FaLinkedin } from "react-icons/fa";

export const metadata = {
  title: "Kappa Theta Pi UTD - Alumni",
  description: "Kappa Theta Pi Alumni",
};

const alumniMembers = [
  {
    name: "Aamir Mohammed",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Aashay Vishwakarma",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276762/IMG_6826_odqf9u.jpg",
    linkedin: "https://www.linkedin.com/in/aashayvishwakarma/",
  },
  {
    name: "Aashna Pathi",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Ajay Kumaran",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276806/P10238171_npaldi.jpg",
    linkedin: "https://www.linkedin.com/in/ajay-kumaran",
  },
  {
    name: "Ariha Kothari",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/in/arihak/",
  },
  {
    name: "Arya Thombare",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683105/image_24_gb1tt8.png",
    linkedin: "https://www.linkedin.com/in/arya-thombare-83303225b/",
  },
  {
    name: "Avani Mehrotra",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Ayaan Khan",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/in/ayaan-r-khan/",
  },
  {
    name: "Ethan Varghese",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683148/image_4_wvnt8p.png",
    linkedin: "https://www.linkedin.com/in/pakkuu/",
  },
  {
    name: "Hima Nagi Reddy",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683151/HimaHeadshot_vh7tjm.png",
    linkedin: "https://www.linkedin.com/in/hima-nagi-reddy",
  },
  {
    name: "Ishaan Dhandapani",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "http://www.linkedin.com/in/ishaandhandapani",
  },
  {
    name: "Kairavi Pandya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
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
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Manasa Paruchuri",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Mansi Cherukupally",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276747/IMG_4233_troejc.jpg",
    linkedin: "https://www.linkedin.com/in/mansi-cherukupally-b399a6214/",
  },
  {
    name: "Mohamed Afsar Harsath Arif",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Monish Ravishankar",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Nivedh Koya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741827747/image_5_1_mhdqxz.png",
    linkedin: "https://www.linkedin.com/nivedh-koya",
  },
  {
    name: "Rushil Patel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
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
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Sumi Suseendrababu",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Tariq Mahamid",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683082/TariqHeadshot_condk8.png",
    linkedin: "https://www.linkedin.com/in/tariq-mahamid-b316a520a/",
  },
  {
    name: "Venkat Sai Eshwar Varma Sagi",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276762/IMG_6825_khcqhn.jpg",
    linkedin: "https://www.linkedin.com/in/venkat-sagi/",
  },
  {
    name: "Wildan Susanto",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
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
    <div className="w-screen h-full bg-white pt-24 text-black">
      <div className="text-primary text-header1 font-bold font-poppins flex text-center justify-center items-center">
        Alumni
      </div>
      <div className="flex flex-wrap justify-center mt-8 mb-20">
        {alumniMembers.map((member, index) => (
          <div
            key={index}
            className="m-4 text-center group"
            style={{ maxWidth: "calc(100% - 2rem)" }}
          >
            <div className="relative w-40 h-40 mx-auto bg-gray-400 rounded-lg overflow-hidden">
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
                  className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <FaLinkedin className="text-white text-4xl" />
                </a>
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
