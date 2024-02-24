import React, { useState } from "react";
import logo from "../../img/battalkart.jpg";
import { addDoc, collection } from "firebase/firestore";
import { db, firestore } from "../../firebase";

const Duyuru = () => {
  const [baslik, setBaslik] = useState("");
  const [metin, setMetin] = useState("");
  const [tarih, setTarih] = useState("");

  const handleOlustur = async (e) => {
    e.preventDefault();
    try {
      const ref = collection(firestore, "duyurular");
      const ref2 = collection(db, "duyurular");
      await addDoc(ref, {
        baslik,
        metin,
        tarih,
      });
      await addDoc(ref2, {
        baslik,
        metin,
        tarih,
      });
      alert("Duyuru Oluşturuldu.");
    } catch (error) {
      alert("Duyuru Oluşturulamadı.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <img src={logo} className="w-72 md:w-96" alt="logo" />
      <div className="max-w-3xl text-center w-full rounded h-96 bg-slate-100">
        <p className="text-2xl font-bold mt-2">DUYURU OLUŞTUR</p>
        <form className="flex flex-col items-center" onSubmit={handleOlustur}>
          <input
            className="p-3 w-80 rounded bg-gray-200 mt-3 placeholder-black font-semibold"
            placeholder="DUYURU BAŞLIĞI"
            value={baslik}
            onChange={(e) => setBaslik(e.target.value)}
            required
          />
          <textarea
            className="p-3 w-80 h-32 rounded bg-gray-200 mt-3 placeholder-black font-semibold resize-none"
            placeholder="DUYURU METNİ"
            value={metin}
            onChange={(e) => setMetin(e.target.value)}
            required
          />
          <input
            className="p-3 w-80 rounded bg-gray-200 mt-3 placeholder-black font-semibold"
            placeholder="DUYURUNUN GÖSTERİLECEĞİ TARİH"
            value={tarih}
            onChange={(e) => setTarih(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-80 mt-5 ring text-center font-extrabold bg-gray-100 border-2 text-black py-3 rounded hover:bg-gray-200 focus:outline-none"
          >
            OLUŞTUR
          </button>
        </form>
      </div>
    </div>
  );
};

export default Duyuru;
