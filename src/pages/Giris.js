import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import logo from "../img/battalkart.jpg";
import { sifreCoz, veriSifrele } from "../services/sifreIslem";
import { getCookieValue } from "../services/cookieIslemler";
import bg from "../img/bg.png";

const Login = () => {
  const [hataliToken, setHataliToken] = useState(false);
  const [misafirData, setMisafirData] = useState({});
  const [modal, setModal] = useState(false);
  const token = getCookieValue("token");

  useEffect(() => {
    if (token !== null) {
      tokenKontrol(token);
    } else {
      return;
    }
  }, []);

  const tokenKontrol = (gelenToken) => {
    const cozulmus = sifreCoz(gelenToken, process.env.REACT_APP_ANAHTAR);
    if (cozulmus.ad) {
      return;
    } else {
      setHataliToken(true);
    }
  };

  const handleSifrele = () => {
    const sifreli = veriSifrele(misafirData, process.env.REACT_APP_ANAHTAR);
    document.cookie = `token=${sifreli}; path=/`;
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src={logo} className="mx-auto mb-6 w-64" />
      <div className="bg-white md:border md:shadow-2xl font-bold text-center p-4 sm:p-8 rounded-lg w-80 sm:w-72 lg:w-6/12">
        {hataliToken ? (
          <>
            <p className="text-xl">TOKEN GEÇERSİZ</p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl">GİRİŞ YAPILMAMIŞ</p>
            <p className="mt-2">
              Aşağıdaki Giriş Yap Butonuna Basarak Giriş Yapınız.
            </p>
            <div className="flex flex-col">
              <button
                type="submit"
                className="w-80 mt-4 ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
                onClick={() => {
                  window.location.href = "http://giris.bmtal.rf.gd/";
                }}
              >
                GİRİŞ YAP
              </button>
              <button
                type="submit"
                onClick={(e) => setModal(true)}
                className="w-80 mt-2 ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                MİSAFİR GİRİŞİ
              </button>
            </div>
            {modal && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-6 rounded-md w-96">
                  <h2 className="text-2xl font-bold mb-4">Misafir Girişi</h2>
                  <label className="block mb-2">Adınız:</label>
                  <input
                    type="text"
                    onChange={(e) =>
                      setMisafirData({ ...misafirData, ad: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                  />
                  <label className="block mb-2">Numaranız:</label>
                  <input
                    type="number"
                    onChange={(e) =>
                      setMisafirData({ ...misafirData, no: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                  />
                  <button
                    className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
                    onClick={handleSifrele}
                  >
                    Kaydet
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
