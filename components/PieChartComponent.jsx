"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const dataAcademicYear = {
  labels: ["Freshman", "Sophomore", "Junior", "Senior"],
  datasets: [
    {
      label: " Students",
      data: [1, 8, 19, 8],
      backgroundColor: [
        "#7FB3D5", // Soft Blue
        "#9ED29E", // Gentle Green
        "#F4E285", // Pale Yellow
        "#D8A7B1", // Muted Pink
      ],
      hoverBackgroundColor: [
        "#7FB3D5", // Soft Blue
        "#9ED29E", // Gentle Green
        "#F4E285", // Pale Yellow
        "#D8A7B1", // Muted Pink
      ],
    },
  ],
};

const dataMajors = {
  labels: [
    "Information Technology and Systems",
    "Computer Science",
    "Computer Engineering",
    "Cognitive Science",
    "Business Analytics",
    "Software Engineering",
    "Biology",
    "Computer Information System and Technology",
    "Marketing"
  ],
  datasets: [
    {
      label: " Students",
      data: [5, 22, 1, 2, 1, 1, 1, 2, 1],
      backgroundColor: [
        "#BAA6D2", // Lavender
        "#FAC8B4", // Peach
        "#D3D3D3", // Light Gray
        "#FFDAB9", // Soft Orange
        "#B0E0E6", // Mint Green
        "#C8A2C8", // Lilac
        "#7FB3D5", // Soft Blue
        "#9ED29E", // Gentle Green
        "#F4E285", // Pale Yellow
        "#D8A7B1", // Muted Pink
      ],
      hoverBackgroundColor: [
        "#BAA6D2", // Lavender
        "#FAC8B4", // Peach
        "#D3D3D3", // Light Gray
        "#FFDAB9", // Soft Orange
        "#B0E0E6", // Mint Green
        "#C8A2C8", // Lilac
        "#7FB3D5", // Soft Blue
        "#9ED29E", // Gentle Green
        "#F4E285", // Pale Yellow
        "#D8A7B1", // Muted Pink
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
        <h3 className="text-white text-header4 font-bold font-poppins mb-4">
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
        <h3 className="text-white text-header4 font-bold font-poppins mb-4">
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
