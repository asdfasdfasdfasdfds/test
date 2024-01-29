import React, { useState } from "react";
import { veriSifrele, sifreCoz } from "../services/sifreIslem";

const Test = () => {
  const [sifreli, setSifreli] = useState("");
  const ornekVeri = {
    ad: "ONUR KÜRKAYA",
    no: "1822",
  };

  const key = process.env.REACT_APP_ANAHTAR;

  const handleSifrele = () => {
    const sifrelenmis = veriSifrele(ornekVeri, key);
    setSifreli(sifrelenmis);
    console.log(sifrelenmis);
    document.cookie = `token=${sifrelenmis}; path=/`;
  };

  const handleCoz = () => {
    const cozulmus = sifreCoz(sifreli, key);
    console.log(cozulmus);
    console.log(cozulmus.ad);
    console.log(cozulmus.no);
  };

  return (
    <div>
      <button onClick={handleSifrele} className="p-4 bg-gray-200">
        Şifrele
      </button>
      <button onClick={handleCoz} className="p-4 bg-gray-200">
        Çöz
      </button>
    </div>
  );
};

export default Test;
