'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [sortMethod, setSortMethod] = useState("newest");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
      const fetchPosts = async () => {
        const res = await fetch("/api/blog");
        const data = await res.json();
        console.log("Fetched:", data);
        setPosts(data || []);
      };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    if (filter === "all") return true;
    return post.category === filter;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortMethod === "newest" 
      ? dateB - dateA
      : dateA - dateB;
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
          {["all", "brothers", "alumni"].map((cat) => (
            <button 
              key={cat}
              className={`px-4 py-2 rounded-lg ${filter === cat ? "bg-primary text-white" : "bg-gray-200 text-primary"}`}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary">Sort by:</span>
          {["newest", "oldest"].map((method) => (
            <button 
              key={method}
              className={`px-4 py-2 rounded-lg ${sortMethod === method ? "bg-primary text-white" : "bg-gray-200 text-primary"}`}
              onClick={() => setSortMethod(method)}
            >
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8 w-full">
        {sortedPosts.map((post) => (
          <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="group">
            <div className="bg-white shadow-lg p-6 rounded-xl transition-all duration-300 hover:shadow-xl border border-gray-200 h-full flex flex-col">
              <div className="text-primary font-semibold mb-2 text-sm">
                Published: {new Date(post.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })} • {post.readTime || "?"}
              </div>
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="text-primary font-bold text-xl mb-2 group-hover:text-primary-dark">
                {post.title}
              </h3>
              <p className="text-green-800 mb-4 flex-grow">{post.content}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className={`px-3 py-1 rounded-md text-sm font-medium shadow-sm ${
                  post.category === "alumni" ? "bg-purple-200 text-purple-800" : "bg-green-200 text-primary"
                }`}>
                  {post.category === "alumni" ? "Alumni" : "Brothers"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}