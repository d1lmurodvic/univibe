import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = ({ onScanSuccess, validateQr }) => {
  const [error, setError] = useState(null);
  const [cameraId, setCameraId] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [parsedResult, setParsedResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qr_scan_history")) || [];
    } catch {
      return [];
    }
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const html5QrCodeRef = useRef(null);

  const config = {
    fps: 10,
    qrbox: (viewfinderWidth, viewfinderHeight) => {
      const min = Math.min(viewfinderWidth, viewfinderHeight);
      return { width: min * 0.8, height: min * 0.8 };
    },
    aspectRatio: 1.0,
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCodeRef.current = html5QrCode;

    const requestCameraPermission = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          setCameras(devices);
          const rearCamera =
            devices.find(
              (cam) =>
                cam.label?.toLowerCase().includes("back") ||
                cam.label?.toLowerCase().includes("rear")
            ) || devices[0];

          setCameraId(rearCamera.id);
          startScanning(rearCamera.id);
        } else {
          setError(
            "📷 Kamera topilmadi. Qurilmada kamera mavjudligini tekshiring."
          );
        }
      } catch (err) {
        setError(
          "❌ Kameraga ruxsat yo‘q. Iltimos HTTPS yoki localhost dan foydalaning."
        );
        console.error("Camera error:", err);
      }
    };

    requestCameraPermission();
    return () => {
      stopScanning();
    };
  }, []);

  const parseResult = (text) => {
    try {
      if (text.startsWith("http")) {
        return { type: "url", value: text };
      }
      return { type: "json", value: JSON.parse(text) };
    } catch {
      return { type: "text", value: text };
    }
  };

  const startScanning = (selectedCameraId) => {
    if (!html5QrCodeRef.current || isScanning || isTransitioning) return;

    setIsTransitioning(true);
    html5QrCodeRef.current
      .start(
        { deviceId: { exact: selectedCameraId } },
        config,
        (decodedText) => {
          setScanResult(decodedText);
          const parsed = parseResult(decodedText);
          setParsedResult(parsed);

          // saqlash
          const newHistory = [
            { text: decodedText, time: new Date().toLocaleString() },
            ...history,
          ].slice(0, 10);
          setHistory(newHistory);
          localStorage.setItem("qr_scan_history", JSON.stringify(newHistory));

          if (validateQr && typeof validateQr === "function") {
            const isValid = validateQr(decodedText);
            if (isValid) {
              onScanSuccess(decodedText);
            } else {
              setError("❌ Noto‘g‘ri QR kod.");
            }
          } else {
            onScanSuccess(decodedText);
          }
        },
        (err) => {
          console.warn("Scan error:", err);
        }
      )
      .then(() => {
        setIsScanning(true);
        setIsTransitioning(false);
      })
      .catch((err) => {
        setError("❌ Skanerni ishga tushirishda xatolik: " + err.message);
        setIsTransitioning(false);
      });
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current && isScanning) {
      setIsTransitioning(true);
      html5QrCodeRef.current
        .stop()
        .then(() => html5QrCodeRef.current.clear())
        .then(() => {
          setIsScanning(false);
          setIsTransitioning(false);
        })
        .catch((err) => {
          console.error("Stop error:", err);
          setIsTransitioning(false);
        });
    }
  };

  const switchCamera = (newCameraId) => {
    if (!html5QrCodeRef.current) return;
    stopScanning();
    setCameraId(newCameraId);
    startScanning(newCameraId);
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-white rounded-2xl shadow-xl space-y-4">
      <h2 className="text-xl font-bold text-center">📷 QR Kod Skanner</h2>

      <div
        id="qr-reader"
        className="w-full aspect-square rounded-xl overflow-hidden border border-gray-200"
      />

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {scanResult && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-700">✅ Skan natijasi:</h3>
          {parsedResult?.type === "url" && (
            <a
              href={parsedResult.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-words"
            >
              {parsedResult.value}
            </a>
          )}
          {parsedResult?.type === "json" && (
            <pre className="text-sm bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
              {JSON.stringify(parsedResult.value, null, 2)}
            </pre>
          )}
          {parsedResult?.type === "text" && (
            <p className="text-gray-800 break-words">{parsedResult.value}</p>
          )}
        </div>
      )}

      {cameras.length > 1 && (
        <select
          className="mt-2 p-2 border rounded w-full text-sm"
          value={cameraId}
          onChange={(e) => switchCamera(e.target.value)}
          disabled={isTransitioning}
        >
          {cameras.map((cam) => (
            <option key={cam.id} value={cam.id}>
              {cam.label || `Kamera ${cam.id}`}
            </option>
          ))}
        </select>
      )}

      <div className="flex gap-2">
        {!isScanning ? (
          <button
            onClick={() => startScanning(cameraId)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
            disabled={!cameraId || isTransitioning}
          >
            ▶️ Start
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium"
            disabled={isTransitioning}
          >
            ⏹ Stop
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">🕘 Tarix:</h3>
          <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
            {history.map((item, idx) => (
              <li key={idx} className="border-b pb-1">
                <span className="block font-mono text-gray-700 truncate">
                  {item.text}
                </span>
                <span className="text-xs text-gray-400">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
