// src/components/admin/CouponDetailModal.jsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

function CouponDetailModal({ isOpen, onClose, coupon }) {
  if (!isOpen || !coupon) {
    return null;
  }

  // The QR code's data is a JSON string created on the frontend
  // This must match the format the backend's validation endpoint expects
  const qrDataString = JSON.stringify({
    event_id: coupon.event,
    coupon_id: coupon.coupon_id_short,
    secureHash: coupon.secureHash,
  });

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={onClose} // Close modal on backdrop click
    >
      <div 
        className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-sm w-full mx-4 relative border border-purple-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
            onClick={onClose} 
            className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold"
        >
            &times;
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Coupon QR Code</h2>
        
        <div className="bg-white p-4 inline-block rounded-lg mt-4">
          <QRCodeSVG value={qrDataString} size={256} />
        </div>

        <div className="mt-6 text-left">
            <p className="text-gray-300">
                <strong>Coupon ID:</strong> 
                <span className="font-mono text-purple-400 ml-2">{coupon.coupon_id_short}</span>
            </p>
            <p className="text-gray-300 mt-1">
                <strong>Status:</strong> 
                <span className="ml-2">{coupon.is_redeemed ? 'Redeemed' : 'Unused'}</span>
            </p>
        </div>
      </div>
    </div>
  );
}

export default CouponDetailModal;