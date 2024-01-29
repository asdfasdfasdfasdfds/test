import { Navigate, Outlet } from "react-router-dom";
import { getCookieValue } from "../services/cookieIslemler";
import { sifreCoz } from "../services/sifreIslem";

const MainLayout = () => {
  const token = getCookieValue("token");

  if (token) {
    const cozulen = sifreCoz(token, process.env.REACT_APP_ANAHTAR);
    if (cozulen.no) {
      return <Outlet />;
    }
  }

  return <Navigate to="/" replace />;
};
export default MainLayout;
