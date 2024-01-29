import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Footer from "../components/Footer";
import { generateRandomCode } from "../kodOlustur";
import { firestore } from "../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from "../img/battalkart.jpg";
import { getCookieValue } from "../services/cookieIslemler";
import { kartSifrele, sifreCoz } from "../services/sifreIslem";

const QrOdeme = () => {
  const [kartNo, setKartNo] = useState("");
  const [kod, setKod] = useState("");
  const [no, setNo] = useState("");
  const [olusturuldu, setOlusturuldu] = useState(false);
  const token = getCookieValue("token");
  const navigate = useNavigate();
  const kulRef = collection(firestore, "kullanicilar");
  const qrRef = collection(firestore, "qrKod");
  const anahtar = process.env.REACT_APP_ANAHTAR;

  useEffect(() => {
    const veriCek = async () => {
      const cozulen = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
      setNo(cozulen.no);
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

  useEffect(() => {
    const qrCek = async () => {
      const qCek = query(qrRef, where("kartNo", "==", kartNo));
      const qSnaps = await getDocs(qCek);
      if (!qSnaps.empty) {
        const qrDoc = qSnaps.docs[0].data();
        const kod = qrDoc.kod;
        setKod(kod);
        setOlusturuldu(true);
      } else {
        setOlusturuldu(false);
      }
    };

    qrCek();
  }, [kartNo]);

  const handleQr = async () => {
    try {
      const kod = generateRandomCode(7);
      const sifreliKod = kartSifrele(kod, anahtar);
      setKod(sifreliKod);
      await addDoc(collection(firestore, "qrKod"), {
        olusturanId: no,
        kartNo,
        kod: sifreliKod,
      });
      setOlusturuldu(true);
    } catch (error) {
      alert("QR Kod oluşturulamadı");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <img src={logo} className="w-80" />
      <div className="bg-indigo-100 max-w-md w-full h-auto rounded-md mt-5">
        <div className="text-center font-semibold">
          {olusturuldu ? (
            <>
              <p className="font-extrabold text-xl mb-5">
                Bu QR kodu validatöre okutunuz.
              </p>
              <QRCode value={kod} className="mx-auto mt-3 mb-3" />
            </>
          ) : (
            <div className="m-4">
              <button
                onClick={handleQr}
                className="p-4 bg-gray-800 text-white rounded-md w-80 border hover:bg-indigo-200"
              >
                Qr kod oluştur
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
