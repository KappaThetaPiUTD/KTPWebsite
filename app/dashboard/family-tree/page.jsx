"use client";

import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node component for family members
const FamilyMemberNode = ({ data }) => {
  // Color coding based on role/status
  const getCardColor = (role) => {
    if (role.includes('Alumni') || role.includes('Dropped')) return 'bg-gray-400 text-white';
    if (role.includes('President') || role.includes('VP')) return 'bg-purple-600 text-white';
    if (role === 'Sister') return 'bg-orange-400 text-white';
    return 'bg-blue-400 text-white'; // Brothers and others
  };
  
  return (
    <div className={`px-3 py-2 shadow-md rounded-lg ${getCardColor(data.role)} min-w-[160px] max-w-[180px]`}>
      <div className="text-center">
        <div className="text-xs font-semibold leading-tight">{data.name}</div>
        <div className="text-xs opacity-90 mt-1">{data.year}</div>
        <div className="text-xs opacity-80 mt-1 italic">{data.role}</div>
      </div>
    </div>
  );
};

// Define custom node types
const nodeTypes = {
  familyMember: FamilyMemberNode,
};

export default function FamilyTreePage() {
  const [loading, setLoading] = useState(true);

  // Family tree data converted to React Flow format with proper spacing
  const initialNodes = [
    // Alpha Class (Spring 2023) - Top row, spaced evenly
    {
      id: 'sanjana-shangle',
      type: 'familyMember',
      position: { x: 100, y: 50 },
      data: { 
        name: 'Sanjana Shangle', 
        year: 'S23', 
        role: 'Brother'
      }
    },
    {
      id: 'manasa-parachuri',
      type: 'familyMember',
      position: { x: 300, y: 50 },
      data: { 
        name: 'Manasa Parachuri', 
        year: 'S23', 
        role: 'Alumni - F24',
      }
    },
    {
      id: 'kairavi-pandya',
      type: 'familyMember',
      position: { x: 500, y: 50 },
      data: { 
        name: 'Kairavi Pandya', 
        year: 'S23', 
        role: 'Alumni - S25'
      }
    },
    {
      id: 'aashna-pattni',
      type: 'familyMember',
      position: { x: 700, y: 50 },
      data: { 
        name: 'Aashna Pathi', 
        year: 'S23', 
        role: 'Alumni - S25',
      }
    },
    {
      id: 'yeshas-nath',
      type: 'familyMember',
      position: { x: 900, y: 50 },
      data: { 
        name: 'Yeshas Nath', 
        year: 'S23', 
        role: 'Brother'
      }
    },
    {
      id: 'ethan-lobo',
      type: 'familyMember',
      position: { x: 1100, y: 50 },
      data: { 
        name: 'Ethan Lobo', 
        year: 'S23', 
        role: 'VP - Int. Affairs',
      }
    },
    {
      id: 'saloni-janorkar',
      type: 'familyMember',
      position: { x: 1300, y: 50 },
      data: { 
        name: 'Saloni Janorkar', 
        year: 'S23', 
        role: 'Dropped - ???'
      }
    },
    {
      id: 'akshaya-kummetha',
      type: 'familyMember',
      position: { x: 1500, y: 50 },
      data: { 
        name: 'Akshaya Kummetha', 
        year: 'S23', 
        role: 'Dropped - ???'
      }
    },
    {
      id: 'renjit-joseph',
      type: 'familyMember',
      position: { x: 1700, y: 50 },
      data: { 
        name: 'Renjit Joseph', 
        year: 'S23', 
        role: 'Dropped - F24'
      }
    },
    {
      id: 'sriram-sendhil',
      type: 'familyMember',
      position: { x: 1900, y: 50 },
      data: { 
        name: 'Sriram Sendhil', 
        year: 'S23', 
        role: 'Dropped - ???'
      }
    },
    {
      id: 'tanvi-surname',
      type: 'familyMember',
      position: { x: 2100, y: 50 },
      data: { 
        name: 'Tanvi', 
        year: 'S23', 
        role: 'Dropped - ???'
      }
    },
    {
      id: 'ayush-bhavsar',
      type: 'familyMember',
      position: { x: 2300, y: 50 },
      data: { 
        name: 'Ayush Bhavsar', 
        year: 'S23', 
        role: 'Dropped - ???'
      }
    },

    // Beta Class (Fall 2023) - Second row
    {
      id: 'sumi-suseendrababu',
      type: 'familyMember',
      position: { x: 300, y: 200 },
      data: { 
        name: 'Sumi Suseendrababu', 
        year: 'F23', 
        role: 'Alumni - S25'
      }
    },
    {
      id: 'sanna-neelee',
      type: 'familyMember',
      position: { x: 450, y: 200 },
      data: { 
        name: 'Sanna Neelee', 
        year: 'F23', 
        role: 'Dropped - S25'
      }
    },
    {
      id: 'laiba-piracha',
      type: 'familyMember',
      position: { x: 600, y: 200 },
      data: { 
        name: 'Laiba Piracha', 
        year: 'F23', 
        role: 'Alumni - S25'
      }
    },
    {
      id: 'arya-thombare',
      type: 'familyMember',
      position: { x: 750, y: 200 },
      data: { 
        name: 'Arya Thombare', 
        year: 'F23', 
        role: 'Brother'
      }
    },
    {
      id: 'hima-nagi-reddy',
      type: 'familyMember',
      position: { x: 900, y: 200 },
      data: { 
        name: 'Hima Nagi Reddy', 
        year: 'F23', 
        role: 'Brother'
      }
    },
    {
      id: 'ethan-varghese',
      type: 'familyMember',
      position: { x: 1050, y: 200 },
      data: { 
        name: 'Ethan Varghese', 
        year: 'F23', 
        role: 'Brother'
      }
    },
    {
      id: 'krisha-amravathi',
      type: 'familyMember',
      position: { x: 1200, y: 200 },
      data: { 
        name: 'Krisha Amravathi', 
        year: 'F23', 
        role: 'Brother'
      }
    },
    {
      id: 'mansi-cherukupally',
      type: 'familyMember',
      position: { x: 1350, y: 200 },
      data: { 
        name: 'Mansi Cherukupally', 
        year: 'F23', 
        role: 'VP - Finance'
      }
    },
    {
      id: 'afsar-arif',
      type: 'familyMember',
      position: { x: 1500, y: 200 },
      data: { 
        name: 'Afsar Arif', 
        year: 'F23', 
        role: 'President'
      }
    },
    {
      id: 'wildan-susanto',
      type: 'familyMember',
      position: { x: 1650, y: 200 },
      data: { 
        name: 'Wildan Susanto', 
        year: 'F23', 
        role: 'Alumni - S25'
      }
    },
    {
      id: 'avani-mehrotra',
      type: 'familyMember',
      position: { x: 1800, y: 200 },
      data: { 
        name: 'Avani Mehrotra', 
        year: 'F23', 
        role: 'Alumni - S25'
      }
    },
    {
      id: 'rushil-patel',
      type: 'familyMember',
      position: { x: 1950, y: 200 },
      data: { 
        name: 'Rushil Patel', 
        year: 'F23', 
        role: 'Brother'
      }
    },

    // Gamma Class (Fall 2024) - Third row
    {
      id: 'bhavya-rayankula',
      type: 'familyMember',
      position: { x: 450, y: 350 },
      data: { 
        name: 'Bhavya Rayankula', 
        year: 'F24', 
        role: 'Dropped - S25'
      }
    },
    {
      id: 'meghana-pula',
      type: 'familyMember',
      position: { x: 500, y: 350 },
      data: { 
        name: 'Meghana Pula', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'faddil-khan',
      type: 'familyMember',
      position: { x: 550, y: 350 },
      data: { 
        name: 'Faddil Khan', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'ayushi-deshmukh',
      type: 'familyMember',
      position: { x: 650, y: 350 },
      data: { 
        name: 'Ayushi Deshmukh', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'aashay-vishwakarma',
      type: 'familyMember',
      position: { x: 700, y: 350 },
      data: { 
        name: 'Aashay Vishwakarma', 
        year: 'F24', 
        role: 'VP - Prof Dev'
      }
    },
    {
      id: 'mekha-mathew',
      type: 'familyMember',
      position: { x: 800, y: 350 },
      data: { 
        name: 'Mekha Mathew', 
        year: 'F24', 
        role: 'VP - Social Eng'
      }
    },
    {
      id: 'vadhanaa-venkat',
      type: 'familyMember',
      position: { x: 900, y: 350 },
      data: { 
        name: 'Vadhanaa (Vee) Venkat', 
        year: 'F24', 
        role: 'VP - Marketing'
      }
    },
    {
      id: 'noel-emmanuel',
      type: 'familyMember',
      position: { x: 950, y: 350 },
      data: { 
        name: 'Noel Emmanuel', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'aman-balam',
      type: 'familyMember',
      position: { x: 1000, y: 350 },
      data: { 
        name: 'Aman Balam', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'ishaan-dhandapani',
      type: 'familyMember',
      position: { x: 1100, y: 350 },
      data: { 
        name: 'Ishaan Dhandapani', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'shreyas-ankolekar',
      type: 'familyMember',
      position: { x: 1150, y: 350 },
      data: { 
        name: 'Shreyas Ankolekar', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'aadhav-manimurugan',
      type: 'familyMember',
      position: { x: 1300, y: 350 },
      data: { 
        name: 'Aadhav Manimurugan', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'ajay-kumaran',
      type: 'familyMember',
      position: { x: 1450, y: 350 },
      data: { 
        name: 'Ajay Kumaran', 
        year: 'F24', 
        role: 'VP - Ext. Affairs'
      }
    },
    {
      id: 'kavin-senthil',
      type: 'familyMember',
      position: { x: 1500, y: 350 },
      data: { 
        name: 'Kavin Senthil', 
        year: 'F24', 
        role: 'VP - Membership'
      }
    },
    {
      id: 'vignesh-selvam',
      type: 'familyMember',
      position: { x: 1600, y: 350 },
      data: { 
        name: 'Vignesh Selvam', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'venkat-sagi',
      type: 'familyMember',
      position: { x: 1750, y: 350 },
      data: { 
        name: 'Venkat Sagi', 
        year: 'F24', 
        role: 'VP - Technology'
      }
    },
    {
      id: 'itbaan-alam',
      type: 'familyMember',
      position: { x: 1850, y: 350 },
      data: { 
        name: 'Itbaan Alam', 
        year: 'F24', 
        role: 'Brother'
      }
    },
    {
      id: 'aamir-mohammed',
      type: 'familyMember',
      position: { x: 2000, y: 350 },
      data: { 
        name: 'Aamir Mohammed', 
        year: 'F24', 
        role: 'Brother'
      }
    },

    // Delta Class (Spring 2025) - Fourth row
    {
      id: 'ariha-kothari',
      type: 'familyMember',
      position: { x: 100, y: 500 },
      data: { 
        name: 'Ariha Kothari', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'joel-philipose',
      type: 'familyMember',
      position: { x: 750, y: 500 },
      data: { 
        name: 'Joel Philipose', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'abhinav-atluri',
      type: 'familyMember',
      position: { x: 650, y: 500 },
      data: { 
        name: 'Abhinav Atluri', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'krish-patel',
      type: 'familyMember',
      position: { x: 720, y: 500 },
      data: { 
        name: 'Krish Patel', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'anvi-siddabhatuni',
      type: 'familyMember',
      position: { x: 800, y: 500 },
      data: { 
        name: 'Anvi Siddabhatuni', 
        year: 'S25', 
        role: 'Sister'
      }
    },
    {
      id: 'ruthvik-penmatsa',
      type: 'familyMember',
      position: { x: 950, y: 500 },
      data: { 
        name: 'Ruthvik Penmatsa', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'aditya-dixit',
      type: 'familyMember',
      position: { x: 900, y: 500 },
      data: { 
        name: 'Aditya Dixit', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'ayaan-khan',
      type: 'familyMember',
      position: { x: 1000, y: 500 },
      data: { 
        name: 'Ayaan Khan', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'nihita-soma',
      type: 'familyMember',
      position: { x: 1050, y: 500 },
      data: { 
        name: 'Nihita Soma', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'rishi-ramesh',
      type: 'familyMember',
      position: { x: 1100, y: 500 },
      data: { 
        name: 'Rishi Ramesh', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'jeevika-balaji',
      type: 'familyMember',
      position: { x: 1200, y: 500 },
      data: { 
        name: 'Jeevika Balaji', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'abdul-qazaffi',
      type: 'familyMember',
      position: { x: 1250, y: 500 },
      data: { 
        name: 'Abdul Qazaffi', 
        year: 'S25', 
        role: 'Dropped - S25'
      }
    },
    {
      id: 'praneel-sreepada',
      type: 'familyMember',
      position: { x: 1350, y: 500 },
      data: { 
        name: 'Praneel Sreepada', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'ayush-velhal',
      type: 'familyMember',
      position: { x: 1450, y: 500 },
      data: { 
        name: 'Ayush Velhal', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'simon-beyene',
      type: 'familyMember',
      position: { x: 1500, y: 500 },
      data: { 
        name: 'Simon Beyene', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'rahil-islam',
      type: 'familyMember',
      position: { x: 1550, y: 500 },
      data: { 
        name: 'Rahil Islam', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'arnav-jain',
      type: 'familyMember',
      position: { x: 1600, y: 500 },
      data: { 
        name: 'Arnav Jain', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'aaron-gheevargheese',
      type: 'familyMember',
      position: { x: 1750, y: 500 },
      data: { 
        name: 'Aaron Gheevargheese', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'sahaj-dahal',
      type: 'familyMember',
      position: { x: 2000, y: 500 },
      data: { 
        name: 'Sahaj Dahal', 
        year: 'S25', 
        role: 'Brother'
      }
    },
    {
      id: 'sachin-selvakumar',
      type: 'familyMember',
      position: { x: 2100, y: 500 },
      data: { 
        name: 'Sachin Selvakumar', 
        year: 'S25', 
        role: 'Brother'
      }
    },
  ];

  const initialEdges = [
    // Alpha's littles
    { id: 'e1', source: 'sanjana-shangle', target: 'ariha-kothari', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2', source: 'manasa-parachuri', target: 'sumi-suseendrababu', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3', source: 'kairavi-pandya', target: 'sanna-neelee', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e4', source: 'kairavi-pandya', target: 'laiba-piracha', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e5', source: 'kairavi-pandya', target: 'meghana-pula', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e6', source: 'aashna-pattni', target: 'arya-thombare', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e7', source: 'aashna-pattni', target: 'hima-nagi-reddy', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e8', source: 'yeshas-nath', target: 'noel-emmanuel', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e9', source: 'yeshas-nath', target: 'aditya-dixit', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e10', source: 'ethan-lobo', target: 'ethan-varghese', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e11', source: 'ethan-lobo', target: 'aman-balam', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e12', source: 'ethan-lobo', target: 'ishaan-dhandapani', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e13', source: 'ethan-lobo', target: 'shreyas-ankolekar', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e14', source: 'ethan-lobo', target: 'ayaan-khan', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e15', source: 'ethan-lobo', target: 'nihita-soma', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e17', source: 'saloni-janorkar', target: 'krisha-amravathi', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e18', source: 'akshaya-kummetha', target: 'mansi-cherukupally', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e19', source: 'renjit-joseph', target: 'afsar-arif', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e20', source: 'sriram-sendhil', target: 'wildan-susanto', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e21', source: 'tanvi-surname', target: 'avani-mehrotra', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e22', source: 'ayush-bhavsar', target: 'rushil-patel', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },

    // Beta's littles
    { id: 'e23', source: 'sanna-neelee', target: 'bhavya-rayankula', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e24', source: 'laiba-piracha', target: 'faddil-khan', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e25', source: 'laiba-piracha', target: 'ayushi-deshmukh', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e26', source: 'arya-thombare', target: 'aashay-vishwakarma', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e27', source: 'arya-thombare', target: 'mekha-mathew', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e28', source: 'arya-thombare', target: 'joel-philipose', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e29', source: 'hima-nagi-reddy', target: 'vadhanaa-venkat', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e30', source: 'krisha-amravathi', target: 'jeevika-balaji', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e31', source: 'mansi-cherukupally', target: 'aadhav-manimurugan', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e32', source: 'afsar-arif', target: 'ajay-kumaran', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e33', source: 'afsar-arif', target: 'kavin-senthil', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e34', source: 'afsar-arif', target: 'arnav-jain', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e35', source: 'wildan-susanto', target: 'vignesh-selvam', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e36', source: 'avani-mehrotra', target: 'venkat-sagi', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e37', source: 'rushil-patel', target: 'itbaan-alam', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e38', source: 'rushil-patel', target: 'aamir-mohammed', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e39', source: 'rushil-patel', target: 'sachin-selvakumar', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },

    // Gamma's littles
    { id: 'e40', source: 'aashay-vishwakarma', target: 'abhinav-atluri', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e41', source: 'aashay-vishwakarma', target: 'krish-patel', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e42', source: 'mekha-mathew', target: 'anvi-siddabhatuni', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e43', source: 'noel-emmanuel', target: 'ruthvik-penmatsa', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e44', source: 'ishaan-dhandapani', target: 'rishi-ramesh', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e45', source: 'aadhav-manimurugan', target: 'abdul-qazaffi', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e46', source: 'aadhav-manimurugan', target: 'praneel-sreepada', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e47', source: 'ajay-kumaran', target: 'ayush-velhal', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e48', source: 'kavin-senthil', target: 'simon-beyene', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e49', source: 'kavin-senthil', target: 'rahil-islam', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e50', source: 'venkat-sagi', target: 'aaron-gheevargheese', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e51', source: 'aamir-mohammed', target: 'sahaj-dahal', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-gray-500">Loading...</div>;
  }

  // Count statistics
  const totalMembers = initialNodes.length;
  const alphaMembers = initialNodes.filter(node => node.data.year === 'S23').length;
  const currentActiveMembers = initialNodes.filter(node => 
    !node.data.role.includes('Alumni') && 
    !node.data.role.includes('Dropped')
  ).length;

  return (
    <div className="min-h-screen bg-white pt-24 text-sm text-black font-['Public_Sans']">
      <main className="px-8 py-6 w-full">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#1E3D2F]">Family Tree</h1>
          <p className="text-gray-600 text-sm mt-2">Explore the lineage and connections within our fraternity</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-[700px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionLineType={ConnectionLineType.Straight}
            fitView
            className="bg-gray-50"
          >
          </ReactFlow>
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#1E3D2F] mb-4">Family Tree Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1E3D2F]">4</div>
              <div className="text-sm text-gray-600">Classes</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1E3D2F]">{totalMembers}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-[#1E3D2F]">{alphaMembers}</div>
              <div className="text-sm text-gray-600">Alpha Class</div>
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
              <span className="text-sm">Executive Board / President</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-400 rounded mr-2"></div>
              <span className="text-sm">Active Brothers</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-400 rounded mr-2"></div>
              <span className="text-sm">Sisters</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
              <span className="text-sm">Alumni / Dropped</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}