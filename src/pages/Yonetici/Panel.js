import React from "react";
import { Link } from "react-router-dom";
import logo from "../../img/battalkart.jpg";
import Footer from "../../components/Footer";
import { firestore } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getCookieValue } from "../../services/cookieIslemler";
const Panel = () => {
  const handleVeriIndir = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "kartlar"));
      let veriTxt = "";

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        veriTxt += `${data.isim} => Bakiye ${JSON.stringify(
          data.aktifBakiye
        )}, Kart NO ${JSON.stringify(data.kartNo)}, Şifre ${JSON.stringify(
          data.sifre
        )} \n`;
      });

      const blob = new Blob([veriTxt], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "veriler.txt";
      link.click();

      console.log("Veriler başarıyla indirildi!");
    } catch (error) {
      console.error("Veri indirme hatası:", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center ">
      <img src={logo} className="w-96 mb-2 rounded-full" />
      <h1 className="text-4xl text-gray-800 font-extrabold mb-6">
        YETKİLİ PANELİ
      </h1>
      <div className="flex flex-col">
        <Link
          to="/kart/islemleri"
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          KART İŞLEMLERİ
        </Link>
        <Link
          to="/bakiye/islemleri"
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          BAKİYE İŞLEMLERİ
        </Link>
        <Link
          to="/rapor"
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          RAPOR
        </Link>
        <Link
          to="/validator"
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          VALİDATÖR
        </Link>
        <Link
          to="/ucret-islem"
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          ÜCRET İŞLEMLERİ
        </Link>
        <button
          onClick={handleVeriIndir}
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          VERİ TABANI
        </button>
        <Link
          to="/anasayfa"
          className="w-72 text-center font-extrabold bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          ANASAYFA
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Panel;
