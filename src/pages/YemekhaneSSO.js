import React, { useEffect, useState } from "react";
import siluet from "../img/siluet.png";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";
import kullaniciIMG from "../img/kullanici.png";
import Footer from "../components/Footer";

const YemekhaneSSO = () => {
  const token = getCookieValue("token");
  const [data, setData] = useState({});

  useEffect(() => {
    const cozulenSifre = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
    setData(cozulenSifre);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <img src={siluet} className="w-36" />
      <p className="font-sans font-semibold text-xl mt-40 text-slate-800">
        HESAP SEÇ
      </p>
      <div
        onClick={() => {
          window.location.href = `https://battal-yemekhane.vercel.app/sso/${token}`;
        }}
        className="p-4 flex font-semibold text-gray-600 border-gray-200 justify-between rounded-xl border w-64 mt-5 hover:bg-slate-100"
      >
        <img src={kullaniciIMG} className="w-12 h-auto" />
        <div className="flex flex-col">
          <p className="text-black text-lg">{data.ad}</p>
          <p className="text-base">{data.seriNo}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default YemekhaneSSO;
