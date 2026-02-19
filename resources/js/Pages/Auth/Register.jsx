import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registrationStep, setRegistrationStep] = useState(1);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        // Step 1 fields - Updated to match database schema (userID removed - auto-generated)
        firstName: '', // Changed from first_name to firstName
        middleName: '', // Changed from middle_name to middleName
        surName: '', // Changed from last_name to surName
        suffix: '',
        userEmail: '', // Changed from email to userEmail
        userPassword: '', // Changed from password to userPassword
        userPassword_confirmation: '', // Changed from password_confirmation to userPassword_confirmation
        
        // Step 2 fields
        birthDate: '',
        userAge: '',
        userEthnicity: '',
        userProvince: '',
        userMunicipality: '',
        userBarangay: '',
        userPurpose: '',
        userAccess: 'applicant', // Added userAccess with default value
        userOffice: '', // Added userOffice field
        terms: false,
    });

    // Options for combo boxes
    const ethnicityOptions = [
        'Tagalog',
        'Cebuano',
        'Ilocano',
        'Bicolano',
        'Hiligaynon',
        'Waray',
        'Kapampangan',
        'Pangasinense',
        'Maranao',
        'Maguindanao',
        'Tausug',
        'Other'
    ];

    const provinceOptions = [
        'Metro Manila',
        'Bulacan',
        'Cavite',
        'Laguna',
        'Rizal',
        'Pampanga',
        'Batangas',
        'Quezon',
        'Nueva Ecija',
        'Tarlac',
        'Cebu',
        'Davao del Sur',
        'Other'
    ];

    const municipalityOptions = [
        'Manila',
        'Quezon City',
        'Caloocan',
        'Makati',
        'Taguig',
        'Pasig',
        'Mandaluyong',
        'San Juan',
        'Marikina',
        'Pasay',
        'Paranaque',
        'Las Pinas',
        'Muntinlupa',
        'Valenzuela',
        'Malabon',
        'Navotas',
        'Other'
    ];

    const barangayOptions = [
        'Barangay 1',
        'Barangay 2',
        'Barangay 3',
        'Barangay 4',
        'Barangay 5',
        'Barangay 6',
        'Barangay 7',
        'Barangay 8',
        'Barangay 9',
        'Barangay 10',
        'Other'
    ];

    useEffect(() => {
        return () => {
            reset('userPassword', 'userPassword_confirmation');
        };
    }, []);

    const handleNextStep = (e) => {
        e.preventDefault();
        setRegistrationStep(2);
    };

    const handlePreviousStep = (e) => {
        e.preventDefault();
        setRegistrationStep(1);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onError: (errors) => {
                console.log('Registration errors:', errors);
            },
        });
    };

    const togglePassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const toggleConfirmPassword = (e) => {
        e.preventDefault();
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Render registration steps
    const renderRegistrationStep = () => {
        switch(registrationStep) {
            case 1:
                return (
                    <form onSubmit={handleNextStep}>
                        {/* Step 1 Indicator */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-blue-600">Step 1 of 2</span>
                                <span className="text-xs text-gray-500">Basic Information</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                            </div>
                        </div>

                        {/* First Row: First, Middle, Last Name */}
                        <div className="mb-4">
                            <div className="grid grid-cols-12 gap-3">
                                {/* First Name */}
                                <div className="col-span-12 sm:col-span-4">
                                    <InputLabel htmlFor="firstName" value="First Name" className="text-gray-700 font-medium mb-2" />
                                    <TextInput
                                        id="firstName"
                                        name="firstName"
                                        value={data.firstName}
                                        className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                        placeholder="First"
                                        autoComplete="given-name"
                                        isFocused={true}
                                        onChange={(e) => setData('firstName', e.target.value)}
                                    />
                                    <InputError message={errors.firstName} className="mt-2" />
                                </div>

                                {/* Middle Name */}
                                <div className="col-span-12 sm:col-span-4">
                                    <InputLabel htmlFor="middleName" value="Middle Name" className="text-gray-700 font-medium mb-2" />
                                    <TextInput
                                        id="middleName"
                                        name="middleName"
                                        value={data.middleName}
                                        className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                        placeholder="Middle"
                                        autoComplete="additional-name"
                                        onChange={(e) => setData('middleName', e.target.value)}
                                    />
                                    <InputError message={errors.middleName} className="mt-2" />
                                </div>

                                {/* Last Name */}
                                <div className="col-span-12 sm:col-span-4">
                                    <InputLabel htmlFor="surName" value="Last Name" className="text-gray-700 font-medium mb-2" />
                                    <TextInput
                                        id="surName"
                                        name="surName"
                                        value={data.surName}
                                        className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                        placeholder="Last"
                                        autoComplete="family-name"
                                        onChange={(e) => setData('surName', e.target.value)}
                                    />
                                    <InputError message={errors.surName} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Second Row: Suffix */}
                        <div className="mb-6">
                            <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-12 sm:col-span-4">
                                    <InputLabel htmlFor="suffix" value="Suffix" className="text-gray-700 font-medium mb-2" />
                                    <TextInput
                                        id="suffix"
                                        name="suffix"
                                        value={data.suffix}
                                        className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                        placeholder="Jr., Sr., III, etc."
                                        onChange={(e) => setData('suffix', e.target.value)}
                                    />
                                    <InputError message={errors.suffix} className="mt-2" />
                                </div>
                                <div className="col-span-12 sm:col-span-8">
                                    {/* Empty space */}
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="mb-6">
                            <div className="w-full sm:w-3/4">
                                <InputLabel htmlFor="userEmail" value="Email Address" className="text-gray-700 font-medium mb-2" />
                                <div className="relative">
                                    <TextInput
                                        id="userEmail"
                                        type="email"
                                        name="userEmail"
                                        value={data.userEmail}
                                        className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        onChange={(e) => setData('userEmail', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.userEmail} className="mt-2" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <div className="w-full sm:w-3/4">
                                <InputLabel htmlFor="userPassword" value="userPassword" className="text-gray-700 font-medium mb-2" />
                                <div className="relative">
                                    <input
                                        id="userPassword"
                                        type={showPassword ? "text" : "password"}
                                        name="userPassword"
                                        value={data.userPassword}
                                        className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all pr-12"
                                        placeholder="Create a password"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('userPassword', e.target.value)}
                                        onContextMenu={(e) => e.preventDefault()}
                                        onCopy={(e) => e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10 bg-transparent p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        tabIndex="-1"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.userPassword} className="mt-2" />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-6">
                            <div className="w-full sm:w-3/4">
                                <InputLabel htmlFor="userPassword_confirmation" value="Confirm Password" className="text-gray-700 font-medium mb-2" />
                                <div className="relative">
                                    <input
                                        id="userPassword_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="userPassword_confirmation"
                                        value={data.userPassword_confirmation}
                                        className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all pr-12"
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('userPassword_confirmation', e.target.value)}
                                        onContextMenu={(e) => e.preventDefault()}
                                        onCopy={(e) => e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10 bg-transparent p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        tabIndex="-1"
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.userPassword_confirmation} className="mt-2" />
                            </div>
                        </div>

                        {/* Hidden userAccess field (defaults to 'applicant') */}
                        <input
                            type="hidden"
                            name="userAccess"
                            value={data.userAccess}
                        />

                        {/* Hidden userOffice field (optional) */}
                        <input
                            type="hidden"
                            name="userOffice"
                            value={data.userOffice}
                        />

                        {/* Next Button */}
                        <div className="flex items-center justify-center">
                            <PrimaryButton
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 transition-all"
                                disabled={processing}
                            >
                                Next Step →
                            </PrimaryButton>
                        </div>

                        {/* Login Link */}
                        <div className="text-center mt-6">
                            <span className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href={route('login')} className="text-blue-600 hover:text-blue-800 font-medium">
                                    Log in
                                </Link>
                            </span>
                        </div>
                    </form>
                );
            
            case 2:
                return (
                    <form onSubmit={submit}>
                        {/* Step 2 Indicator */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-blue-600">Step 2 of 2</span>
                                <span className="text-xs text-gray-500">Additional Details</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        {/* Birth Date and Age in one row */}
                        <div className="grid grid-cols-12 gap-4 mb-6">
                            {/* Birth Date */}
                            <div className="col-span-12 sm:col-span-6">
                                <InputLabel htmlFor="birthDate" value="birthDate" className="text-gray-700 font-medium mb-2" />
                                <TextInput
                                    id="birthDate"
                                    type="date"
                                    name="birthDate"
                                    value={data.birthDate}
                                    className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                    onChange={(e) => setData('birthDate', e.target.value)}
                                />
                                <InputError message={errors.birthDate} className="mt-2" />
                            </div>

                            {/* Age (manual input) */}
                            <div className="col-span-12 sm:col-span-6">
                                <InputLabel htmlFor="userAge" value="userAge" className="text-gray-700 font-medium mb-2" />
                                <TextInput
                                    id="userAge"
                                    type="number"
                                    name="userAge"
                                    value={data.age}
                                    className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                    placeholder="Enter your age"
                                    min="1"
                                    max="120"
                                    onChange={(e) => setData('userAge', e.target.value)}
                                />
                                <InputError message={errors.userAge} className="mt-2" />
                            </div>
                        </div>

                        {/* Ethnicity */}
                        <div className="mb-6">
                            <InputLabel htmlFor="userEthnicity" value="userEthnicity" className="text-gray-700 font-medium mb-2" />
                            <select
                                id="userEthnicity"
                                name="userEthnicity"
                                value={data.ethnicity}
                                onChange={(e) => setData('userEthnicity', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all appearance-none bg-white"
                            >
                                <option value="">Select ethnicity</option>
                                {ethnicityOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <InputError message={errors.userEthnicity} className="mt-2" />
                        </div>

                        {/* Province */}
                        <div className="mb-6">
                            <InputLabel htmlFor="userProvince" value="userProvince" className="text-gray-700 font-medium mb-2" />
                            <select
                                id="userProvince"
                                name="userProvince"
                                value={data.province}
                                onChange={(e) => setData('userProvince', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all appearance-none bg-white"
                            >
                                <option value="">Select province</option>
                                {provinceOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <InputError message={errors.province} className="mt-2" />
                        </div>

                        {/* Municipality */}
                        <div className="mb-6">
                            <InputLabel htmlFor="userMunicipality" value="userMunicipality" className="text-gray-700 font-medium mb-2" />
                            <select
                                id="userMunicipality"
                                name="userMunicipality"
                                value={data.municipality}
                                onChange={(e) => setData('userMunicipality', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all appearance-none bg-white"
                            >
                                <option value="">Select municipality</option>
                                {municipalityOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <InputError message={errors.userMunicipality} className="mt-2" />
                        </div>

                        {/* Barangay */}
                        <div className="mb-6">
                            <InputLabel htmlFor="userBarangay" value="userBarangay" className="text-gray-700 font-medium mb-2" />
                            <select
                                id="userBarangay"
                                name="userBarangay"
                                value={data.barangay}
                                onChange={(e) => setData('userBarangay', e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all appearance-none bg-white"
                            >
                                <option value="">Select barangay</option>
                                {barangayOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <InputError message={errors.userBarangay} className="mt-2" />
                        </div>

                        {/* Purpose */}
                        <div className="mb-6">
                            <InputLabel htmlFor="userPurpose" value="userPurpose" className="text-gray-700 font-medium mb-2" />
                            <TextInput
                                id="userPurpose"
                                type="text"
                                name="userPurpose"
                                value={data.purpose}
                                className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                placeholder="What is your purpose?"
                                onChange={(e) => setData('userPurpose', e.target.value)}
                            />
                            <InputError message={errors.userPurpose} className="mt-2" />
                        </div>

                        {/* Terms Agreement */}
                        <div className="mb-8">
                            <label className="flex items-center">
                                <Checkbox
                                    name="terms"
                                    checked={data.terms}
                                    onChange={(e) => setData('terms', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    I agree to the <Link href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> and <Link href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
                                </span>
                            </label>
                            <InputError message={errors.terms} className="mt-2" />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="w-1/3 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg rounded-xl transition-all"
                            >
                                ← Back
                            </button>
                            
                            <PrimaryButton
                                className="w-2/3 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 transition-all"
                                disabled={processing}
                            >
                                Create Account
                            </PrimaryButton>
                        </div>

                        {/* Login Link */}
                        <div className="text-center mt-6">
                            <span className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href={route('login')} className="text-blue-600 hover:text-blue-800 font-medium">
                                    Log in
                                </Link>
                            </span>
                        </div>
                    </form>
                );
            
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Sign Up" />
            
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header with Logo */}
                <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Simple Text Logo */}
                            <div className="flex items-center">
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    IPSGPS
                                </span>
                            </div>
                            {/* Navigation Buttons */}
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={route('login')}
                                    className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 bg-blue-600 text-white shadow-lg shadow-blue-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                    <div className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
                        {/* Welcome Text */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {registrationStep === 1 ? 'Create Account' : 'Additional Details'}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {registrationStep === 1 
                                    ? 'Join us today and get started' 
                                    : 'Almost there! Tell us more about yourself'
                                }
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white shadow-xl rounded-2xl px-8 py-8">
                            {renderRegistrationStep()}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white/80 backdrop-blur-sm py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-500">
                            © 2026 IPSGPS. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Global styles to hide browser's password reveal */}
            <style>{`
                input[type="password"]::-ms-reveal,
                input[type="password"]::-ms-clear,
                input[type="password"]::-webkit-textfield-decoration-container,
                input[type="password"]::-webkit-credentials-auto-fill-button,
                input[type="password"]::-webkit-contacts-auto-fill-button,
                input[type="password"]::-webkit-strong-password-auto-fill-button {
                    display: none !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                    width: 0 !important;
                    height: 0 !important;
                    opacity: 0 !important;
                }
                
                input[type="password"] {
                    -webkit-appearance: none;
                    appearance: none;
                }
            `}</style>
        </>
    );
}