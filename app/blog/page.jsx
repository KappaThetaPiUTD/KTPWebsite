'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaThumbtack } from "react-icons/fa";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [sortMethod, setSortMethod] = useState("newest");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/blog");
      const data = await res.json();
      console.log("FULL POSTS DATA:", data); // Add this line
      setPosts(Array.isArray(data) ? data : data?.posts || []);
    };
    fetchPosts();
  }, []);

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    if (filter === "all") return true;
    return post.category?.trim().toLowerCase() === filter.toLowerCase();
  }) : [];

  const pinnedPosts = filteredPosts.filter(post => Boolean(post.is_pinned) === true);
  const nonPinnedPosts = filteredPosts.filter(post => Boolean(post.is_pinned) === false);

  const sortPosts = (a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortMethod === "newest" ? dateB - dateA : dateA - dateB;
  };

  const sortedPinned = [...pinnedPosts].sort(sortPosts);
  const sortedNonPinned = [...nonPinnedPosts].sort(sortPosts);

  const sortedPosts = [...sortedPinned, ...sortedNonPinned];

  return (

<div className="min-h-screen bg-white flex flex-col items-center justify-start pt-16 pb-20 px-4 md:px-8">
      <div className="flex flex-col items-center space-y-2 mb-6 pt-8">
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
            <div className="bg-white shadow-lg p-6 rounded-xl transition-all duration-300 hover:shadow-xl border-2 border-green-50 hover:border-green-300 h-full flex flex-col hover:-translate-y-1 relative">
            
            {post.is_pinned && (
            <div className="absolute top-4 right-4 text-green-800 z-10">
              <FaThumbtack className="text-xl transform rotate-45" />
              <span className="sr-only">Pinned Post</span>
            </div>
          )}
              
              <div className="text-green-800 font-medium mb-2 text-sm">
                Published: {new Date(post.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })} • {post.readTime?.endsWith('read') ? post.readTime : `${post.readTime || "?"} read`}
              </div>

              <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-green-50">
  {post.image ? (
    <img
      src={post.image}
      alt={post.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 opacity-100 group-hover:opacity-900 transition-opacity" />
  )}
</div>

              
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                post.category === "alumni" ? "bg-purple-200 text-purple-800" : "bg-green-300 text-green-800"
              }`}>
                {post.category === "alumni" ? "Alumni" : "Brothers"}
              </span>

              {(Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? post.tags.split(',') : [])).map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>

            <h3 className="text-green-900 font-bold text-xl mb-2 group-hover:text-green-800 transition-colors">
              {post.title}
            </h3>

            <p className="text-green-800 mb-1 flex-grow font-light leading-relaxed">
              {post.content.substring(0, 100)}...
              <span className="ml-2 text-green-900 font-medium group-hover:text-green-800 transition-colors">
                Read more →
              </span>
            </p>

            {post.author && (
              <p className="text-green-800 font-medium leading-relaxed">
                Author: {post.author.split(",").map((fullName) => {
                  const parts = fullName.trim().split(" ");
                  const firstName = parts[0] || "";
                  const lastInitial = parts[1]?.charAt(0).toUpperCase() || "";
                  return `${firstName} ${lastInitial}.`;
                }).join(", ")}
              </p>
            )}



            </div>
          </Link>
        ))}
      </div>
    </div>
  );

}