import React from "react";

export default function HoverCard({ description, createdBy }) {
  return (
    <div className="absolute z-10 bg-white border border-gray-300 shadow-lg rounded-lg p-4 text-sm w-64">
      <p className="font-semibold mb-2">Description:</p>
      <p className="text-gray-700 mb-4">
        {description || "No description available."}
      </p>
      <p className="font-semibold">Created By:</p>
      <p className="text-gray-700">{createdBy || "Unknown"}</p>
    </div>
  );
}
