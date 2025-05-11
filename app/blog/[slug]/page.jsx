'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaThumbsUp } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function BlogPostPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug);
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) setPost(data);
    };
    fetchPost();
  }, [slug]);

  const handleLike = () => {
    if (!post) return;
    setPost(prev => ({
      ...prev,
      likes: isLiked ? prev.likes - 1 : prev.likes + 1
    }));
    setIsLiked(prev => !prev);
  };

  if (!post) return <div className="p-10 text-red-600">Post not found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
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
        {/* Left Side */}
        <div className="w-full lg:w-4/5 pr-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Blog</h1>
          <div className="w-full h-96 rounded-lg mb-6 overflow-hidden bg-gray-200">
  {post.image ? (
    <img
      src={post.image}
      alt={post.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 opacity-80" />
  )}
</div>


          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-md text-sm font-medium shadow-sm ${
              post.category === 'alumni' ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'
            }`}>
              {post.category === 'alumni' ? 'Alumni' : 'Brothers'}
            </span>
            {(Array.isArray(post.tags) ? post.tags : post.tags?.split(',')).map((tag, i) => (
              <span key={i} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-md text-sm font-medium shadow-sm">
                {tag.trim()}
              </span>
            ))}
          </div>

          {/* Meta + Like */}
          <div className="flex items-center gap-6 mb-6">
            <span className="text-sm text-primary font-medium">{post.readTime || '—'} </span>
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary-dark"
            >
              <FaThumbsUp className={isLiked ? 'text-blue-500' : 'text-primary'} size={14} />
              <span>Liked by {post.likes || 0} people</span>
            </button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              Published on: {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <h3 className="text-3xl font-bold text-primary">{post.title}</h3>
          </div>

          {/* Content */}
          <div className="prose max-w-none text-primary text-justify">
            {post.content.split('\n').map((para, i) => (
              <p key={i} className="mb-6 text-lg leading-relaxed">{para.trim()}</p>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-1/5 pl-4">
          <div className="sticky top-24">
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-primary mb-4">Recent Posts</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog" className="text-primary hover:underline">Go to Blog Home</Link>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-primary mb-4">Categories</h3>
              <ul className="space-y-3">
                {(Array.isArray(post.tags) ? post.tags : post.tags?.split(',')).map((tag, i) => (
                  <li key={i} className="text-primary hover:underline cursor-pointer">{tag.trim()}</li>
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
