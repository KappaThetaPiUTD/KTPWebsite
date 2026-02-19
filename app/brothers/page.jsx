import Image from "next/image";
import React from "react";
import { FaLinkedin } from "react-icons/fa";

export const metadata = {
  title: "Kappa Theta Pi UTD - Brothers",
  description: "Kappa Theta Pi Descripton",
};

const executiveBoardMembers = [
  {
    name: "Mohamed Afsar Harsath Arif",
    position: "President",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276761/Brother%20Page/Executive%20Board/IMG_6821_ynqfbt.jpg",
    linkedin: "https://www.linkedin.com/in/afsararif",
  },
  {
    name: "Vignesh Selvam",
    position: "VP of Internal Affairs",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741221585/Brother%20Page/Executive%20Board/IMG_4351_z0ensz.jpg",
    linkedin: "https://www.linkedin.com/in/vignesh-2004-selvam/",
  },
  {
    name: "Ajay Kumaran",
    position: "VP of External Affairs",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276806/Brother%20Page/Executive%20Board/P10238171_npaldi.jpg",
    linkedin: "https://www.linkedin.com/in/ajay-kumaran",
  },
  {
    name: "Mekha Mathew",
    position: "VP of Social Engagement",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276796/Brother%20Page/Executive%20Board/P1023770_jtxnfl.jpg",
    linkedin: "https://www.linkedin.com/in/mekha-mathew-7402b4275",
  },
  {
    name: "Mansi Cherukupally",
    position: "VP of Finance",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276747/Brother%20Page/Executive%20Board/IMG_4233_troejc.jpg",
    linkedin: "https://www.linkedin.com/in/mansi-cherukupally-b399a6214/",
  },
  {
    name: "Aashay Vishwakarma",
    position: "VP of Professional Development",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276762/Brother%20Page/Executive%20Board/IMG_6826_odqf9u.jpg",
    linkedin: "https://www.linkedin.com/in/aashayvishwakarma/",
  },
  {
    name: "Venkat Sai Eshwar Varma Sagi",
    position: "VP of Technology",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276762/Brother%20Page/Executive%20Board/IMG_6825_khcqhn.jpg",
    linkedin: "https://www.linkedin.com/in/venkat-sagi/",
  },
  {
    name: "Kavinram Senthil",
    position: "VP of Membership",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276796/Brother%20Page/Executive%20Board/P1023742_gqdojj.jpg",
    linkedin: "https://www.linkedin.com/in/kavinram-senthil-640349249/",
  },
  {
    name: "Anvi Siddabhattuni",
    position: "VP of Marketing",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/in/anvi-siddabhattuni/",
  },
];

const directorBoardMembers = [
  {
    name: "Ashrita Dara",
    position: "Director of Social Media",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771192288/Brother%20Page/Actives/IMG_5624_di54se.jpg",
    linkedin: "https://www.linkedin.com/in/ashritadara/",
  },
  
  {
    name: "Yeshwanth Vajinapalli ",
    position: "Director of Recruitment",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190679/Brother%20Page/Actives/IMG_5750_hagvvk.jpg", 
    linkedin: "https://www.linkedin.com/in/yeshwanth-vajinapalli/",
  },
  {
    name: "Abhinav Atluri",
    position: "Director of Web Systems",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190820/Brother%20Page/Actives/IMG_5740_knge0i.jpg", 
    linkedin: "http://linkedin.com/in/abhinav-atluri/",
  },
  {
    name: "Navmi Srithaj",
    position: "Co-Director of Industry Relations",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190844/Brother%20Page/Actives/IMG_5599_dcvebb.jpg",
    linkedin: "https://www.linkedin.com/in/navmi-srithaj/",
  },
  {
    name: "Sahaj Dahal",
    position: "Co-Director of Industry Relations",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190902/Brother%20Page/Actives/IMG_5538_on0oi0.jpg", 
    linkedin: "https://www.linkedin.com/in/sahaj-dahal-239433240/",
  },
  {
    name: "Ethan Philipose",
    position: "Director of Social Logistics",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Ethan's image link
    linkedin: "https://www.linkedin.com/in/ethan-philipose/",
  },

];

const activeMembers = [
  {
    name: "Itbaan Alam",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683119/image_11_uatklb.png",
    linkedin: "http://linkedin.com/in/itbaanalam",
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
    name: "Hima Nagi Reddy",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683151/HimaHeadshot_vh7tjm.png",
    linkedin: "https://www.linkedin.com/in/hima-nagi-reddy",
  },
  {
    name: "Nivedh Koya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741827747/image_5_1_mhdqxz.png",
    linkedin: "https://www.linkedin.com/nivedh-koya",
  },
  {
    name: "Meghana Pula",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683113/image_20_ijskwh.png",
    linkedin: "http://www.linkedin.com/in/sai-meghana-pula",
  },
  {
    name: "Ethan Varghese",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683148/image_4_wvnt8p.png",
    linkedin: "https://www.linkedin.com/in/pakkuu/",
  },
  {
    name: "Aadhav Manimurugan",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683127/image_9_cmr6km.png",
    linkedin: "http://linkedin.com/in/aadhav-",
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
  {
    name: "Joel Philipose",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771193096/Brother%20Page/Actives/IMG_5558_ajgu8v.jpg",
    linkedin: "https://www.linkedin.com/in/joel-philipose/",
  },
  {
    name: "Nihita Soma",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Rahil Islam",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/in/rahil-islam/",
  },
 
  {
    name: "Simon Beyene",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190933/Brother%20Page/Actives/IMG_5527_c7shnm.jpg", 
    linkedin: "https://www.linkedin.com/in/simon-beyene-b948373a1/", 
  },
  {
    name: "Sachin Selvakumar",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190965/Brother%20Page/Actives/IMG_5451_ubtsje.jpg", 
    linkedin: "https://www.linkedin.com/in/sachinselvakumar24/",
  },
  {
    name: "Rishi Ramesh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190974/Brother%20Page/Actives/IMG_5440_miludq.jpg", 
    linkedin: "https://www.linkedin.com/in/seyyonrishiramesh/",
  },
  {
    name: "Ayush Velhal",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771193510/Brother%20Page/Actives/IMG_5563_ugi2ed.jpg", 
    linkedin: "https://www.linkedin.com/in/ayush-velhal/",
  },
  {
    name: "Ayaan Khan",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190927/Brother%20Page/Actives/IMG_5520_iyzv9s.jpg", 
    linkedin: "https://www.linkedin.com/in/ayaan-r-khan/",
  },
  {
    name: "Anvi Siddabhattuni",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Anvi's image URL
    linkedin: "https://www.linkedin.com/in/anvi-siddabhattuni/",
  },

  {
    name: "Aaron Gheevarghese",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771193596/Brother%20Page/Actives/IMG_5572_v5jgz8.jpg", 
    linkedin: "https://www.linkedin.com/in/aarongheevarghese/",
  },
  {
    name: "Krish Patel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190927/Brother%20Page/Actives/IMG_5530_gwhixw.jpg", 
    linkedin: "https://www.linkedin.com/in/krish-patel10/",
  },
   {
    name: "Ariha Kothari",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", 
    linkedin: "https://www.linkedin.com/in/arihak/",
  },
     {
    name: "Arnav Jain",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", 
    linkedin: "https://www.linkedin.com/in/arnavjainpro/",
  },
  {
    name: "Arya Thombare",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771191007/Brother%20Page/Actives/IMG_5348_p7z7ub.jpg", 
    linkedin: "https://www.linkedin.com/in/arya-thombare/",
  },
  {
    name: "Ayushi Deshmukh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190998/Brother%20Page/Actives/IMG_5411_x9dmgh.jpg", 
    linkedin: "https://www.linkedin.com/in/ayushi-deshmukhh/",
  },
  {
    name: "Bhavaneeth Parnapalli",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190953/Brother%20Page/Actives/IMG_5497_tgo41k.jpg", 
    linkedin: "https://www.linkedin.com/in/bhavaneeth-parnapalli-1315862b6/",
  },
  {
    name: "Ishaan Dhandapani",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771191009/Brother%20Page/Actives/IMG_5372_ntqmj1.jpg", 
    linkedin: "https://www.linkedin.com/in/ishaandhandapani/",
  },
  {
    name: "Jashanpreet Singh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", 
    linkedin: "https://www.linkedin.com/in/jashanpreet-singh2026/",
  },
 {
    name: "Jiya Khurana",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190628/Brother%20Page/Actives/IMG_5681_yio6e3.jpg", 
    linkedin: "https://www.linkedin.com/in/jiyakhurana21/",
  },
  {
    name: "Lalith Keertipati",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771276882/Brother%20Page/Actives/IMG_5712_fjmsow.jpg", 
    linkedin: "https://www.linkedin.com/in/lalith-raju-keertipati/",
  },
  {
    name: "Noel Emmanuel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683083/NoelHeadshot_nbv6gg.png", 
    linkedin: "https://www.linkedin.com/in/noel-emmanuel20/",
  },
  {
    name: "Om Pansuriya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771277289/Brother%20Page/Actives/IMG_5588_v1wq7k.jpg", 
    linkedin: "https://www.linkedin.com/in/om-pansuriya-b7aa87148/",
  },
  {
    name: "Pranay Chintakunta",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", 
    linkedin: "https://www.linkedin.com/in/pkc298160/",
  },
  {
    name: "Praneel Sreepada",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771277580/Brother%20Page/Actives/IMG_5702_xqkzil.jpg", 
    linkedin: "https://www.linkedin.com/in/praneelsreepada/",
  },
  {
    name: "Prateek Banda",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", 
    linkedin: "https://www.linkedin.com/in/prateek-banda/",
  },
  {
    name: "Rushil Patel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715962309/Brother%20Page/Actives/Rushil_Patel_Headshot_ncxas2.jpg", 
    linkedin: "https://www.linkedin.com/in/rushil-patel5/",
  },
  {
    name: "Ruthvik Penmatsa",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190823/Brother%20Page/Actives/IMG_5706_pehj8h.jpg", 
    linkedin: "https://www.linkedin.com/in/ruthvikpenmatsa/",
  },
  {
    name: "Shraddha Gangaram",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190834/Brother%20Page/Actives/IMG_5632_t8zmop.jpg", 
    linkedin: "https://www.linkedin.com/in/shraddha-gangaram-1a6394281/",
  },
  {
    name: "Shreyas Ankolekar",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190993/Brother%20Page/Actives/IMG_5392_qkfpuo.jpg", 
    linkedin: "https://www.linkedin.com/in/shreyas-ankolekar/",
  },
   {
    name: "Siri Kishore Dola",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190835/Brother%20Page/Actives/IMG_5646_hiubqi.jpg", 
    linkedin: "https://www.linkedin.com/in/siri-kishore-dola/",
  },
  {
    name: "Tanmayi Addanki",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190850/Brother%20Page/Actives/IMG_5607_fpscrf.jpg", 
    linkedin: "https://www.linkedin.com/in/tanmayiforintern/",
  },
  {
    name: "Viraaj Singh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190894/Brother%20Page/Actives/IMG_5549_yaalv0.jpg", 
    linkedin: "https://www.linkedin.com/in/viraaj-singh-business/",
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
  "Yeshas Nath",
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
  "Venkat Sai Eshwar Varma Sagi",
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
  "Simon Beyene",
].sort((a, b) => a.localeCompare(b));

const epsilonClassMembers = [
  // put names here
  "Ashrita Dara",
  "Bhavaneeth Parnapalli",
  "Ethan Philipose",
  "Jashanpreet Singh",
  "Jiya Khurana",
  "Lalith Keertipati",
  "Navmi Srithaj",
  "Om Pansuriya",
  "Pranay Chintakunta",
  "Prateek Banda",
  "Shraddha Gangaram",
  "Siri Kishore Dola",
  "Tanmayi Addanki",
  "Viraaj Singh",
  "Yeshwanth Vajinapalli"
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
  const epsilonColumns = splitIntoColumns(epsilonClassMembers, 3);


  return (
    <div className="w-screen min-h-screen bg-white pt-24 text-black">
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
                src={member.src}
                class="center"
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
                src={member.src}
                class="center"
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
      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
  Epsilon Class
</div>
<div className="flex justify-center mt-4 mb-20">
  {epsilonColumns.map((column, index) => (
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
