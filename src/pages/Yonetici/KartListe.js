import React, { useEffect, useState } from "react";
import logo from "../../img/battalkart.jpg";
import ogrenci from "../../img/ogrenci.jpg";
import ogretmen from "../../img/ogretmen.jpg";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase";

const KartListe = () => {
  const [kartlar, setKartlar] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const getKartlar = async () => {
      const kartlarCollection = collection(firestore, "kartlar");
      const querySnapshot = await getDocs(kartlarCollection);

      const kartlarData = [];
      querySnapshot.forEach((doc) => {
        kartlarData.push({ id: doc.id, ...doc.data() });
      });

      setKartlar(kartlarData);
    };

    getKartlar();
  }, []);

  const handleSil = async (kartId) => {
    const kartDocRef = doc(firestore, "kartlar", kartId);
    await deleteDoc(kartDocRef);
    const updatedKartlar = kartlar.filter((kart) => kart.id !== kartId);
    setKartlar(updatedKartlar);
  };

  useEffect(() => {
    if (searchQuery) {
      const searchResults = kartlar.filter((kart) =>
        kart.kartNo.includes(searchQuery)
      );
      setSearchResults(searchResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, kartlar]);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
      <img src={logo} className="w-96 mb-2" />
      <div className="w-full max-w-4xl p-3 bg-white border rounded-md shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Kart Listesi</h1>
        <input
          type="text"
          className="w-full p-2 mb-4 rounded-md border border-gray-300"
          placeholder="Kart No Ara"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex flex-col gap-4">
          {searchQuery
            ? searchResults.map((kart, index) => (
                <div
                  key={index}
                  className="bg-[#77cadc] shadow-[#b4dce6] shadow-2xl border border-gray-800 w-80 h-62 lg:w-full lg:h-56 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    {kart.yetki === "Öğrenci" ? (
                      <img src={ogrenci} className="w-44 rounded-md" />
                    ) : (
                      <img src={ogretmen} className="w-52 rounded-md" />
                    )}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <p className="text-gray-800 font-extrabold text-sm">
                        Kart NO
                      </p>
                      <p className="text-white text-2xl font-extrabold">
                        {kart.kartNo}
                      </p>
                      <div className="mt-2">
                        <p className="text-gray-800 font-extrabold text-sm">
                          Seri NO
                        </p>
                        <p className="text-white text-2xl font-extrabold ">
                          {kart.seriNo}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-800 font-extrabold text-sm">
                        Şifre
                      </p>
                      <p className="text-white text-2xl font-extrabold ">
                        {kart.sifre}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-gray-800 font-extrabold text-sm">
                        Bakiyeniz
                      </p>
                      <p className="text-white text-2xl font-extrabold">
                        {kart.aktifBakiye} TL
                      </p>
                    </div>
                    <button
                      className="text-lg p-3 w-48 bg-white rounded-md  text-red-500 font-extrabold cursor-pointer"
                      onClick={() => handleSil(kart.id)}
                    >
                      Kartı Sil
                    </button>
                    <div className="flex flex-col">
                      <p className="text-gray-800 font-extrabold text-sm">
                        İsim
                      </p>
                      <p className="text-white text-2xl font-extrabold">
                        {kart.ad}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            : kartlar.map((kart, index) => (
                <div
                  key={index}
                  className="bg-[#77cadc] shadow-[#b4dce6] shadow-2xl border border-gray-800 w-80 h-62 lg:w-full lg:h-56 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    {kart.yetki === "Öğrenci" ? (
                      <img src={ogrenci} className="w-44 rounded-md" />
                    ) : (
                      <img src={ogretmen} className="w-52 rounded-md" />
                    )}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <p className="text-gray-800 font-extrabold text-sm">
                        Kart NO
                      </p>
                      <p className="text-white text-2xl font-extrabold">
                        {kart.kartNo}
                      </p>
                      <div className="mt-2">
                        <p className="text-gray-800 font-extrabold text-sm">
                          Seri NO
                        </p>
                        <p className="text-white text-2xl font-extrabold ">
                          {kart.seriNo}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-800 font-extrabold text-sm">
                        Şifre
                      </p>
                      <p className="text-white text-2xl font-extrabold ">
                        {kart.sifre}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div>
                      <p className="text-gray-800 font-extrabold text-sm">
                        Bakiyeniz
                      </p>
                      <p className="text-white text-2xl font-extrabold">
                        {kart.aktifBakiye} TL
                      </p>
                    </div>
                    <button
                      className="text-lg p-3 w-48 bg-white rounded-md  text-red-500 font-extrabold cursor-pointer"
                      onClick={() => handleSil(kart.id)}
                    >
                      Kartı Sil
                    </button>
                    <div className="flex flex-col">
                      <p className="text-gray-800 font-extrabold text-sm">
                        İsim
                      </p>
                      <p className="text-white text-2xl font-extrabold">
                        {kart.ad}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default KartListe;
