import React, { useEffect, useState } from "react";
import logo from "../../img/battalkart.jpg";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebase";

const Rapor = () => {
  const raporRef = collection(firestore, "rapor");
  const [suankiTarih, setSuankiTarih] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const anlikTarih = new Date();
    const gun = String(anlikTarih.getDate()).padStart(2, "0");
    const ay = String(anlikTarih.getMonth() + 1).padStart(2, "0");
    const yil = anlikTarih.getFullYear();
    setSuankiTarih(`${gun}.${ay}.${yil}`);

    const fetchData = async () => {
      const q = query(raporRef, where("tarih", "==", suankiTarih));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setData(doc.data());
      });
    };

    fetchData();
  }, [suankiTarih]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <img src={logo} className="w-96 mt-5" alt="Logo" />
      <div className="bg-gray-800 w-96 mt-5 h-60 rounded-md p-4 shadow-md">
        <p className="text-center font-semibold text-xl text-white mt-2">
          <span className="font-extrabold">{suankiTarih}</span> <br />
          TARİHLİ RAPOR
        </p>
        {data.length != 0 ? (
          <div className="flex flex-col gap-2 items-center mt-5">
            <div className="p-4 text-center w-60 bg-white rounded-md">
              <p className="text-black font-semibold">
                YEMEK YİYEN KİŞİ SAYISI
                <span className="font-extrabold"> {data.yYkisi}</span>
              </p>
            </div>
            <div className="p-4 w-60 text-center bg-white rounded-md">
              <p className="text-black font-semibold">
                KAZANÇ <span className="font-extrabold">{data.kazanc}</span> TL
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xl text-center mt-5 text-white font-bold">
            Rapor bulunamadı.
          </p>
        )}
      </div>
    </div>
  );
};

export default Rapor;
