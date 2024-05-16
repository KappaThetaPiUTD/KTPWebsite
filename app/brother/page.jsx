// page.jsx
import Image from 'next/image';
import React from 'react';
import { FaLinkedin } from 'react-icons/fa'; // LinkedIn icon

const executiveBoardMembers = [
  { name: 'Ethan Lobo', position: 'President', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/ethanlobo' },
  { name: 'Tariq Mahamid', position: 'VP of Technology', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/tariqmahamid' },
  { name: 'Afsar Arif', position: 'VP of Internal Affairs', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/afsararif' },
  { name: 'Avani Melhotra', position: 'VP of Engagement', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/avanimelhotra' },
  { name: 'Laiba Piracha', position: 'VP of Membership', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/laibapiracha' },
  { name: 'Rushil Patel', position: 'VP of Professional Development', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/rushilpatel' },
  { name: 'Arya Thombre', position: 'VP of Communications', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/aryathombre' }
];

const activeMembers = [
  { name: 'Mansi Cherukupally', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/mansicherukupally' },
  { name: 'Ethan Varghese', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png', linkedin: 'https://www.linkedin.com/in/ethanvarghese' },
  { name: 'Sanjana Neelee', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/sanjananeelee' },
  { name: 'Manasa Paruchuri', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png', linkedin: 'https://www.linkedin.com/in/manasaparuchuri' },
  { name: 'Ibrahim Khan', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/ibrahimkhan' },
  { name: 'Kairavi Pandya', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715884826/Brother%20Page/Actives/Kairavi_Pandya_Headshot_vearh8.jpg', linkedin: 'https://www.linkedin.com/in/kairavipandya' },
  { name: 'Sumedha Suseendrababu', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/sumedhasuseendrababu' },
  { name: 'Gloria Tu', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png', linkedin: 'https://www.linkedin.com/in/gloriatu' },
  { name: 'Reuben John', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png', linkedin: 'https://www.linkedin.com/in/reubenjohn' },
  { name: 'Annan Ahmed', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png', linkedin: 'https://www.linkedin.com/in/annanahmed' },
  { name: 'Humsini Revuru', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/humsinirevuru' },
  { name: 'Aashna Pathi', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png', linkedin: 'https://www.linkedin.com/in/aashnapathi' },
  { name: 'Wildan Susanto', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/wildansusanto' },
  { name: 'Monish Ravishankar', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/monishravishankar' },
  { name: 'Shalom Michael', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png', linkedin: 'https://www.linkedin.com/in/shalommichael' },
  { name: 'Viraaj Veeramachaneni', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/viraajveeramachaneni' },
  { name: 'Yeshas Nath', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/yeshasnath' },
  { name: 'Joshua Solomon', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715885018/Brother%20Page/Actives/KTP_LOGO_aj24pt.png', linkedin: 'https://www.linkedin.com/in/joshuasolomon' },
  { name: 'Arjun Prabhune', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg', linkedin: 'https://www.linkedin.com/in/arjunprabhune' }
].sort((a, b) => a.name.localeCompare(b.name));

const alphaClassMembers = [
  'Adam Moffat',
  'Aditya Sajeev',
  'Akahaya Kummetha',
  'Arjun Prabhune',
  'Aashna Pathi',
  'Benjamin Wowo',
  'Ethan Lobo',
  'Ibrahim Khan',
  'Kairavi Pandya',
  'Kanishk Garg',
  'Lokesh Narasnai',
  'Manasa Paruchuri',
  'Rhea Aemireaddy',
  'Renjit Joseph',
  'Sanajana Shangle',
  'Sriram Sendhil',
  'Shalom Michael',
  'Viraaj Neeramanchi',
  'Yeshas Nath',
].sort((a, b) => a.localeCompare(b));

const betaClassMembers = [
  'Affiq Mohammed',
  'Annan Ahmed',
  'Anwita Gudapuri',
  'Arya Thombre',
  'Aryaman Dubey',
  'Avani Mehrotra',
  'Ethan Varghese',
  'Gloria Tu',
  'Hima Nagi Reddy',
  'Humsini Revuru',
  'Itihas Paluri',
  'Joshua Solomon',
  'Krisha Amaravathi',
  'Laiba Piracha',
  'Mansi Cherukupally',
  'Mohamed Afsar Harsath Arif',
  'Monish Ravishankar',
  'Nivedh Koya',
  'Reuben John',
  'Rushil Patel',
  'Sanjana Neelee',
  'Sai Vemugunta',
  'Shalin Shrestha',
  'Sumi Suseendrababu',
  'Tariq Mahamid',
  'Wildan Susanto'
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
      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center mt-8">
        Executive Board
      </div>
      <div className="flex flex-wrap justify-center mt-8">
        {executiveBoardMembers.map((member, index) => (
          <div key={index} className="m-4 text-center relative group">
            <div className="relative w-32 h-32 bg-gray-400 rounded-lg overflow-hidden">
              <Image
                src={member.src}
                alt={`${member.name} - ${member.position}`}
                fill
                className="transition-all duration-300 group-hover:brightness-50 object-cover"
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

      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center mt-16">
        Actives
      </div>
      <div className="flex flex-wrap justify-center mt-8">
        {activeMembers.map((member, index) => (
          <div key={index} className="m-4 text-center relative group">
            <div className="relative w-32 h-32 bg-gray-400 rounded-lg overflow-hidden">
              <Image
                src={member.src}
                alt={`${member.name}`}
                fill
                className="transition-all duration-300 group-hover:brightness-50 object-cover"
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

      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center mt-16">
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

      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center mt-16">
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
