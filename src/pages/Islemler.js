import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Footer from "../components/Footer";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";

const Islemler = () => {
  const [yukleniyor, setYukleniyor] = useState(false);
  const [islemler, setIslemler] = useState([]);
  const token = getCookieValue("token");

  useEffect(() => {
    const veriCek = async () => {
      try {
        setYukleniyor(true);
        const cozulenData = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
        const kullaniciRef = collection(firestore, "kullanicilar");
        const queryKullanici = query(
          kullaniciRef,
          where("no", "==", cozulenData.no)
        );
        const kullaniciSnap = await getDocs(queryKullanici);

        if (!kullaniciSnap.empty) {
          const kullaniciDoc = kullaniciSnap.docs[0];
          const kullaniciData = kullaniciDoc.data();
          const kartNo = kullaniciData.kartNo;

          const kartRef = collection(firestore, "kartlar");
          const queryKart = query(kartRef, where("kartNo", "==", kartNo));
          const kartSnap = await getDocs(queryKart);

          if (!kartSnap.empty) {
            const kartDoc = kartSnap.docs[0];
            const kartData = kartDoc.data();
            const islemler = kartData.islemler || [];
            setIslemler(islemler);
            setYukleniyor(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    veriCek();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-gray-800 text-center font-extrabold mb-4">
        Kart İşlemleri
      </h2>
      {yukleniyor && (
        <div className="flex justify-center mt-20">
          <div
            className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      )}
      {islemler.length === 0 && (
        <p className="text-center text-xl text-gray-800 font-extrabold">
          Kartınıza ait kayıt bulunamadı.
        </p>
      )}
      <ul className="space-y-4">
        {islemler.map((isleml, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg shadow-md ${
              isleml.islemTuru === "Bakiye Yüklendi"
                ? "border border-l-8 border-green-400"
                : isleml.islemTuru === "Qr ile Ödeme"
                ? "border border-l-8 border-rose-400"
                : "border border-l-8 border-red-500 "
            }`}
          >
            <p className="font-extrabold text-xl">{isleml.islemTuru}</p>
            {isleml.miktar && (
              <p className="font-extrabold mt-2">
                Miktar:{" "}
                <span className="font-mono text-gray-700">
                  {isleml.miktar} TL
                </span>
              </p>
            )}
            <p className="font-extrabold mt-2">
              Tarih:{" "}
              <span className="font-mono text-gray-700">{isleml.tarih}</span>
            </p>
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default Islemler;
