// src/components/admin/CouponGenerationSection.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import CouponTable from './CouponTable'; // Component to display the list of coupons
// Assuming a chart library for the pie chart, e.g., 'react-chartjs-2'

function CouponGenerationSection() {
  const { eventId } = useParams();
  const [eventName, setEventName] = useState('');
  const [numToGenerate, setNumToGenerate] = useState(100);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [generationSuccess, setGenerationSuccess] = useState('');

  const [coupons, setCoupons] = useState([]);
  const [couponStats, setCouponStats] = useState({ redeemed: 0, unused: 0 });
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [couponsError, setCouponsError] = useState('');

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchCoupons();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${eventId}`);
      setEventName(response.data.name);
    } catch (err) {
      console.error("Failed to fetch event name:", err);
      setEventName("Unknown Event");
    }
  };

  const fetchCoupons = async () => {
    setCouponsLoading(true);
    setCouponsError('');
    try {
      const response = await api.get(`/events/${eventId}/coupons`); // API to get all coupons for an event
      setCoupons(response.data);
      const redeemed = response.data.filter(c => c.is_redeemed).length;
      const unused = response.data.length - redeemed;
      setCouponStats({ redeemed, unused });
    } catch (err) {
      setCouponsError('Failed to load coupons.');
      console.error(err);
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleGenerateCoupons = async () => {
    setGenerationLoading(true);
    setGenerationError('');
    setGenerationSuccess('');
    try {
      await api.post(`/events/${eventId}/generate-coupons`, { count: numToGenerate });
      setGenerationSuccess(`${numToGenerate} coupons generated successfully!`);
      fetchCoupons(); // Refresh the coupon list
    } catch (err) {
      setGenerationError('Failed to generate coupons. Please try again.');
      console.error(err);
    } finally {
      setGenerationLoading(false);
    }
  };

  const downloadAllQRs = () => {
    alert("Functionality to download QR PDFs would be implemented here, calling a backend endpoint.");
    // In a real app, this would call a backend endpoint that generates a PDF
    // e.g., window.open(api.defaults.baseURL + `/events/${eventId}/coupons/download-pdf`);
  };

  // Pie chart data for react-chartjs-2
  const chartData = {
    labels: ['Redeemed', 'Unused'],
    datasets: [
      {
        data: [couponStats.redeemed, couponStats.unused],
        backgroundColor: ['#4ade80', '#fbbf24'], // green, yellow
        hoverBackgroundColor: ['#22c55e', '#facc15'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Coupon Management for "{eventName}"</h1>

      {/* Coupon Generation Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Generate New Coupons</h2>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <input
            type="number"
            value={numToGenerate}
            onChange={(e) => setNumToGenerate(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full md:w-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white"
            min="1"
          />
          <button
            onClick={handleGenerateCoupons}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
            disabled={generationLoading}
          >
            {generationLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i> Generating...
              </>
            ) : (
              <>
                <i className="fas fa-plus mr-2"></i> Generate Coupons
              </>
            )}
          </button>
          <button
            onClick={downloadAllQRs}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
            disabled={couponsLoading || coupons.length === 0}
          >
            <i className="fas fa-download mr-2"></i> Download All QRs (PDF)
          </button>
        </div>
        {generationError && <p className="text-red-400 text-sm">{generationError}</p>}
        {generationSuccess && <p className="text-green-400 text-sm">{generationSuccess}</p>}
      </div>

      {/* Coupon List and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Coupon List</h2>
          {couponsLoading ? (
            <div className="text-center text-gray-400">Loading coupons...</div>
          ) : couponsError ? (
            <div className="text-red-400">{couponsError}</div>
          ) : coupons.length === 0 ? (
            <p className="text-gray-400">No coupons generated for this event yet.</p>
          ) : (
            <CouponTable coupons={coupons} />
          )}
        </div>
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Coupon Status</h2>
          {/* Example of how you'd integrate a chart */}
          {coupons.length > 0 ? (
            <div className="h-64 flex items-center justify-center">
              {/* <Pie data={chartData} options={chartOptions} /> */}
              <p className="text-gray-400">
                [Pie chart here using a library like `react-chartjs-2`]
                <br/>Redeemed: {couponStats.redeemed} ({((couponStats.redeemed / (couponStats.redeemed + couponStats.unused)) * 100).toFixed(1)}%)
                <br/>Unused: {couponStats.unused} ({((couponStats.unused / (couponStats.redeemed + couponStats.unused)) * 100).toFixed(1)}%)
              </p>
            </div>
          ) : (
            <p className="text-gray-400">Generate coupons to see statistics.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CouponGenerationSection;