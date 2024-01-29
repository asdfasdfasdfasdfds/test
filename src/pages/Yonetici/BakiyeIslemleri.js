import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { generateRandomCode } from "../../kodOlustur";
import logo from "../../img/battalkart.jpg";

function BakiyeIslemleri() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [kartNo, setKartNo] = useState("");
  const [basarili, setBasarili] = useState(false);
  const [basarisiz, setBasarisiz] = useState(false);
  const [miktar, setMiktar] = useState("");
  const ref = collection(firestore, "kartlar");

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = (kapat) => {
    kapat.preventDefault();
    setShowAddModal(false);
  };

  const handleSnackbarClose = () => {
    setBasarili(false);
    setBasarisiz(false);
  };

  const bakiyeYukle = async (e) => {
    e.preventDefault();
    try {
      const q = query(ref, where("kartNo", "==", kartNo));
      const kartData = await getDocs(q);

      if (!kartData.empty) {
        const kartDoc = kartData.docs[0];
        const kartId = kartDoc.id;
        const kartVeri = kartDoc.data();

        const islem = {
          islemTuru: `Bakiye Yüklendi`,
          miktar: miktar,
          tarih: new Date().toLocaleString("tr-TR"),
          islemKodu: generateRandomCode(7),
        };

        const yeniBakiye = kartVeri.aktifBakiye + parseFloat(miktar);

        await updateDoc(doc(ref, kartId), {
          aktifBakiye: yeniBakiye,
          islemler: arrayUnion(islem),
        });

        setBasarili(true);

        setKartNo("");
        setMiktar("");
      } else {
        setBasarisiz(true);
      }
    } catch (error) {
      console.error("Bakiye yükleme işlemi başarısız oldu:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <img src={logo} className="w-96 mb-2 rounded-full mt-20" />
      <h1 className="text-4xl text-gray-800 font-extrabold mb-6">
        BAKİYE İŞLEMLERİ
      </h1>
      <div className="flex flex-col">
        <button
          onClick={openAddModal}
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          BAKİYE YÜKLE
        </button>
        <Link
          to="/panel"
          className="w-72 text-center font-extrabold bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          PANELE DÖN
        </Link>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 mt-20 flex items-center justify-center">
          <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-md w-80 lg:w-5/12">
            <h2 className="text-center text-3xl font-extrabold mb-6 text-gray-800">
              Bakiye Yükle
            </h2>
            <form>
              <div className="mb-3">
                <label
                  htmlFor="no"
                  className="block text-sm font-extrabold text-gray-800 mb-1"
                >
                  Kart NO
                </label>
                <input
                  type="text"
                  id="no"
                  value={kartNo}
                  onChange={(e) => {
                    setKartNo(e.currentTarget.value);
                  }}
                  className="w-full px-4 py-4 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                  placeholder="Kartın Üzerindeki Numara"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="miktar"
                  className="block text-sm font-extrabold text-gray-800 mb-1"
                >
                  Miktar
                </label>
                <input
                  type="number"
                  id="miktar"
                  value={miktar}
                  onChange={(e) => {
                    setMiktar(e.currentTarget.value);
                  }}
                  className="w-full px-4 py-4 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                  placeholder="Yüklenecek Miktar"
                />
              </div>

              <button
                type="submit"
                onClick={bakiyeYukle}
                className="w-full ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-none rounded-t-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Yükle
              </button>
              <button
                onClick={closeAddModal}
                className="w-full ring-2 text-center font-extrabold bg-gray-800 text-white py-3 rounded-none rounded-b-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Kapat
              </button>
            </form>
          </div>
        </div>
      )}

      {basarili && (
        <div className="fixed bottom-[580px] right-5 bg-green-500 text-white py-4 px-6 rounded-md">
          İşlem Başarılı.
          <button
            onClick={handleSnackbarClose}
            className="ml-2 text-sm font-semibold focus:outline-none"
          >
            Kapat
          </button>
        </div>
      )}

      {basarisiz && (
        <div className="fixed bottom-[580px] right-5 bg-red-500 text-white py-4 px-6 rounded-md">
          İşlem Başarısız
          <button
            onClick={handleSnackbarClose}
            className="ml-2 text-sm font-semibold focus:outline-none"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}

export default BakiyeIslemleri;
