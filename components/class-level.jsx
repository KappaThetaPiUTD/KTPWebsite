import dynamic from "next/dynamic";

const ClassChart = dynamic(() => import("./class-level-chart"), { ssr: false });

const Classes = () => {
  const classes = [
    // Added 'const' keyword to declare the 'majors' array
    { name: "Freshman", value: 3 },
    { name: "Sophomore", value: 5 },
    { name: "Junior", value: 15 },
    { name: "Senior", value: 1 },

  ];

  const colors = ["#003f5c","#58508d", "#bc5090", "#ff6361", "#ffa600"];

  return (
    <div className="flex flex-col text-center pl-10 pr-10">
      <div className="text-primary text-header4 font-bold font-georgia">
        Academic Years
      </div>
      <div className="text-gray text-paragraph font-georgia text-center">
        <ClassChart data={classes} colors={colors} />
      </div>
    </div>
  );
};

export default Classes;
