// src/components/volunteer/QRScanner.jsx
import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

/**
 * QRScanner Component
 * Handles the actual QR code scanning logic using html5-qrcode.
 *
 * @param {function} onScanSuccess - Callback function when a QR code is successfully scanned.
 * @param {function} onScanError - Callback function for scanning errors (optional).
 * @param {number} qrBoxSize - Size of the QR scanning box (width and height).
 * @param {number} fps - Frames per second for the camera feed.
 */
function QRScanner({ onScanSuccess, onScanError, qrBoxSize = 250, fps = 10 }) {
  const scannerId = "qr-code-scanner"; // Unique ID for the scanner element
  const html5QrcodeScannerRef = useRef(null); // Ref to store the scanner instance

  useEffect(() => {
    // Ensure the scanner is initialized only once
    if (!html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current = new Html5QrcodeScanner(
        scannerId,
        {
          fps: fps,
          qrbox: { width: qrBoxSize, height: qrBoxSize },
          // The `disableFlip` option can be useful for debugging or specific camera setups
          // disableFlip: false, 
        },
        /* verbose= */ false
      );

      // Render the scanner
      html5QrcodeScannerRef.current.render(onScanSuccess, onScanError || (() => {})); // Provide a no-op for onScanError if not given
    }

    // Cleanup function: stop the scanner when the component unmounts
    return () => {
      if (html5QrcodeScannerRef.current) {
        try {
          html5QrcodeScannerRef.current.clear();
        } catch (e) {
          console.warn("Failed to clear html5QrcodeScanner on unmount:", e);
        }
        html5QrcodeScannerRef.current = null; // Clear the ref
      }
    };
  }, [onScanSuccess, onScanError, qrBoxSize, fps]); // Re-run if these props change

  // Method to manually pause the scanner (e.g., after a successful scan)
  const pauseScanner = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.pause();
    }
  };

  // Method to manually resume the scanner
  const resumeScanner = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.resume();
    }
  };

  // Expose these methods to the parent component using a ref or context if needed.
  // For now, we'll assume the parent handles state and re-renders to control it.
  // The onScanSuccess itself often implies a pause.

  return (
    // The element where the QR scanner's video feed and UI will be rendered
    <div id={scannerId} className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg border-2 border-purple-600">
      {/* html5-qrcode will inject its video and canvas elements here */}
    </div>
  );
}

export default QRScanner;