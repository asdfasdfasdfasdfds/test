import React, { useEffect, useState } from "react";
import DuyuruModal from "../components/DuyuruModal";
import { Outlet } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";
import gif from "../img/cumhuriyet.gif";

const DuyuruLayout = () => {
  const [duyuru, setDuyuru] = useState(true);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [duyuruBilgi, setDuyuruBilgi] = useState({});
  const [tarih, setTarih] = useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      setYukleniyor(false);
    }, 10);
  });

  const formatDate = (date) => {
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const duyuruCek = async () => {
      const q = query(
        collection(firestore, "duyurular"),
        where("tarih", "==", formatDate(tarih))
      );

      const gelenSnap = await getDocs(q);

      if (!gelenSnap.empty) {
        setDuyuru(true);
        const data = gelenSnap.docs[0].data();
        setDuyuruBilgi(data);
      } else {
        setDuyuru(false);
      }
    };
    duyuruCek();
  }, [tarih]);

  if (yukleniyor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <img src={gif} />;
      </div>
    );
  }

  if (duyuru) {
    return (
      <>
        <DuyuruModal
          baslik={duyuruBilgi.baslik}
          metin={duyuruBilgi.metin}
          tarih={duyuruBilgi.tarih}
        />
        <Outlet />
      </>
    );
  }

  return <Outlet />;
};

export default DuyuruLayout;
