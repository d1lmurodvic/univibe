import React from "react";
import QrScanner from "../../components/QrScanner/QrScanner";

export default function QrCode() {
  const handleScanSuccess = (text) => {
    console.log("QR o‘qildi:", text);
  };

  const validateQr = (text) => {
    // Masalan: faqat URL bo‘lsa ruxsat beramiz
    return text.startsWith("http");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <QrScanner onScanSuccess={handleScanSuccess} validateQr={validateQr} />
    </div>
  );
}
