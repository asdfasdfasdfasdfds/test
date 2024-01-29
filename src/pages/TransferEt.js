import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { generateRandomCode } from "../kodOlustur";
import Footer from "../components/Footer";
import logo from "../img/battalkart.jpg";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";

const QrTransfer = () => {
  const [miktar, setMiktar] = useState("");
  const [sifre, setSifre] = useState("");
  const [kartSifre, setKartSifre] = useState("");
  const [kartNo, setKartNo] = useState("");
  const [aktifBakiye, setAktifBakiye] = useState("");
  const token = getCookieValue("token");
  const [transferKod, setTransferKod] = useState("");
  const [sifreYanlis, setSifreYanlis] = useState(false);

  useEffect(() => {
    const veriCek = async () => {
      try {
        const cozulenData = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
        const kullaniciRef = collection(firestore, "kullanicilar");
        const kartRef = collection(firestore, "kartlar");
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

          const kartQuery = query(kartRef, where("kartNo", "==", kartNo));
          const kartSnapshot = await getDocs(kartQuery);

          if (!kartSnapshot.empty) {
            const kartDoc = kartSnapshot.docs[0];
            const kartData = kartDoc.data();
            const kartSifre = kartData.sifre;
            const aktifBakiye = kartData.aktifBakiye;
            setKartSifre(kartSifre);
            setAktifBakiye(aktifBakiye);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    veriCek();
  }, []);

  const transferEt = async () => {
    try {
      const kartRef = collection(firestore, "kartlar");
      const kartQuery = query(kartRef, where("kartNo", "==", kartNo));
      const kartSnapshot = await getDocs(kartQuery);

      if (!kartSnapshot.empty) {
        const kartDoc = kartSnapshot.docs[0];
        const kartData = kartDoc.data();
        const aktifBakiye = kartData.aktifBakiye;

        if (sifre === kartSifre) {
          if (parseInt(miktar) <= aktifBakiye) {
            const yeniTransferKod = generateRandomCode(5);
            const transferlerRef = collection(firestore, "transferler");
            await addDoc(transferlerRef, {
              gonderenKartNo: kartNo,
              miktar: parseInt(miktar),
              kod: yeniTransferKod,
              durum: "Gonderilmedi",
            });

            setTransferKod(yeniTransferKod);
          }
        } else {
          setSifreYanlis(true);
          setTimeout(() => {
            setSifreYanlis(false);
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Hata oluştu");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src={logo} className="mx-auto mb-10 w-64" />
      <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-md w-80 lg:w-5/12">
        <h2 className="text-center text-3xl font-extrabold mb-6 text-gray-800">
          Transfer
        </h2>
        {transferKod ? (
          <div className="text-center">
            <p className="text-2xl mb-5 font-extrabold text-gray-800">
              Transfer Kodunuz: <span>{transferKod}</span>
            </p>
            <Link
              to="/anasayfa"
              className="px-40 font-extrabold text-center bg-gray-800 text-white py-3 rounded-xl mt-6 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Anasayfaya Dön
            </Link>
          </div>
        ) : (
          <form>
            <div className="text-center bg-[#77cadc] shadow-2xl rounded-lg py-2 mb-3">
              <p className="text-gray-800 text-xl font-extrabold">
                Transfer edebileceginiz miktar: <span>{aktifBakiye} TL</span>
              </p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="miktar"
                className="block text-sm font-extrabold text-gray-800 mb-1"
              >
                Transfer edilecek Miktar
              </label>
              <input
                type="number"
                id="miktar"
                value={miktar}
                onChange={(e) => setMiktar(e.currentTarget.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                placeholder="Miktar"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-extrabold text-gray-800 mb-1"
              >
                Kart Şifresi
              </label>
              <input
                type="password"
                id="password"
                value={sifre}
                onChange={(e) => setSifre(e.currentTarget.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                placeholder="Şifre"
              />
            </div>
            <button
              type="button"
              onClick={transferEt}
              className="w-full ring-2 font-extrabold bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Transfer Et
            </button>
            {sifreYanlis && (
              <p className="text-gray-800 font-bold text-lg mt-4">
                Girilen kart şifresi yanlış!
              </p>
            )}
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default QrTransfer;
