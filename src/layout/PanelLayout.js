import { Navigate, Outlet } from "react-router-dom";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";
import { useEffect, useState } from "react";
import gif from "../img/kurumsal.gif";

const PanelLay = () => {
  const usbToken = getCookieValue("USBToken");

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

  if (usbToken) {
    return <Outlet />;
  }

  return <Navigate to="/engel" replace />;
};
export default PanelLay;
