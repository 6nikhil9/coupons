// src/pages/VolunteerScanPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import QRScanner from '../components/volunteer/QRScanner'; // Import the new QRScanner component
import api from '../services/api';

function VolunteerScanPage() {
  const [scanResult, setScanResult] = useState(null); // Raw QR data
  const [validationStatus, setValidationStatus] = useState(null); // 'success', 'error'
  const [validationMessage, setValidationMessage] = useState('');
  const [couponDetails, setCouponDetails] = useState(null); // Details from backend
  const [isScanning, setIsScanning] = useState(true); // Control scanner state

  // Ref to directly control the QRScanner methods (pause/resume)
  // This ref pattern is common for imperative interactions with child components
  const qrScannerRef = useRef(); 

  // Callback for when QR code is successfully scanned by the child QRScanner component
  const handleScanSuccess = async (decodedText) => {
    console.log(`QR Code scanned: ${decodedText}`);
    setScanResult(decodedText);
    setValidationStatus(null); // Reset previous status
    setValidationMessage('Validating coupon...');
    setCouponDetails(null);
    setIsScanning(false); // Stop scanning temporarily

    // Manually pause the scanner using its ref if it had an imperative method
    // If QRScanner component manages its own internal pause/resume on success, this might not be needed.
    // However, it's good to have for explicit control from parent.
    if (qrScannerRef.current && typeof qrScannerRef.current.pauseScanner === 'function') {
      qrScannerRef.current.pauseScanner();
    }

    try {
      // Assuming decodedText contains { event_id, coupon_id, secureHash } JSON string
      const parsedData = JSON.parse(decodedText); 
      const { event_id, coupon_id, secureHash } = parsedData;

      const response = await api.post('/coupons/validate', {
        eventId: event_id,
        couponId: coupon_id,
        secureHash: secureHash, // Send secureHash for backend validation
      });

      if (response.data.valid) {
        setValidationStatus('success');
        setValidationMessage('Coupon Valid! Meal Served.');
        setCouponDetails(response.data.coupon); // Backend returns updated coupon details
      } else {
        setValidationStatus('error');
        setValidationMessage(response.data.message || 'Invalid or Already Redeemed Coupon.');
        setCouponDetails(null);
      }
    } catch (err) {
      console.error("Validation error:", err);
      setValidationStatus('error');
      if (err.response && err.response.data && err.response.data.message) {
        setValidationMessage(err.response.data.message);
      } else {
        setValidationMessage('Scan error or invalid QR format.');
      }
    }
  };

  // Callback for scanning errors (e.g., camera not found, but not common QR errors)
  const handleScanError = (errorMessage) => {
    // console.error(errorMessage); // Log errors but don't show to user constantly
    // You might want to display a message if the camera fails to start, for example.
    // if (!isScanning && errorMessage.includes("Camera access")) { ... }
  };

  const handleScanNext = () => {
    setScanResult(null);
    setValidationStatus(null);
    setValidationMessage('');
    setCouponDetails(null);
    setIsScanning(true); // Restart scanning
    
    // Resume the scanner
    if (qrScannerRef.current && typeof qrScannerRef.current.resumeScanner === 'function') {
      qrScannerRef.current.resumeScanner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Coupon Validation Station</h1>

      {/* Render the QRScanner component */}
      <QRScanner
        ref={qrScannerRef} // Attach ref to the scanner component
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
        qrBoxSize={250}
        fps={10}
      />

      {/* Validation Result Display */}
      <div className="mt-8 w-full max-w-sm p-6 rounded-lg shadow-xl bg-gray-800">
        {validationMessage && (
          <div
            className={`p-4 rounded-md ${
              validationStatus === 'success' ? 'bg-green-600' : validationStatus === 'error' ? 'bg-red-600' : 'bg-blue-600'
            } text-white text-lg font-semibold text-center mb-4`}
          >
            {validationMessage}
          </div>
        )}

        {couponDetails && validationStatus === 'success' && (
          <div className="text-gray-300 text-center">
            <p className="mb-2"><strong>Event:</strong> {couponDetails.event_name}</p>
            <p className="mb-2"><strong>Coupon ID:</strong> {couponDetails.coupon_id}</p>
            <p><strong>Food:</strong> {couponDetails.food_details || 'N/A'}</p>
          </div>
        )}

        {/* Scan Next Button */}
        {validationStatus && (
          <button
            onClick={handleScanNext}
            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
          >
            Scan Next Coupon
          </button>
        )}
      </div>
    </div>
  );
}

export default VolunteerScanPage;