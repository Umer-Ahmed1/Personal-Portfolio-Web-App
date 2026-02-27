// components/Footer.tsx
import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
          {/* Brand + Social */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Umer Ahmed
            </h2>

            <div className="flex gap-5">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaFacebookF size={22} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <FaLinkedinIn size={22} />
              </a>
            </div>
          </div>

          {/* About / Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">About</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Me
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Explore My Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Project Management Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-10 md:gap-8">
            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-5">Services</h3>
              <ul className="space-y-3 text-gray-400">
                <li>UX/UI Design</li>
                <li>Full-Stack Development</li>
                <li>Project Management</li>
                <li>Systems Architecture</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-5">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li>+92-301 824 2245</li>
                <li>
                  <a
                    href="mailto:umerahmedwork4@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    umerahmedwork4@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            © {new Date().getFullYear()} Umer Ahmed. All Rights Reserved.
          </div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}