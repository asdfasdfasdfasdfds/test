import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import logo from "../img/battalkart.jpg";
import { sifreCoz, veriSifrele } from "../services/sifreIslem";
import { deleteCookie, getCookieValue } from "../services/cookieIslemler";
import girisLogo from "../img/girislogo.png";
import indir from "../files/program.zip";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";

const Login = () => {
  const [seriNo, setSeriNo] = useState("");
  const [kartSifre, setKartSifre] = useState("");
  const [hataliToken, setHataliToken] = useState(false);
  const [usbModal, setUsbModal] = useState(false);
  const token = getCookieValue("token");
  const localSeriNo = localStorage.getItem("seriNo");

  useEffect(() => {
    if (localSeriNo) {
      setSeriNo(localSeriNo);
    }
  }, []);

  useEffect(() => {
    if (token !== null) {
      tokenKontrol(token);
    } else {
      return;
    }
  }, []);

  const tokenKontrol = (gelenToken) => {
    const cozulmus = sifreCoz(gelenToken, process.env.REACT_APP_ANAHTAR);
    console.log(cozulmus);
    if (cozulmus.ad) {
      return;
    } else {
      setHataliToken(true);
    }
  };

  const handleGiris = async () => {
    try {
      const ref = collection(firestore, "kartlar");
      const q = query(
        ref,
        where("seriNo", "==", seriNo),
        where("sifre", "==", kartSifre)
      );
      const getSnap = await getDocs(q);
      if (!getSnap.empty) {
        const data = getSnap.docs[0].data();
        const sifrele = veriSifrele(data, process.env.REACT_APP_ANAHTAR);
        document.cookie = `token=${sifrele}; path=/`;
        localStorage.setItem("seriNo", seriNo);
        window.location.reload();
      } else {
        alert("GİRİLEN SERİ NO VE ŞİFRE GEÇERSİZ!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleIndır = () => {
    const programUrl = indir;

    const link = document.createElement("a");
    link.href = programUrl;
    link.download = "battal-giris.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex flex-col items-center md:justify-center min-h-screen bg-white">
      <img src={logo} className="mx-auto w-64 mt-20 md:mt-0" />
      <div className="bg-white md:border md:ring-2 md:ring-gray-50 md:shadow-2xl font-bold text-center p-4 sm:p-8 rounded-lg w-80 sm:w-72 lg:w-6/12">
        {hataliToken ? (
          <>
            <p className="text-xl">TOKEN GEÇERSİZ</p>
            <button
              className="p-2 w-80 rounded-md bg-gray-800 text-white mt-4"
              onClick={() => {
                deleteCookie("token");
                window.location.reload();
              }}
            >
              TEKRAR GİRİŞ YAP
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl">GİRİŞ YAPILMAMIŞ</p>
            <p className="mt-2 mb-5">
              AŞAĞIDAKİ SEÇENEKLERİ KULLANARAK GİRİŞ YAPINIZ.
            </p>
            <input
              type="text"
              value={seriNo}
              onChange={(e) => setSeriNo(e.target.value.toUpperCase())}
              placeholder="KART SERİ NO"
              className="bg-gray-50 mb-1 text-center border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-80 p-2.5 "
              required
            />
            <input
              type="text"
              value={kartSifre}
              onChange={(e) => setKartSifre(e.target.value)}
              placeholder="KART ŞİFRESİ"
              className="bg-gray-50 border text-center border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-80 p-2.5"
              required
            />
            <div className="flex flex-col">
              <button
                type="submit"
                className="w-80 mt-4 ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
                onClick={handleGiris}
              >
                GİRİŞ YAP
              </button>
              <div className="inline-flex items-center justify-center w-full">
                <hr className="w-64 h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
              </div>
              <button
                type="submit"
                onClick={(e) => setUsbModal(true)}
                className="w-80 mt-2 ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                USB KEY İLE GİRİŞ
              </button>
            </div>
            {usbModal && (
              <div
                onClick={(e) => setUsbModal(false)}
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-50"
              >
                <div className="bg-white h-[500px] flex flex-col items-center max-w-5xl border shadow rounded-md w-full">
                  <img src={girisLogo} className="w-96 mx-auto mt-10" />
                  <p className="font-medium text-3xl mt-5">
                    BATTALKART USB KEY İLE GİRİŞ
                  </p>
                  <ul className="mt-5 text-xl">
                    <li>1.USB doğrulama programını indirin.</li>
                    <li>2.Programı açın ve USB yerleştirin.</li>
                    <li>3.Gelen listeden ilgili USB seçin.</li>
                    <li>4.Giriş yap butonuna tıklayın.</li>
                  </ul>
                  <button
                    className="w-96 mt-5 bg-black text-white py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
                    onClick={handleIndır}
                  >
                    PROGRAMI İNDİR
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;
