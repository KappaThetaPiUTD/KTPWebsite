'use client';

import React, { useState } from "react";
import Link from "next/link";
import { FaThumbsUp } from "react-icons/fa";

// Move your blog posts data here (same as in blog/page.jsx)
const allBlogPosts = [
  {
    id: 1,
    slug: "leadership-in-tech",
    title: "Leadership in Tech",
    author: "Kairavi Pandya",
    tags: ["Leadership", "Design", "UI/UX", "Alumni"],
    readTime: "12 min read",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    publishedDate: new Date("2025-01-22"),
    likes: 5
  },
  {
    id: 2,
    slug: "design-thinking",
    title: "Design Thinking Workshop",
    author: "Kairavi Pandya",
    tags: ["Design", "Workshop", "UI/UX"],
    readTime: "8 min read",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    publishedDate: new Date("2025-01-15"),
    likes: 3
  },
  {
    id: 3,
    slug: "alumni-spotlight",
    title: "Alumni Spotlight",
    author: "Kairavi Pandya",
    tags: ["Alumni", "Interview", "Career"],
    readTime: "10 min read",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    publishedDate: new Date("2025-01-10"),
    likes: 5
  },
  {
    id: 4,
    slug: "ux-best-practices",
    title: "UX Best Practices",
    author: "Kairavi Pandya",
    tags: ["UI/UX", "Design", "Tutorial"],
    readTime: "15 min read",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    likes: 5
  },
  {
    id: 5,
    slug: "tech-interview-prep",
    title: "Tech Interview Prep",
    author: "Kairavi Pandya",
    tags: ["Career", "Interview", "Workshop"],
    readTime: "14 min read",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    publishedDate: new Date("2024-12-20"),
    likes: 8
  },
  {
    id: 6,
    slug: "spring-recruitment",
    title: "Spring Recruitment",
    author: "Kairavi Pandya",
    tags: ["Recruitment", "Events", "Brothers"],
    readTime: "6 min read",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    publishedDate: new Date("2024-12-15"),
    likes: 3
  }
];

export default function BlogPostPage({ params }) {
  // Find the post that matches the current slug
  const postData = allBlogPosts.find(post => post.slug === params.slug);
  
  if (!postData) {
    return <div>Post not found</div>;
  }

  // Initialize state with the found post data
  const [post, setPost] = useState({
    ...postData,
    isLiked: false
  });

  const handleLike = () => {
    setPost(prevPost => ({
      ...prevPost,
      likes: prevPost.isLiked ? prevPost.likes - 1 : prevPost.likes + 1,
      isLiked: !prevPost.isLiked
    }));
  };

  const BlogPage = ({ posts }) => {
    return (
      <div className="blog-list">
        {posts.map((post) => (
          <div key={post.id} className="blog-post">
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            {/* Make sure this part is green */}
          {/* Post Content */}
          {/* Post Content */}
          <div className="prose max-w-none text-justify text-green-600">
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-6 text-lg leading-relaxed !text-inherit">
                {paragraph.trim()}
              </p>
            ))}
          </div>
          </div>
        ))}
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="flex justify-center items-center py-6 border-b border-gray-200">
        <div className="flex space-x-8 font-medium">
          <Link href="/" className="text-primary">HOME</Link>
          <Link href="/about" className="text-primary">ABOUT</Link>
          <Link href="/recruitment" className="text-primary">RECRUITMENT</Link>
          <Link href="/blog" className="text-primary">BLOG</Link>
          <Link href="/contact" className="text-primary">CONTACT</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex">
        {/* Left Content (80% width) */}
        <div className="w-full lg:w-4/5 pr-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Blog</h1>
          
          {/* Image Block */}
          <div className="w-full h-96 bg-gray-200 mb-6 rounded-lg"></div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-green-200 text-primary px-3 py-1 rounded-md text-sm font-medium shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Post Metadata */}
          <div className="flex items-center gap-6 mb-6">
            <span className="text-sm text-primary font-medium">{post.readTime}</span>
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary-dark transition-colors"
            >
              <FaThumbsUp 
                className={post.isLiked ? "text-blue-500" : "text-primary"} 
                size={14} 
              />
              <span>Liked by {post.likes} people</span>
            </button>
          </div>

          {/* Post Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Published on: {post.publishedDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <h3 className="text-3xl font-bold text-primary">{post.title}</h3>
          </div>

          {/* Post Content */}
          <div className="prose max-w-none text-primary text-justify">
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-6 text-lg leading-relaxed">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>

        {/* Right Sidebar (20% width) */}
        <div className="hidden lg:block w-1/5 pl-4">
          <div className="sticky top-24">
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-primary mb-4">Recent Posts</h3>
              <ul className="space-y-3">
                {allBlogPosts.slice(0, 3).map((post) => (
                  <li key={post.id}>
                    <Link href={`/blog/${post.slug}`} className="text-primary hover:underline">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-primary mb-4">Categories</h3>
              <ul className="space-y-3">
                {Array.from(new Set(allBlogPosts.flatMap(post => post.tags))).map((tag, i) => (
                  <li key={i} className="text-primary hover:underline cursor-pointer">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="text-center text-primary">
          <p className="font-medium">The University of Texas at Dallas</p>
          <p>Kappa Theta Pi - Mu Chapter</p>
        </div>
      </footer>
    </div>
  );
}