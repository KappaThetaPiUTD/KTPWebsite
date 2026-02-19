"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const dataAcademicYear = {
  labels: ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"],
  datasets: [
    {
      label: " Students",
      data: [5, 8, 20, 16, 1],
      backgroundColor: [
        "#d3d0cb",
        "#393e41",
        "#1e2019",
        "#374526",
        "#04b43b",
      ],
      hoverBackgroundColor: [
        "#d3d0cb",
        "#393e41",
        "#1e2019",
        "#374526",
        "#04b43b",
      ],
    },
  ],
};

const dataMajors = {
  labels: [
    "Computer Science",
    "Computer Information System and Technology",
    "Software Engineering",
    "Data Science",
    "Business Analytics",
    "Business Administration",
    "Finance",
    "Cognitive Science",
    "Healthcare Management",
    "Biochemistry"
  ],
  datasets: [
    {
      label: " Students",
      data: [33, 6, 3, 5, 0, 2, 2, 1, 1, 1],
      backgroundColor: [
        "#04b43b",
        "#374526",
        "#1e2019",
        "#393e41",
        "#d3d0cb",
        "#a9927d",
        "#5F8237",
        "#9ED29E",
        "#F2F4F3",
        "#BFCCAF",
      ],
      hoverBackgroundColor: [
        "#04b43b",
        "#374526",
        "#1e2019",
        "#393e41",
        "#d3d0cb",
        "#a9927d",
        "#5F8237",
        "#9ED29E",
        "#F2F4F3",
        "#BFCCAF",
      ],
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        font: {
          family: "Public Sans",
        },
        color: "#000000",
      },
    },
    datalabels: {
      color: "#fff",
      font: {
        weight: "bold",
        size: 14,
      },
      formatter: (value, context) => {
        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
        const percentage = ((value / total) * 100);
        // Only show percentage if it's 10% or greater
        return percentage >= 5 ? `${percentage.toFixed(1)}%` : "";
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    },
  },
  maintainAspectRatio: false,
};

const PieChartComponent = () => (
  <div className="bg-white p-8 text-black w-full">
    <h2 className="text-black text-4xl lg:text-header1 font-bold font-poppins text-center mb-8 tracking--2">
      KTP Wrapped
    </h2>
    <div className="flex flex-col md:flex-row justify-center md:gap-8">
      <div className="text-center mb-8 md:mb-0">
        <h3 className="text-black text-header4 font-bold font-poppins mb-4">
          Academic Year
        </h3>
        <div
          className="flex justify-center items-center w-full"
          style={{ maxWidth: "480px" }}
        >
          <Pie
            data={dataAcademicYear}
            options={options}
            width={410}
            height={410}
          />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-black text-header4 font-bold font-poppins mb-4">
          Major
        </h3>
        <div
          className="flex justify-center items-center w-full"
          style={{ maxWidth: "480px" }}
        >
          <Pie
            data={dataMajors}
            options={{
              ...options,
              legend: { display: true, position: "bottom" },
            }}
            width={450}
            height={450}
          />
        </div>
      </div>
    </div>
  </div>
);

export default PieChartComponent;
