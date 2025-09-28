// src/components/admin/CouponDetailModal.jsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

function CouponDetailModal({ isOpen, onClose, coupon }) {
  if (!isOpen || !coupon) return null;

  // Recreate the QR data string just like the backend does
  const qrData = JSON.stringify({
    event_id: coupon.event,
    coupon_id: coupon.coupon_id_short,
    secureHash: coupon.secureHash
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-sm w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-white mb-4">Coupon QR Code</h2>
        <p className="text-gray-300 mb-2">Event ID: <span className="font-mono text-sm">{coupon.event}</span></p>
        <p className="text-gray-300 mb-6">Coupon ID: <span className="font-mono text-purple-400">{coupon.coupon_id_short}</span></p>

        <div className="bg-white p-4 inline-block rounded-lg">
          <QRCodeSVG value={qrData} size={220} />
        </div>

        <p className="text-xs text-gray-500 mt-4">Volunteers can scan this code to validate the coupon.</p>
      </div>
    </div>
  );
}

export default CouponDetailModal;