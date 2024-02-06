import { Navigate, Outlet } from "react-router-dom";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";
import { useEffect, useState } from "react";
import gif from "../img/kurumsal.gif";

const MainLayout = () => {
  const token = getCookieValue("token");

  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setYukleniyor(false);
    }, 1600);
  }, []);

  if (yukleniyor) {
    return (
      <div className="flex justify-center mt-40">
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
