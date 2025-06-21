import React from "react";
import SocialButton from "./UI/SocialButtons";

const Footer: React.FC = () => (
  <footer className="w-full bg-gray-900 py-8">
    <div className="flex justify-center">
      <SocialButton />
    </div>
    <p className="text-center text-gray-400 mt-4 text-sm">
      &copy; {new Date().getFullYear()} Hahn Software. All rights reserved.
    </p>
  </footer>
);

export default Footer;