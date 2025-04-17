import React from 'react';
import { FaGoogle, FaDiscord } from 'react-icons/fa';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-4 text-black">Sign in</h2>


        <form className="space-y-4 mt-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3D2F]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3D2F]"
              />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
                👁️
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-[#1E3D2F]" />
              <span className="ml-2 text-black">Remember me</span>
            </label>
            <a href="#" className="text-[#1E3D2F] font-medium hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E3D2F] text-white py-2 rounded-lg hover:bg-[#162E24] transition"
          >
            Sign in
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg text-black hover:bg-gray-100 transition">
            <FaGoogle className="mr-2 text-lg" /> Continue with Google
          </button>
          <button className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg text-black hover:bg-gray-100 transition">
            <FaDiscord className="mr-2 text-lg text-[#5865F2]" /> Continue with Discord
          </button>
        </div>
      </div>
    </div>
  );
}
