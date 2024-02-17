import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";
import Footer from "../components/Footer";
import logo from "../img/battalkart.jpg";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";

const TransferAl = () => {
  const [kartNo, setKartNo] = useState("");
  const [transferTamamlandi, setTransferTamamlandi] = useState("");
  const token = getCookieValue("token");
  const [transferKod, setTransferKod] = useState("");
  const [miktar, setMiktar] = useState("");
  const [tamamlandi, setTamamlandi] = useState(false);

  useEffect(() => {
    const veriCek = async () => {
      try {
        const cozulenData = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
        const kullaniciRef = collection(firestore, "kartlar");
        const queryKullanici = query(
          kullaniciRef,
          where("no", "==", cozulenData.no)
        );
        const querySnapshot = await getDocs(queryKullanici);

        if (!querySnapshot.empty) {
          const kullaniciDoc = querySnapshot.docs[0];
          const kullaniciVeri = kullaniciDoc.data();
          const kartNo = kullaniciVeri.kartNo;
          setKartNo(kartNo);
        }
      } catch (e) {
        console.log(e);
      }
    };
    veriCek();
  }, []);

  const Tamamla = async () => {
    const kartRef = collection(firestore, "kartlar");

    try {
      const transferRef = collection(firestore, "transferler");
      const queryTransfer = query(transferRef, where("kod", "==", transferKod));
      const querySnap = await getDocs(queryTransfer);

      if (!querySnap.empty) {
        const transferDoc = querySnap.docs[0];
        const transferData = transferDoc.data();
        const gonderenKartNo = transferData.gonderenKartNo;
        const gonderilecekMiktar = transferData.miktar;
        const durum = transferData.durum;

        if (durum === "Basarili") {
          setTransferTamamlandi(true);
          return;
        }

        setMiktar(gonderilecekMiktar);

        const alanKartQuery = query(kartRef, where("kartNo", "==", kartNo));
        const alanSnap = await getDocs(alanKartQuery);

        if (!alanSnap.empty) {
          const alanDoc = alanSnap.docs[0];
          const alanData = alanDoc.data();

          await updateDoc(alanDoc.ref, {
            aktifBakiye: alanData.aktifBakiye + gonderilecekMiktar,
          });
        }

        const gonderenKartQuery = query(
          kartRef,
          where("kartNo", "==", gonderenKartNo)
        );
        const gonderenSnap = await getDocs(gonderenKartQuery);

        if (!gonderenSnap.empty) {
          const gonderenDoc = gonderenSnap.docs[0];
          const gonderenData = gonderenDoc.data();
          const gonderenAktifBakiye = gonderenData.aktifBakiye;

          if (gonderenAktifBakiye >= gonderilecekMiktar) {
            await updateDoc(gonderenDoc.ref, {
              aktifBakiye: gonderenAktifBakiye - gonderilecekMiktar,
            });
            await updateDoc(transferDoc.ref, {
              durum: "Basarili",
              alanKart: kartNo,
            });
            setTamamlandi(true);
          } else {
            alert("Yetersiz bakiye");
          }
        } else {
          alert("Gönderen kart bulunamadı.");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src={logo} className="mx-auto mb-10 w-64" />
      <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-md w-80 lg:w-5/12">
        <h2 className="text-center text-3xl font-extrabold mb-6 text-gray-800">
          Transfer
        </h2>
        {tamamlandi ? (
          <div className="text-center text-lg font-extrabold text-gray-800">
            <p>Transfer işlemi başarıyla tamamlandı.</p>
            <p>
              Miktar: <span>{miktar}</span> TL
            </p>
            <Link
              type="submit"
              to="/anasayfa"
              className="w-full text-center bg-gray-800 text-white py-3 rounded-xl mt-6 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Anasayfaya Dön
            </Link>
          </div>
        ) : (
          <form>
            <div className="mb-6">
              <label
                htmlFor="miktar"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Transfer Kodu
              </label>
              <input
                type="number"
                id="miktar"
                value={transferKod}
                onChange={(e) => setTransferKod(e.currentTarget.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                placeholder="Transfer Kodu"
              />
            </div>
            <button
              type="button"
              onClick={Tamamla}
              className="w-full ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-none rounded-t-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Tamamla
            </button>
            <Link
              type="submit"
              to="/anasayfa"
              className="w-full ring-2 text-center font-extrabold bg-gray-800 text-white py-3 rounded-none rounded-b-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Anasayfaya Dön
            </Link>
          </form>
        )}
        {transferTamamlandi && (
          <p className="text-red-800 text-lg mt-2 font-bold">
            Zaten Transfer Tamamlanmış.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TransferAl;
