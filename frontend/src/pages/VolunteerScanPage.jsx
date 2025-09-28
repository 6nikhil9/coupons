// src/pages/VolunteerScanPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../hooks/useAuth';

function VolunteerScanPage() {
  const [scanResult, setScanResult] = useState(null);
  const [validationMessage, setValidationMessage] = useState('Initializing scanner...');
  const [validationStatus, setValidationStatus] = useState('idle'); // idle, scanning, success, error
  const scannerRef = useRef(null);
  const { user } = useAuth();

  const handleScanSuccess = useCallback(async (decodedText) => {
    // Prevent multiple scans of the same code
    if (validationStatus !== 'idle') return;

    setValidationStatus('scanning');
    setValidationMessage('Validating coupon...');

    try {
      const qrPayload = JSON.parse(decodedText);
      const response = await api.post('/coupons/validate', {
        eventId: qrPayload.event_id,
        couponId: qrPayload.coupon_id,
        secureHash: qrPayload.secureHash,
      });

      setValidationStatus('success');
      setScanResult(response.data.coupon);
      setValidationMessage(response.data.message);

    } catch (err) {
      setValidationStatus('error');
      if (err.response) {
        setValidationMessage(err.response.data.message);
      } else if (err instanceof SyntaxError) {
        setValidationMessage("Invalid QR Code: Data is not in the correct format.");
      } else {
        setValidationMessage("An unknown error occurred.");
      }
      console.error("Validation Error:", err);
    }

    // Reset after a delay to allow for the next scan
    setTimeout(() => {
        setValidationStatus('idle');
        setValidationMessage('Ready for next scan...');
        setScanResult(null);
    }, 3500);

  }, [validationStatus]);

  const handleScanError = (error) => {
    // This is called frequently, so we only log it for debugging
    // console.error("QR Scanner Error:", error);
  };

  useEffect(() => {
    // Initialize the scanner
    const scanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      /* verbose= */ false
    );

    scanner.render(handleScanSuccess, handleScanError);
    scannerRef.current = scanner;
    setValidationMessage('Ready to scan. Point camera at a QR code.');


    // Cleanup function to stop the scanner when the component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner on unmount.", error);
        });
      }
    };
  }, [handleScanSuccess]); // Rerun effect if the success handler changes

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center p-6 min-h-[calc(100vh-64px)] bg-gray-900">
        <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-2xl p-8 border border-purple-800">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Volunteer Scanning Station</h1>
          <p className="text-gray-400 mb-6 text-center">Logged in as: {user?.username}</p>

          <div id="reader" className="w-full rounded-lg overflow-hidden" />

          <div className="mt-6 text-center p-4 rounded-lg h-24 flex items-center justify-center"
               style={{
                 backgroundColor: validationStatus === 'success' ? '#10B981' : validationStatus === 'error' ? '#EF4444' : '#374151'
               }}>
            <div>
                <p className="text-lg font-semibold text-white">{validationMessage}</p>
                {scanResult && (
                    <p className="text-sm text-gray-200">Event: {scanResult.event_name}</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VolunteerScanPage;