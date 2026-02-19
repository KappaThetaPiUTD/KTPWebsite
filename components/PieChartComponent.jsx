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
        "#f5f5f5",
        "#000000",
        "#00542C",
        "#5a5a5a",
        "#2d8b57",
      ],
      hoverBackgroundColor: [
        "#f5f5f5",
        "#000000",
        "#00542C",
        "#5a5a5a",
        "#2d8b57",
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
    "Business Administration",
    "Finance",
    "Cognitive Science",
    "Healthcare Management",
    "Biochemistry"
  ],
  datasets: [
    {
      label: " Students",
      data: [33, 6, 3, 5, 2, 2, 1, 1, 1],
      backgroundColor: [
        "#00542C",
        "#000000",
        "#5a5a5a",
        "#2d8b57",
        "#f5f5f5",
        "#1a5c35",
        "#c5e8d3",
        "#8a8a8a",
        "#7fb892",
      ],
      hoverBackgroundColor: [
        "#00542C",
        "#000000",
        "#5a5a5a",
        "#2d8b57",
        "#f5f5f5",
        "#1a5c35",
        "#c5e8d3",
        "#8a8a8a",
        "#7fb892",
      ],
    },
  ],
};

const CHART_SIZE = 450;
const MAJOR_EXTRA_HEIGHT = 55;

const baseOptions = {
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        font: {
          family: "Public Sans",
          size: 11,
        },
        color: "#000000",
        boxWidth: 12,
        padding: 8,
      },
    },
    datalabels: {
      color: (context) => {
        const bg = context.dataset.backgroundColor[context.dataIndex];
        const light = ["#f5f5f5", "#c5e8d3", "#7fb892"];
        return light.includes(bg) ? "#000000" : "#ffffff";
      },
      font: {
        weight: "bold",
        size: 14,
      },
      formatter: (value, context) => {
        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
        const percentage = ((value / total) * 100);
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
  <div className="bg-white p-8 text-black w-full pb-8">
    <h2 className="text-black text-4xl lg:text-header1 font-bold font-poppins text-center mb-14 tracking--2">
      KTP Wrapped
    </h2>
    <div className="flex flex-col md:flex-row justify-center md:gap-8">
      <div className="text-center mb-8 md:mb-0">
        <h3 className="text-black text-header4 font-bold font-poppins mb-4">
          Academic Year
        </h3>
        <div
          className="flex justify-center items-center w-full"
          style={{ width: `${CHART_SIZE}px`, minWidth: `${CHART_SIZE}px` }}
        >
          <Pie
            data={dataAcademicYear}
            options={baseOptions}
            width={CHART_SIZE}
            height={CHART_SIZE}
          />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-black text-header4 font-bold font-poppins mb-4">
          Major
        </h3>
        <div
          className="flex justify-center items-center w-full"
          style={{ width: `${CHART_SIZE}px`, minWidth: `${CHART_SIZE}px`, minHeight: `${CHART_SIZE + MAJOR_EXTRA_HEIGHT}px` }}
        >
          <Pie
            data={dataMajors}
            options={baseOptions}
            width={CHART_SIZE}
            height={CHART_SIZE + MAJOR_EXTRA_HEIGHT}
          />
        </div>
      </div>
    </div>
  </div>
);

export default PieChartComponent;
