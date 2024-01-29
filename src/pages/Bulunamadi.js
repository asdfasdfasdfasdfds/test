import React from "react";
import Footer from "../components/Footer";
import logo from "../img/battalkart.jpg";

const NotFound = () => {
  return (
    <div className="mt-40 flex justify-center items-center flex-col">
      <img src={logo} className="mx-auto mb-10 w-64" alt="Resim" />{" "}
      <h1 className="text-3xl font-extrabold text-gray-800">
        Sayfa Bulunamadı.
      </h1>
      <Footer />
    </div>
  );
};

export default NotFound;
