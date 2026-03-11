import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";
import { useState, useRef, useCallback, useEffect, memo } from "react";
import axios from 'axios';

// Import components
import StepIndicator from "@/Components/COC/StepIndicator";
import MethodSelector from "@/Components/COC/MethodSelector";
import CameraCapture from "@/Components/COC/CameraCapture";
import FileUploader from "@/Components/COC/FileUploader";
import FilePreview from "@/Components/COC/FilePreview";

// ========== MOVE STEP COMPONENTS OUTSIDE THE MAIN COMPONENT ==========

const Step1_IPLeader = memo(({ formData, errors, handleChange, regions, provinces }) => (
    <div className="space-y-6">
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
));

const Step2_Father = memo(({ formData, errors, handleChange }) => (
    <div className="space-y-6">
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
));

const Step3_Mother = memo(({ formData, errors, handleChange }) => (
    <div className="space-y-6">
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
));

const Step5_Document = memo(({ selectedMethod, uploadedFile, uploadedFileName, errors, removeFile }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                5
            </div>
            <h2 className="text-xl font-bold text-gray-900">
                {selectedMethod === 'upload' ? 'Upload Document' : 'Document Preview'}
            </h2>
        </div>
        
        {uploadedFile ? (
            <FilePreview 
                file={uploadedFile}
                fileName={uploadedFileName}
                onRemove={removeFile}
            />
        ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No document uploaded yet</p>
            </div>
        )}
        
        {errors.uploadedFile && (
            <p className="text-sm text-red-600">{errors.uploadedFile}</p>
        )}
    </div>
));

const SuccessView = ({ controlID }) => (
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
);

// ========== MAIN COMPONENT ==========

export default function COCApplication({ auth }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [controlID, setControlID] = useState('');
    
    // Step state
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState(null); // 'upload' or 'camera'
    const [showMethodModal, setShowMethodModal] = useState(false);
    const totalSteps = 5;
    
    // Form data state
    const [formData, setFormData] = useState({
        userID: auth?.user?.userID || '',
        IPLeaderName: '',
        IPLeaderRegion: '',
        IPLeaderProvince: '',
        IPLeaderMunicipality: '',
        IPLeaderBarangay: '',
        IPLeaderDistrict: '',
        FatherName: '',
        FatherEthnicity: '',
        FatherOrigin: '',
        MotherName: '',
        MotherEthnicity: '',
        MotherOrigin: '',
        applicationType: 'Certificate of Competency',
    });

    // File state
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');

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

    // ========== HANDLERS ==========
    
    const handleChange = useCallback((e) => {
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
    }, [errors]);

    const handleFileUpload = (file) => {
        setUploadedFile(file);
        setUploadedFileName(file.name);
        setShowMethodModal(false);
        setCurrentStep(5);
    };

    const handleCameraCapture = (file, previewUrl) => {
        setUploadedFile(file);
        setUploadedFileName(file.name);
        setShowMethodModal(false);
        setCurrentStep(5);
    };

    const removeFile = () => {
        setUploadedFile(null);
        setUploadedFileName('');
    };

    // Validate current step
    const validateStep = () => {
        const newErrors = {};
        
        switch(currentStep) {
            case 1:
                if (!formData.IPLeaderName?.trim()) {
                    newErrors.IPLeaderName = 'IP Leader name is required';
                }
                if (!formData.IPLeaderRegion) {
                    newErrors.IPLeaderRegion = 'Region is required';
                }
                if (!formData.IPLeaderProvince) {
                    newErrors.IPLeaderProvince = 'Province is required';
                }
                if (!formData.IPLeaderMunicipality?.trim()) {
                    newErrors.IPLeaderMunicipality = 'Municipality is required';
                }
                if (!formData.IPLeaderBarangay?.trim()) {
                    newErrors.IPLeaderBarangay = 'Barangay is required';
                }
                break;
                
            case 2:
                if (!formData.FatherName?.trim()) {
                    newErrors.FatherName = 'Father\'s name is required';
                }
                if (!formData.FatherEthnicity?.trim()) {
                    newErrors.FatherEthnicity = 'Father\'s ethnicity is required';
                }
                if (!formData.FatherOrigin?.trim()) {
                    newErrors.FatherOrigin = 'Father\'s origin is required';
                }
                break;
                
            case 3:
                if (!formData.MotherName?.trim()) {
                    newErrors.MotherName = 'Mother\'s name is required';
                }
                if (!formData.MotherEthnicity?.trim()) {
                    newErrors.MotherEthnicity = 'Mother\'s ethnicity is required';
                }
                if (!formData.MotherOrigin?.trim()) {
                    newErrors.MotherOrigin = 'Mother\'s origin is required';
                }
                break;
                
            case 4:
                if (!selectedMethod) {
                    newErrors.selectedMethod = 'Please choose an upload method';
                }
                break;
                
            case 5:
                if (!uploadedFile) {
                    newErrors.uploadedFile = 'Please upload a document or take a photo';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 4) {
            // For step 4, just open the modal without validation first
            setShowMethodModal(true);
        } else {
            // For other steps, validate before proceeding
            if (validateStep()) {
                setCurrentStep(prev => Math.min(prev + 1, totalSteps));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep()) {
            return;
        }

        setLoading(true);
        setError('');

        const submitData = new FormData();
        
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key] || '');
        });

        if (uploadedFile) {
            submitData.append('document', uploadedFile);
        }

        try {
            const response = await axios.post('/api/coc', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.success) {
                setControlID(response.data.data.controlID);
                setSuccess(true);
                
                setTimeout(() => {
                    router.visit('/application-status');
                }, 3000);
            }
        } catch (error) {
            if (error.response?.status === 422 && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setError(error.response?.data?.message || 'An error occurred during submission');
            }
            console.error('Submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    const MethodModal = () => {
        if (!showMethodModal) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    {!selectedMethod ? (
                                        <>
                                            <MethodSelector 
                                                selectedMethod={selectedMethod}
                                                onSelect={setSelectedMethod}
                                            />
                                            {/* Continue button */}
                                            {selectedMethod && (
                                                <div className="mt-6 flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowMethodModal(false);
                                                            setSelectedMethod(null);
                                                        }}
                                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowMethodModal(false);
                                                            setCurrentStep(5);
                                                        }}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Continue
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : selectedMethod === 'upload' ? (
                                        <FileUploader 
                                            onUpload={handleFileUpload}
                                            onClose={() => {
                                                setShowMethodModal(false);
                                                setSelectedMethod(null);
                                            }}
                                        />
                                    ) : selectedMethod === 'camera' ? (
                                        <CameraCapture 
                                            onCapture={handleCameraCapture}
                                            onClose={() => {
                                                setShowMethodModal(false);
                                                setSelectedMethod(null);
                                            }}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ========== MAIN RENDER ==========
    
    if (success) {
        return (
            <AppLayout title="Application Submitted">
                <SuccessView controlID={controlID} />
            </AppLayout>
        );
    }

    return (
        <AppLayout title="COC Application">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Certificate of Competency Application</h1>
                    <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
                </div>

                {/* Step Indicator */}
                <StepIndicator currentStep={currentStep} selectedMethod={selectedMethod} />

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
                    {/* Current Step - Now using the moved components with props */}
                    {currentStep === 1 && (
                        <Step1_IPLeader 
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            regions={regions}
                            provinces={provinces}
                        />
                    )}
                    {currentStep === 2 && (
                        <Step2_Father 
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3_Mother 
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                        />
                    )}
                    {currentStep === 5 && (
                        <Step5_Document 
                            selectedMethod={selectedMethod}
                            uploadedFile={uploadedFile}
                            uploadedFileName={uploadedFileName}
                            errors={errors}
                            removeFile={removeFile}
                        />
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                                currentStep === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>

                        {currentStep < totalSteps ? (
                            currentStep === 4 ? (
                                // Special handling for step 4 - Open modal button
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    Choose Method
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ) : (
                                // Normal next button for other steps
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    Next
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </button>
                        )}
                    </div>
                </form>

                {/* Method Modal */}
                <MethodModal />
            </div>
        </AppLayout>
    );
}