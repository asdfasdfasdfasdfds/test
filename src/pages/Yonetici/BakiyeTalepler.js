import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import logo from "../../img/battalkart.jpg";
import { generateRandomCode } from "../../utils/kodOlustur";

const BakiyeTalepler = () => {
  const [talepler, setTalepler] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const ref = collection(firestore, "talepler");

  const getTalep = async () => {
    let queryRef = ref;

    if (searchTerm !== "") {
      queryRef = query(
        ref,
        where("ad", ">=", searchTerm),
        where("ad", "<=", searchTerm + "\uf8ff")
      );
    }

    const qSnap = await getDocs(queryRef);
    const talepData = [];
    qSnap.forEach((doc) => {
      talepData.push({ id: doc.id, ...doc.data() });
    });
    setTalepler(talepData);
  };

  useEffect(() => {
    getTalep();
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toUpperCase());
  };

  const handleOnayla = async (id) => {
    try {
      const docRef = doc(firestore, "talepler", id);
      const qDoc = await getDoc(docRef);
      const docData = qDoc.data();
      const kartNo = docData.kartNo;
      const seriNo = docData.seriNo;
      const miktar = docData.miktar;
      bakiyeYukle(kartNo, seriNo, miktar, id);
    } catch (error) {
      alert("Sistemde hata var. Lütfen ONUR KÜRKAYA 10/A söyleyiniz.");
    }
  };

  const bakiyeYukle = async (kartNumara, seriNumara, miktar, gelenId) => {
    const kartRef = collection(firestore, "kartlar");
    const qSnap = query(
      kartRef,
      where("kartNo", "==", kartNumara),
      where("seriNo", "==", seriNumara)
    );
    const donenSnap = await getDocs(qSnap);
    if (!donenSnap.empty) {
      const docId = donenSnap.docs[0].id;
      const yeniRef = doc(firestore, "kartlar", docId);
      const aktifBakiye = donenSnap.docs[0].data().aktifBakiye;
      const yeniBakiye = aktifBakiye + parseInt(miktar);
      const islem = {
        islemTuru: `Bakiye Yüklendi`,
        miktar: miktar,
        tarih: new Date().toLocaleString("tr-TR"),
        islemKodu: generateRandomCode(9),
      };
      await updateDoc(yeniRef, {
        aktifBakiye: yeniBakiye,
        islemler: arrayUnion(islem),
      });
      handleSil(gelenId);
      setSuccessMessage("KART BAKİYESİ GÜNCELLENDİ.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      alert("SİSTEMDE HATA VAR LÜTFEN ONUR KÜRKAYA 10/A BİLDİRİNİZ.");
    }
  };

  const handleSil = async (id) => {
    try {
      const docRef = doc(firestore, "talepler", id);
      await deleteDoc(docRef);
      getTalep();
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-semibold">
      <img src={logo} className="w-48 mb-6" />
      <h2 className="text-xl mb-4">BAKİYE TALEPLERİ</h2>
      <div className="w-full h-auto p-1 border max-w-xl overflow-hidden rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="ADI SOYADI"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-4 border bg-gray-100 border-gray-300 rounded-md mb-5"
        />
        {talepler.length == 0 && (
          <p className="text-center font-bold">HENÜZ TALEP OLUŞTURULMAMIŞ!</p>
        )}

        <ul className="divide-y flex flex-col gap-2 divide-gray-200">
          {talepler.map((talep) => (
            <li
              key={talep.id}
              className="py-4 px-6 bg-gray-100 text-center hover:bg-gray-50"
            >
              <h3 className="text-base p-1 rounded bg-white border-2 font-semibold">
                ADI SOYADI: {talep.ad}
              </h3>
              <h3 className="text-base p-1 rounded bg-white border-2 font-semibold">
                SERİ NO: {talep.seriNo}
              </h3>
              <h3 className="text-base p-1 rounded bg-white border-2 font-semibold">
                KART NO: {talep.kartNo}
              </h3>
              <h3 className="text-base p-1 rounded bg-white border-2 font-semibold">
                MİKTAR: {talep.miktar} TL
              </h3>
              <div className="flex flex-row gap-2 items-center justify-center">
                <button
                  onClick={() => handleOnayla(talep.id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 w-60 rounded mt-2"
                >
                  ONAYLA
                </button>
                <button
                  onClick={() => handleSil(talep.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 w-60 rounded mt-2"
                >
                  SİL
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {successMessage && (
        <div className="fixed top-0 right-0 mr-4 mt-4 bg-green-500 text-white py-2 px-4 rounded">
          {successMessage}
        </div>
      )}
      <p className="text-sm text-gray-600 font-light mt-2">
        &copy; Onur Kürkaya
      </p>
    </div>
  );
};

export default BakiyeTalepler;
