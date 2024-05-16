// page.jsx
import Image from 'next/image';
import React from 'react';

const executiveBoardMembers = [
  { name: 'Ethan Lobo', position: 'President', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg' },
  { name: 'Tariq Mahamid', position: 'VP of Technology', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg' },
  { name: 'Afsar Arif', position: 'VP of Internal Affairs', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg' },
  { name: 'Avani Melhotra', position: 'VP of Engagement', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg' },
  { name: 'Laiba Piracha', position: 'VP of Membership', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg' },
  { name: 'Rushil Patel', position: 'VP of Professional Development', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg' },
  { name: 'Arya Thombre', position: 'VP of Communications', src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg' }
];

const activeMembers = [
  'Mansi Cherukupally',
  'Ethan Varghese',
  'Sanjana Neelee',
  'Manasa Paruchuri',
  'Ibrahim Khan',
  'Kairavi Pandya',
  'Sumedha Suseendrababu',
  'Gloria Tu',
  'Reuben John',
  'Annan Ahmed',
  'Humsini Revuru',
  'Aashna Pathi',
  'Wildan Susanto',
  'Monish Ravishankar',
  'Shalom Michael',
  'Tariq Mahamid',
  'Viraaj Veeramachaneni',
  'Yeshas Nath',
  'Joshua Solomon',
  'Arjun Prabhune'
].map(name => ({ name, src: 'https://res.cloudinary.com/dha44tosd/image/upload/v1715882072/Brother%20Page/Executive%20Board/ethan_headshot_gnmqtg.jpg' }));

const alphaClassMembers = [
  'Aditya Sajeev',
  'Aashna Pathi',
  'Akahaya Kummetha',
  'Arjun Prabhune',
  'Ethan Lobo',
  'Kairavi Pandya',
  'Lokesh Narasnai',
  'Manasa Paruchuri',
  'Rhea Aemireaddy',
  'Sriram Sendhil',
  'Viraaj Neeramanchi'
];

const betaClassMembers = [
  'Annan Ahmed',
  'Arya Thombre',
  'Gloria Tu',
  'Humsini Revuru',
  'Laiba Piracha',
  'Sanjana Neelee',
  'Sumedha Suseendrababu',
  'Tariq Mahamid'
];

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
    <div className="w-screen bg-[#0F0F0F] text-white">
      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center mt-8">
        Executive Board
      </div>
      <div className="flex flex-wrap justify-center mt-8">
        {executiveBoardMembers.map((member, index) => (
          <div key={index} className="m-4 text-center">
            <div className="relative w-32 h-32 bg-gray-400 rounded-lg overflow-hidden">
              <Image
                src={member.src}
                alt={`${member.name} - ${member.position}`}
                layout="fill"
                objectFit="cover"
              />
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
          <div key={index} className="m-4 text-center">
            <div className="relative w-32 h-32 bg-gray-400 rounded-lg overflow-hidden">
              <Image
                src={member.src}
                alt={`${member.name}`}
                layout="fill"
                objectFit="cover"
              />
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
