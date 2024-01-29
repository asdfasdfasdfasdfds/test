import { Outlet, Navigate } from "react-router-dom";
import { firestore } from "../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";

const Panel = () => {
  const [yetki, setYetki] = useState("");
  const token = getCookieValue("token");
  const ref = collection(firestore, "kartlar");
  const key = process.env.REACT_APP_ANAHTAR;
  useEffect(() => {
    const yetkiGetir = async () => {
      try {
        const cozulenSifre = sifreCoz(token, key);
        const q = query(ref, where("isim", "==", cozulenSifre.ad));
        const yetki = await getDocs(q);

        if (!yetki.empty) {
          const yetkiData = yetki.docs[0].data();
          const yetkiCek = yetkiData.yetki;
          setYetki(yetkiCek);
        }
      } catch (error) {
        console.log("hata");
      }
    };

    yetkiGetir();
  }, []);

  if (!yetki == "Yetkili") {
    return <Navigate to="/anasayfa" replace />;
  }
  return <Outlet />;
};

export default Panel;
