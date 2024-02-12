import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const MenuEkle = () => {
  const [menuItems, setMenuItems] = useState([{ name: "", id: 1 }]);
  const [manualDate, setManualDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleAddItem = () => {
    setMenuItems((prevItems) => [
      ...prevItems,
      { name: "", id: prevItems.length + 1 },
    ]);
  };

  const handleRemoveItem = (id) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleItemChange = (id, value) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, name: value } : item
      )
    );
  };

  const handleMenuSubmit = async () => {
    try {
      const menuData = menuItems.reduce(
        (acc, item, index) => {
          acc[`Yemek${index + 1}`] = item.name;
          return acc;
        },
        { tarih: manualDate, katilanlar: [] }
      );

      const docRef = await addDoc(collection(db, "yemekler"), menuData);

      setShowSuccess(true);
      setShowError(false);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      setShowError(true);
      setShowSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-8">
      <header className="text-3xl font-extrabold text-gray-900 mb-4">
        Menü Ekle
      </header>
      <div className="bg-white rounded-lg p-4 mb-4 shadow-2xl w-full max-w-md">
        <input
          type="text"
          placeholder="Tarih (Örn: 12 Ağustos 2023)"
          value={manualDate}
          onChange={(e) => setManualDate(e.target.value)}
          className="block w-full p-2 border rounded-md mb-4"
        />
        {menuItems.map((item) => (
          <div key={item.id} className="flex mb-2">
            <input
              type="text"
              placeholder={`Yemek ${item.id}`}
              value={item.name}
              onChange={(e) => handleItemChange(item.id, e.target.value)}
              className="block w-full p-2 border rounded-md"
            />
            {menuItems.length > 1 && (
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="ml-2 text-red-600 hover:text-red-800 font-medium transition duration-300"
              >
                Sil
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddItem}
          className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-300"
        >
          + Yemek Ekle
        </button>
        <button
          onClick={handleMenuSubmit}
          className="mt-4 w-full bg-gray-800 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold"
        >
          Menüyü Ekle
        </button>
        <div className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md font-semibold text-center">
          <Link to="/ypanel">Panele Dön</Link>
        </div>
        {showSuccess && (
          <div className="text-green-600 mt-2">Menü başarıyla eklendi!</div>
        )}
        {showError && (
          <div className="text-red-600 mt-2">
            Menü eklenirken bir hata oluştu.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MenuEkle;
