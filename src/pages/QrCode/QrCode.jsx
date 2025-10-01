import React from "react";
import QrScanner from "../../components/QrScanner/QrScanner";

export default function QrCode() {
  const handleScanSuccess = (text) => {
    alert("QR код: " + text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Сканер QR-кодов</h1>
      <QrScanner onScanSuccess={handleScanSuccess} />
    </div>
  );
}
