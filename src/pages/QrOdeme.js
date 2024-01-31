import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Footer from "../components/Footer";
import { firestore } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from "../img/battalkart.jpg";
import { getCookieValue } from "../services/cookieIslemler";
import { kartSifrele, sifreCoz } from "../services/sifreIslem";

const QrOdeme = () => {
  const [kartNo, setKartNo] = useState("");
  const [kod, setKod] = useState("");
  const [olusturuldu, setOlusturuldu] = useState(false);
  const token = getCookieValue("token");
  const navigate = useNavigate();
  const kulRef = collection(firestore, "kullanicilar");
  const anahtar = process.env.REACT_APP_ANAHTAR;

  useEffect(() => {
    const veriCek = async () => {
      const cozulen = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
      const q = query(kulRef, where("no", "==", cozulen.no));
      const qSnap = await getDocs(q);

      if (!qSnap.empty) {
        const kulData = qSnap.docs[0].data();
        const kartNo = kulData.kartNo;
        setKartNo(kartNo);
      } else {
        alert("Lütfen kartınızı ekleyin.");
        navigate("/anasayfa");
      }
    };
    veriCek();
  }, []);

  const handleQr = async () => {
    try {
      const sifreliKart = kartSifrele(kartNo, anahtar);
      setKod(sifreliKart);
      setOlusturuldu(true);
    } catch (error) {
      alert("QR Kod oluşturulamadı");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <img src={logo} className="w-80" />
      <div className="bg-white border border-gray-500 max-w-lg w-full h-auto rounded-md p-4 mt-5">
        <div className="text-center font-semibold">
          {olusturuldu ? (
            <>
              <QRCode value={kod} className="mx-auto mt-3 mb-6" />
              <p className="font-semibold bg-indigo-100 p-3 rounded-md text-xl">
                <span className="font-bold">{kartNo}</span>
              </p>
            </>
          ) : (
            <div className="m-4">
              <button
                onClick={handleQr}
                className="p-4 bg-gray-800 text-white rounded-md w-80 border hover:bg-indigo-200"
              >
                QR KOD OLUŞTUR
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QrOdeme;
