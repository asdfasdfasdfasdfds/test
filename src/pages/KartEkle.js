import React, { useState } from "react";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Footer from "../components/Footer";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";
import logo from "../img/battalkart.jpg";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";

const KartEkle = () => {
  const [tamAd, setTamAd] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const token = getCookieValue("token");
  const [sifre, setSifre] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value.toUpperCase();
    setTamAd(inputValue);
  };

  const handleKartEkle = async (e) => {
    e.preventDefault();
    const cozulenSifre = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
    const userDocRef = doc(firestore, "kullanicilar", cozulenSifre.no);
    const kartRef = collection(firestore, "kartlar");
    const userDoc = await getDoc(userDocRef);
    const q = query(kartRef, where("isim", "==", tamAd));
    const kart = await getDocs(q);

    if (!userDoc.data()) {
      const kartData = kart.docs[0].data();
      const kartSifre = kartData.sifre;
      const yeniKartNo = kartData.kartNo;

      try {
        if (sifre != kartSifre) {
          alert("Kart şifresi hatalı.");
        } else {
          await setDoc(
            userDocRef,
            { no: cozulenSifre.no, kartNo: yeniKartNo },
            { merge: true }
          );
          setIsSuccess(true);
        }
      } catch (error) {
        console.error("Kart eklenirken bir hata oluştu:", error);
        setIsError(true);
      }
    } else {
      alert("Hatalı Şifre.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src={logo} className="mx-auto mb-10 w-64" />
      <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-md w-80 lg:w-5/12">
        <h2 className="text-center text-3xl font-extrabold mb-6 text-gray-800">
          Kart Ekle
        </h2>
        <form onSubmit={handleKartEkle}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AD
            </label>
            <input
              type="text"
              value={tamAd}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
              placeholder="TAM AD"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ŞİFRE
            </label>
            <input
              type="text"
              value={sifre}
              onChange={(e) => setSifre(e.currentTarget.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
              placeholder="KART ŞİFRESİ"
            />
          </div>
          <button
            type="submit"
            className="w-full ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-none rounded-t-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Ekle
          </button>
          <Link
            type="submit"
            to="/anasayfa"
            className="w-full ring-2 text-center font-extrabold bg-gray-800 text-white py-3 rounded-none rounded-b-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Anasayfaya Dön
          </Link>
        </form>
        {isSuccess && (
          <div className="text-green-500 mt-4">Kart başarıyla eklendi!</div>
        )}
        {isError && <div className="text-red-500 mt-4">Kart zaten mevcut.</div>}
      </div>
      <Footer />
    </div>
  );
};

export default KartEkle;
