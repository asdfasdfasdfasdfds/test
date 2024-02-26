import React, { useEffect, useState } from "react";
import logo from "../img/battalkart.jpg";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";
import Footer from "../components/Footer";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebase";
import { generateRandomCode } from "../utils/kodOlustur";
import { useNavigate } from "react-router-dom";

const BakiyeYukle = () => {
  const token = getCookieValue("token");
  const [adSoyad, setAdSoyad] = useState("");
  const [seriNo, setSeriNo] = useState("");
  const [kartNo, setKartNo] = useState("");
  const [miktar, setMiktar] = useState(0);
  const [talepKod, setTalepKod] = useState("");
  const [olusturuldu, setOlusturuldu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cozulenToken = sifreCoz(token);
    setAdSoyad(cozulenToken.ad);
    setSeriNo(cozulenToken.seriNo);
    setKartNo(cozulenToken.kartNo);
  }, []);

  const handleTalepOlustur = async () => {
    try {
      const ref = collection(firestore, "talepler");
      const talepKodu = generateRandomCode(6);
      setTalepKod(talepKodu);
      const yeniTalep = {
        talepKodu,
        ad: adSoyad,
        seriNo,
        kartNo,
        miktar,
      };
      await addDoc(ref, yeniTalep);
      setOlusturuldu(true);
    } catch (error) {
      alert("SİSTEMDE HATA VAR. LÜTFEN BİLDİRİNİZ");
    }
  };

  const handleYonlendir = () => {
    navigate("/anasayfa");
  };

  return (
    <div className="min-h-screen flex flex-col items-center mt-20 md:mt-0 md:justify-center bg-white font-semibold">
      <img src={logo} className="w-48 mb-3" />
      {olusturuldu ? (
        <>
          <p className="p-2 w-[350px] shadow-xl text-center mb-4 bg-green-500 rounded-xl font-bold">
            TALEP OLUŞTURULDU!
          </p>
          <p className="p-3 mb-4 text-center w-[350px] shadow-lg bg-rose-800 text-white text-xl font-semibold rounded-md">
            {talepKod}
          </p>
          <p className="p-3 text-center w-[350px] bg-gray-200 border border-black shadow-xl text-black text-base font-sans rounded">
            Yukarıdaki talep kodu ve ücreti ile beraber <br />
            <span className="font-bold">
              Yemekhaneden Sorumlu Müdür Yardımcısına <br />
            </span>{" "}
            giderek yükleyebilirsiniz.
          </p>
          <button
            className="mt-5 w-[350px]  bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleYonlendir}
          >
            ANASAYFA
          </button>
        </>
      ) : (
        <>
          <h1 className="font-bold text-gray-800 text-2xl mb-5">
            BAKİYE TALEP FORMU
          </h1>
          <div className="mb-3">
            <label
              htmlFor="adSoyad"
              className="block ml-1 text-gray-700 text-sm font-bold mb-1"
            >
              ADI SOYADI
            </label>
            <input
              id="adSoyad"
              type="text"
              value={adSoyad}
              onChange={(e) => setSeriNo(e.target.value.toUpperCase())}
              disabled
              className="appearance-none opacity-50 bg-gray-100 rounded-xl p-2 relative block w-80 text-gray-900 border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 focus:z-10 sm:text-sm"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="seriNo"
              className="block ml-1 text-gray-700 text-sm font-bold mb-1"
            >
              SERİ NO
            </label>
            <input
              id="seriNo"
              type="text"
              value={seriNo}
              onChange={(e) => setSeriNo(e.target.value.toUpperCase())}
              disabled
              className="appearance-none opacity-50 bg-gray-100 rounded-xl p-2 relative block w-80 text-gray-900 border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 focus:z-10 sm:text-sm"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="kartNo"
              className="block ml-1 text-gray-700 text-sm font-bold mb-1"
            >
              KART NO
            </label>
            <input
              id="kartNo"
              type="number"
              value={kartNo}
              onChange={(e) => setKartNo(e.target.value.toUpperCase())}
              disabled
              className="appearance-none rounded-xl p-2 opacity-50 relative block w-80 bg-gray-100  text-gray-900 border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 focus:z-10 sm:text-sm"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="miktar"
              className="block ml-1 text-gray-700 text-sm font-bold mb-1"
            >
              MİKTAR
            </label>
            <input
              id="miktar"
              type="number"
              value={miktar}
              onChange={(e) => setMiktar(e.target.value)}
              placeholder="YÜKLENECEK MİKTAR"
              required
              className="appearance-none p-2 rounded-xl relative block w-80 bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-primary-600 focus:border-primary-600 focus:z-10 sm:text-sm"
            />
          </div>
          <button
            className="mt-3 w-80  bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl"
            disabled={!miktar}
            onClick={handleTalepOlustur}
          >
            TALEP OLUŞTUR
          </button>
        </>
      )}
      <Footer />
    </div>
  );
};

export default BakiyeYukle;
