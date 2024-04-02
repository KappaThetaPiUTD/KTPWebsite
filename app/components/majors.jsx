import dynamic from "next/dynamic";

const MajorChart = dynamic(() => import("./major-chart"), { ssr: false });

const Majors = () => {
  const majors = [
    // Added 'const' keyword to declare the 'majors' array
    { name: "CS", value: 50 },
    { name: "CGS", value: 40 },
    { name: "ITS", value: 30 },
    { name: "CE", value: 20 },
    { name: "SE", value: 10 },
  ];

  return (
    <div className="text-center pl-10 pr-10">
      <div className="text-secondary text-header1 font-bold font-georgia">
        Majors
      </div>
      <div className="text-gray text-paragraph font-georgia text-center">
        <MajorChart data={majors} />
      </div>
    </div>
  );
};

export default Majors;
