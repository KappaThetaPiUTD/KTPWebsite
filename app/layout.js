import { Inter } from "next/font/google";
import * as React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <style>
        {`
          @media print {
            #simplify-jobs-container {
              display: none;
            }
          }
          " Client: "
          ::-webkit-scrollbar {
              width: 4px; 
              height: 6px;
            }

          ::-webkit-scrollbar-thumb {
              background-color: #363636;
              border-radius: 3px;
          }

          ::-webkit-scrollbar-track {
              background-color: #0F0F0F;
          }

          ::-webkit-scrollbar-button {
              display: none;
          }
        `}
      </style>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className={inter.className} style={{ overflowX: "hidden" }}>
        <Navbar />
        {children}
        <Footer />
        <ToastContainer
          closeOnClick
          closeButton={false}
          draggable={false}
          position="bottom-center"
          autoClose={5000}
        />
      </body>
    </html>
  );
}
