"use client";

import {
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-200 border-t border-gray-700 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-4 tracking-wide">Features</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white transition">Expense Tracking</li>
            <li className="hover:text-white transition">Income Logging</li>
            <li className="hover:text-white transition">Spending Reports</li>
            <li className="hover:text-white transition">Budget Planning</li>
            <li className="hover:text-white transition">Goal Setting</li>
            <li className="hover:text-white transition">Recurring Reminders</li>
            <li className="hover:text-white transition">Daily Insights</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-4 tracking-wide">Resources</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white transition">User Guide</li>
            <li className="hover:text-white transition">FAQs</li>
            <li className="hover:text-white transition">Help Center</li>
            <li className="hover:text-white transition">Privacy Policy</li>
            <li className="hover:text-white transition">Terms & Conditions</li>
          </ul>
        </div>

        {/* Learn More */}
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-4 tracking-wide">Learn more</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white transition">About ExpenseTracker</li>
            <li className="hover:text-white transition">Roadmap</li>
            <li className="hover:text-white transition">Changelog</li>
            <li className="hover:text-white transition">Open Source</li>
            <li className="hover:text-white transition">Community</li>
          </ul>
          <div className="flex gap-4 text-lg mt-5 text-gray-300">
            <FaTwitter className="hover:text-sky-400 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaLinkedin className="hover:text-blue-500 cursor-pointer" />
            <FaGithub className="hover:text-gray-400 cursor-pointer" />
          </div>
        </div>

        {/* Get Started */}
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-4 tracking-wide">Get Started</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white transition">Create a new account</li>
            <li className="hover:text-white transition">Log in</li>
            <li className="hover:text-white transition">Contact Support</li>
          </ul>
        </div>
      </div>

      {/* Legal/Note Section */}
      <div className="max-w-7xl mx-auto px-6 mt-14 text-xs text-gray-500">
        <p className="mb-4">
          ExpenseTracker is a personal finance platform built to help individuals gain control of their spending. 
          Your data is encrypted and stays private—always. ExpenseTracker is independent and not affiliated with any financial institutions.
        </p>
        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
