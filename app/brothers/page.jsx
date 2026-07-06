import Image from "next/image";
import React from "react";
import { executiveBoardMembers, directorBoardMembers } from "../../lib/roster";

export const metadata = {
  title: "Kappa Theta Pi UTD - Brothers",
  description: "Kappa Theta Pi Descripton",
};



const activeMembers = [
  {
    name: "Mekha Mathew",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Ruthvik Penmatsa",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190823/Brother%20Page/Actives/IMG_5706_pehj8h.jpg",
    linkedin: "https://www.linkedin.com/in/ruthvikpenmatsa/",
  },
  {
    name: "Praneel Sreepada",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771277580/Brother%20Page/Actives/IMG_5702_xqkzil.jpg",
    linkedin: "https://www.linkedin.com/in/praneelsreepada/",
  },
  {
    name: "Itbaan Alam",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683119/image_11_uatklb.png",
    linkedin: "http://linkedin.com/in/itbaanalam",
  },
  {
    name: "Meghana Pula",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1740683113/image_20_ijskwh.png",
    linkedin: "http://www.linkedin.com/in/sai-meghana-pula",
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
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190962/Brother%20Page/Actives/IMG_5452_issyik.jpg",
    linkedin: "https://www.linkedin.com/in/mohammed-faadil-khan-6a196b287/",
  },
  {
    name: "Joel Philipose",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771193096/Brother%20Page/Actives/IMG_5558_ajgu8v.jpg",
    linkedin: "",
  },
  {
    name: "Nihita Soma",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Rahil Islam",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207516/Brother%20Page/Actives/rahil_islam.jpg",
    linkedin: "",
  },
  {
    name: "Sachin Selvakumar",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190965/Brother%20Page/Actives/IMG_5451_ubtsje.jpg", // Add Sachin's image URL
    linkedin: "https://www.linkedin.com/in/sachinselvakumar24/",
  },
  {
    name: "Rishi Ramesh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190974/Brother%20Page/Actives/IMG_5440_miludq.jpg", // Add Rishi's image URL
    linkedin: "https://www.linkedin.com/in/seyyonrishiramesh/",
  },
  {
    name: "Ayush Velhal",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190875/Brother%20Page/Actives/IMG_5569_ceoasl.jpg", // Add Ayush's image URL
    linkedin: "https://www.linkedin.com/in/ayush-velhal/",
  },
  {
    name: "Anvi Siddabhattuni",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207292/Brother%20Page/Actives/anvi_siddabhattuni.jpg", // Add Anvi's image URL
    linkedin: "https://www.linkedin.com/in/anvi-siddabhattuni/",
  },

  {
    name: "Aaron Gheevarghese",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771193596/Brother%20Page/Actives/IMG_5572_v5jgz8.jpg", // Add Aaron's image URL
    linkedin: "https://www.linkedin.com/in/aarongheevarghese/",
  },

  {
    name: "Krish Patel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190927/Brother%20Page/Actives/IMG_5530_gwhixw.jpg", // Add Aaron's image URL
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
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207294/Brother%20Page/Actives/afeef_zarraf.jpg",
    linkedin: "",
  },
  {
    name: "Anya Konda",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207410/Brother%20Page/Actives/anya_konda.jpg",
    linkedin: "",
  },
  {
    name: "Jashanpreet Singh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Jonathan Ebenezer",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207296/Brother%20Page/Actives/jonathan_ebenezer.jpg",
    linkedin: "",
  },
  {
    name: "Kida Khanooni",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207646/Brother%20Page/Actives/kida_khanooni.jpg",
    linkedin: "",
  },
  {
    name: "Kushagra Mathur",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207409/Brother%20Page/Actives/kushagra_mathur.jpg",
    linkedin: "",
  },
  {
    name: "Lalith Keertipati",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771276882/Brother%20Page/Actives/IMG_5712_fjmsow.jpg",
    linkedin: "",
  },
  {
    name: "Madhav Suri",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207296/Brother%20Page/Actives/madhav_suri.jpg",
    linkedin: "",
  },
  {
    name: "Nirmal Shah",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207295/Brother%20Page/Actives/nirmal_shah.jpg",
    linkedin: "",
  },
  {
    name: "Onkar Bajwa",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Prateek Banda",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1783207292/Brother%20Page/Actives/prateek_banda.jpg",
    linkedin: "",
  },
  {
    name: "Sam Paudel",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "",
  },
  {
    name: "Siri Kishore Dola",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190835/Brother%20Page/Actives/IMG_5646_hiubqi.jpg",
    linkedin: "",
  },
  {
    name: "Tanmayi Addanki",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190850/Brother%20Page/Actives/IMG_5607_fpscrf.jpg",
    linkedin: "",
  },
  {
    name: "Viraaj Singh",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1771190894/Brother%20Page/Actives/IMG_5549_yaalv0.jpg",
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
  "Venkat Sagi",
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

const Brother = () => {
  return (
    <div className="w-full h-full bg-white pt-24 text-black">
      <div className="text-primary text-header1 font-bold font-poppins flex text-center justify-center items-center">
        Executive Board
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 mt-8 max-w-5xl mx-auto px-4">
        {executiveBoardMembers.map((member, index) => (
          <div
            key={index}
            className="w-32 sm:w-40 text-center"
          >
            <div className="group relative w-32 h-40 sm:w-40 sm:h-52 mx-auto bg-gray-400 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
              <Image
                src={member.src}
                alt={`${member.name} - ${member.position}`}
                fill
                sizes="(max-width: 640px) 128px, 160px"
                quality={90}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  aria-label={`${member.name} LinkedIn profile`}
                
              />
              )}
            </div>
            <div className="mt-2">{member.name}</div>
            <div className="text-sm text-gray-400">{member.position}</div>
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex text-center justify-center items-center">
        Director Board
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 mt-8 max-w-5xl mx-auto px-4">
        {directorBoardMembers.map((member, index) => (
          <div
            key={index}
            className="w-32 sm:w-40 text-center"
          >
            <div className="group relative w-32 h-40 sm:w-40 sm:h-52 mx-auto bg-gray-400 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
              <Image
                src={member.src}
                alt={`${member.name} - ${member.position}`}
                fill
                sizes="(max-width: 640px) 128px, 160px"
                quality={90}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  aria-label={`${member.name} LinkedIn profile`}
                
              />
              )}
            </div>
            <div className="mt-2">{member.name}</div>
            <div className="text-sm text-gray-400">{member.position}</div>
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-16">
        Actives
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 mt-8 max-w-5xl mx-auto px-4">
        {activeMembers.map((member, index) => (
          <div
            key={index}
            className="w-32 sm:w-40 text-center"
          >
            <div className="group relative w-32 h-40 sm:w-40 sm:h-52 mx-auto bg-gray-400 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
              <Image
                src={member.src}
                alt={`${member.name}`}
                fill
                sizes="(max-width: 640px) 128px, 160px"
                quality={90}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  aria-label={`${member.name} LinkedIn profile`}
                
              />
              )}
            </div>
            <div className="mt-2">{member.name}</div>
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Alpha Class
      </div>
      <div className="columns-2 sm:columns-3 gap-8 max-w-2xl mx-auto mt-4 px-4">
        {alphaClassMembers.map((member, idx) => (
          <div key={idx} className="m-2 text-center break-inside-avoid">
            {member}
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Beta Class
      </div>
      <div className="columns-2 sm:columns-3 gap-8 max-w-2xl mx-auto mt-4 px-4">
        {betaClassMembers.map((member, idx) => (
          <div key={idx} className="m-2 text-center break-inside-avoid">
            {member}
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Gamma Class
      </div>
      <div className="columns-2 sm:columns-3 gap-8 max-w-2xl mx-auto mt-4 px-4">
        {gammaClassMembers.map((member, idx) => (
          <div key={idx} className="m-2 text-center break-inside-avoid">
            {member}
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Delta Class
      </div>
      <div className="columns-2 sm:columns-3 gap-8 max-w-2xl mx-auto mt-4 px-4">
        {deltaClassMembers.map((member, idx) => (
          <div key={idx} className="m-2 text-center break-inside-avoid">
            {member}
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Epsilon Class
      </div>
      <div className="columns-2 sm:columns-3 gap-8 max-w-2xl mx-auto mt-4 px-4">
        {epsilonClassMembers.map((member, idx) => (
          <div key={idx} className="m-2 text-center break-inside-avoid">
            {member}
          </div>
        ))}
      </div>

      <div className="text-primary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
        Zeta Class
      </div>
      <div className="columns-2 sm:columns-3 gap-8 max-w-2xl mx-auto mt-4 mb-20 px-4">
        {zetaClassMembers.map((member, idx) => (
          <div key={idx} className="m-2 text-center break-inside-avoid">
            {member}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brother;
