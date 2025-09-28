// src/components/admin/CouponGenerationSection.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import CouponTable from './CouponTable';
import CouponDetailModal from './CouponDetailModal'; // Import the new modal component

function CouponGenerationSection() {
    const { eventId } = useParams();
    const [eventName, setEventName] = useState('');
    const [numToGenerate, setNumToGenerate] = useState(50);
    const [generationLoading, setGenerationLoading] = useState(false);
    const [generationError, setGenerationError] = useState('');
    const [generationSuccess, setGenerationSuccess] = useState('');

    const [coupons, setCoupons] = useState([]);
    const [couponStats, setCouponStats] = useState({ redeemed: 0, unused: 0 });
    const [couponsLoading, setCouponsLoading] = useState(true);
    const [couponsError, setCouponsError] = useState('');

    const [selectedCoupon, setSelectedCoupon] = useState(null); // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            const response = await api.get(`/events/${eventId}/coupons`);
            setCoupons(response.data);
            const redeemed = response.data.filter(c => c.is_redeemed).length;
            setCouponStats({ redeemed, unused: response.data.length - redeemed });
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

    const handleDownloadPdf = async () => {
        try {
            const response = await api.get(`/admin/events/${eventId}/download-pdf`, {
                responseType: 'blob', // Crucial for file downloads
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `event_${eventId}_coupons.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Could not download PDF. There might be no unredeemed coupons.');
        }
    };
    
    const handleRowClick = (coupon) => {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Coupon Management for "{eventName}"</h1>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Actions</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="number"
                        value={numToGenerate}
                        onChange={(e) => setNumToGenerate(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full md:w-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 text-white"
                        min="1"
                    />
                    <button
                        onClick={handleGenerateCoupons}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                        disabled={generationLoading}
                    >
                        {generationLoading ? 'Generating...' : 'Generate Coupons'}
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                        disabled={coupons.length === 0}
                    >
                        Download PDF of QRs
                    </button>
                </div>
                {generationError && <p className="text-red-400 text-sm mt-2">{generationError}</p>}
                {generationSuccess && <p className="text-green-400 text-sm mt-2">{generationSuccess}</p>}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-white mb-4">Coupon List ({coupons.length} total)</h2>
                <p className="text-sm text-gray-400 mb-4">Click on a row to view the QR code.</p>
                {couponsLoading ? (
                    <p>Loading coupons...</p>
                ) : couponsError ? (
                    <p className="text-red-400">{couponsError}</p>
                ) : (
                    <CouponTable coupons={coupons} onRowClick={handleRowClick} />
                )}
            </div>
            
            <CouponDetailModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                coupon={selectedCoupon}
            />
        </div>
    );
}

export default CouponGenerationSection;