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
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg",
    linkedin: "https://www.linkedin.com/in/ethanlobo",
  },
  {
    name: "Tariq Mahamid",
    position: "VP of Technology",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716144869/Brother%20Page/Executive%20Board/Tariq_mxviux.jpg",
    linkedin: "https://www.linkedin.com/in/tariq-mahamid-b316a520a/",
  },
  {
    name: "Afsar Arif",
    position: "VP of Internal Affairs",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716144869/Brother%20Page/Executive%20Board/Afsar_gpj1ul.jpg",
    linkedin: "https://www.linkedin.com/in/afsararif",
  },
  {
    name: "Avani Melhotra",
    position: "VP of Engagement",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716144868/Brother%20Page/Executive%20Board/Avani_Headshot_xmzjsq.jpg",
    linkedin: "https://www.linkedin.com/in/avani-mehrotra/",
  },
  {
    name: "Laiba Piracha",
    position: "VP of Membership",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715960970/Brother%20Page/Executive%20Board/Laiba_Piracha_Headshot_tnfivs.jpg",
    linkedin: "https://www.linkedin.com/in/laibapiracha",
  },
  {
    name: "Rushil Patel",
    position: "VP of Professional Development",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715962309/Brother%20Page/Executive%20Board/Rushil_Patel_Headshot_ncxas2.jpg",
    linkedin: "https://www.linkedin.com/in/rushil-patel5/",
  },
  {
    name: "Arya Thombre",
    position: "VP of Communications",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716144868/Brother%20Page/Executive%20Board/Arya_d1sdqf.jpg",
    linkedin: "https://www.linkedin.com/in/arya-thombare-83303225b/",
  },
];

const activeMembers = [
  {
    name: "Mansi Cherukupally",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/in/mansi-cherukupally-b399a6214/",
  },
  {
    name: "Sanjana Neelee",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716401954/Brother%20Page/Actives/sanjana_neelee_headshot_zf456w.jpg",
    linkedin: "https://www.linkedin.com/in/sanjananeelee",
  },
  {
    name: "Ibrahim Khan",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/in/ibrahimkhan-utd/",
  },
  {
    name: "Kairavi Pandya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715884826/Brother%20Page/Actives/Kairavi_Pandya_Headshot_vearh8.jpg",
    linkedin: "https://www.linkedin.com/in/kairavi-pandya",
  },
  {
    name: "Sumedha Suseendrababu",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716401955/Brother%20Page/Actives/sumi_s_hgs2th.jpg",
    linkedin: "https://www.linkedin.com/in/sumedhasuseendrababu",
  },
  {
    name: "Humsini Revuru",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716146167/Brother%20Page/Actives/humsini_vfj0bi.jpg",
    linkedin: "https://www.linkedin.com/in/humsini-r/",
  },
  {
    name: "Wildan Susanto",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716145816/Brother%20Page/Actives/wildam_rtk8jy.jpg",
    linkedin: "https://www.linkedin.com/in/wildan-susanto/",
  },
  {
    name: "Monish Ravishankar",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715884812/Brother%20Page/Actives/MONISH_HEADSHOT_om9ujn.jpg",
    linkedin: "https://www.linkedin.com/in/wildan-susanto/",
  },
  {
    name: "Viraaj Veeramachaneni",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716263543/Brother%20Page/Actives/viraaj_headshot_f3uolo.png",
    linkedin: "https://www.linkedin.com/in/viraajveeramachaneni/",
  },
  {
    name: "Yeshas Nath",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/in/yeshasnath",
  },
  {
    name: "Arjun Prabhune",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716401982/Brother%20Page/Actives/arjun_prabhune_bai3rg.jpg",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Rhea Aemireddy",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716596377/Brother%20Page/Actives/Rhea_Reddy_j2pixh.jpg",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Sanjana Shangle",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716596377/Brother%20Page/Actives/Sanjana_Shangle_m4j7uq.jpg",
    linkedin: "http://www.linkedin.com/in/sanjanashangle",
  },
  {
    name: "Aditya Sajeev",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Adam Moffat",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Affiq Mohammed",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Akshaya Kummetha",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Anwita Gudapuri",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Aryaman Dubey",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Benjamin Wowo",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Hima Nagi Reddy",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1716401983/Brother%20Page/Actives/hima_nagi_reddy_wrc5sr.jpg",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Itihas Paluri",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Kanishk Garg",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Krisha Amaravathi",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Lokesh Narasani",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Nivedh Koya",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Renjit Joseph",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Sai Vemugunta",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Shalin Shrestha",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
  {
    name: "Sriram Sendhil",
    src: "https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png",
    linkedin: "https://www.linkedin.com/company/ktputd",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const alphaClassMembers = [
  "Adam Moffat",
  "Aditya Sajeev",
  "Akahaya Kummetha",
  "Arjun Prabhune",
  "Aashna Pathi",
  "Benjamin Wowo",
  "Ethan Lobo",
  "Ibrahim Khan",
  "Kairavi Pandya",
  "Kanishk Garg",
  "Lokesh Narasnai",
  "Manasa Paruchuri",
  "Rhea Aemireaddy",
  "Renjit Joseph",
  "Sanajana Shangle",
  "Sriram Sendhil",
  "Shalom Michael",
  "Viraaj Neeramanchi",
  "Yeshas Nath",
].sort((a, b) => a.localeCompare(b));

const betaClassMembers = [
  "Affiq Mohammed",
  "Annan Ahmed",
  "Anwita Gudapuri",
  "Arya Thombre",
  "Aryaman Dubey",
  "Avani Mehrotra",
  "Ethan Varghese",
  "Gloria Tu",
  "Hima Nagi Reddy",
  "Humsini Revuru",
  "Itihas Paluri",
  "Joshua Solomon",
  "Krisha Amaravathi",
  "Laiba Piracha",
  "Mansi Cherukupally",
  "Mohamed Afsar Harsath Arif",
  "Monish Ravishankar",
  "Nivedh Koya",
  "Reuben John",
  "Rushil Patel",
  "Sanjana Neelee",
  "Sai Vemugunta",
  "Shalin Shrestha",
  "Sumedha Suseendrababu",
  "Tariq Mahamid",
  "Wildan Susanto",
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

  return (
    <div className="w-screen h-full bg-[#0F0F0F] text-white">
      <div className="text-secondary text-header1 font-bold font-poppins flex text-center justify-center items-center mt-8">
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
                <FaLinkedin className="text-white text-4xl" />
              </a>
            </div>
            <div className="mt-2">{member.name}</div>
            <div className="text-sm text-gray-400">{member.position}</div>
          </div>
        ))}
      </div>

      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center items-center mt-16">
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

      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
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

      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center items-center mt-14">
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
    </div>
  );
};

export default Brother;