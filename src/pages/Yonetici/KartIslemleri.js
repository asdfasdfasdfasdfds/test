import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { kartNoOlustur } from "../../utils/KartNoOlustur";
import { kartSifrele } from "../../services/sifreIslem";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import logo from "../../img/battalkart.jpg";
import ogrenciKart from "../../img/bosOgrenci.png";
import ogretmenKart from "../../img/bosOgretmen.png";
import gorevliKart from "../../img/bosGorevli.png";
import yetkiliKart from "../../img/bosYetkili.png";
import bosKartArka from "../../img/bosKartArka.png";
import QRCode from "qrcode";

function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [kartSifre, setKartSifre] = useState("");
  const [kartNo, setKartNo] = useState("");
  const [seriNo, setSeriNo] = useState("");
  const [isim, setIsım] = useState("");
  const [bolum, setBolum] = useState("");
  const [ogrenciNo, setOgrenciNo] = useState("");
  const [basarili, setBasarili] = useState(false);
  const [silinecekKartNo, setSilinecekKartNo] = useState("");
  const [basarisiz, setBasarisiz] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Öğrenci");
  const ref = collection(firestore, "kartlar");
  const anahtar = process.env.REACT_APP_ANAHTAR;

  useEffect(() => {
    const kartNo = kartNoOlustur(6);
    const seriNo = kartNoOlustur(9);
    setKartNo(kartNo);
    setSeriNo(seriNo);
  }, [showAddModal]);

  const handleChange = (e) => {
    const change = e.target.value.toUpperCase();
    setIsım(change);
  };
  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = (kapat) => {
    kapat.preventDefault();
    setShowAddModal(false);
    setShowDeleteModal(false);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSnackbarClose = () => {
    setBasarili(false);
    setBasarili(false);
  };

  const kartOlustur = async (e) => {
    e.preventDefault();
    try {
      const docData = {
        ad: isim,
        kartNo: kartNo,
        sifre: kartSifre,
        aktifBakiye: 0,
        yetki: selectedRole,
        no: ogrenciNo,
        seriNo: "BMTAL" + seriNo,
      };

      await addDoc(ref, docData);

      generateCard(isim, kartNo, bolum, ogrenciNo);

      setBasarili(true);
      inputSifirla();
    } catch (error) {
      setBasarisiz(true);
    }
  };

  const inputSifirla = () => {
    setIsım("");
    setBolum("");
    setOgrenciNo("");
    setKartSifre("");
    setKartNo("");
    setSeriNo("");
    setSelectedRole("");
  };

  const generateCard = (isim, kartNo, bolum, ogrenciNo) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const ogrenciImg = new Image();
    const ogretmenImg = new Image();
    const gorevliImg = new Image();
    const yetkiliImg = new Image();
    const img2 = new Image();

    ogrenciImg.src = ogrenciKart;
    ogretmenImg.src = ogretmenKart;
    gorevliImg.src = gorevliKart;
    yetkiliImg.src = yetkiliKart;
    img2.src = bosKartArka;

    if (selectedRole == "Öğrenci") {
      ogrenciImg.onload = () => {
        canvas.width = ogrenciImg.width;
        canvas.height = ogrenciImg.height;
        ctx.drawImage(ogrenciImg, 0, 0);

        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`${isim}`, 310, 295);
        ctx.fillText(`${ogrenciNo}`, 310, 335);
        ctx.fillText(`${bolum}`, 310, 378);
        const downloadLink = document.createElement("a");
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.download = isim + "ON.png";
        downloadLink.click();
        kartArkaOlustur(isim, kartNo, seriNo);
      };
    } else if (selectedRole == "Ogretmen") {
      ogretmenImg.onload = () => {
        canvas.width = ogretmenImg.width;
        canvas.height = ogretmenImg.height;
        ctx.drawImage(ogretmenImg, 0, 0);

        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`${isim}`, 310, 323);
        ctx.fillText(`${ogrenciNo}`, 310, 366);
        const downloadLink = document.createElement("a");
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.download = isim + "ON.png";
        downloadLink.click();
        kartArkaOlustur(isim, kartNo, seriNo);
      };
    } else if (selectedRole == "Gorevli") {
      gorevliImg.onload = () => {
        canvas.width = gorevliImg.width;
        canvas.height = gorevliImg.height;
        ctx.drawImage(gorevliImg, 0, 0);

        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`${isim}`, 310, 323);
        ctx.fillText(`${ogrenciNo}`, 310, 366);
        const downloadLink = document.createElement("a");
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.download = isim + "ON.png";
        downloadLink.click();
        kartArkaOlustur(isim, kartNo, seriNo);
      };
    } else {
      yetkiliImg.onload = () => {
        canvas.width = yetkiliImg.width;
        canvas.height = yetkiliImg.height;
        ctx.drawImage(yetkiliImg, 0, 0);

        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`${isim}`, 310, 323);
        ctx.fillText(`${ogrenciNo}`, 310, 366);
        const downloadLink = document.createElement("a");
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.download = isim + "ON.png";
        downloadLink.click();
        kartArkaOlustur(isim, kartNo, seriNo);
      };
    }
  };

  const kartArkaOlustur = async (gelenIsim, gelenNo, gelenSNo) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const kartArka = new Image();
    kartArka.src = bosKartArka;

    kartArka.onload = async () => {
      canvas.width = kartArka.width;
      canvas.height = kartArka.height;
      ctx.drawImage(kartArka, 0, 0);

      const qrGetir = await QRKodOlustur(gelenNo);

      if (qrGetir) {
        const gelenImage = new Image();
        gelenImage.src = qrGetir;

        gelenImage.onload = () => {
          ctx.drawImage(gelenImage, 460, 60, 450, 450);
          ctx.font = "bold 18px Arial";
          ctx.fillStyle = "black";
          ctx.fillText(`BMTAL${gelenSNo}`, 800, 568);

          const indirL = document.createElement("a");
          indirL.href = canvas.toDataURL("image/png");
          indirL.download = gelenIsim + "arka.png";
          indirL.click();
        };
      } else {
      }
    };
  };

  const QRKodOlustur = async (gelenKart) => {
    const qrData = `${gelenKart}`;
    const sifreliData = kartSifrele(qrData, anahtar);

    try {
      const qrCodeUrl = await QRCode.toDataURL(sifreliData, {
        type: "image/png",
      });
      return qrCodeUrl;
    } catch (error) {
      alert("Sistem de bir sorun var. QR kod oluşturulamıyor.");
      return null;
    }
  };

  const kartSil = async (e) => {
    e.preventDefault();
    try {
      const q = query(ref, where("kartNo", "==", silinecekKartNo));
      const kartVeri = await getDocs(q);

      if (!kartVeri.empty) {
        const kartId = kartVeri.docs[0].id;

        await deleteDoc(doc(ref, kartId));

        setBasarili(true);
      } else {
        alert("KART NO BULUNAMADI.");
      }
    } catch (error) {
      setBasarisiz(true);
    }
  };

  const handleBolumChange = (event) => {
    setBolum(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <img src={logo} className="w-96 mb-2 rounded-full mt-10" />
      <h1 className="text-4xl text-gray-800 font-extrabold mb-6">
        KART İŞLEMLERİ
      </h1>
      <div className="flex flex-col">
        <button
          onClick={openAddModal}
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          KART EKLE
        </button>
        <button
          onClick={openDeleteModal}
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          KART SİL
        </button>
        <Link
          to="/kart/liste"
          className="w-72 text-center font-extrabold mb-6 bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          KART LİSTESİ
        </Link>
        <Link
          to="/panel"
          className="w-72 text-center font-extrabold bg-gray-800 text-white py-3 rounded-xl mt-2 hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          PANELE DÖN
        </Link>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-md w-80 lg:w-5/12">
            <h2 className="text-center text-3xl font-extrabold mb-6 text-gray-800">
              Kart Oluştur
            </h2>
            <form>
              <p className="text-gray-800 text-xl font-extrabold">
                Kart NO: {kartNo}
              </p>
              <p className="mb-5 text-gray-800 text-xl font-extrabold">
                Seri NO: BMTAL{seriNo}
              </p>
              <div className="mb-3">
                <label
                  htmlFor="isim"
                  className="block text-sm font-extrabold text-gray-800 mb-1"
                >
                  AD SOYAD
                </label>
                <input
                  type="text"
                  id="isim"
                  value={isim}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                  placeholder="ADI SOYADI"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="countries"
                  className="block text-sm font-extrabold text-gray-800 mb-1"
                >
                  BÖLÜM
                </label>
                <select
                  id="countries"
                  className="w-full px-4 py-4 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                  value={bolum}
                  onChange={handleBolumChange}
                >
                  <option value="ÖĞRENCİ BÖLÜMÜ">ÖĞRENCİ BÖLÜMÜ</option>
                  <option value="BİLİŞİM TEK.">BİLİŞİM TEK.</option>
                  <option value="ELEKTRİK">ELEKTRİK</option>
                  <option value="İNŞAAT">İNŞAAT</option>
                  <option value="METAL">METAL</option>
                  <option value="MOBİLYA">MOBİLYA</option>
                  <option value="TESİSAT">TESİSAT</option>
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="ogrNo"
                  className="block text-sm font-extrabold text-gray-800 mb-1"
                >
                  TEL || Ogrenci Numarası
                </label>
                <input
                  type="text"
                  id="ogrNo"
                  value={ogrenciNo}
                  onChange={(e) => {
                    setOgrenciNo(e.currentTarget.value);
                  }}
                  className="w-full px-4 py-4 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                  placeholder="TEL || ÖĞRENCİ NO"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="sifre"
                  className="block text-sm font-extrabold text-gray-800 mb-1"
                >
                  ŞİFRE
                </label>
                <input
                  type="text"
                  id="sifre"
                  value={kartSifre}
                  onChange={(e) => {
                    setKartSifre(e.currentTarget.value);
                  }}
                  className="w-full px-4 py-4 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                  placeholder="KART ŞİFRESİ"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="yetki"
                  className="block text-sm font-extrabold text-gray-800 mb-1"
                >
                  YETKİ
                </label>
                <select
                  id="yetki"
                  className="w-full px-4 py-2 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                  onChange={handleRoleChange}
                  value={selectedRole}
                >
                  <option value="Öğrenci">ÖĞRENCİ</option>
                  <option value="Ogretmen">ÖĞRETMEN</option>
                  <option value="Yetkili">YETKİLİ</option>
                  <option value="Gorevli">GÖREVLİ</option>
                </select>
              </div>
              <button
                type="submit"
                onClick={kartOlustur}
                className="w-full ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-none rounded-t-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Oluştur
              </button>
              <button
                onClick={closeAddModal}
                className="w-full ring-2 text-center font-extrabold bg-gray-800 text-white py-3 rounded-none rounded-b-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Kapat
              </button>
            </form>
          </div>
        </div>
      )}

      {basarili && (
        <div className="fixed bottom-[580px] right-5 bg-green-500 text-white py-4 px-6 rounded-md">
          İşlem Başarılı.
          <button
            onClick={handleSnackbarClose}
            className="ml-2 text-sm font-semibold focus:outline-none"
          >
            Kapat
          </button>
        </div>
      )}

      {basarisiz && (
        <div className="fixed bottom-[580px] right-5 bg-red-500 text-white py-4 px-6 rounded-md">
          İşlem Başarısız
          <button
            onClick={handleSnackbarClose}
            className="ml-2 text-sm font-semibold focus:outline-none"
          >
            Kapat
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white border border-gray-300 p-8 rounded-lg shadow-md w-80 lg:w-5/12">
            <h2 className="text-center text-3xl font-extrabold mb-6 text-gray-800">
              Kart Sil
            </h2>
            <form>
              <div className="mb-3">
                <label
                  htmlFor="silinecekKartNo"
                  className="block text-sm font-extrabold text-gray-800 mb-1"
                >
                  Silinecek Kart No
                </label>
                <input
                  type="text"
                  id="silinecekKartNo"
                  value={silinecekKartNo}
                  onChange={(e) => {
                    setSilinecekKartNo(e.currentTarget.value);
                  }}
                  className="w-full px-4 py-4 bg-gray-100 rounded-md focus:ring focus:ring-blue-200"
                  placeholder="Kart NO"
                />
              </div>
              <button
                type="submit"
                onClick={kartSil}
                className="w-full ring-2 bg-gray-800 font-extrabold text-white py-3 rounded-none rounded-t-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Sil
              </button>
              <button
                onClick={closeAddModal}
                className="w-full ring-2 text-center font-extrabold bg-gray-800 text-white py-3 rounded-none rounded-b-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Kapat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
