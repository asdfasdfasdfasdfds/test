import { Navigate, Outlet } from "react-router-dom";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";
import { useEffect, useState } from "react";
import gif from "../img/cumhuriyet.gif";

const MainLayout = () => {
  const token = getCookieValue("token");

  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setYukleniyor(false);
    }, 1500);
  }, []);

  if (yukleniyor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <img src={gif} />;
      </div>
    );
  }

  if (token) {
    const cozulen = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
    if (cozulen.no) {
      return <Outlet />;
    }
  }

  return <Navigate to="/" replace />;
};
export default MainLayout;
