"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const dataAcademicYear = {
  labels: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
  datasets: [
    {
      label: 'Academic Year',
      data: [3, 5, 15, 1],
      backgroundColor: [
        '#7FB3D5', // Soft Blue
        '#9ED29E', // Gentle Green
        '#F4E285', // Pale Yellow
        '#D8A7B1', // Muted Pink
      ],
      hoverBackgroundColor: [
        '#7FB3D5', // Soft Blue
        '#9ED29E', // Gentle Green
        '#F4E285', // Pale Yellow
        '#D8A7B1', // Muted Pink
      ],
    },
  ],
};

const dataMajors = {
  labels: [
    'Information Technology and Systems',
    'Computer Science',
    'Computer Engineering',
    'Cognitive Science',
    'Business Administration',
    'Marketing',
    'Software Engineering',
    'Electrical Engineering',
    'Finance',
    'Biology',
  ],
  datasets: [
    {
      label: 'Majors',
      data: [6, 12, 2, 3, 1, 1, 3, 2, 2, 2],
      backgroundColor: [
        '#BAA6D2', // Lavender
        '#FAC8B4', // Peach
        '#D3D3D3', // Light Gray
        '#FFDAB9', // Soft Orange
        '#B0E0E6', // Mint Green
        '#C8A2C8', // Lilac
        '#7FB3D5', // Soft Blue
        '#9ED29E', // Gentle Green
        '#F4E285', // Pale Yellow
        '#D8A7B1', // Muted Pink
      ],
      hoverBackgroundColor: [
        '#BAA6D2', // Lavender
        '#FAC8B4', // Peach
        '#D3D3D3', // Light Gray
        '#FFDAB9', // Soft Orange
        '#B0E0E6', // Mint Green
        '#C8A2C8', // Lilac
        '#7FB3D5', // Soft Blue
        '#9ED29E', // Gentle Green
        '#F4E285', // Pale Yellow
        '#D8A7B1', // Muted Pink
      ],
    },
  ],
};

const options = {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        font: {
          family: 'Georgia',
        },
        color: '#FFFFFF',
      },
    },
  },
  maintainAspectRatio: false,
};

const PieChartComponent = () => (
  <div className="bg-black p-8 text-white">
    <h2 className="text-secondary text-header2 font-bold font-poppins flex justify-center mb-8">KTP Wrapped</h2>
    <div className="flex justify-center gap-8">
      <div className="text-center">
        <h3 className="text-white text-header4 font-bold font-georgia mb-4">Academic Year</h3>
        <div className="flex justify-center items-center" style={{ width: '320px', height: '320px' }}>
          <Pie data={dataAcademicYear} options={options} />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-white text-header4 font-bold font-georgia mb-4">Major</h3>
        <div className="flex justify-center items-center" style={{ width: '320px', height: '320px' }}>
          <Pie data={dataMajors} options={options} />
        </div>
      </div>
    </div>
  </div>
);

export default PieChartComponent;
