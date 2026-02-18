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
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const togglePassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const toggleConfirmPassword = (e) => {
        e.preventDefault();
        setShowConfirmPassword(!showConfirmPassword);
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
                                    YourApp
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
                    <div className="w-full sm:max-w-md">
                        {/* Welcome Text */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
                            <p className="text-gray-600 text-lg">Join us today and get started</p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white shadow-xl rounded-2xl px-8 py-8">
                            <form onSubmit={submit}>
                                {/* Full Name Field */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="name" value="Full Name" className="text-gray-700 font-medium mb-2" />
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                            placeholder="John Doe"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Email Field */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="email" value="Email" className="text-gray-700 font-medium mb-2" />
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400">📧</span>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                            placeholder="you@example.com"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Password Field with Reveal Toggle */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-medium mb-2" />
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            className="mt-1 block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                            placeholder="Create a password"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            onContextMenu={(e) => e.preventDefault()}
                                            onCopy={(e) => e.preventDefault()}
                                            onPaste={(e) => e.preventDefault()}
                                            style={{
                                                WebkitTextSecurity: showPassword ? 'none' : 'disc',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePassword}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10 bg-white/50 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center"
                                            tabIndex="-1"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Confirm Password Field with Reveal Toggle */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-gray-700 font-medium mb-2" />
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
                                        <input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="mt-1 block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-all"
                                            placeholder="Confirm your password"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
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
                                    <InputError message={errors.password_confirmation} className="mt-2" />
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
                                            📝 I agree to the <Link href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> and <Link href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
                                        </span>
                                    </label>
                                    <InputError message={errors.terms} className="mt-2" />
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-center">
                                    <PrimaryButton
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-200 transition-all"
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

            {/* Global styles to hide browser's password reveal */}
            <style jsx>{`
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