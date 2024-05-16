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

const Brother = () => {
  const activeMembers = new Array(16).fill('John Doe');
  const alphaClassMembers = new Array(4).fill('John Doe');
  const betaClassMembers = new Array(5).fill('John Doe');

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
            <div className="w-32 h-32 bg-gray-400 rounded-lg"></div>
            <div className="mt-2">{member}</div>
          </div>
        ))}
      </div>

      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center mt-16">
        Alpha Class
      </div>
      <div className="flex flex-wrap justify-center mt-4">
        {alphaClassMembers.map((member, index) => (
          <div key={index} className="m-2 text-center">
            {member}
          </div>
        ))}
      </div>

      <div className="text-secondary text-header1 font-bold font-poppins flex justify-center mt-16">
        Beta Class
      </div>
      <div className="flex flex-wrap justify-center mt-4">
        {betaClassMembers.map((member, index) => (
          <div key={index} className="m-2 text-center">
            {member}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brother;
