'use client';

import React from 'react';
import FormPage from './form';

/* ------------------------------------------------------------------
   FUTURE: Events + RSVP (keep for later; uncomment when ready)
-------------------------------------------------------------------
// const events = [
//   { date: '9/3',  event: 'Info Session', location: 'GR.428',       time: '7PM', rsvpLink: 'https://tally.so/r/wooqbO' },
//   { date: '9/4',  event: 'Info Session', location: 'ECSW 1.365',   time: '7PM', rsvpLink: 'https://tally.so/r/mD5jqN' },
//   { date: '9/5',  event: 'Meet the Bros', location: 'Science Courtyard', time: '7PM', rsvpLink: 'https://tally.so/r/wooq9O' },
//   { date: '9/9',  event: 'Game Night',    location: 'NS Skylounge', time: '7PM', rsvpLink: 'https://tally.so/r/3x2AVv' },
//   { date: '9/10', event: 'KTP Speed Dating', location: 'GR 3.420', time: '7PM', rsvpLink: 'https://tally.so/r/wQdboX' },
//   { date: '9/11', event: 'Professional Event (Invite Only)', location: 'Sent with invite', time: '7PM', rsvpLink: '' },
// ];
-------------------------------------------------------------------*/

const RecruitmentPage = () => {
  /* ---------------------------------------------------------------
     FUTURE: RSVP click handler
  -----------------------------------------------------------------
  const handleRSVPClick = (link) => {
    if (!link) {
      alert(
        'You will be contacted directly for the Professional Event if you receive an invite. Please check your email and Instagram closer to the date.'
      );
      return;
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  };
  -----------------------------------------------------------------*/

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-24 px-4 md:px-8 text-black">
      {/* Existing titles/theme */}
      <div className="text-primary text-[28px] sm:text-[36px] md:text-header1 font-bold font-poppins text-center mb-4">
        Recruitment
      </div>
      {/*<div className="text-black text-paragraph sm:text-[36px] md:text-header1 font-poppins text-center mb-8">
        We will release more information closer to Spring 2025.
      </div>*/}

      {/* Only the application form for now */}
      <section className="w-full max-w-5xl">
        <FormPage />
      </section>

      {/* -----------------------------------------------------------
         FUTURE: Events Grid with RSVP buttons
      -------------------------------------------------------------
      <section className="w-full max-w-5xl mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((e, idx) => (
            <div
              key={`${e.date}-${idx}`}
              className="rounded-md border border-gray-200 p-4 bg-white shadow-sm"
            >
              <div className="text-sm text-gray-600">
                {e.date} · {e.time}
              </div>
              <div className="text-lg font-semibold mt-1">{e.event}</div>
              <div className="text-sm text-gray-700 mt-1">{e.location}</div>
              <button
                onClick={() => handleRSVPClick(e.rsvpLink)}
                className="mt-3 inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm hover:opacity-90"
              >
                {e.rsvpLink ? 'RSVP' : 'Invite Only'}
              </button>
            </div>
          ))}
        </div>
      </section>
      -------------------------------------------------------------*/}
    </div>
  );
};

export default RecruitmentPage;
