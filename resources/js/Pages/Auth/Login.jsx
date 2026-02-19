import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';

export default function Login({ status, canResetPassword }) {
    const [isLogin, setIsLogin] = useState(true);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Update login form to use userID (matches your model's primary key)
    const { data, setData, post, processing, errors, reset } = useForm({
        userID: '', // Primary key field
        userPassword: '', // Changed to match your model's field name
        remember: false,
    });

    const registerForm = useForm({
        userID: '', // Custom user ID
        firstName: '',
        middleName: '',
        surName: '',
        userEmail: '', // Changed to match your model's field name
        userPassword: '', // Changed to match your model's field name
        userPassword_confirmation: '', // For password confirmation
        userAccess: 'applicant', // Default role
        userOffice: '',
        terms: false,
    });

    useEffect(() => {
        return () => {
            reset('userPassword');
        };
    }, []);

    // Reset password visibility when switching tabs
    useEffect(() => {
        setShowLoginPassword(false);
        setShowRegisterPassword(false);
        setShowConfirmPassword(false);
    }, [isLogin]);

    const submitLogin = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const submitRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('register'));
    };

    const toggleLoginPassword = (e) => {
        e.preventDefault();
        setShowLoginPassword(!showLoginPassword);
    };

    const toggleRegisterPassword = (e) => {
        e.preventDefault();
        setShowRegisterPassword(!showRegisterPassword);
    };

    const toggleConfirmPassword = (e) => {
        e.preventDefault();
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <Head title={isLogin ? "Log in" : "Sign Up"} />
            
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header with Logo */}
                <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            {/* Simple Text Logo */}
                            <div className="flex items-center">
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    YourApp
                                </span>
                            </div>
                            {/* Navigation Buttons */}
                            <div className="flex items-center space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(true)}
                                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                        isLogin 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    Log In
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(false)}
                                    className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                        !isLogin 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                    <div className="w-full sm:max-w-md">
                        {/* Welcome Text */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h1>
                            <p className="text-gray-600 text-lg">
                                {isLogin ? 'Sign in with your User ID' : 'Join us today'}
                            </p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white shadow-xl rounded-2xl px-8 py-8">
                            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                            {/* Login Form */}
                            {isLogin ? (
                                <form onSubmit={submitLogin}>
                                    {/* User ID Field */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="userID" value="User ID" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                                            <TextInput
                                                id="userID"
                                                type="text"
                                                name="userID"
                                                value={data.userID}
                                                className="mt-1 block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="Enter your User ID"
                                                autoComplete="username"
                                                isFocused={true}
                                                onChange={(e) => setData('userID', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.userID} className="mt-2" />
                                    </div>

                                    {/* Password Field */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="userPassword" value="Password" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
                                            <input
                                                id="userPassword"
                                                type={showLoginPassword ? "text" : "password"}
                                                name="userPassword"
                                                value={data.userPassword}
                                                className="mt-1 block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="Enter your password"
                                                autoComplete="current-password"
                                                onChange={(e) => setData('userPassword', e.target.value)}
                                                onContextMenu={(e) => e.preventDefault()}
                                                onCopy={(e) => e.preventDefault()}
                                                onPaste={(e) => e.preventDefault()}
                                                style={{
                                                    WebkitTextSecurity: showLoginPassword ? 'none' : 'disc',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleLoginPassword}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10 bg-white/50 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center"
                                                tabIndex="-1"
                                            >
                                                {showLoginPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        <InputError message={errors.userPassword} className="mt-2" />
                                    </div>

                                    {/* Remember Me and Forgot Password */}
                                    <div className="flex items-center justify-between mb-8">
                                        <label className="flex items-center">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Forgot your password?
                                            </Link>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-center">
                                        <PrimaryButton
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 transition-all"
                                            disabled={processing}
                                        >
                                            Log In
                                        </PrimaryButton>
                                    </div>
                                </form>
                            ) : (
                                /* Registration Form */
                                <form onSubmit={submitRegister}>
                                    {/* User ID Field */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="register-userID" value="User ID" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🆔</span>
                                            <TextInput
                                                id="register-userID"
                                                type="text"
                                                name="userID"
                                                value={registerForm.data.userID}
                                                className="mt-1 block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="Choose a User ID"
                                                autoComplete="username"
                                                isFocused={true}
                                                onChange={(e) => registerForm.setData('userID', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={registerForm.errors.userID} className="mt-2" />
                                    </div>

                                    {/* First Name Field */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="firstName" value="First Name" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                                            <TextInput
                                                id="firstName"
                                                name="firstName"
                                                value={registerForm.data.firstName}
                                                className="mt-1 block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="First Name"
                                                autoComplete="given-name"
                                                onChange={(e) => registerForm.setData('firstName', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={registerForm.errors.firstName} className="mt-2" />
                                    </div>

                                    {/* Middle Name Field (Optional) */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="middleName" value="Middle Name (Optional)" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                                            <TextInput
                                                id="middleName"
                                                name="middleName"
                                                value={registerForm.data.middleName}
                                                className="mt-1 block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="Middle Name"
                                                autoComplete="additional-name"
                                                onChange={(e) => registerForm.setData('middleName', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={registerForm.errors.middleName} className="mt-2" />
                                    </div>

                                    {/* Surname Field */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="surName" value="Surname" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                                            <TextInput
                                                id="surName"
                                                name="surName"
                                                value={registerForm.data.surName}
                                                className="mt-1 block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="Surname"
                                                autoComplete="family-name"
                                                onChange={(e) => registerForm.setData('surName', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={registerForm.errors.surName} className="mt-2" />
                                    </div>

                                    {/* Email Field */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="userEmail" value="Email Address" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">📧</span>
                                            <TextInput
                                                id="userEmail"
                                                type="email"
                                                name="userEmail"
                                                value={registerForm.data.userEmail}
                                                className="mt-1 block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                                onChange={(e) => registerForm.setData('userEmail', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={registerForm.errors.userEmail} className="mt-2" />
                                    </div>

                                    {/* Office Field */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="userOffice" value="Office/Department" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🏢</span>
                                            <TextInput
                                                id="userOffice"
                                                type="text"
                                                name="userOffice"
                                                value={registerForm.data.userOffice}
                                                className="mt-1 block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="Your Office/Department"
                                                onChange={(e) => registerForm.setData('userOffice', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={registerForm.errors.userOffice} className="mt-2" />
                                    </div>

                                    {/* Password Field */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="register-userPassword" value="Password" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
                                            <input
                                                id="register-userPassword"
                                                type={showRegisterPassword ? "text" : "password"}
                                                name="userPassword"
                                                value={registerForm.data.userPassword}
                                                className="mt-1 block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="Create a password"
                                                autoComplete="new-password"
                                                onChange={(e) => registerForm.setData('userPassword', e.target.value)}
                                                onContextMenu={(e) => e.preventDefault()}
                                                onCopy={(e) => e.preventDefault()}
                                                onPaste={(e) => e.preventDefault()}
                                                style={{
                                                    WebkitTextSecurity: showRegisterPassword ? 'none' : 'disc',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleRegisterPassword}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10 bg-white/50 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center"
                                                tabIndex="-1"
                                            >
                                                {showRegisterPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        <InputError message={registerForm.errors.userPassword} className="mt-2" />
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="mb-6">
                                        <InputLabel htmlFor="userPassword_confirmation" value="Confirm Password" className="text-gray-700 font-medium mb-2" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
                                            <input
                                                id="userPassword_confirmation"
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="userPassword_confirmation"
                                                value={registerForm.data.userPassword_confirmation}
                                                className="mt-1 block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                                placeholder="Confirm your password"
                                                autoComplete="new-password"
                                                onChange={(e) => registerForm.setData('userPassword_confirmation', e.target.value)}
                                                onContextMenu={(e) => e.preventDefault()}
                                                onCopy={(e) => e.preventDefault()}
                                                onPaste={(e) => e.preventDefault()}
                                                style={{
                                                    WebkitTextSecurity: showConfirmPassword ? 'none' : 'disc',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleConfirmPassword}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10 bg-white/50 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center"
                                                tabIndex="-1"
                                            >
                                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                            </button>
                                        </div>
                                        <InputError message={registerForm.errors.userPassword_confirmation} className="mt-2" />
                                    </div>

                                    {/* Hidden userAccess field (defaults to 'applicant') */}
                                    <input
                                        type="hidden"
                                        name="userAccess"
                                        value={registerForm.data.userAccess}
                                    />

                                    {/* Terms Agreement */}
                                    <div className="mb-8">
                                        <label className="flex items-center">
                                            <Checkbox
                                                name="terms"
                                                checked={registerForm.data.terms}
                                                onChange={(e) => registerForm.setData('terms', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">
                                                📝 I agree to the <Link href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> and <Link href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
                                            </span>
                                        </label>
                                        <InputError message={registerForm.errors.terms} className="mt-2" />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-center">
                                        <PrimaryButton
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 transition-all"
                                            disabled={registerForm.processing}
                                        >
                                            Create Account
                                        </PrimaryButton>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white/80 backdrop-blur-sm py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-500">
                            © 2026 YourApp. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Fixed style section - removed jsx attribute */}
            <style>{`
                input[type="password"]::-ms-reveal,
                input[type="password"]::-ms-clear,
                input[type="password"]::-webkit-textfield-decoration-container,
                input[type="password"]::-webkit-credentials-auto-fill-button {
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