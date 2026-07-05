import { Inter } from "next/font/google";
import * as React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import PageTransition from "../components/PageTransition";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://ktp-website.vercel.app";
const OG_IMAGE =
  "https://res.cloudinary.com/dha44tosd/image/upload/c_fill,w_1200,h_630,g_auto/v1783200474/Assets%20for%20website/who_we_are_spring26.jpg";
const SITE_DESCRIPTION =
  "Kappa Theta Pi (KTP) Mu Chapter at UT Dallas - a professional technology fraternity building technical skills, professional growth, and lifelong community.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Kappa Theta Pi UTD",
  description: SITE_DESCRIPTION,
  keywords: [
    "Kappa Theta Pi",
    "KTP",
    "KTP UTD",
    "UT Dallas",
    "UTD",
    "technology fraternity",
    "professional fraternity",
    "Mu Chapter",
  ],
  openGraph: {
    title: "Kappa Theta Pi - Mu Chapter at UT Dallas",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Kappa Theta Pi - Mu Chapter",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kappa Theta Pi Mu Chapter at UT Dallas",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kappa Theta Pi - Mu Chapter at UT Dallas",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
        <GoogleAnalytics />
        <Navbar />
        <PageTransition>{children}</PageTransition>
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
