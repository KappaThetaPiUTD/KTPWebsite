import dynamic from "next/dynamic";

const MajorChart = dynamic(() => import("./major-chart"), { ssr: false });

const Majors = () => {
  const majors = [
    // Added 'const' keyword to declare the 'majors' array
    { name: "CS", value: 50 },
    { name: "CGS", value: 100 },
    { name: "ITS", value: 50 },
    { name: "CE", value: 80 },
    { name: "SE", value: 60 },
    {name: "EE", value: 70}
  ];

  const colors = ["#003f5c","#58508d", "#bc5090", "#ff6361", "#ffa600"];

  return (
    <div className="flex flex-col text-center pl-10 pr-10">
      <div className="text-secondary text-header4 font-bold font-georgia">
        Majors
        <MajorChart data={majors} colors={colors}/>
        {/* <ul className="text-gray text-paragraph font-georgia text-center">
          {majors.map((major, index) => (
            <li key={index}>
              {major.name}: {major.value}
            </li>
          ))}
        </ul> */}
      </div>
      <div className="text-gray text-paragraph font-georgia text-center">
        {/* <MajorChart data={majors} colors={colors} />
        <ul className="text-gray text-paragraph font-georgia text-center">
          {majors.map((major, index) => (
            <li key={index}>
              {major.name}: {major.value}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default Majors;
