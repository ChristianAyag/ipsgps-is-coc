import AppLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function COCApplication({ auth }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [controlID, setControlID] = useState('');

    // Form data state matching NewCOC model exactly
    const [formData, setFormData] = useState({
        // User ID from authenticated user
        userID: auth?.user?.userID || '',
        
        // IP Leader Information
        IPLeaderName: '',
        IPLeaderRegion: '',
        IPLeaderProvince: '',
        IPLeaderMunicipality: '',
        IPLeaderBarangay: '',
        IPLeaderDistrict: '',
        
        // Father's Information
        FatherName: '',
        FatherEthnicity: '',
        FatherOrigin: '',
        
        // Mother's Information
        MotherName: '',
        MotherEthnicity: '',
        MotherOrigin: '',
        
        // Application Details
        applicationType: 'Certificate of Competency',
    });

    // Validation errors
    const [errors, setErrors] = useState({});

    // Philippine regions data
    const regions = [
        'NCR - National Capital Region',
        'CAR - Cordillera Administrative Region',
        'Region I - Ilocos Region',
        'Region II - Cagayan Valley',
        'Region III - Central Luzon',
        'Region IV-A - CALABARZON',
        'Region IV-B - MIMAROPA',
        'Region V - Bicol Region',
        'Region VI - Western Visayas',
        'Region VII - Central Visayas',
        'Region VIII - Eastern Visayas',
        'Region IX - Zamboanga Peninsula',
        'Region X - Northern Mindanao',
        'Region XI - Davao Region',
        'Region XII - SOCCSKSARGEN',
        'Region XIII - Caraga',
        'BARMM - Bangsamoro Autonomous Region in Muslim Mindanao'
    ];

    // Sample provinces (you should fetch these from backend based on selected region)
    const provinces = [
        'Metro Manila',
        'Bulacan',
        'Cavite',
        'Laguna',
        'Rizal',
        'Quezon',
        'Batangas',
        'Pampanga',
        'Nueva Ecija',
        'Tarlac'
    ];

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate all fields
    const validateForm = () => {
        const newErrors = {};
        
        // IP Leader Information validation
        if (!formData.IPLeaderName.trim()) {
            newErrors.IPLeaderName = 'IP Leader name is required';
        }
        if (!formData.IPLeaderRegion) {
            newErrors.IPLeaderRegion = 'Region is required';
        }
        if (!formData.IPLeaderProvince) {
            newErrors.IPLeaderProvince = 'Province is required';
        }
        if (!formData.IPLeaderMunicipality.trim()) {
            newErrors.IPLeaderMunicipality = 'Municipality is required';
        }
        if (!formData.IPLeaderBarangay.trim()) {
            newErrors.IPLeaderBarangay = 'Barangay is required';
        }
        
        // Father's Information validation
        if (!formData.FatherName.trim()) {
            newErrors.FatherName = 'Father\'s name is required';
        }
        if (!formData.FatherEthnicity.trim()) {
            newErrors.FatherEthnicity = 'Father\'s ethnicity is required';
        }
        if (!formData.FatherOrigin.trim()) {
            newErrors.FatherOrigin = 'Father\'s origin is required';
        }
        
        // Mother's Information validation
        if (!formData.MotherName.trim()) {
            newErrors.MotherName = 'Mother\'s name is required';
        }
        if (!formData.MotherEthnicity.trim()) {
            newErrors.MotherEthnicity = 'Mother\'s ethnicity is required';
        }
        if (!formData.MotherOrigin.trim()) {
            newErrors.MotherOrigin = 'Mother\'s origin is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields before submission
        if (!validateForm()) {
            // Scroll to first error
            const firstErrorField = Object.keys(errors)[0];
            const element = document.getElementsByName(firstErrorField)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/coc', formData);
            
            if (response.data.success) {
                setControlID(response.data.data.controlID);
                setSuccess(true);
                
                // Redirect to status page after 3 seconds
                setTimeout(() => {
                    router.visit('/application-status');
                }, 3000);
            }
        } catch (error) {
            if (error.response?.status === 422 && error.response.data.errors) {
                setErrors(error.response.data.errors);
                // Scroll to first error
                const firstErrorField = Object.keys(error.response.data.errors)[0];
                const element = document.getElementsByName(firstErrorField)[0];
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                setError(error.response?.data?.message || 'An error occurred during submission');
            }
            console.error('Submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Success view
    if (success) {
        return (
            <AppLayout title="Application Submitted">
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
                        <p className="text-gray-600 mb-4">
                            Your COC application has been received. Your Control ID is:
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-2xl font-mono font-bold text-blue-600">{controlID}</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Please save this Control ID for tracking your application status.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                            <span>Redirecting to application status...</span>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="COC Application">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Certificate of Competency Application</h1>
                    <p className="text-gray-600">Please fill out all required information to submit your application</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
                    {/* IP Leader Information Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                1
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">IP Leader Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    IP Leader Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="IPLeaderName"
                                    value={formData.IPLeaderName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.IPLeaderName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter full name"
                                />
                                {errors.IPLeaderName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.IPLeaderName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Region <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="IPLeaderRegion"
                                    value={formData.IPLeaderRegion}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.IPLeaderRegion ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Region</option>
                                    {regions.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                                {errors.IPLeaderRegion && (
                                    <p className="mt-1 text-sm text-red-600">{errors.IPLeaderRegion}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Province <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="IPLeaderProvince"
                                    value={formData.IPLeaderProvince}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.IPLeaderProvince ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                                {errors.IPLeaderProvince && (
                                    <p className="mt-1 text-sm text-red-600">{errors.IPLeaderProvince}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Municipality <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="IPLeaderMunicipality"
                                    value={formData.IPLeaderMunicipality}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.IPLeaderMunicipality ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter municipality"
                                />
                                {errors.IPLeaderMunicipality && (
                                    <p className="mt-1 text-sm text-red-600">{errors.IPLeaderMunicipality}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Barangay <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="IPLeaderBarangay"
                                    value={formData.IPLeaderBarangay}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.IPLeaderBarangay ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter barangay"
                                />
                                {errors.IPLeaderBarangay && (
                                    <p className="mt-1 text-sm text-red-600">{errors.IPLeaderBarangay}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    District (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="IPLeaderDistrict"
                                    value={formData.IPLeaderDistrict}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter district if applicable"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Father's Information Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                2
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Father's Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Father's Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="FatherName"
                                    value={formData.FatherName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.FatherName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter father's full name"
                                />
                                {errors.FatherName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.FatherName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Father's Ethnicity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="FatherEthnicity"
                                    value={formData.FatherEthnicity}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.FatherEthnicity ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Tagalog, Cebuano, Ilocano"
                                />
                                {errors.FatherEthnicity && (
                                    <p className="mt-1 text-sm text-red-600">{errors.FatherEthnicity}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Father's Origin <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="FatherOrigin"
                                    value={formData.FatherOrigin}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.FatherOrigin ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Place of origin"
                                />
                                {errors.FatherOrigin && (
                                    <p className="mt-1 text-sm text-red-600">{errors.FatherOrigin}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mother's Information Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                3
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Mother's Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mother's Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="MotherName"
                                    value={formData.MotherName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.MotherName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter mother's full name"
                                />
                                {errors.MotherName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.MotherName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mother's Ethnicity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="MotherEthnicity"
                                    value={formData.MotherEthnicity}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.MotherEthnicity ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Tagalog, Cebuano, Ilocano"
                                />
                                {errors.MotherEthnicity && (
                                    <p className="mt-1 text-sm text-red-600">{errors.MotherEthnicity}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mother's Origin <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="MotherOrigin"
                                    value={formData.MotherOrigin}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.MotherOrigin ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Place of origin"
                                />
                                {errors.MotherOrigin && (
                                    <p className="mt-1 text-sm text-red-600">{errors.MotherOrigin}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Required Fields Note */}
                    <div className="mb-4 text-sm text-gray-500">
                        <span className="text-red-500">*</span> Indicates required fields
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg font-medium"
                        >
                            {loading ? (
                                <>
                                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Submitting Application...
                                </>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </AppLayout>
    );
}