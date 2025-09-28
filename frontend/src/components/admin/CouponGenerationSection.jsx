// src/components/admin/CouponGenerationSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import CouponTable from './CouponTable';
import CouponDetailModal from './CouponDetailModal';

function CouponGenerationSection() {
    const { eventId } = useParams();
    const [eventName, setEventName] = useState('');
    const [numToGenerate, setNumToGenerate] = useState(50);
    const [loading, setLoading] = useState({ generating: false, fetching: true });
    const [error, setError] = useState({ generation: '', fetching: '' });
    const [success, setSuccess] = useState('');
    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCoupons = useCallback(async () => {
        setLoading(prev => ({ ...prev, fetching: true }));
        setError(prev => ({ ...prev, fetching: '' }));
        try {
            const response = await api.get(`/events/${eventId}/coupons`);
            setCoupons(response.data);
        } catch (err) {
            setError(prev => ({ ...prev, fetching: 'Failed to load coupons.' }));
            console.error(err);
        } finally {
            setLoading(prev => ({ ...prev, fetching: false }));
        }
    }, [eventId]);

    const fetchEventDetails = useCallback(async () => {
        try {
            const response = await api.get(`/events/${eventId}`);
            setEventName(response.data.name);
        } catch (err) {
            setEventName("Unknown Event");
        }
    }, [eventId]);

    useEffect(() => {
        fetchEventDetails();
        fetchCoupons();
    }, [fetchEventDetails, fetchCoupons]);

    const handleGenerateCoupons = async () => {
        setLoading(prev => ({ ...prev, generating: true }));
        setError(prev => ({ ...prev, generation: '' }));
        setSuccess('');
        try {
            await api.post(`/events/${eventId}/generate-coupons`, { count: numToGenerate });
            setSuccess(`${numToGenerate} coupons generated successfully!`);
            fetchCoupons(); // Refresh the list
        } catch (err) {
            setError(prev => ({ ...prev, generation: 'Failed to generate coupons.' }));
        } finally {
            setLoading(prev => ({ ...prev, generating: false }));
        }
    };
    
    const handleRowClick = (coupon) => {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link to="/admin/events" className="text-sm text-gray-400 hover:text-white">
                        &larr; Back to Events
                    </Link>
                    <h1 className="text-4xl font-bold">Coupons for: {eventName}</h1>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="number"
                        value={numToGenerate}
                        onChange={(e) => setNumToGenerate(Number(e.target.value))}
                        className="w-40 p-2 bg-gray-700 rounded-md"
                    />
                    <button onClick={handleGenerateCoupons} disabled={loading.generating} className="bg-purple-600 hover:bg-purple-700 font-bold py-2 px-4 rounded-lg">
                        {loading.generating ? 'Generating...' : 'Generate Coupons'}
                    </button>
                    {/* Placeholder for PDF Download */}
                    <button className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded-lg" disabled>
                        Download PDF (Soon)
                    </button>
                </div>
                {error.generation && <p className="text-red-400 mt-2">{error.generation}</p>}
                {success && <p className="text-green-400 mt-2">{success}</p>}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Generated Coupons</h2>
                {loading.fetching ? <p>Loading...</p> : (
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