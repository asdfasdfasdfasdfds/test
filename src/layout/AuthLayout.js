import { Navigate, Outlet } from "react-router-dom";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";
import gif from "../img/kurumsal.gif";
import { useEffect, useState } from "react";

const AuthLayout = () => {
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
      return <Navigate to="/anasayfa" replace />;
    }
  }

  return <Outlet />;
};
export default AuthLayout;
