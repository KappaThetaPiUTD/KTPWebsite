import React from "react";

export const metadata = {
  title: "Kappa Theta Pi UTD - Blog",
  description: "Keep up with our blog to stay updated on our latest events and news",
};

const blogPosts = [
  {
    id: 1,
    title: "Published on: January 22, 2025",
    author: "Kairavi Pandya",
    tags: ["Leadership", "Design", "UI/UX", "Alumni"],
    readTime: "12 min read",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    title: "Published on: January 22, 2025",
    author: "Kairavi Pandya",
    tags: ["Leadership", "Design", "UI/UX", "Alumni"],
    readTime: "12 min read",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    title: "Published on: January 22, 2025",
    author: "Kairavi Pandya",
    tags: ["Leadership", "Design", "UI/UX", "Alumni"],
    readTime: "12 min read",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 4,
    title: "Published on: January 22, 2025",
    author: "Kairavi Pandya",
    tags: ["Leadership", "Design", "UI/UX", "Alumni"],
    readTime: "12 min read",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 5,
    title: "Published on: January 22, 2025",
    author: "Kairavi Pandya",
    tags: ["Leadership", "Design", "UI/UX", "Alumni"],
    readTime: "12 min read",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 6,
    title: "Published on: January 22, 2025",
    author: "Kairavi Pandya",
    tags: ["Leadership", "Design", "UI/UX", "Alumni"],
    readTime: "12 min read",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const BlogPage = () => {
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
      <div className="w-full flex justify-between items-center mb-6 px-4 md:px-8">
        <div className="flex space-x-2">
          <button className="bg-gray-200 px-4 py-2 rounded-lg text-primary">All &gt;</button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg text-primary">Brothers</button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg text-primary">Alumni</button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-primary">Sort by:</span>
          <button className="bg-gray-200 px-4 py-2 rounded-lg text-primary">Newest</button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg text-primary">Oldest</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-lg p-4 rounded-xl transition-transform transform hover:scale-105 border border-gray-200"
          >
            <div className="text-primary font-semibold mb-2">12 min read</div>
            <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
            <div className="text-primary font-semibold mb-1">Published on: January 22, 2025</div>
            <div className="text-primary font-semibold mb-2">By: Kairavi Pandya</div>
            <div className="flex space-x-2 mb-2">
              <span className="bg-green-200 text-primary px-2 py-1 rounded-md text-sm">Leadership</span>
              <span className="bg-green-200 text-primary px-2 py-1 rounded-md text-sm">Design</span>
              <span className="bg-green-200 text-primary px-2 py-1 rounded-md text-sm">UI/UX</span>
              <span className="bg-green-200 text-primary px-2 py-1 rounded-md text-sm">Alumni</span>
            </div>
            <p className="text-primary text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;