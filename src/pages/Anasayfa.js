import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";
import { Link } from "react-router-dom";
import logo from "../img/battalkart.jpg";
import ogrenci from "../img/ogrenci.jpg";
import ogretmen from "../img/ogretmen.jpg";
import { getCookieValue, deleteCookie } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";
import DuyuruModal from "../components/DuyuruModal";

const ref = collection(firestore, "kartlar");

const Dashboard = () => {
  const [isim, setIsim] = useState("");
  const [no, setNo] = useState("");
  const [kart, setKart] = useState("");
  const [kartVeri, setKartVeri] = useState({});
  const [kartBulunamadi, setKartBulunamadi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [yetki, setYetki] = useState("");
  const token = getCookieValue("token");

  const cikisYap = () => {
    deleteCookie("token");
    window.location.reload();
  };
  useEffect(() => {
    getKartNo();
  }, [no]);

  useEffect(() => {
    const sifre = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
    setIsim(sifre.ad);
    setNo(sifre.no);
  }, []);

  useEffect(() => {
    const yetkiGetir = async () => {
      try {
        const q = query(ref, where("kartNo", "==", kart));
        const yetki = await getDocs(q);

        if (!yetki.empty) {
          const yetkiData = yetki.docs[0].data();
          const yetkiCek = yetkiData.yetki;
          setYetki(yetkiCek);
        }
      } catch (error) {
        console.log("hata");
      }
    };

    yetkiGetir();
  }, [kart]);

  const getKartNo = async () => {
    try {
      const q = query(ref, where("no", "==", no));
      const kart = await getDocs(q);
      if (!kart.empty) {
        const kartData = kart.docs[0].data();
        const kartNo = kartData.kartNo;

        setKart(kartNo);

        const kartlarQuery = query(ref, where("kartNo", "==", kartNo));
        const kartlar = await getDocs(kartlarQuery);
        if (!kartlar.empty) {
          const kartVeri = kartlar.docs[0].data();
          setKartVeri(kartVeri);
        } else {
          setKartBulunamadi(true);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const kartGetir = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center mt-20">
          <div
            className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      );
    } else if (!kart) {
      return (
        <>
          <p className="text-center mt-10 text-2xl font-extrabold text-gray-800">
            Lütfen kartınızı ekleyin.
          </p>
          <Link
            className="bg-gray-800 text-center hover:bg-gray-700 text-white font-bold py-4 px-24 rounded-2xl mt-4"
            to="/kart/ekle"
            onClick={() => {}}
          >
            Kart Ekle
          </Link>
        </>
      );
    } else {
      return (
        <>
          {kartBulunamadi ? (
            <>
              <p className="text-center mt-10 text-2xl font-extrabold text-gray-800">
                Kart bulunamadı.
              </p>
              <Link
                className="bg-gray-800 text-center hover:bg-gray-700 text-white font-bold py-4 px-24 rounded-2xl mt-4"
                to="/kart/guncelle"
                onClick={() => {}}
              >
                Kartı Güncelle
              </Link>
            </>
          ) : (
            <div className="flex justify-center" veri={kartVeri}>
              <div className="bg-[#77cadc] border shadow-xl border-black w-80 h-62 lg:w-96 lg:h-56 mt-2 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  {yetki == "Öğrenci" ? (
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
                      {kartVeri.kartNo}
                    </p>
                  </div>
                  <div className="mt-4 ml-6 md:mr-2">
                    <Link
                      to="/islemler"
                      className="p-3 px-12 bg-gray-800 font-extrabold text-white hover:bg-white shadow-2xl hover:text-black rounded-lg"
                    >
                      İşlemler
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <div>
                    <p className="text-gray-800 font-extrabold text-sm">
                      Bakiyeniz
                    </p>
                    <p className="text-white text-2xl font-extrabold">
                      {kartVeri.aktifBakiye} TL
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-800 font-extrabold text-sm">İsim</p>
                    <p className="text-white text-2xl font-extrabold">
                      {kartVeri.ad}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div>
      <img src={logo} className="mx-auto w-64 lg:w-96 md:mt-10 mt-0" />
      <div className="flex flex-col h-max p-4 rounded-md">
        <p className="text-center mb-4 text-2xl mt-1 font-extrabold text-gray-800">
          {isim}
        </p>
        <div className="flex flex-col lg:flex-row gap-2 justify-center">
          <Link
            className="bg-gray-800 text-center hover:bg-gray-700 text-white font-bold py-3 px-12 rounded-2xl"
            to="/kart/guncelle"
          >
            Kart Güncelle
          </Link>
          {yetki == "Yetkili" && (
            <Link
              className="bg-gray-800 text-center hover:bg-gray-700 text-white font-bold py-3 px-12 rounded-2xl"
              to="/panel"
            >
              Panel
            </Link>
          )}
          {yetki == "Gorevli" && (
            <Link
              className="bg-gray-800 text-center hover:bg-gray-700 text-white font-bold py-3 px-12 rounded-2xl"
              to="/ypanel"
            >
              Yemekhane Panel
            </Link>
          )}
          <Link
            className="bg-gray-800 text-center hover:bg-gray-700 text-white font-bold py-3 px-12 rounded-2xl"
            to="/qr/odeme"
          >
            QR Kodum
          </Link>
          <Link
            className="bg-gray-800 text-center hover:bg-gray-700 text-white font-bold py-3 px-12 rounded-2xl"
            to="/transfer"
          >
            Transfer İşlemleri
          </Link>
          <button
            className="bg-red-500 text-center hover:bg-gray-700 text-white font-bold py-3 px-12 rounded-2xl"
            onClick={cikisYap}
          >
            Çıkış Yap
          </button>
        </div>
        <div className="flex items-center justify-center mt-2"></div>
        <div className="flex flex-col items-center justify-center mt-2">
          {kartGetir()}
          <p className="p-2 bg-red-100 rounded text-center mt-2 w-80 md:w-96 shadow-2xl">
            <strong className="font-bold">
              Kart Numaranızı <br />
            </strong>
            <span className="block sm:inline">kimseyle paylaşmayınız.</span>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
