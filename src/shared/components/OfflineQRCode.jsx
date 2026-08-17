import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export const OfflineQRCode = ({ value, size = 180, className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#06121E',
          light: '#FFFFFF'
        }
      }, (err) => {
        if (err) console.error("Error generating offline QR code:", err);
      });
    }
  }, [value, size]);

  return (
    <div className={`inline-block bg-white p-2 rounded-xl border-2 border-sky-400 shadow-md ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
};
