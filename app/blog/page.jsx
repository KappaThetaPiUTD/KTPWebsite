'use client';

import React, { useState } from "react";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    slug: "leadership-in-tech",
    title: "Leadership in Tech",
    author: "Kairavi Pandya",
    tags: ["Leadership", "Design", "UI/UX"],
    readTime: "12 min read",
    content: "Exploring the role of leadership in technology organizations and how KTP prepares members for these challenges.",
    publishedDate: new Date("2025-01-22"),
    category: "brothers" // Added category
  },
  {
    id: 2,
    slug: "design-thinking",
    title: "Design Thinking Workshop",
    author: "Kairavi Pandya",
    tags: ["Design", "Workshop", "UI/UX"],
    readTime: "8 min read",
    content: "Recap of our recent design thinking workshop and how these principles apply to real-world projects.",
    publishedDate: new Date("2025-01-15"),
    category: "brothers"
  },
  {
    id: 3,
    slug: "alumni-spotlight",
    title: "Alumni Spotlight",
    author: "Kairavi Pandya",
    tags: ["Alumni", "Interview", "Career"],
    readTime: "10 min read",
    content: "Spotlight on our distinguished alumni and their career journeys after graduating from UTD.",
    publishedDate: new Date("2025-01-10"),
    category: "alumni" // Added category
  },
  {
    id: 4,
    slug: "ux-best-practices",
    title: "UX Best Practices",
    author: "Kairavi Pandya",
    tags: ["UI/UX", "Design", "Tutorial"],
    readTime: "15 min read",
    content: "Essential UX best practices every designer should know, curated from our member experiences.",
    publishedDate: new Date("2025-01-05"),
    category: "brothers"
  },
  {
    id: 5,
    slug: "tech-interview-prep",
    title: "Tech Interview Prep",
    author: "Kairavi Pandya",
    tags: ["Career", "Interview", "Workshop"],
    readTime: "14 min read",
    content: "How we prepare members for technical interviews through our workshop series and mock interviews.",
    publishedDate: new Date("2024-12-20"),
    category: "brothers"
  },
  {
    id: 6,
    slug: "spring-recruitment",
    title: "Spring Recruitment",
    author: "Kairavi Pandya",
    tags: ["Recruitment", "Events", "Brothers"],
    readTime: "6 min read",
    content: "Everything you need to know about our Spring 2025 recruitment process and timeline.",
    publishedDate: new Date("2024-12-15"),
    category: "brothers"
  }
];

export default function BlogPage() {
  const [sortMethod, setSortMethod] = useState("newest");
  const [filter, setFilter] = useState("all"); // 'all', 'brothers', or 'alumni'
  
  const filteredPosts = blogPosts.filter(post => {
    if (filter === "all") return true;
    return post.category === filter;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return sortMethod === "newest" 
      ? b.publishedDate - a.publishedDate
      : a.publishedDate - b.publishedDate;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-16 px-4 md:px-8">
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="text-primary text-[28px] md:text-[36px] font-bold font-poppins text-center">
          Blog
        </div>
        <div className="text-primary text-[20px] md:text-[32px] text-center">
          Here, we share what our brothers and alumni want to showcase.
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6 px-4 md:px-8 gap-4">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-primary text-white" : "bg-gray-200 text-primary"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === "brothers" ? "bg-primary text-white" : "bg-gray-200 text-primary"}`}
            onClick={() => setFilter("brothers")}
          >
            Brothers
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${filter === "alumni" ? "bg-primary text-white" : "bg-gray-200 text-primary"}`}
            onClick={() => setFilter("alumni")}
          >
            Alumni
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary">Sort by:</span>
          <button 
            className={`px-4 py-2 rounded-lg ${sortMethod === "newest" ? "bg-primary text-white" : "bg-gray-200 text-primary"}`}
            onClick={() => setSortMethod("newest")}
          >
            Newest
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${sortMethod === "oldest" ? "bg-primary text-white" : "bg-gray-200 text-primary"}`}
            onClick={() => setSortMethod("oldest")}
          >
            Oldest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8 w-full">
        {sortedPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <div className="bg-white shadow-lg p-6 rounded-xl transition-all duration-300 hover:shadow-xl border border-gray-200 h-full flex flex-col">
              <div className="text-primary font-semibold mb-2 text-sm">
                Published: {post.publishedDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })} • {post.readTime}
              </div>
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="text-primary font-bold text-xl mb-2 group-hover:text-primary-dark">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">{post.content}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className={`px-3 py-1 rounded-md text-sm font-medium shadow-sm ${
                  post.category === "alumni" ? "bg-purple-200 text-purple-800" : "bg-green-200 text-primary"
                }`}>
                  {post.category === "alumni" ? "Alumni" : "Brothers"}
                </span>
                {post.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-green-200 text-primary px-3 py-1 rounded-md text-sm font-medium shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}