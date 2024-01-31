import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import logo from "../img/battalkart.jpg";
import bg from "../img/bg.jpg";

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
        {kartDetay == null && (
          <div className="ml-4 m-2">
            <p className="font-extrabold ">Kart bilgisi getirilemedi.</p>
          </div>
        )}
        {kartDetay && (
          <div className="flex justify-center">
            <div className="w-96 h-56 m-auto rounded-xl text-white shadow-2xl transition-transform transform hover:scale-105">
              <img
                className="relative object-cover w-full h-full rounded-xl"
                src={bg}
              />
              <div className="w-full px-8 absolute top-8">
                <div className="flex justify-between">
                  <div>
                    <p className="font-light">AD</p>
                    <p className="font-medium tracking-widest">
                      {kartDetay.isim}
                    </p>
                  </div>
                </div>
                <div className="pt-1">
                  <p className="font-light">KART NO</p>
                  <p className="font-medium tracking-more-wider">
                    {kartDetay.kartNo}
                  </p>
                </div>
                <div className="pt-6 pr-6">
                  <div className="flex justify-between">
                    <div className="">
                      <p className="font-light text-xs">BAKİYE</p>
                      <p className="font-medium tracking-wider text-sm">
                        {kartDetay.aktifBakiye} TL
                      </p>
                    </div>
                    <div className="">
                      <p className="font-light text-xs">YETKİ</p>
                      <p className="font-bold tracking-more-wider text-sm">
                        {kartDetay.yetki.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KartDetay;
