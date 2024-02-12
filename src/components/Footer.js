import React from "react";
import logo from "../img/bg.png";

const Footer = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full py-2 bg-white border-t border-gray-200 shadow-inner font-semibold text-slate-600 text-xs flex justify-between items-center px-5">
      <p>2.0</p>
      <p>&copy; Onur Kürkaya</p>
      <img src={logo} className="w-auto h-12" />
    </div>
  );
};

export default Footer;
