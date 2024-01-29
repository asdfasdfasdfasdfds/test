import CryptoJS from "crypto-js";

const key = "mebBATTALGAZIEML";
const ykey = "mebBATTALGAZIEMLYEMEKHANE";

export const veriSifrele = (data) => {
  const encryptedData = CryptoJS.Blowfish.encrypt(
    JSON.stringify(data),
    key
  ).toString();
  return encryptedData;
};

export const sifreCoz = (sifreliData) => {
  const decryptedBytes = CryptoJS.Blowfish.decrypt(sifreliData, key);
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const kartSifrele = (kartNo) => {
  const sifreli = CryptoJS.Blowfish.encrypt(kartNo, ykey).toString();
  return sifreli;
};

export const kartCoz = (sifreliNo) => {
  const sifrelenmis = CryptoJS.Blowfish.decrypt(sifreliNo, ykey);
  const formatla = sifrelenmis.toString(CryptoJS.enc.Utf8);
  return formatla;
};
