import React, { useEffect, useState } from "react";

const DuyuruModal = ({ baslik, metin, tarih, Goster }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const isModalShownPreviously = localStorage.getItem("duyuruGosterildi");
    if (isModalShownPreviously) {
      const lastShownDate = new Date(isModalShownPreviously);
      const currentDate = new Date();
      const differenceInDays =
        (currentDate - lastShownDate) / (1000 * 60 * 60 * 24);
      if (differenceInDays < 1) {
        setIsOpen(false);
      }
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("duyuruGosterildi", new Date().toISOString());
  };
  return (
    <div>
      {isOpen && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-60 py-10">
          <div className="max-h-full w-96 md:w-full rounded-2xl  max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
            <div className="w-full">
              <div className="m-4 my-5 text-center max-w-[320px] mx-auto">
                <div className="mb-2">
                  <p className="text-base p-1 bg-green-300 rounded font-bold mb-2">
                    DUYURU
                  </p>
                  <h1 className="mb-2 text-xl md:text-2xl font-extrabold">
                    {baslik}
                  </h1>
                  <p className="text-gray-800 font-semibold md:text-xl text-base mb-4">
                    {metin}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="p-1 bg-black rounded-full text-white w-full font-semibold">
                    {tarih}
                  </p>
                  <button
                    onClick={handleClose}
                    className="p-3 bg-white text-black border-2 rounded-full w-full font-semibold"
                  >
                    KAPAT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuyuruModal;
