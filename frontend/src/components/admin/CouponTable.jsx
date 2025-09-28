// src/components/admin/CouponTable.jsx
import React from 'react';

function CouponTable({ coupons, onRowClick }) {
  if (!coupons || coupons.length === 0) {
    return <p className="text-gray-400">No coupons to display.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coupon ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Redeemed At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Validator</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {coupons.map((coupon) => (
            <tr 
              key={coupon._id} 
              onClick={() => onRowClick(coupon)} 
              className="hover:bg-gray-700 cursor-pointer transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{coupon.coupon_id_short}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.is_redeemed ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {coupon.is_redeemed ? 'Redeemed' : 'Unused'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {coupon.redeemed_at ? new Date(coupon.redeemed_at).toLocaleString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{coupon.redeemed_by_validator || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CouponTable;