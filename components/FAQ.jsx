"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Who can join KTP?",
    a: "Kappa Theta Pi is a co-ed professional technology fraternity open to all UT Dallas students who are passionate about technology, regardless of major or year.",
  },
  {
    q: "Do I need to be a Computer Science major?",
    a: "Not at all! Our members come from a wide range of majors. A genuine interest in technology and a desire to grow matter far more than your specific program.",
  },
  {
    q: "When and how do I apply?",
    a: "Recruitment happens each semester. When our rush period opens, you can apply using the application form on this page. Follow us on Instagram @utdktp for event dates and deadlines.",
  },
  {
    q: "What does the recruitment process look like?",
    a: "Rush typically includes info sessions, social events, and interviews, giving us a chance to get to know you and you a chance to get to know our brotherhood. Watch our Instagram and this page for the schedule.",
  },
  {
    q: "Is there a GPA requirement?",
    a: "Yes. KTP members maintain a minimum 3.0 GPA, in keeping with our focus on academic and professional excellence.",
  },
  {
    q: "What will I get out of joining?",
    a: "Technical workshops, professional development like resume and interview prep, mentorship, alumni connections, and a close-knit community, all built around our five pillars.",
  },
  {
    q: "I still have questions. Who do I contact?",
    a: "Email us at kappathetapiutd@gmail.com or DM @utdktp on Instagram. You can also ask our chat assistant (bottom-right corner) anytime!",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-16 mb-20">
      <h2 className="text-primary text-3xl sm:text-header2 font-bold font-poppins text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="border border-primary/20 rounded-lg overflow-hidden bg-white"
            >
              <button
                type="button"
                id={`faq-button-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-poppins font-semibold text-primary hover:bg-primary/5 transition-colors"
              >
                <span>{item.q}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-black/80 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
