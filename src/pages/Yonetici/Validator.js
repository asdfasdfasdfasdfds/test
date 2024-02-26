import React from "react";
import QrScanner from "react-qr-scanner";
import logo from "../../img/battalkart.jpg";
import { useState } from "react";
import { firestore } from "../../firebase";
import gec from "../../sound/gec.mp3";
import yetersiz from "../../sound/yetersiz.mp3";
import bulunamadi from "../../sound/bulunamadi.mp3";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { generateRandomCode } from "../../utils/kodOlustur";
import { kartCoz } from "../../services/sifreIslem";

function Validator() {
  const [yetki, setYetki] = useState("");
  const [kameraAcik, setKameraAcik] = useState(true);
  const [kazanc, setKazanc] = useState(0);
  const [yYkisi, setYiyenKisi] = useState(0);

  const anlikTarih = new Date();
  const gun = String(anlikTarih.getDate()).padStart(2, "0");
  const ay = String(anlikTarih.getMonth() + 1).padStart(2, "0");
  const yil = anlikTarih.getFullYear();
  const tarih = `${gun}.${ay}.${yil}`;
  const raporREf = collection(firestore, "rapor");
  const gecSes = new Audio(gec);
  const yetersizSes = new Audio(yetersiz);
  const bulunamadiSes = new Audio(bulunamadi);
  const anahtar = process.env.REACT_APP_YEMEKHANE;

  const handleQrOku = async (data) => {
    if (data) {
      const gelenKartNo = data.text;
      const cozulenKart = kartCoz(gelenKartNo, anahtar);
      paraCek(cozulenKart);
      setKameraAcik(false);
    }
  };

  console.log(kazanc);

  const paraCek = async (kartNo) => {
    try {
      const q = query(
        collection(firestore, "kartlar"),
        where("kartNo", "==", kartNo)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].id;
        const yetki = querySnapshot.docs[0].data().yetki;
        setYetki(yetki);
        const aktifBakiye = querySnapshot.docs[0].data().aktifBakiye;

        const cekilecekMiktar = yetki === "Öğrenci" ? 20 : 30;

        const islem = {
          islemTuru: `QR ile Ödeme`,
          miktar: cekilecekMiktar,
          tarih: new Date().toLocaleString("tr-TR"),
          islemKodu: generateRandomCode(10),
        };
        if (aktifBakiye >= cekilecekMiktar) {
          await updateDoc(doc(firestore, "kartlar", docRef), {
            aktifBakiye: aktifBakiye - cekilecekMiktar,
            islemler: arrayUnion(islem),
          });
          setKazanc(kazanc + cekilecekMiktar);
          setYiyenKisi(yYkisi + 1);
          gecSes.play();
        } else {
          yetersizSes.play();
        }
      } else {
        bulunamadiSes.play();
      }
    } catch (error) {
      console.error("Güncelleme Hatası:", error);
    }
    setTimeout(() => {
      setKameraAcik(true);
    }, 2000);
  };

  const handleRaporYaz = async () => {
    try {
      const raporData = {
        kazanc,
        yYkisi,
        tarih,
      };

      await addDoc(raporREf, raporData);
      alert("Rapor başarıyla yazıldı, Validatoru kapatabilirsiniz.");
    } catch (error) {
      console.error("Rapor oluşturma hatası:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <img src={logo} className="mt-5" />
      {kameraAcik ? (
        <>
          <p className="text-xl font-bold mb-5">DİJİTAL VALİDATOR</p>
          <QrScanner
            delay={300}
            onError={(error) => console.error(error)}
            onScan={handleQrOku}
            className="rounded-lg"
            constraints={{
              video: { facingMode: "environment" },
            }}
          />
          <button
            onClick={handleRaporYaz}
            className="w-80 p-4 bg-gray-400 font-bold rounded-md hover:bg-gray-200 mt-5"
          >
            RAPOR YAZ
          </button>
        </>
      ) : (
        <div className="text-center font-bold flex flex-col gap-2 items-center justify-center">
          {yetki === "Öğrenci" ? (
            <div className="w-96 flex flex-col items-center justify-center h-96 bg-gray-200 rounded-md">
              <p>ÖĞRENCİ</p>
              <p>AFİYET OLSUN</p>
            </div>
          ) : (
            <div className="w-96 flex flex-col items-center justify-center h-96 bg-gray-200 rounded-md">
              <p>ÖĞRETMEN - YETKİLİ</p>
              <p>AFİYET OLSUN</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Validator;
