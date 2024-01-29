import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import logo from "../img/battalkart.jpg";

const KartDetay = () => {
  const { no } = useParams();
  const [kartDetay, setKartDetay] = useState(null);

  useEffect(() => {
    const sorgu = query(
      collection(firestore, "kartlar"),
      where("kartNo", "==", no)
    );

    const getKartDetay = async () => {
      try {
        const querySnapshot = await getDocs(sorgu);
        if (!querySnapshot.empty) {
          const kart = querySnapshot.docs[0].data();
          setKartDetay(kart);
        }
      } catch (error) {
        console.error("Kart detayını alırken hata oluştu:", error);
      }
    };

    getKartDetay();
  }, []);

  return (
    <div className=" bg-white flex flex-col items-center justify-center">
      <img src={logo} className="w-48 mx-auto mt-10" />
      <div className="w-96 mt-5 md:bg-slate-50 bg-white md:border rounded-md md:shadow-lg">
        <div className="ml-4 mt-2">
          <p>
            <span className="font-semibold text-lg">{no}</span> Numaralı kartın
            bilgileri:
          </p>
        </div>
        {kartDetay == null && (
          <div className="ml-4 m-2">
            <p className="font-extrabold ">Kart bilgisi getirilemedi.</p>
          </div>
        )}
        {kartDetay && (
          <div className="ml-4 m-2">
            <p className="text-lg">
              Kart No: <span className="font-semibold">{no}</span>
            </p>
            <p className="text-lg">
              Aktif Bakiye:{" "}
              <span className="font-semibold">{kartDetay.aktifBakiye}</span> TL
            </p>
            <p className="text-lg">
              Ad: <span className="font-semibold">{kartDetay.isim}</span>
            </p>
            <p className="text-lg">
              Yetki: <span className="font-semibold">{kartDetay.yetki}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KartDetay;
