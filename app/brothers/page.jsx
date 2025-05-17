import Image from "next/image";
import React from "react";
import { FaLinkedin } from "react-icons/fa"; 

export const metadata = {
  title: "Kappa Theta Pi UTD - Brothers",
  description: "Kappa Theta Pi Descripton",
};

const executiveBoardMembers = [
  {
    name: "Ethan Lobo",
    position: "President",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683155/EthanLoboHeadshot_f7pcoz.png",
    linkedin: "https://www.linkedin.com/in/ethanlobo",
  },
  // {
  //   name: "Tariq Mahamid",
  //   position: "VP of Technology",
  //   src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716144869/Brother%20Page/Executive%20Board/Tariq_mxviux.jpg",
  //   linkedin: "https://www.linkedin.com/in/tariq-mahamid-b316a520a/",
  // },
  {
    name: "Afsar Arif",
    position: "VP of Internal Affairs",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683145/image_3_u0bo8p.png",
    linkedin: "https://www.linkedin.com/in/afsararif",
  },
  {
    name: "Avani Mehrotra",
    position: "VP of Engagement",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683156/AvaniHeadshot_sxhzel.png",
    linkedin: "https://www.linkedin.com/in/avani-mehrotra/",
  },
  {
    name: "Laiba Piracha",
    position: "VP of Membership",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683141/image_8_klwk6y.png",
    linkedin: "https://www.linkedin.com/in/laibapiracha",
  },
  {
    name: "Rushil Patel",
    position: "VP of Professional Development",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683106/image_23_iqhjzf.png",
    linkedin: "https://www.linkedin.com/in/rushil-patel5/",
  },
  {
    name: "Arya Thombre",
    position: "VP of Communications",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683105/image_24_gb1tt8.png",
    linkedin: "https://www.linkedin.com/in/arya-thombare-83303225b/",
  },
];

const directorBoardMembers = [
  {
    name: "Venkat Sai Eshwar Varma Sagi",
    position: "Director of Tech",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683082/VenkatHeadshot_n9o2km.png",
    linkedin: "https://www.linkedin.com/in/venkat-sagi/",
  },
  {
    name: "Aamir Mohammed",
    position: "Director of Finance",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683105/image_s3dmun.png",
    linkedin: "https://www.linkedin.com/in/aamirmohammedd",
  },
  {
    name: "Kavinram Senthil",
    position: "Director of Rush",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683144/image_6_kpccke.png",
    linkedin: "https://www.linkedin.com/in/kavinram-senthil-640349249/",
  },
  {
    name: "Ajay Kumaran",
    position: "Co-Director of Social Media",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683119/image_10_misxan.png",
    linkedin: "https://www.linkedin.com/in/ajay-kumaran",
  },
  {
    name: "Vadhanaa Venkatakrishnan",
    position: "Co-Director of Social Media",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683116/image_17_appdpu.png",
    linkedin: "https://www.linkedin.com/in/vadhanaavenkatakrishnan",
  },  

]

const activeMembers = [
  {
    name: "Mansi Cherukupally",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683085/MansiHeadshot_kyrcjw.png",
    linkedin: "https://www.linkedin.com/in/mansi-cherukupally-b399a6214/",
  },
  {
    name: "Mekha Mathew",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683113/image_21_gig0ha.png",
    linkedin: "https://www.linkedin.com/in/mekha-mathew-7402b4275",
  },
  {
    name: "Kairavi Pandya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741828016/Kairavi_Pandya_Headshot_sgl4z0.jpg",
    linkedin: "https://www.linkedin.com/in/kairavi-pandya",
  },
  {
    name: "Sumedha Suseendrababu",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716401955/Brother%20Page/Actives/sumi_s_hgs2th.jpg",
    linkedin: "https://www.linkedin.com/in/sumedhasuseendrababu",
  },
  {
    name: "Itbaan Alam",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683119/image_11_uatklb.png",
    linkedin: "http://linkedin.com/in/itbaanalam",
  },
  {
    name: "Wildan Susanto",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683144/image_2_awllqf.png",
    linkedin: "https://www.linkedin.com/in/wildan-susanto/",
  },
  {
    name: "Aashay Vishwakarma",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683161/AashayHeadshot_n84axq.png",
    linkedin: "https://www.linkedin.com/in/aashayvishwakarma/",
  },
  {
    name: "Yeshas Nath",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683065/YeshasHeadshot_kxpvse.png",
    linkedin: "https://www.linkedin.com/in/yeshasnath",
  },
  {
    name: "Aman Balam",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683157/AmanHeadshot_rgmejh.png",
    linkedin: "https://www.linkedin.com/in/aman-balam-838b32214",
  },
  {
    name: "Sanjana Shangle",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683105/image_25_r2yumm.png",
    linkedin: "http://www.linkedin.com/in/sanjanashangle",
  },
  {
    name: "Vignesh Selvam",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741221585/IMG_4351_z0ensz.jpg",
    linkedin: "https://www.linkedin.com/in/vignesh-2004-selvam/",
  },
  {
    name: "Hima Nagi Reddy",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683151/HimaHeadshot_vh7tjm.png",
    linkedin: "https://www.linkedin.com/in/hima-nagi-reddy",
  },
  {
    name: "Krisha Amaravathi",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683115/image_18_vlsqgo.png",
    linkedin: "http://www.linkedin.com/in/krisha-amaravathi",
  },
  {
    name: "Noel Emmanuel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683083/NoelHeadshot_nbv6gg.png",
    linkedin: "http://linkedin.com/in/noel-emmanuel20",
  },
  {
    name: "Nivedh Koya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741827747/image_5_1_mhdqxz.png",
    linkedin: "https://www.linkedin.com/nivedh-koya",
  },
  {
    name: "Aashna Pathi",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683163/AashnaHeadshot_rwzh2y.png",
    linkedin: "http://linkedin.com/in/aashna-pathi",
  },
  {
    name: "Meghana Pula",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683113/image_20_ijskwh.png",
    linkedin: "http://www.linkedin.com/in/sai-meghana-pula",
  },
  {
    name: "Ayushi Deshmukh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683114/image_19_ywfpdt.png",
    linkedin: "https://www.linkedin.com/in/ayushi-deshmukhh/",
  },
  {
    name: "Ethan Varghese",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683148/image_4_wvnt8p.png",
    linkedin: "https://www.linkedin.com/in/pakkuu/",
  },
  {
    name: "Ishaan Dhandapani",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "http://www.linkedin.com/in/ishaandhandapani",
  }, 
  {
    name: "Aadhav Manimurugan",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683127/image_9_cmr6km.png",
    linkedin: "http://linkedin.com/in/aadhav-",
  },  
  {
    name: "Bhavya Rayankula",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683116/image_16_oag2bh.png",
    linkedin: "http://www.linkedin.com/in/bhavya-rayankula-37219a1b9",
  },  
  {
    name: "Shreyas Ankolekar",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683141/image_7_jjoa5d.png",
    linkedin: "https://www.linkedin.com/in/shreyas-ankolekar-b55851325/",
  },  
  {
    name: "Mohammed Faadil Khan",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683151/FaadilHeadshot_t5xhvb.png",
    linkedin: "https://www.linkedin.com/in/mohammed-faadil-khan-6a196b287/",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const alphaClassMembers = [
  "Aashna Pathi",
  "Ethan Lobo",
  "Kairavi Pandya",
  "Kanishk Garg",
  "Raghav Pillai",
  "Manasa Paruchuri",
  "Sanjana Shangle",
  "Yeshas Nath"
].sort((a, b) => a.localeCompare(b));

const betaClassMembers = [
  "Arya Thombre",
  "Avani Mehrotra",
  "Ethan Varghese",
  "Hima Nagi Reddy",
  "Krisha Amaravathi",
  "Laiba Piracha",
  "Mansi Cherukupally",
  "Mohamed Afsar Harsath Arif",
  "Monish Ravishankar",
  "Nivedh Koya",
  "Rushil Patel",
  "Sumedha Suseendrababu",
  "Tariq Mahamid",
  "Wildan Susanto",
].sort((a, b) => a.localeCompare(b));

const gammaClassMembers = [
  "Aadhav Manimurugan",
  "Aamir Mohammed",
  "Aashay Vishwakarma",
  "Aman Balam",
  "Ayushi Deshmukh",
  "Ajay Kumaran",
  "Bhavya Rayankula",
  "Ishaan Dhandapani",
  "Itbaan Alam",
  "Kavinram Senthil",
  "Meghana Pula",
  "Mekha Mathew",
  "Mohammed Faadhil Khan",
  "Noel Emmanuel",
  "Shreyas Ankolekar",
  "Vadhanna Venkatakrishnan",
  "Vignesh Selvam",
  "Venkat Sai Eshwar Varma Sagi"
].sort((a, b) => a.localeCompare(b));

const deltaClassMembers = [
 "Aaron Gheevarghese",
 "Abdul Qazzafi",
 "Abhinav Atluri",
 "Aditya Dixit",
 "Anvi Siddabhattuni",
 "Ariha Kothari",
 "Arnav Jain",
 "Ayaan Khan",
 "Ayush Velhal",
 "Jeevika Balaji",
 "Joel Philipose",
 "Krish Patel",
 "Nihita Soma",
 "Praneel Sreepada",
 "Rahil Islam",
 "Rishi Ramesh",
 "Ruthvik Penmatsa",
 "Sachin Selvakumar",
 "Sahaj Dahal",
 "Simon Beyene"
].sort((a, b) => a.localeCompare(b));

const splitIntoColumns = (arr, columns) => {
  const result = [];
  const columnSize = Math.ceil(arr.length / columns);

  for (let i = 0; i < columns; i++) {
    result.push(arr.slice(i * columnSize, (i + 1) * columnSize));
  }

  return result;
};

const Brother = () => {
  const alphaColumns = splitIntoColumns(alphaClassMembers, 3);
  const betaColumns = splitIntoColumns(betaClassMembers, 3);
  const gammaColumns = splitIntoColumns(gammaClassMembers, 3);
  const deltaColumns = splitIntoColumns(deltaClassMembers, 3);

  return (
    <div className="w-screen h-full bg-white pt-24 text-black">
      <div className="text-primary text-header1 font-bold font-poppins flex text-center justify-center items-center">
        Executive Board
      </div>
      <div className="flex flex-wrap justify-center mt-8">
        {executiveBoardMembers.map((member, index) => (
          <div
            key={index}
            className="m-4 text-center"
            style={{ maxWidth: "calc(100% - 2rem)" }}
          >
            <div className="relative w-40 h-40 mx-auto bg-gray-400 rounded-lg overflow-hidden">
              <Image
                src={member.src} class="center"
                alt={`${member.name} - ${member.position}`}
                fill
                className="object-cover"
              />
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <FaLinkedin className="text-black text-4xl" />
              </a>
            </div>
            <div className="mt-2">{member.name}</div>
            <div className="text-sm text-gray-400">{member.position}</div>
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex text-center justify-center items-center">
        Director Board
      </div>
      <div className="flex flex-wrap justify-center mt-8">
        {directorBoardMembers.map((member, index) => (
          <div
            key={index}
            className="m-4 text-center"
            style={{ maxWidth: "calc(100% - 2rem)" }}
          >
            <div className="relative w-40 h-40 mx-auto bg-gray-400 rounded-lg overflow-hidden">
              <Image
                src={member.src} class="center"
                alt={`${member.name} - ${member.position}`}
                fill
                className="object-cover"
              />
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <FaLinkedin className="text-black text-4xl" />
              </a>
            </div>
            <div className="mt-2">{member.name}</div>
            <div className="text-sm text-gray-400">{member.position}</div>
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-16">
        Actives
      </div>
      <div className="flex flex-wrap justify-center mt-8">
        {activeMembers.map((member, index) => (
          <div
            key={index}
            className="m-4 text-center"
            style={{ maxWidth: "calc(100% - 2rem)" }}
          >
            <div className="relative w-40 h-40 mx-auto bg-gray-400 rounded-lg overflow-hidden">
              <Image
                src={member.src}
                alt={`${member.name}`}
                class="center"
                fill
                className="object-cover"
              />
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <FaLinkedin className="text-white text-4xl" />
              </a>
            </div>
            <div className="mt-2">{member.name}</div>
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Alpha Class
      </div>
      <div className="flex justify-center mt-4">
        {alphaColumns.map((column, index) => (
          <div key={index} className="mx-4">
            {column.map((member, idx) => (
              <div key={idx} className="m-2 text-center">
                {member}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Beta Class
      </div>
      <div className="flex justify-center mt-4">
        {betaColumns.map((column, index) => (
          <div key={index} className="mx-4">
            {column.map((member, idx) => (
              <div key={idx} className="m-2 text-center">
                {member}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Gamma Class
      </div>
      <div className="flex justify-center mt-4 mb-20">
        {gammaColumns.map((column, index) => (
          <div key={index} className="mx-4">
            {column.map((member, idx) => (
              <div key={idx} className="m-2 text-center">
                {member}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Delta Class
      </div>
      <div className="flex justify-center mt-4 mb-20">
        {deltaColumns.map((column, index) => (
          <div key={index} className="mx-4">
            {column.map((member, idx) => (
              <div key={idx} className="m-2 text-center">
                {member}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brother;