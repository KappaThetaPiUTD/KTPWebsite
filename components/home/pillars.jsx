import React from "react";

// Define a single Pillar component
const Pillar = ({ number, title, description }) => {
  return (
    <div className="flex flex-row items-start justify-start p-6 bg-white border-2 border-primary border-opacity-25 shadow-md my-4 rounded-lg w-full">
      <div className="text-3xl font-bold text-black mr-9">{number}</div>
      <div className="flex flex-col">
        <div className="text-xl font-semibold text-black mb-1">{title}</div>
        <p className="text-black">{description}</p>
      </div>
    </div>
  );
};


// Main Pillars component containing all individual Pillar components
const Pillars = () => {
  const pillarsData = [
    { number: '1', title: "Academic Support", description: "We provide a network of support for our members, offering access to tutoring, study groups, and educational workshops to ensure academic success." },
    { number: '2', title: "Tech Advancement", description: "Our commitment to technology extends to hands-on workshops, coding bootcamps, and tech talks to keep our members ahead in the fast-evolving tech landscape." },
    { number: '3', title: "Alumni Connections", description: "We bridge the gap between current members and alumni through networking events, mentorship opportunities, and career guidance to foster long-term professional relationships." },
    { number: '4', title: "Social Growth", description: "Social events, retreats, and community service projects are integral to our mission, helping members build lifelong friendships and soft skills." },
    { number: '5', title: "Professional Development", description: "From resume workshops to interview prep sessions, our professional development programs are designed to prepare members for the workforce." }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50">
      <h2 className="text-header2 font-bold text-black mb-6">Our Core Values</h2>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full max-w-4xl">
        {pillarsData.map((pillar, index) => (
          <Pillar key={index} number={pillar.number} title={pillar.title} description={pillar.description} />
        ))}
      </div>
    </div>
  );
};

export default Pillars;
