'use client'
import { useState, useEffect } from "react";
import { FaUtensils } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { reservation_services } from "@/services/reservation.services";
import { IReservationPayload } from "@/interfaces";
import SuccessModal, { ReservationSuccessData } from "../common/success_modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/constants/route";

interface ReservationData {
    name: string;
    email: string;
    phone: string;
    guests: string;
    date: string;
    time: string;
    requests: string;
}

const ReservationLabel = ({ text }: { text: string }) => {
    return (
        <label className="block text-gray-700 font-semibold mb-2">
            {text} <span className="text-red-600">*</span>
        </label>
    )
}

const ReservationForm = ({
    onSubmit,
    isLoading,
    serverError
}: {
    onSubmit: (data: ReservationData) => void;
    isLoading: boolean;
    serverError: string;
}) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        guests: '',
        date: '',
        time: '',
        requests: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || user.name || '',
                email: prev.email || user.email || '',
                phone: prev.phone || user.phoneNumber || ''
            }));
        }
    }, [user]);

    const today = new Date().toISOString().split('T')[0];

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
            {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                    <span>⚠</span>
                    <span>{serverError}</span>
                </div>
            )}

            {/* Reservation Details Section */}
            <div className="mb-8">
                <h2 className="text-primary text-2xl font-semibold mb-6 pb-3 border-b-2 border-secondary flex items-center gap-2">
                    <FiCalendar />Reservation Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <ReservationLabel text="Full Name" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <ReservationLabel text="Email" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <ReservationLabel text="Phone Number" />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <ReservationLabel text="Number of Guests" />
                        <select
                            name="guests"
                            value={formData.guests}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                        >
                            <option value="">Select guests</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>
                                    {num} Guest{num > 1 ? 's' : ''}
                                </option>
                            ))}
                            <option value="8+">8+ Guests</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <ReservationLabel text="Reservation Date" />
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            min={today}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <ReservationLabel text="Preferred Time" />
                        <select
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors"
                        >
                            <option value="">Select time</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="17:30">5:30 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="18:30">6:30 PM</option>
                            <option value="19:00">7:00 PM</option>
                            <option value="19:30">7:30 PM</option>
                            <option value="20:00">8:00 PM</option>
                            <option value="20:30">8:30 PM</option>
                            <option value="21:00">9:00 PM</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Special Requests
                    </label>
                    <textarea
                        name="requests"
                        value={formData.requests}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Dietary restrictions, allergies, special occasions, etc."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary focus:outline-none transition-colors resize-none"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 text-white font-semibold py-4 px-8 rounded-full text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Reservation...
                    </>
                ) : (
                    '🎉 Confirm Reservation'
                )}
            </button>
        </form>
    );
};

const SuccessMessage = () => {
    return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <h3 className="text-green-800 text-2xl font-semibold mb-4">
                Reservation Confirmed!
            </h3>
            <p className="text-green-700 text-lg">
                Thank you for your reservation. We've sent a confirmation email with all the details.
                We look forward to serving you!
            </p>
        </div>
    );
};

const ReservationPage = () => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [reservationData, setReservationData] = useState<ReservationSuccessData | null>(null);

    const handleReservationSubmit = async (formData: ReservationData) => {
        setIsLoading(true);
        setServerError('');
        try {
            let reservationTimeISO: string;
            if (formData.date && formData.time) {
                reservationTimeISO = new Date(`${formData.date}T${formData.time}:00.000Z`).toISOString();
            } else {
                reservationTimeISO = new Date().toISOString();
            }

            const payload: IReservationPayload = {
                fullName: formData.name,
                email: formData.email,
                phoneNumber: formData.phone,
                numberOfGuests: parseInt(formData.guests, 10) || 1,
                reservationTime: reservationTimeISO,
                specialRequests: formData.requests || undefined,
            };

            const res = isAuthenticated
                ? await reservation_services.createMeReservation(payload)
                : await reservation_services.createPublicReservation(payload);

            if (res.success || res.data) {
                setReservationData({
                    fullName: formData.name,
                    date: formData.date,
                    time: formData.time,
                    numberOfGuests: parseInt(formData.guests, 10) || 1,
                    tableID: res.data?.tableID || null,
                });
                setShowSuccessModal(true);
                toast.success("Đặt bàn thành công! Cảm ơn quý khách.");
            } else {
                setServerError(res.message || 'Failed to complete reservation. Please try again.');
            }
        } catch (error: any) {
            setServerError(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message ||
                'Something went wrong while reserving.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-900 via-primary to-amber-800">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center text-white mb-10">
                    <h1 className="flex place-items-center justify-center text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                        <FaUtensils />
                        <span className="ml-4">Foodie Restaurant</span>
                    </h1>
                    <p className="text-xl opacity-90">
                        Reserve your table and pre-order your favorite dishes
                    </p>
                </div>

                {/* Main Content Form */}
                <ReservationForm
                    onSubmit={handleReservationSubmit}
                    isLoading={isLoading}
                    serverError={serverError}
                />

                {/* Reservation Success Modal Popup */}
                {showSuccessModal && reservationData && (
                    <SuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        type="RESERVATION"
                        reservationData={reservationData}
                        onPrimaryAction={() => {
                            setShowSuccessModal(false);
                            router.push('/account');
                        }}
                        onSecondaryAction={() => {
                            setShowSuccessModal(false);
                            router.push(ROUTES.GUEST.HOME || '/guest');
                        }}
                    />
                )}
            </div>
        </div>
    );
};


export default ReservationPage

