import { BrowserRouter, Routes, Route } from "react-router-dom";
import Giris from "./pages/Giris";
import Anasayfa from "./pages/Anasayfa";
import Main from "./layout/MainLayout";
import PanelLayout from "./layout/PanelLayout";
import Auth from "./layout/AuthLayout";
import Yemekhane from "./layout/YemekhaneLayout";
import Ekle from "./pages/KartEkle";
import KartGuncelle from "./pages/KartGuncelle";
import QrOdeme from "./pages/QrOdeme";
import Transfer from "./pages/Transferİslem";
import TransferEt from "./pages/TransferEt";
import TransferAl from "./pages/TransferAl";
import Bulunamadi from "./pages/Bulunamadi";
import Islemler from "./pages/Islemler";
import DashboardAnasayfa from "./pages/Yonetici/Panel";
import Kart from "./pages/Yonetici/KartIslemleri";
import Bakiye from "./pages/Yonetici/BakiyeIslemleri";
import KartDetay from "./pages/KartDetay";
import KartListe from "./pages/Yonetici/KartListe";
import Validator from "./pages/Yonetici/Validator";
import Rapor from "./pages/Yonetici/Rapor";
import YPanel from "./pages/Yemekhane/Panel";
import USBToken from "./services/USBToken";
import USBEngel from "./pages/USBEngel";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />}>
            <Route path="/" element={<Giris />} />
          </Route>
          <Route path="/" element={<Main />}>
            <Route path="/anasayfa" element={<Anasayfa />} />
            <Route path="/islemler" element={<Islemler />} />
            <Route path="/kart/guncelle" element={<KartGuncelle />} />
            <Route path="/kart/ekle" element={<Ekle />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/transfer/et" element={<TransferEt />} />
            <Route path="/transfer/al" element={<TransferAl />} />
            <Route path="/qr/odeme" element={<QrOdeme />} />
            <Route path="/engel" element={<USBEngel />} />
            <Route path="/" element={<PanelLayout />}>
              <Route path="/panel" element={<DashboardAnasayfa />} />
              <Route path="/kart/islemleri" element={<Kart />} />
              <Route path="/kart/liste" element={<KartListe />} />
              <Route path="/bakiye/islemleri" element={<Bakiye />} />
              <Route path="/validator" element={<Validator />} />
              <Route path="/rapor" element={<Rapor />} />
            </Route>
            <Route path="/" element={<Yemekhane />}>
              <Route path="/ypanel" element={<YPanel />} />
              <Route path="/yvalidator" element={<Validator />} />
            </Route>
          </Route>
          <Route path="/kart/:no" element={<KartDetay />} />
          <Route path="/token/:token" element={<USBToken />} />
          <Route path="*" element={<Bulunamadi />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
