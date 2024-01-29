import React, { useState } from "react";
import { firestore } from "../firebase";
import {
  collection,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import logo from "../img/battalkart.jpg";

const kullaniciRef = collection(firestore, "kullanicilar");
const kartRef = collection(firestore, "kartlar");

const KartGuncelle = () => {
  const [ad, setAd] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [sifre, setSifre] = useState("");
  const [no, setNo] = useState("");

  const handleAd = (e) => {
    const change = e.target.value.toUpperCase();
    setAd(change);
  };

  const handleKartGuncelle = async (e) => {
    e.preventDefault();
    try {
      const q2 = query(kartRef, where("isim", "==", ad));
      const q3 = query(kartRef, where("sifre", "==", sifre));
      const q = query(kullaniciRef, where("no", "==", no));
      const kart2 = await getDocs(q2);
      const kart = await getDocs(q);
      if (kart.docs.length > 0 && !kart2.empty) {
        const kartDoc = kart.docs[0];
        const kart2Doc = kart2.docs[0].data();
        const kartSifre = kart2Doc.sifre;
        const kartNoCek = kart2Doc.kartNo;

        if (sifre != kartSifre) {
          alert("Şifre hatalı");
        } else {
          await updateDoc(kartDoc.ref, { kartNo: kartNoCek });
          setIsSuccess(true);
          setIsError(false);
        }
      } else {
        setIsSuccess(false);
        setIsError(true);
      }
    } catch (error) {
      setIsSuccess(false);
      setIsError(true);
    }
  };

  return (
    <div className="flex flex-col  items-center justify-center min-h-screen bg-white">
      <img src={logo} className="mx-auto mb-10 w-64" />
      <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-md w-80 lg:w-5/12">
        <h2 className="text-center text-3xl font-extrabold mb-6 text-gray-800">
          Kartımı Güncelle
        </h2>
        <form onSubmit={handleKartGuncelle}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AD
            </label>
            <input
              type="text"
              value={ad}
              onChange={handleAd}
              className="w-full px-4 py-3 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
              placeholder="TAM AD"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TEL || ÖĞRENCİ NO
            </label>
            <input
              type="text"
              value={no}
              onChange={(e) => setNo(e.currentTarget.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
              placeholder="NO"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kart Şifre
            </label>
            <input
              type="text"
              value={sifre}
              onChange={(e) => setSifre(e.currentTarget.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
              placeholder="Kart Şifre"
            />
          </div>
          <button
            type="submit"
            className="w-full ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-none rounded-t-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Güncelle
          </button>
          <Link
            type="submit"
            to="/anasayfa"
            className="w-full ring-2 text-center font-extrabold  bg-gray-800 text-white py-3 rounded-none rounded-b-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Anasayfaya Dön
          </Link>
        </form>
        {isSuccess && (
          <div className="text-green-500 mt-4">Başarıyla güncellendi!</div>
        )}
        {isError && (
          <div className="text-red-500 mt-4">Güncelleme başarısız oldu.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default KartGuncelle;
