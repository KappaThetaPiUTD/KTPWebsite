import Image from "next/image";
import React from "react";
import { FaLinkedin } from "react-icons/fa";

export const metadata = {
  title: "Kappa Theta Pi UTD - Brothers",
  description: "Kappa Theta Pi Descripton",
};

const executiveBoardMembers = [
  {
    name: "Kavin Senthil",
    position: "President",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190975/Brother%20Page/Actives/IMG_5423_fxoxkr.jpg",
    linkedin: "", // TODO: add Kavin Senthil's LinkedIn URL
  },
  {
    name: "Ajay Kumaran",
    position: "VP of External Affairs",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276806/P10238171_npaldi.jpg",
    linkedin: "https://www.linkedin.com/in/ajay-kumaran",
  },
  {
    name: "Mekha Mathew",
    position: "VP of Social Engagement",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276796/P1023770_jtxnfl.jpg",
    linkedin: "https://www.linkedin.com/in/mekha-mathew-7402b4275",
  },
  {
    name: "Mansi Cherukupally",
    position: "VP of Finance",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276747/IMG_4233_troejc.jpg",
    linkedin: "https://www.linkedin.com/in/mansi-cherukupally-b399a6214/",
  },
  {
    name: "Aashay Vishwakarma",
    position: "VP of Professional Development",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276762/IMG_6826_odqf9u.jpg",
    linkedin: "https://www.linkedin.com/in/aashayvishwakarma/",
  },
  {
    name: "Venkat Sai Eshwar Varma Sagi",
    position: "VP of Technology",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276762/IMG_6825_khcqhn.jpg",
    linkedin: "https://www.linkedin.com/in/venkat-sagi/",
  },
  {
    name: "Kavinram Senthil",
    position: "VP of Membership",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1756276796/P1023742_gqdojj.jpg",
    linkedin: "https://www.linkedin.com/in/kavinram-senthil-640349249/",
  },
];

const directorBoardMembers = [
  {
    name: "Ayushi Deshmukh",
    position: "Director of External Affairs",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683114/image_19_ywfpdt.png",
    linkedin: "https://www.linkedin.com/in/ayushi-deshmukhh/",
  },
  {
    name: "Vignesh Selvam",
    position: "Director of Internal Affairs",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741221585/IMG_4351_z0ensz.jpg",
    linkedin: "https://www.linkedin.com/in/vignesh-2004-selvam/",
  },
  {
    name: "Ishaan Dhandapani",
    position: "Director of Standards",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "http://www.linkedin.com/in/ishaandhandapani",
  },
  {
    name: "Ariha Kothari",
    position: "Director of Standards",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Ariha's image link
    linkedin: "https://www.linkedin.com/in/arihak/",
  },
  {
    name: "Praneel Sreepada",
    position: "Director of Recruitment",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Praneel's image link
    linkedin: "https://www.linkedin.com/in/praneelsreepada/",
  },
  {
    name: "Abhinav Atluri",
    position: "Director of Industry Relations",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Abhi's image link
    linkedin: "http://linkedin.com/in/abhinav-atluri/",
  },

  {
    name: "Noel Emmanuel",
    position: "Director of Career Development",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683083/NoelHeadshot_nbv6gg.png",
    linkedin: "http://linkedin.com/in/noel-emmanuel20",
  },
  {
    name: "Ruthvik Penmatsa",
    position: "Director of Finance",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Ruthvik's image link
    linkedin: "https://www.linkedin.com/in/ruthvikpenmatsa/",
  },
  {
    name: "Vignesh Selvam",
    position: "Director of Social Logistics",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1741221585/IMG_4351_z0ensz.jpg",
    linkedin: "https://www.linkedin.com/in/vignesh-2004-selvam/",
  },
  {
    name: "Arnav Jain",
    position: "Director of Web Systems",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Arnav's image link
    linkedin: "https://www.linkedin.com/in/arnavjainpro/",
  },
  {
    name: "Arya Thombre",
    position: "Director of Technical Development",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683105/image_24_gb1tt8.png",
    linkedin: "https://www.linkedin.com/in/arya-thombare-83303225b/",
  },
];

const activeMembers = [
  {
    name: "Itbaan Alam",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683119/image_11_uatklb.png",
    linkedin: "http://linkedin.com/in/itbaanalam",
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
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Nihita Soma",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Rahil Islam",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Tariq Mahamid",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716144869/Brother%20Page/Executive%20Board/Tariq_mxviux.jpg",
    linkedin: "https://www.linkedin.com/in/tariq-mahamid-b316a520a/",
  },
  {
    name: "Simon Beyene",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Simon's image URL
    linkedin: "", // Add Simon's LinkedIn URL
  },
  {
    name: "Sahaj Dahal",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Sahaj's image URL
    linkedin: "https://www.linkedin.com/in/sahaj-dahal-239433240/",
  },
  {
    name: "Sachin Selvakumar",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Sachin's image URL
    linkedin: "https://www.linkedin.com/in/sachinselvakumar24/",
  },
  {
    name: "Rishi Ramesh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Rishi's image URL
    linkedin: "https://www.linkedin.com/in/seyyonrishiramesh/",
  },
  {
    name: "Jeevika Balaji",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Jeevika's image URL
    linkedin: "https://www.linkedin.com/in/jeevika-balaji-a71b67240/",
  },
  {
    name: "Ayush Velhal",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Ayush's image URL
    linkedin: "https://www.linkedin.com/in/ayush-velhal/",
  },
  {
    name: "Ayaan Khan",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Ayaan's image URL
    linkedin: "https://www.linkedin.com/in/ayaan-r-khan/",
  },
  {
    name: "Anvi Siddabhattuni",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Anvi's image URL
    linkedin: "https://www.linkedin.com/in/anvi-siddabhattuni/",
  },

  {
    name: "Aaron Gheevarghese",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Aaron's image URL
    linkedin: "https://www.linkedin.com/in/aarongheevarghese/",
  },

  {
    name: "Krish Patel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png", // Add Aaron's image URL
    linkedin: "https://www.linkedin.com/in/krish-patel10/",
  },
  {
    name: "Aarav Ashok",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Aashini Chalasani",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Afeef Zarraf",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Anya Konda",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Ashrita Dara",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Bhavaneeth Parnapalli",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Ethan Philipose",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Hemant Pacha",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Jashanpreet Singh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Jiya Khurana",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Jonathan Ebenezer",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Kida Khanooni",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Kushagra Mathur",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Lalith Keertipati",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Madhav Suri",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Navmi Srithaj",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Nirmal Shah",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Om Pansuriya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Onkar Bajwa",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Pranav Cheedalla",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Pranay Chintakunta",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Prateek Banda",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Sam Paudel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Sanika Tripathi",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Siri Kishore Dola",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Sreyas Chakka",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Tanmayi Addanki",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Viraaj Singh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Yeshwanth Vajinapalli",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const alphaClassMembers = [
  "Aashna Pathi",
  "Kairavi Pandya",
  "Kanishk Garg",
  "Manasa Paruchuri",
  "Raghav Pillai",
  "Sanjana Shangle",
  "Yeshas Nath",
].sort((a, b) => a.localeCompare(b));

const betaClassMembers = [
  "Arya Thombare",
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
  "Sumi Suseendrababu",
  "Tariq Mahamid",
  "Wildan Susanto",
].sort((a, b) => a.localeCompare(b));

const gammaClassMembers = [
  "Aadhav Manimurugan",
  "Aamir Mohammed",
  "Aashay Vishwakarma",
  "Ajay Kumaran",
  "Aman Balam",
  "Ayushi Deshmukh",
  "Ishaan Dhandapani",
  "Itbaan Alam",
  "Kavinram Senthil",
  "Meghana Pula",
  "Mekha Mathew",
  "Mohammed Faadil Khan",
  "Noel Emmanuel",
  "Shreyas Ankolekar",
  "Venkat Sai Eshwar Varma Sagi",
  "Vignesh Selvam",
].sort((a, b) => a.localeCompare(b));

const deltaClassMembers = [
  "Aaron Gheevarghese",
  "Abhinav Atluri",
  "Anvi Siddabhattuni",
  "Ariha Kothari",
  "Arnav Jain",
  "Ayaan Khan",
  "Ayush Velhal",
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
  "Yeshwanth Vajinapalli",
].sort((a, b) => a.localeCompare(b));

const zetaClassMembers = [
  "Aarav Ashok",
  "Aashini Chalasani",
  "Afeef Zarraf",
  "Anya Konda",
  "Hemant Pacha",
  "Jonathan Ebenezer",
  "Kida Khanooni",
  "Kushagra Mathur",
  "Madhav Suri",
  "Nirmal Shah",
  "Onkar Bajwa",
  "Pranav Cheedalla",
  "Sam Paudel",
  "Sanika Tripathi",
  "Sreyas Chakka",
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
  const zetaColumns = splitIntoColumns(zetaClassMembers, 3);

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
      <div className="flex justify-center mt-4">
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
      <div className="flex justify-center mt-4">
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
      <div className="flex justify-center mt-4">
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

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Zeta Class
      </div>
      <div className="flex justify-center mt-4 mb-20">
        {zetaColumns.map((column, index) => (
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
