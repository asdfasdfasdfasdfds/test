import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import girisLogo from "../img/girislogo.png";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";
import { veriSifrele } from "./sifreIslem";

const USBToken = () => {
  const { token } = useParams();
  const [ad, setAd] = useState("");
  const [kod, setKod] = useState("");
  const [islemGerceklesiyor, setIslemGerceklesiyor] = useState(true);
  const [gecersiz, setGecersiz] = useState(false);
  const key = process.env.REACT_APP_USB_ANAHTAR;

  useEffect(() => {
    handleSifreCoz();
  }, []);

  const handleSifreCoz = async () => {
    if (token) {
      const sifreli_sayi_bytes = new Uint8Array(
        [...atob(token)].map((char) => char.charCodeAt(0))
      );
      const anahtar_bytes = new Uint8Array(
        [...key].map((char) => char.charCodeAt(0))
      );

      const cozulmus_sayi_bytes = new Uint8Array(
        sifreli_sayi_bytes.map(
          (b1, i) => b1 ^ anahtar_bytes[i % anahtar_bytes.length]
        )
      );
      const cozulmus_sayi = String.fromCharCode(...cozulmus_sayi_bytes);
      setKod(cozulmus_sayi);
      handleGiris(cozulmus_sayi);
    } else {
      setGecersiz(true);
    }
  };

  const handleGiris = async (gelenKod) => {
    try {
      const ref = collection(firestore, "key");
      const q = query(ref, where("vendor", "==", gelenKod));
      const getSnap = await getDocs(q);

      if (!getSnap.empty) {
        const data = getSnap.docs[0].data();
        setAd(data.ad);
        const sifrele = veriSifrele(data, key);
        document.cookie = `token=${sifrele}; path=/`;
        setIslemGerceklesiyor(false);
      } else {
        setGecersiz(true);
        setIslemGerceklesiyor(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 flex-col items-center justify-center">
      <div className="max-w-4xl w-full h-[500px] flex flex-col items-center rounded-md border bg-white">
        <img src={girisLogo} className="w-96 mx-auto mt-10" />
        <p className="p-5 text-lg shadow-xl bg-gray-200 max-w-xl text-center font-semibold rounded-md w-full mt-4">
          {token}
        </p>
        {islemGerceklesiyor ? (
          <>
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-16 h-16 mt-10 text-black animate-spin dark:text-gray-600 fill-indigo-200"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold mt-5">GİRİŞ YAPILIYOR</p>
          </>
        ) : gecersiz ? (
          <>
            <p className="p-4 bg-red-500 text-3xl w-96 text-center font-bold mt-20 rounded-md">
              TOKEN GEÇERSİZ
            </p>
            <p className="p-4 bg-red-500 w-96 text-center text-xl font-bold mt-5 rounded-md">
              {kod}
            </p>
          </>
        ) : (
          <div className="mt-5 text-center text-xl font-bold">
            <p className="p-3 bg-green-400 w-96 rounded-md shadow-xl">
              GİRİŞ BAŞARILI
            </p>
            <p className="mt-10 text-3xl font-bold">{ad}</p>
            <button className="mt-5">
              <Link
                className="p-4 px-20 bg-black text-white py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
                to="/anasayfa"
              >
                ANASAYFA
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default USBToken;
