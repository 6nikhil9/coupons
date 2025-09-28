// src/components/admin/CouponDetailModal.jsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Import the QR Code component

function CouponDetailModal({ coupon, qrData, onClose }) {
  if (!coupon) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Coupon Details</h2>
        <p className="text-gray-300 mb-2">Coupon ID: <span className="font-mono text-purple-400">{coupon.coupon_id_short}</span></p>
        <p className="text-gray-300 mb-6">Status: {coupon.is_redeemed ? 'Redeemed' : 'Unused'}</p>

        {/* This is the magic part! */}
        <div className="bg-white p-4 inline-block rounded-lg">
          <QRCodeSVG value={qrData} size={200} />
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CouponDetailModal;