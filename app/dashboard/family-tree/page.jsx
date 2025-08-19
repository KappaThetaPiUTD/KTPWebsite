"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import Sidebar from "../../../components/Sidebar";

export default function FamilyTreePage() {
  const [loading, setLoading] = useState(true);
  const svgRef = useRef();

  // Family tree data with VERY spacious positioning for maximum readability
  const familyData = [
    // Alpha Class (Spring 2023) - Top row with extra generous 600px spacing for better arrow readability
    { id: 'sanjana-shangle', name: 'Sanjana Shangle', year: 'Alpha', role: 'Brother', x: 50, y: 50 },
    { id: 'manasa-parachuri', name: 'Manasa Parachuri', year: 'Alpha', role: 'Alumni - F24', x: 300, y: 50 },
    { id: 'kairavi-pandya', name: 'Kairavi Pandya', year: 'Alpha', role: 'Alumni - S25', x: 862.5, y: 50 },
    { id: 'aashna-pattni', name: 'Aashna Pathi', year: 'Alpha', role: 'Alumni - S25', x: 2268.75, y: 50 },
    { id: 'yeshas-nath', name: 'Yeshas Nath', year: 'Alpha', role: 'Brother', x: 2912.5, y: 50 },
    { id: 'ethan-lobo', name: 'Ethan Lobo', year: 'Alpha', role: 'VP - Int. Affairs', x: 3925, y: 50 },
    { id: 'saloni-janorkar', name: 'Saloni Janorkar', year: 'Alpha', role: 'Dropped', x: 4800, y: 50 },
    { id: 'akshaya-kummetha', name: 'Akshaya Kummetha', year: 'Alpha', role: 'Dropped', x: 5175, y: 50 },
    { id: 'renjit-joseph', name: 'Renjit Joseph', year: 'Alpha', role: 'Dropped', x: 5862.5, y: 50 },
    { id: 'sriram-sendhil', name: 'Sriram Sendhil', year: 'Alpha', role: 'Dropped', x: 6550, y: 50 },
    { id: 'tanvi-surname', name: 'Tanvi', year: 'Alpha', role: 'Dropped', x: 6800, y: 50 },
    { id: 'ayush-bhavsar', name: 'Ayush Bhavsar', year: 'Alpha', role: 'Dropped', x: 7300, y: 50 },

    // Beta Class (Fall 2023) - Second row with very generous 400px spacing
    { id: 'sumi-suseendrababu', name: 'Sumi Suseendrababu', year: 'Beta', role: 'Alumni - S25', x: 300, y: 350 },
    { id: 'sanna-neelee', name: 'Sanna Neelee', year: 'Beta', role: 'Dropped', x: 550, y: 350 },
    { id: 'laiba-piracha', name: 'Laiba Piracha', year: 'Beta', role: 'Alumni - S25', x: 1175, y: 350 },
    { id: 'arya-thombare', name: 'Arya Thombare', year: 'Beta', role: 'Brother', x: 1987.5, y: 350 },
    { id: 'hima-nagi-reddy', name: 'Hima Nagi Reddy', year: 'Beta', role: 'Brother', x: 2550, y: 350 },
    { id: 'ethan-varghese', name: 'Ethan Varghese', year: 'Beta', role: 'Brother', x: 4550, y: 350 },
    { id: 'krisha-amravathi', name: 'Krisha Amravathi', year: 'Beta', role: 'Brother', x: 4800, y: 350 },
    { id: 'mansi-cherukupally', name: 'Mansi Cherukupally', year: 'Beta', role: 'VP - Finance', x: 5175, y: 350 },
    { id: 'afsar-arif', name: 'Afsar Arif', year: 'Beta', role: 'President', x: 5862.5, y: 350 },
    { id: 'wildan-susanto', name: 'Wildan Susanto', year: 'Beta', role: 'Alumni - S25', x: 6550, y: 350 },
    { id: 'avani-mehrotra', name: 'Avani Mehrotra', year: 'Beta', role: 'Alumni - S25', x: 6800, y: 350 },
    { id: 'rushil-patel', name: 'Rushil Patel', year: 'Beta', role: 'Brother', x: 7300, y: 350 },

    // Gamma Class (Fall 2024) - Third row with very generous 400px spacing
    { id: 'bhavya-rayankula', name: 'Bhavya Rayankula', year: 'Gamma', role: 'Dropped', x: 550, y: 650 },
    { id: 'meghana-pula', name: 'Meghana Pula', year: 'Gamma', role: 'Brother', x: 800, y: 650 },
    { id: 'faddil-khan', name: 'Faddil Khan', year: 'Gamma', role: 'Brother', x: 1050, y: 650 },
    { id: 'ayushi-deshmukh', name: 'Ayushi Deshmukh', year: 'Gamma', role: 'Brother', x: 1300, y: 650 },
    { id: 'aashay-vishwakarma', name: 'Aashay Vishwakarma', year: 'Gamma', role: 'VP - Prof Dev', x: 1675, y: 650 },
    { id: 'mekha-mathew', name: 'Mekha Mathew', year: 'Gamma', role: 'VP - Social Eng', x: 2300, y: 650 },
    { id: 'vadhanaa-venkat', name: 'Vadhanaa (Vee) Venkat', year: 'Gamma', role: 'VP - Marketing', x: 2550, y: 650 },
    { id: 'noel-emmanuel', name: 'Noel Emmanuel', year: 'Gamma', role: 'Brother', x: 2800, y: 650 },
    { id: 'aman-balam', name: 'Aman Balam', year: 'Gamma', role: 'Brother', x: 3800, y: 650 },
    { id: 'ishaan-dhandapani', name: 'Ishaan Dhandapani', year: 'Gamma', role: 'Brother', x: 4050, y: 650 },
    { id: 'shreyas-ankolekar', name: 'Shreyas Ankolekar', year: 'Gamma', role: 'Brother', x: 4300, y: 650 },
    { id: 'aadhav-manimurugan', name: 'Aadhav Manimurugan', year: 'Gamma', role: 'Brother', x: 5175, y: 650 },
    { id: 'ajay-kumaran', name: 'Ajay Kumaran', year: 'Gamma', role: 'VP - Ext. Affairs', x: 5550, y: 650 },
    { id: 'kavin-senthil', name: 'Kavin Senthil', year: 'Gamma', role: 'VP - Membership', x: 6175, y: 650 },
    { id: 'vignesh-selvam', name: 'Vignesh Selvam', year: 'Gamma', role: 'Brother', x: 6550, y: 650 },
    { id: 'venkat-sagi', name: 'Venkat Sagi', year: 'Gamma', role: 'VP - Technology', x: 6800, y: 650 },
    { id: 'itbaan-alam', name: 'Itbaan Alam', year: 'Gamma', role: 'Brother', x: 7050, y: 650 },
    { id: 'aamir-mohammed', name: 'Aamir Mohammed', year: 'Gamma', role: 'Brother', x: 7300, y: 650 },

    // Delta Class (Spring 2025) - Fourth row with very generous 400px spacing
    { id: 'ariha-kothari', name: 'Ariha Kothari', year: 'Delta', role: 'Brother', x: 50, y: 950 },
    { id: 'abhinav-atluri', name: 'Abhinav Atluri', year: 'Delta', role: 'Brother', x: 1550, y: 950 },
    { id: 'krish-patel', name: 'Krish Patel', year: 'Delta', role: 'Brother', x: 1800, y: 950 },
    { id: 'joel-philipose', name: 'Joel Philipose', year: 'Delta', role: 'Brother', x: 2050, y: 950 },
    { id: 'anvi-siddabhatuni', name: 'Anvi Siddabhatuni', year: 'Delta', role: 'Brother', x: 2300, y: 950 },
    { id: 'aditya-dixit', name: 'Aditya Dixit', year: 'Delta', role: 'Brother', x: 3050, y: 950 },
    { id: 'ruthvik-penmatsa', name: 'Ruthvik Penmatsa', year: 'Delta', role: 'Brother', x: 2800, y: 950 },
    { id: 'ayaan-khan', name: 'Ayaan Khan', year: 'Delta', role: 'Brother', x: 3300, y: 950 },
    { id: 'nihita-soma', name: 'Nihita Soma', year: 'Delta', role: 'Brother', x: 3550, y: 950 },
    { id: 'rishi-ramesh', name: 'Rishi Ramesh', year: 'Delta', role: 'Brother', x: 4050, y: 950 },
    { id: 'jeevika-balaji', name: 'Jeevika Balaji', year: 'Delta', role: 'Brother', x: 4800, y: 950 },
    { id: 'abdul-qazaffi', name: 'Abdul Qazaffi', year: 'Delta', role: 'Dropped', x: 5050, y: 950 },
    { id: 'praneel-sreepada', name: 'Praneel Sreepada', year: 'Delta', role: 'Brother', x: 5300, y: 950 },
    { id: 'ayush-velhal', name: 'Ayush Velhal', year: 'Delta', role: 'Brother', x: 5550, y: 950 },
    { id: 'simon-beyene', name: 'Simon Beyene', year: 'Delta', role: 'Brother', x: 6300, y: 950 },
    { id: 'rahil-islam', name: 'Rahil Islam', year: 'Delta', role: 'Brother', x: 6050, y: 950 },
    { id: 'arnav-jain', name: 'Arnav Jain', year: 'Delta', role: 'Brother', x: 5800, y: 950 },
    { id: 'aaron-gheevargheese', name: 'Aaron Gheevargheese', year: 'Delta', role: 'Brother', x: 6800, y: 950 },
    { id: 'sahaj-dahal', name: 'Sahaj Dahal', year: 'Delta', role: 'Brother', x: 7300, y: 950 },
    { id: 'sachin-selvakumar', name: 'Sachin Selvakumar', year: 'Delta', role: 'Brother', x: 7600, y: 950 }
  ];

  // Edge data - all connections from ReactFlow
  const edgeData = [
    // Alpha's littles
    { source: 'sanjana-shangle', target: 'ariha-kothari' },
    { source: 'manasa-parachuri', target: 'sumi-suseendrababu' },
    { source: 'kairavi-pandya', target: 'sanna-neelee' },
    { source: 'kairavi-pandya', target: 'laiba-piracha' },
    { source: 'kairavi-pandya', target: 'meghana-pula' },
    { source: 'aashna-pattni', target: 'arya-thombare' },
    { source: 'aashna-pattni', target: 'hima-nagi-reddy' },
    { source: 'yeshas-nath', target: 'noel-emmanuel' },
    { source: 'yeshas-nath', target: 'aditya-dixit' },
    { source: 'ethan-lobo', target: 'ethan-varghese' },
    { source: 'ethan-lobo', target: 'aman-balam' },
    { source: 'ethan-lobo', target: 'ishaan-dhandapani' },
    { source: 'ethan-lobo', target: 'shreyas-ankolekar' },
    { source: 'ethan-lobo', target: 'ayaan-khan' },
    { source: 'ethan-lobo', target: 'nihita-soma' },
    { source: 'saloni-janorkar', target: 'krisha-amravathi' },
    { source: 'akshaya-kummetha', target: 'mansi-cherukupally' },
    { source: 'renjit-joseph', target: 'afsar-arif' },
    { source: 'sriram-sendhil', target: 'wildan-susanto' },
    { source: 'tanvi-surname', target: 'avani-mehrotra' },
    { source: 'ayush-bhavsar', target: 'rushil-patel' },

    // Beta's littles
    { source: 'sanna-neelee', target: 'bhavya-rayankula' },
    { source: 'laiba-piracha', target: 'faddil-khan' },
    { source: 'laiba-piracha', target: 'ayushi-deshmukh' },
    { source: 'arya-thombare', target: 'aashay-vishwakarma' },
    { source: 'arya-thombare', target: 'mekha-mathew' },
    { source: 'arya-thombare', target: 'joel-philipose' },
    { source: 'hima-nagi-reddy', target: 'vadhanaa-venkat' },
    { source: 'krisha-amravathi', target: 'jeevika-balaji' },
    { source: 'mansi-cherukupally', target: 'aadhav-manimurugan' },
    { source: 'afsar-arif', target: 'ajay-kumaran' },
    { source: 'afsar-arif', target: 'kavin-senthil' },
    { source: 'afsar-arif', target: 'arnav-jain' },
    { source: 'wildan-susanto', target: 'vignesh-selvam' },
    { source: 'avani-mehrotra', target: 'venkat-sagi' },
    { source: 'rushil-patel', target: 'itbaan-alam' },
    { source: 'rushil-patel', target: 'aamir-mohammed' },
    { source: 'rushil-patel', target: 'sachin-selvakumar' },

    // Gamma's littles
    { source: 'aashay-vishwakarma', target: 'abhinav-atluri' },
    { source: 'aashay-vishwakarma', target: 'krish-patel' },
    { source: 'mekha-mathew', target: 'anvi-siddabhatuni' },
    { source: 'noel-emmanuel', target: 'ruthvik-penmatsa' },
    { source: 'ishaan-dhandapani', target: 'rishi-ramesh' },
    { source: 'aadhav-manimurugan', target: 'abdul-qazaffi' },
    { source: 'aadhav-manimurugan', target: 'praneel-sreepada' },
    { source: 'ajay-kumaran', target: 'ayush-velhal' },
    { source: 'kavin-senthil', target: 'simon-beyene' },
    { source: 'kavin-senthil', target: 'rahil-islam' },
    { source: 'venkat-sagi', target: 'aaron-gheevargheese' },
    { source: 'aamir-mohammed', target: 'sahaj-dahal' }
  ];

  // Color coding function
  const getCardColor = (role) => {
    if (role.includes('Alumni')) return '#d97706'; // amber-600 (prestigious gold)
    if (role.includes('Dropped')) return '#d1d5db'; // gray-300
    if (role.includes('President') || role.includes('VP')) return '#7c3aed'; // purple-600
    if (role === 'Sister') return '#fb923c'; // orange-400
    return '#60a5fa'; // blue-400 (Brothers and others)
  };

  const getTextColor = (role) => {
    if (role.includes('Dropped')) return '#000000';
    return '#ffffff';
  };

  useEffect(() => {
    setLoading(false);
    // Add a small delay to ensure the SVG ref is ready
    const timer = setTimeout(() => {
      drawTree();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const drawTree = () => {
    console.log("Drawing tree...", svgRef.current); // Debug log
    
    if (!svgRef.current) {
      console.log("SVG ref not ready");
      return;
    }
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content
    
    const width = 4000; // Much wider to accommodate extra spacious Alpha class layout
    const height = 1200; // Much taller for better vertical spacing
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    svg
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f9fafb");

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create a map for quick node lookup
    const nodeMap = new Map();
    familyData.forEach(node => {
      nodeMap.set(node.id, node);
    });

    // Add arrowheads first
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("fill", "#374151");

    // Draw edges first (so they appear behind nodes) - using curved paths
    const lines = g.selectAll(".edge")
      .data(edgeData)
      .enter().append("path")
      .attr("class", "edge")
      .attr("d", d => {
        const sourceX = nodeMap.get(d.source).x + 100; // Center of source node
        const sourceY = nodeMap.get(d.source).y + 80; // Bottom of source node
        const targetX = nodeMap.get(d.target).x + 100; // Center of target node
        const targetY = nodeMap.get(d.target).y; // Top of target node
        
        // Create curved path with control points
        const midY = sourceY + (targetY - sourceY) / 2;
        
        return `M ${sourceX} ${sourceY} 
                C ${sourceX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`;
      })
      .style("stroke", "#374151")
      .style("stroke-width", "2px")
      .style("fill", "none")
      .style("opacity", 0.7)
      .attr("marker-end", "url(#arrowhead)");

    // Draw nodes - use direct positioning without scaling
    const nodes = g.selectAll(".node")
      .data(familyData)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add node rectangles - larger for better readability
    nodes.append("rect")
      .attr("width", 200) // Wider cards
      .attr("height", 80) // Taller cards
      .attr("rx", 10)
      .attr("ry", 10)
      .style("fill", d => getCardColor(d.role))
      .style("stroke", "#6b7280")
      .style("stroke-width", "1px")
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))");

    // Add names - centered in wider cards
    nodes.append("text")
      .attr("x", 100) // Center of 200px wide card
      .attr("y", 22)
      .style("text-anchor", "middle")
      .style("font-size", "14px") // Larger font
      .style("font-weight", "600")
      .style("fill", d => getTextColor(d.role))
      .style("font-family", "Public Sans, sans-serif")
      .text(d => d.name);

    // Add years
    nodes.append("text")
      .attr("x", 100)
      .attr("y", 40)
      .style("text-anchor", "middle")
      .style("font-size", "12px") // Larger font
      .style("fill", d => getTextColor(d.role))
      .style("opacity", 0.9)
      .style("font-family", "Public Sans, sans-serif")
      .text(d => d.year);

    // Add roles
    nodes.append("text")
      .attr("x", 100)
      .attr("y", 58)
      .style("text-anchor", "middle")
      .style("font-size", "11px") // Larger font
      .style("fill", d => getTextColor(d.role))
      .style("opacity", 0.8)
      .style("font-style", "italic")
      .style("font-family", "Public Sans, sans-serif")
      .text(d => d.role);

    // Add zoom and pan functionality
    const zoom = d3.zoom()
      .scaleExtent([0.2, 2]) // Better zoom range for larger layout
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Set initial zoom to fit the content better
    const initialScale = 0.3; // Start zoomed out to see the spacious layout
    svg.call(zoom.transform, d3.zoomIdentity.scale(initialScale));
    
    console.log("Tree drawn successfully"); // Debug log
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-gray-500">Loading...</div>;
  }

  // Count statistics
  const alphaMembers = familyData.filter(node => node.year === 'Alpha').length;
  const betaMembers = familyData.filter(node => node.year === 'Beta').length;
  const gammaMembers = familyData.filter(node => node.year === 'Gamma').length;
  const deltaMembers = familyData.filter(node => node.year === 'Delta').length;
  const alumniMembers = familyData.filter(node => 
    node.role.includes('Alumni')
  ).length;
  const currentActiveMembers = familyData.filter(node => 
    !node.role.includes('Alumni') && 
    !node.role.includes('Dropped')
  ).length;

  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans'] grid grid-cols-[220px_1fr]">

      {/* Sidebar */}
      <aside className="bg-white px-6 py-10 font-['Inter'] border-r border-black shadow-sm space-y-6">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="px-8 py-6 w-full">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#1E3D2F]">Family Tree</h1>
          <p className="text-gray-600 text-sm mt-2">Explore the lineage and connections within our fraternity</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-[800px] overflow-hidden">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#1E3D2F] mb-4">Family Tree Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1E3D2F]">{alphaMembers}</div>
              <div className="text-sm text-gray-600">Alpha Class</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1E3D2F]">{betaMembers}</div>
              <div className="text-sm text-gray-600">Beta Class</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1E3D2F]">{gammaMembers}</div>
              <div className="text-sm text-gray-600">Gamma Class</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1E3D2F]">{deltaMembers}</div>
              <div className="text-sm text-gray-600">Delta Class</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1E3D2F]">{alumniMembers}</div>
              <div className="text-sm text-gray-600">Alumni</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1E3D2F]">{currentActiveMembers}</div>
              <div className="text-sm text-gray-600">Active Members</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#1E3D2F] mb-4">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
              <span className="text-sm">Executive Board</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
              <span className="text-sm">Active Brothers</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-amber-600 rounded mr-2"></div>
              <span className="text-sm">Alumni</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 border border-gray-400 rounded mr-2"></div>
              <span className="text-sm">Dropped</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-4">
          <p className="text-sm text-blue-800">
            <strong>Navigation:</strong> Use mouse wheel to zoom in/out and click & drag to pan around the family tree.
          </p>
        </div>
      </main>
    </div>
  );
}