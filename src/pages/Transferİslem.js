import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import logo from "../img/battalkart.jpg";

const Tranferİslem = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <img src={logo} className="w-96 mb-2 rounded-full" />
      <h1 className="text-4xl text-gray-800 font-extrabold mb-6">
        Transfer İşlemleri
      </h1>
      <Link
        to="/transfer/et"
        className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
      >
        Transfer Et
      </Link>
      <Link
        to="/transfer/al"
        className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
      >
        Transfer Al
      </Link>
      <Link
        to="/anasayfa"
        className="w-72 text-center font-extrabold bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
      >
        Anasayfaya Dön
      </Link>
      <Footer />
    </div>
  );
};

export default Tranferİslem;
