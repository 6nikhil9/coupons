// src/pages/VolunteerScanPage.jsx
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode'; // Import Html5QrcodeScanner
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import { AuthContext } from '../context/AuthContext';

function VolunteerScanPage() {
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle', 'scanning', 'success', 'fail'
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false); // Controls scanner lifecycle
  const html5QrCodeScannerRef = useRef(null); // Ref for the scanner instance
  const { user } = useContext(AuthContext);

  const qrboxConfig = {
    width: 250,
    height: 250,
  };
  const fps = 10;

  // Callback for successful QR code scan
  const onScanSuccess = useCallback(async (decodedText, decodedResult) => {
    // Stop scanning once a QR code is detected
    if (html5QrCodeScannerRef.current) {
        try {
            await html5QrCodeScannerRef.current.clear(); // Stop camera and clear scanner
        } catch (error) {
            console.warn("Failed to clear scanner:", error);
        }
    }
    setIsScanning(false); // Update state

    setScanStatus('scanning');
    setErrorMessage('');

    try {
      const qrPayload = JSON.parse(decodedText); // Expecting JSON from QR code

      const response = await api.post('/coupons/validate', {
        eventId: qrPayload.event_id,
        couponId: qrPayload.coupon_id,
        secureHash: qrPayload.secureHash,
        validatorUsername: user ? user.username : 'unknown_validator',
      });

      if (response.data.valid) {
        setScanStatus('success');
        setErrorMessage(`Coupon ${qrPayload.coupon_id} Validated Successfully!`);
      } else {
        setScanStatus('fail');
        setErrorMessage(response.data.message || 'Coupon validation failed.');
      }
    } catch (err) {
      setScanStatus('fail');
      if (err instanceof SyntaxError) {
        setErrorMessage('Invalid QR code format (expected JSON).');
      } else if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(`Validation Error: ${err.response.data.message}`);
      } else {
        setErrorMessage('Invalid QR code data or network error.');
      }
      console.error("QR Code validation error:", err);
    } finally {
        // Automatically restart scanning after a delay, regardless of success/fail
        setTimeout(() => {
            setErrorMessage('');
            setScanStatus('idle');
            // Check if user is still on this page and wants to continue scanning
            if (!isScanning) { // Ensure scanner is not already running
                 startScanner(); // Restart if not already scanning
            }
        }, 3000); // Clear message and restart after 3 seconds
    }
  }, [user, isScanning]);


  // Callback for QR code scan error
  const onScanError = useCallback((errorMessage) => {
    // html5-qrcode calls this continuously if no QR is found.
    // Only log significant errors, not just 'no QR found'.
    // console.warn("QR Scan Error:", errorMessage);
  }, []);

  const startScanner = useCallback(() => {
    if (isScanning) {
        console.log("Scanner already running, skipping start.");
        return;
    }
    
    // Clear any previous scanner instance
    if (html5QrCodeScannerRef.current) {
        html5QrCodeScannerRef.current.clear().catch(e => console.warn("Failed to clear previous scanner on start:", e));
        html5QrCodeScannerRef.current = null;
    }

    // Initialize the scanner
    html5QrCodeScannerRef.current = new Html5QrcodeScanner(
      "reader", // Element ID where the scanner will be rendered
      { fps: fps, qrbox: qrboxConfig, disableFlip: false }, // disableFlip false is good for mobile
      /* verbose= */ false
    );
    
    html5QrCodeScannerRef.current.render(onScanSuccess, onScanError);
    setIsScanning(true);
    setScanStatus('idle');
    setErrorMessage('Camera ready. Point at a QR code.');
  }, [onScanSuccess, onScanError, isScanning]);

  const stopScanner = useCallback(async () => {
    if (html5QrCodeScannerRef.current && isScanning) {
      try {
        await html5QrCodeScannerRef.current.clear();
        console.log("Scanner stopped.");
      } catch (e) {
        console.warn("Failed to stop scanner:", e);
      } finally {
        setIsScanning(false);
        setScanStatus('idle');
      }
    }
  }, [isScanning]);

  // Effect to manage scanner lifecycle
  useEffect(() => {
    startScanner(); // Start scanner when component mounts

    return () => {
      stopScanner(); // Stop scanner when component unmounts
    };
  }, [startScanner, stopScanner]); // Only run on mount and unmount

  const getStatusMessage = () => {
    switch (scanStatus) {
      case 'idle':
        return isScanning ? 'Camera ready. Point at a QR code.' : 'Scanner stopped.';
      case 'scanning':
        return 'Processing scan...';
      case 'success':
        return <span className="text-green-400 font-bold">{errorMessage}</span>;
      case 'fail':
        return <span className="text-red-400 font-bold">{errorMessage}</span>;
      default:
        return '';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 to-purple-950 flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-extrabold text-white mb-8">Coupon Validation Station</h1>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg text-center relative overflow-hidden">
          <div className="mb-6">
            <div id="reader" className="w-full bg-gray-700 rounded-md overflow-hidden">
              {/* The QR code scanner will be rendered here */}
            </div>
            {!isScanning && (
                <p className="text-gray-400 mt-4">Scanner is not active. Click "Start Scan" to begin.</p>
            )}
          </div>
          
          <p className={`text-lg mb-4 ${scanStatus === 'success' ? 'text-green-400' : scanStatus === 'fail' ? 'text-red-400' : 'text-gray-300'}`}>
            {getStatusMessage()}
          </p>

          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={isScanning ? stopScanner : startScanner}
              className={`px-6 py-3 rounded-md font-bold transition-colors duration-300 ${isScanning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
            >
              <i className={`fas ${isScanning ? 'fa-stop-circle' : 'fa-play-circle'} mr-2`}></i>
              {isScanning ? 'Stop Scan' : 'Start Scan'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">Note: If camera doesn't start, check browser permissions.</p>
        </div>
      </div>
    </>
  );
}

export default VolunteerScanPage;