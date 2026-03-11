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

const Step1_IPLeader = memo(({
    formData,
    errors,
    handleChange,
    regions,
    provinces,
    municipalities,
    barangays,
    selectedRegionCode,
    selectedProvinceCode,
    selectedMunicipalityCode,
    selectedBarangayCode,
    loadingRegion,
    loadingProvinces,
    loadingMunicipalities,
    loadingBarangays,
    handleIPLeaderRegionChange,
    handleIPLeaderProvinceChange,
    handleIPLeaderMunicipalityChange,
    handleIPLeaderBarangayChange,
}) => (
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
));

const Step2_Father = memo(({ formData, errors, handleChange, ethnicityOptions, loadingEthnicities }) => (
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
));

const Step3_Mother = memo(({ formData, errors, handleChange, ethnicityOptions, loadingEthnicities }) => (
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

    const clearFieldError = (fieldName) => {
        setErrors(prev => (prev[fieldName] ? { ...prev, [fieldName]: '' } : prev));
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

        if (!formData.userID) {
            setError('Please log in to submit an application.');
            return;
        }
        
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
                    router.visit('/user/application-status');
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
                            municipalities={municipalities}
                            barangays={barangays}
                            selectedRegionCode={selectedRegionCode}
                            selectedProvinceCode={selectedProvinceCode}
                            selectedMunicipalityCode={selectedMunicipalityCode}
                            selectedBarangayCode={selectedBarangayCode}
                            loadingRegion={loadingRegion}
                            loadingProvinces={loadingProvinces}
                            loadingMunicipalities={loadingMunicipalities}
                            loadingBarangays={loadingBarangays}
                            handleIPLeaderRegionChange={handleIPLeaderRegionChange}
                            handleIPLeaderProvinceChange={handleIPLeaderProvinceChange}
                            handleIPLeaderMunicipalityChange={handleIPLeaderMunicipalityChange}
                            handleIPLeaderBarangayChange={handleIPLeaderBarangayChange}
                        />
                    )}
                    {currentStep === 2 && (
                        <Step2_Father 
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            ethnicityOptions={ethnicityOptions}
                            loadingEthnicities={loadingEthnicities}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3_Mother 
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            ethnicityOptions={ethnicityOptions}
                            loadingEthnicities={loadingEthnicities}
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
