
import React from "react";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-sm py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center space-x-6">
        <a
          href="https://www.instagram.com/amir.ssr/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <Instagram size={24} />
          <span>Instagram</span>
        </a>
        <a
          href="https://www.tiktok.com/@tamsouuu7"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <span>TikTok</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
