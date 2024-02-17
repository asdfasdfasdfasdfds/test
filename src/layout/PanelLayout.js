import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import gif from "../img/cumhuriyet.gif";

const PanelLay = () => {
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setYukleniyor(false);
    }, 1600);
  }, []);

  if (yukleniyor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <img src={gif} />;
      </div>
    );
  }

  return <Outlet />;
};
export default PanelLay;
