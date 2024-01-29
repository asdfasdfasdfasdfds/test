import React from "react";
import { Link } from "react-router-dom";
import logo from "../../img/battalkart.jpg";
import Footer from "../../components/Footer";

const Panel = () => {
  return (
    <div className="flex flex-col items-center justify-center ">
      <img src={logo} className="w-96 mb-2 rounded-full" />
      <h1 className="text-4xl text-gray-800 font-extrabold mb-6">
        YEMEKHANE PANELİ
      </h1>
      <div className="flex flex-col">
        <Link
          to="/validator"
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          VALİDATÖR
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Panel;
