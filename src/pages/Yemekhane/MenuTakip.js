import React, { useState, useEffect } from "react";
import {
  query,
  collection,
  getDocs,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const Menuler = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  useEffect(() => {
    async function fetchMenus() {
      const q = query(collection(db, "yemekler"));

      const querySnapshot = await getDocs(q);

      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const tarih = data.tarih;
        const katilanlarSayisi = data.katilanlar.length;

        items.push({ tarih, katilanlarSayisi, id: doc.id });
      });

      setMenuItems(items);
    }

    fetchMenus();
    setIsLoadingMenu(false);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "yemekler", id));
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-8">
      <header className="text-2xl font-extrabold text-center text-gray-900 mb-4">
        YEMEKHANE KATILIM <br /> TAKİP
      </header>
      <div>
        {isLoadingMenu ? (
          <p className="text-gray-500 text-center">Yükleniyor...</p>
        ) : menuItems.length === 0 ? (
          <p className="text-center text-red-500 text-xl font-bold mb-4">
            Menü oluşturulmamış.
          </p>
        ) : (
          <ol>
            {menuItems.map((item, index) => (
              <div
                className="bg-white rounded-lg p-4 mb-4 shadow-2xl w-full max-w-md"
                key={index}
              >
                <li className="flex flex-col">
                  <p className="font-extrabold">{item.tarih} Tarihinde,</p>
                  {item.katilanlarSayisi} kişi yemekhaneye katılacak.
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="mt-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Menüyü Sil
                  </button>
                </li>
              </div>
            ))}
          </ol>
        )}
      </div>
      <Link
        to="/ypanel"
        className="mt-3 w-72 lg:w-96 flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Anasayfaya Dön
      </Link>
      <Footer />
    </div>
  );
};

export default Menuler;
