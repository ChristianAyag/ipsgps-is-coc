import AppLayout from "@/Layouts/AppLayout";  // Fixed import path
import { router } from "@inertiajs/react";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from 'axios';


export default function COCApplication({ auth }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [controlID, setControlID] = useState('');
    
    // Modal state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);

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

    // Single uploaded file
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');

    // Validation errors
    const [errors, setErrors] = useState({});

    // PSGC API dropdown state (regions -> provinces -> municipalities -> barangays)
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [loadingRegion, setLoadingRegion] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
    const [loadingBarangays, setLoadingBarangays] = useState(false);
    const [selectedRegionCode, setSelectedRegionCode] = useState('');
    const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
    const [selectedMunicipalityCode, setSelectedMunicipalityCode] = useState('');
    const [selectedBarangayCode, setSelectedBarangayCode] = useState('');
    const municipalitiesCacheRef = useRef({});
    const barangaysCacheRef = useRef({});

    // DRIP API dropdown state (ethnogroups)
    const [ethnicityOptions, setEthnicityOptions] = useState([]);
    const [loadingEthnicities, setLoadingEthnicities] = useState(false);

    const psgcBaseUrl = (import.meta.env.VITE_PSGC_API_URL || 'https://psgc.gitlab.io/api').replace(/\/+$/, '');
    const psgcApiKey = import.meta.env.VITE_PSGC_API_KEY;
    const psgcFetch = (path, init = {}) => {
        const headers = {
            ...(init.headers || {}),
            ...(psgcApiKey ? { 'X-API-KEY': psgcApiKey } : {}),
        };

        return fetch(`${psgcBaseUrl}${path}`, { ...init, headers });
    };

    const getEthnicityOption = (option, index) => {
        const value = typeof option === 'string'
            ? option
            : (option.name
                ? option.name
                : (option.ethnicity
                    ? option.ethnicity
                    : (option.value
                        ? option.value
                        : JSON.stringify(option))));

        const label = typeof option === 'string'
            ? option
            : (option.name
                ? option.name
                : (option.ethnicity
                    ? option.ethnicity
                    : (option.label
                        ? option.label
                        : (option.value
                            ? option.value
                            : 'Unknown'))));

        return { value, label, key: index };
    };

    // Fetch regions on mount
    useEffect(() => {
        setLoadingRegion(true);
        psgcFetch('/regions/')
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.sort((a, b) => a.code.localeCompare(b.code));
                setRegions(sorted);
            })
            .catch((err) => console.error('Failed to fetch regions:', err))
            .finally(() => setLoadingRegion(false));
    }, []);

    // If formData already has a region name (e.g., edit/draft), sync dropdown code.
    useEffect(() => {
        if (selectedRegionCode || !formData.IPLeaderRegion || regions.length === 0) return;

        const match = regions.find((r) => (r.regionName || r.name) === formData.IPLeaderRegion);
        if (match) {
            setSelectedRegionCode(match.code);
        }
    }, [regions, formData.IPLeaderRegion, selectedRegionCode]);

    // Fetch provinces when region changes
    useEffect(() => {
        if (!selectedRegionCode) {
            setProvinces([]);
            setMunicipalities([]);
            setBarangays([]);
            setSelectedProvinceCode('');
            setSelectedMunicipalityCode('');
            setSelectedBarangayCode('');
            setFormData(prev => ({
                ...prev,
                IPLeaderProvince: '',
                IPLeaderMunicipality: '',
                IPLeaderBarangay: '',
            }));
            return;
        }

        setLoadingProvinces(true);
        setProvinces([]);
        setMunicipalities([]);
        setBarangays([]);
        setSelectedProvinceCode('');
        setSelectedMunicipalityCode('');
        setSelectedBarangayCode('');
        setFormData(prev => ({
            ...prev,
            IPLeaderProvince: '',
            IPLeaderMunicipality: '',
            IPLeaderBarangay: '',
        }));

        psgcFetch(`/regions/${selectedRegionCode}/provinces/`)
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setProvinces(sorted);
            })
            .catch((err) => console.error('Failed to fetch provinces:', err))
            .finally(() => setLoadingProvinces(false));
    }, [selectedRegionCode]);

    // Fetch municipalities when province changes (with caching)
    useEffect(() => {
        if (!selectedProvinceCode) {
            setMunicipalities([]);
            setBarangays([]);
            setSelectedMunicipalityCode('');
            setSelectedBarangayCode('');
            setFormData(prev => ({
                ...prev,
                IPLeaderMunicipality: '',
                IPLeaderBarangay: '',
            }));
            return;
        }

        setLoadingMunicipalities(true);
        setMunicipalities([]);
        setBarangays([]);
        setSelectedMunicipalityCode('');
        setSelectedBarangayCode('');
        setFormData(prev => ({
            ...prev,
            IPLeaderMunicipality: '',
            IPLeaderBarangay: '',
        }));

        const cachedMunicipalities = municipalitiesCacheRef.current[selectedProvinceCode];
        if (cachedMunicipalities) {
            setMunicipalities(cachedMunicipalities);
            setLoadingMunicipalities(false);
            return;
        }

        psgcFetch(`/provinces/${selectedProvinceCode}/cities-municipalities/`)
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                municipalitiesCacheRef.current[selectedProvinceCode] = sorted;
                setMunicipalities(sorted);
            })
            .catch((err) => console.error('Failed to fetch municipalities:', err))
            .finally(() => setLoadingMunicipalities(false));
    }, [selectedProvinceCode]);

    // Fetch barangays when municipality changes (with caching + abort)
    useEffect(() => {
        if (!selectedMunicipalityCode) {
            setBarangays([]);
            setSelectedBarangayCode('');
            setFormData(prev => ({ ...prev, IPLeaderBarangay: '' }));
            return;
        }

        const cachedBarangays = barangaysCacheRef.current[selectedMunicipalityCode];
        if (cachedBarangays) {
            setBarangays(cachedBarangays);
            return;
        }

        const controller = new AbortController();
        setLoadingBarangays(true);
        setBarangays([]);
        setSelectedBarangayCode('');
        setFormData(prev => ({ ...prev, IPLeaderBarangay: '' }));

        psgcFetch(`/cities-municipalities/${selectedMunicipalityCode}/barangays/`, {
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then((data) => {
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                barangaysCacheRef.current[selectedMunicipalityCode] = sorted;
                setBarangays(sorted);
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error('Failed to fetch barangays:', err);
                }
            })
            .finally(() => setLoadingBarangays(false));

        return () => controller.abort();
    }, [selectedMunicipalityCode]);

    // Fetch ethnogroups from DRIP API
    useEffect(() => {
        const fetchEthnoGroups = async () => {
            const dripUrl = import.meta.env.VITE_NCIP_DRIP_API_URL;
            const dripKey = import.meta.env.VITE_NCIP_DRIP_API_KEY;

            if (!dripUrl || !dripKey) {
                setEthnicityOptions([]);
                return;
            }

            setLoadingEthnicities(true);
            try {
                const res = await fetch(dripUrl, {
                    method: 'GET',
                    headers: {
                        'X-API-KEY': dripKey,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const json = await res.json();
                const options = Array.isArray(json)
                    ? json
                    : (json.data && Array.isArray(json.data))
                        ? json.data
                        : (json.ethnogroups && Array.isArray(json.ethnogroups))
                            ? json.ethnogroups
                            : (json.records && Array.isArray(json.records))
                                ? json.records
                                : [];

                setEthnicityOptions(options);
            } catch (err) {
                console.error('Failed to fetch ethno groups:', err);
                setEthnicityOptions([]);
            } finally {
                setLoadingEthnicities(false);
            }
        };

        fetchEthnoGroups();
    }, []);

    // Drag and drop handlers
    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }
        setIsDragging(true);
    }, []);

    const validateFile = (file) => {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                file: 'File size must be less than 5MB'
            }));
            return false;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                file: 'Only JPG, PNG, and PDF files are allowed'
            }));
            return false;
        }

        return true;
    };

    const processFile = (file) => {
        if (!validateFile(file)) return;

        setSelectedFile(file);

        // Create preview URL for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFilePreview('pdf');
        }

        // Clear file error
        if (errors.file) {
            setErrors(prev => ({
                ...prev,
                file: ''
            }));
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    // Handle file selection in modal
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    // Handle modal upload confirmation
    const handleModalUpload = () => {
        if (selectedFile) {
            setUploadedFile(selectedFile);
            setUploadedFileName(selectedFile.name);
            setShowUploadModal(false);
            
            // Clear selected file data
            setSelectedFile(null);
            setFilePreview('');
            
            // Clear any file errors
            if (errors.uploadedFile) {
                setErrors(prev => ({
                    ...prev,
                    uploadedFile: ''
                }));
            }
        }
    };

    // Handle modal cancel
    const handleModalCancel = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setFilePreview('');
        setIsDragging(false);
        setErrors(prev => ({ ...prev, file: '' }));
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Remove uploaded file
    const removeFile = () => {
        setUploadedFile(null);
        setUploadedFileName('');
    };

    const clearFieldError = (fieldName) => {
        if (!errors[fieldName]) return;
        setErrors(prev => ({ ...prev, [fieldName]: '' }));
    };

    const handleIPLeaderRegionChange = (e) => {
        const code = e.target.value;
        const region = regions.find((r) => r.code === code);
        const regionName = region ? (region.regionName || region.name || '') : '';

        setSelectedRegionCode(code);
        setSelectedProvinceCode('');
        setSelectedMunicipalityCode('');
        setSelectedBarangayCode('');
        setFormData(prev => ({
            ...prev,
            IPLeaderRegion: regionName,
            IPLeaderProvince: '',
            IPLeaderMunicipality: '',
            IPLeaderBarangay: '',
        }));

        clearFieldError('IPLeaderRegion');
        clearFieldError('IPLeaderProvince');
        clearFieldError('IPLeaderMunicipality');
        clearFieldError('IPLeaderBarangay');
    };

    const handleIPLeaderProvinceChange = (e) => {
        const code = e.target.value;
        const province = provinces.find((p) => p.code === code);

        setSelectedProvinceCode(code);
        setSelectedMunicipalityCode('');
        setSelectedBarangayCode('');
        setFormData(prev => ({
            ...prev,
            IPLeaderProvince: province ? province.name : '',
            IPLeaderMunicipality: '',
            IPLeaderBarangay: '',
        }));

        clearFieldError('IPLeaderProvince');
        clearFieldError('IPLeaderMunicipality');
        clearFieldError('IPLeaderBarangay');
    };

    const handleIPLeaderMunicipalityChange = (e) => {
        const code = e.target.value;
        const municipality = municipalities.find((m) => m.code === code);

        setSelectedMunicipalityCode(code);
        setSelectedBarangayCode('');
        setFormData(prev => ({
            ...prev,
            IPLeaderMunicipality: municipality ? municipality.name : '',
            IPLeaderBarangay: '',
        }));

        clearFieldError('IPLeaderMunicipality');
        clearFieldError('IPLeaderBarangay');
    };

    const handleIPLeaderBarangayChange = (e) => {
        const code = e.target.value;
        const barangay = barangays.find((b) => b.code === code);

        setSelectedBarangayCode(code);
        setFormData(prev => ({
            ...prev,
            IPLeaderBarangay: barangay ? barangay.name : '',
        }));

        clearFieldError('IPLeaderBarangay');
    };

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

        // File upload validation
        if (!uploadedFile) {
            newErrors.uploadedFile = 'Please upload a document';
        }

        setErrors(newErrors);
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.userID) {
            setError('Please log in to submit an application.');
            return;
        }
        
        // Validate all fields before submission
        const nextErrors = validateForm();
        if (Object.keys(nextErrors).length > 0) {
            // Scroll to first error
            const firstErrorField = Object.keys(nextErrors)[0];
            const element = document.getElementsByName(firstErrorField)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setLoading(true);
        setError('');

        // Create FormData object for multipart/form-data submission
        const submitData = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        // Append the uploaded file
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
                
                // Redirect to status page after 3 seconds
                setTimeout(() => {
                    router.visit('/user/application-status');
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
                    <p className="text-gray-600">Please fill out all required information and upload the necessary document</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6" encType="multipart/form-data">
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
                                    value={selectedRegionCode}
                                    onChange={handleIPLeaderRegionChange}
                                    disabled={loadingRegion}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.IPLeaderRegion ? 'border-red-500' : 'border-gray-300'
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                >
                                    <option value="">
                                        {loadingRegion ? 'Loading regions...' : 'Select Region'}
                                    </option>
                                    {regions.map(r => (
                                        <option key={r.code} value={r.code}>{r.regionName || r.name}</option>
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
                                    value={selectedProvinceCode}
                                    onChange={handleIPLeaderProvinceChange}
                                    disabled={!selectedRegionCode || loadingProvinces}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.IPLeaderProvince ? 'border-red-500' : 'border-gray-300'
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                >
                                    <option value="">
                                        {loadingProvinces ? 'Loading provinces...' : 'Select Province'}
                                    </option>
                                    {provinces.map(p => (
                                        <option key={p.code} value={p.code}>{p.name}</option>
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
                                <select
                                    name="IPLeaderMunicipality"
                                    value={selectedMunicipalityCode}
                                    onChange={handleIPLeaderMunicipalityChange}
                                    disabled={!selectedProvinceCode || loadingMunicipalities}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.IPLeaderMunicipality ? 'border-red-500' : 'border-gray-300'
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                >
                                    <option value="">
                                        {loadingMunicipalities ? 'Loading municipalities...' : 'Select Municipality'}
                                    </option>
                                    {municipalities.map(m => (
                                        <option key={m.code} value={m.code}>{m.name}</option>
                                    ))}
                                </select>
                                {errors.IPLeaderMunicipality && (
                                    <p className="mt-1 text-sm text-red-600">{errors.IPLeaderMunicipality}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Barangay <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="IPLeaderBarangay"
                                    value={selectedBarangayCode}
                                    onChange={handleIPLeaderBarangayChange}
                                    disabled={!selectedMunicipalityCode || loadingBarangays}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.IPLeaderBarangay ? 'border-red-500' : 'border-gray-300'
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                >
                                    <option value="">
                                        {loadingBarangays ? 'Loading barangays...' : 'Select Barangay'}
                                    </option>
                                    {barangays.map(b => (
                                        <option key={b.code} value={b.code}>{b.name}</option>
                                    ))}
                                </select>
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
                                <select
                                    name="FatherEthnicity"
                                    value={formData.FatherEthnicity}
                                    onChange={handleChange}
                                    disabled={loadingEthnicities}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.FatherEthnicity ? 'border-red-500' : 'border-gray-300'
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                >
                                    <option value="">
                                        {loadingEthnicities ? 'Loading ethnicities...' : 'Select ethnicity'}
                                    </option>
                                    {ethnicityOptions.map((option, index) => {
                                        const { value, label, key } = getEthnicityOption(option, index);
                                        return (
                                            <option key={key} value={value}>
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
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
                                <select
                                    name="MotherEthnicity"
                                    value={formData.MotherEthnicity}
                                    onChange={handleChange}
                                    disabled={loadingEthnicities}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.MotherEthnicity ? 'border-red-500' : 'border-gray-300'
                                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                >
                                    <option value="">
                                        {loadingEthnicities ? 'Loading ethnicities...' : 'Select ethnicity'}
                                    </option>
                                    {ethnicityOptions.map((option, index) => {
                                        const { value, label, key } = getEthnicityOption(option, index);
                                        return (
                                            <option key={key} value={value}>
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
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
                    
                    {/* Document Upload Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                4
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Document Upload</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {!uploadedFile ? (
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(true)}
                                    className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                >
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-600 group-hover:text-blue-600">
                                            <span className="font-medium">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG, PDF up to 5MB
                                        </p>
                                    </div>
                                </button>
                            ) : (
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                {uploadedFile.type.startsWith('image/') ? (
                                                    <img 
                                                        src={URL.createObjectURL(uploadedFile)} 
                                                        alt="Preview" 
                                                        className="h-12 w-12 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{uploadedFileName}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(uploadedFile.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                            {errors.uploadedFile && (
                                <p className="mt-1 text-sm text-red-600">{errors.uploadedFile}</p>
                            )}
                        </div>
                        
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Please upload a clear and legible copy of your supporting document. 
                                Accepted formats: JPG, PNG, PDF. Maximum file size: 5MB.
                            </p>
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

                {/* Upload Modal with Drag & Drop */}
                {showUploadModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            {/* Modal panel */}
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                Upload Document
                                            </h3>
                                            
                                            {/* Drag & Drop zone in modal */}
                                            <div className="mt-2">
                                                <div
                                                    ref={dropZoneRef}
                                                    onDragEnter={handleDragEnter}
                                                    onDragLeave={handleDragLeave}
                                                    onDragOver={handleDragOver}
                                                    onDrop={handleDrop}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className={`relative flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                                                        isDragging 
                                                            ? 'border-blue-500 bg-blue-50' 
                                                            : selectedFile 
                                                                ? 'border-green-500 bg-green-50' 
                                                                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                                                    }`}
                                                >
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        onChange={handleFileSelect}
                                                    />
                                                    
                                                    <div className="space-y-1 text-center w-full">
                                                        {!selectedFile ? (
                                                            <>
                                                                <svg className={`mx-auto h-12 w-12 ${
                                                                    isDragging ? 'text-blue-500' : 'text-gray-400'
                                                                }`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                                <div className="flex text-sm text-gray-600 justify-center">
                                                                    <span className="font-medium text-blue-600 hover:text-blue-500">
                                                                        Click to upload
                                                                    </span>
                                                                    <p className="pl-1">or drag and drop</p>
                                                                </div>
                                                                <p className="text-xs text-gray-500">
                                                                    PNG, JPG, PDF up to 5MB
                                                                </p>
                                                                {isDragging && (
                                                                    <p className="text-sm text-blue-600 font-medium mt-2">
                                                                        Drop your file here
                                                                    </p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div>
                                                                {filePreview && filePreview !== 'pdf' ? (
                                                                    <img 
                                                                        src={filePreview} 
                                                                        alt="Preview" 
                                                                        className="max-h-48 mx-auto rounded-lg"
                                                                    />
                                                                ) : filePreview === 'pdf' ? (
                                                                    <div className="flex items-center justify-center p-4">
                                                                        <svg className="h-16 w-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                                        </svg>
                                                                    </div>
                                                                ) : null}
                                                                <p className="mt-2 text-sm font-medium text-gray-900">
                                                                    {selectedFile.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                                </p>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedFile(null);
                                                                        setFilePreview('');
                                                                        if (fileInputRef.current) {
                                                                            fileInputRef.current.value = '';
                                                                        }
                                                                    }}
                                                                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {errors.file && (
                                                    <p className="mt-2 text-sm text-red-600">{errors.file}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={handleModalUpload}
                                        disabled={!selectedFile}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleModalCancel}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
