"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Sector, Label, Line } from "recharts";

const MajorChart = ({ data, colors }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = (data, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const handleClick = (data, index) => {
    // Call the handleClick function passed from props
  };
  

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="40%"
        outerRadius={100}
        labelLine={true}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={
              activeIndex === index
                ? colors[index % colors.length]
                : `${colors[index % colors.length]}80` // Dim color for inactive segments
            }
          />
        ))}
        {data.map((entry, index) => (
          <Sector
            key={`sector-${index}`}
            cx="50%"
            cy="40%"
            innerRadius={100}
            outerRadius={activeIndex === index ? 110 : 100} // Increase radius for active segment
            startAngle={entry.startAngle}
            endAngle={entry.endAngle}
            fill={
              activeIndex === index
                ? colors[index % colors.length]
                : `${colors[index % colors.length]}100` // Dim color for inactive segments
            }
          />
        ))}
        {data.map((entry, index) => {
          const radius = 110;
          const midAngle =
            (entry.startAngle + entry.endAngle) / 2;
          const x = Math.cos(-midAngle * Math.PI / 180) * radius;
          const y = Math.sin(-midAngle * Math.PI / 180) * radius;
          return (
            <g key={`label-line-${index}`}>
              <Line
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke={
                  activeIndex === index
                    ? colors[index % colors.length]
                    : `${colors[index % colors.length]}80`
                }
              />
              <Label
                key={`label-${index}`}
                value={entry.name}
                x={x}
                y={y}
                position="center"
                fill={
                  activeIndex === index
                    ? colors[index % colors.length]
                    : `${colors[index % colors.length]}80`
                }
              />
            </g>
          );
        })}
      </Pie>
    </PieChart>
  );
};

export default MajorChart;
