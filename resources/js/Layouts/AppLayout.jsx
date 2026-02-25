import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function AppLayout({ title, children, user = null }) {
    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Sidebar - Fixed width, no collapsing */}
                <div className="w-64 bg-white/80 backdrop-blur-sm shadow-lg flex flex-col">
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-center border-b border-gray-200">
                        <Link href="/user/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            YourApp
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6">
                        <div className="space-y-2">
                            <NavLink 
                                href="/user/dashboard"
                                text="Home" 
                                active={route().current('user.dashboard')} 
                            />
                            
                            <NavLink 
                                href="/user/coc-application"
                                text="COC Application Process" 
                                active={route().current('user.coc-application')} 
                            />
                            
                            <NavLink 
                                href="/user/application-status"
                                text="Application Status" 
                                active={route().current('user.application-status')} 
                            />
                            
                            <NavLink 
                                href="/user/issued-coc"
                                text="Issued COC" 
                                active={route().current('user.issued-coc')} 
                            />
                            
                            <NavLink 
                                href="/user/ip-groups"
                                text="IP Groups" 
                                active={route().current('user.ip-groups')} 
                            />
                            
                            <NavLink 
                                href="/user/faqs"
                                text="FAQs" 
                                active={route().current('user.faqs')} 
                            />
                            
                            <NavLink 
                                href="/user/downloadable-forms"
                                text="Downloadable Forms & Requirements" 
                                active={route().current('user.downloadable-forms')} 
                            />
                            
                            <NavLink 
                                href="/user/ncip-admin-order"
                                text="NCIP Admin Order No. 2" 
                                active={route().current('user.ncip-admin-order')} 
                            />
                        </div>
                    </nav>

                    {/* Empty div to maintain spacing */}
                    <div className="h-4"></div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    {/* Top Navigation */}
                    <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
                        <div className="px-6 py-4">
                            <div className="flex justify-between items-center">
                                {/* Empty div to maintain spacing when search is removed */}
                                <div className="flex-1"></div>

                                {/* Right Navigation */}
                                <div className="flex items-center space-x-4">
                                    {/* Notifications */}
                                    <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                        <span className="text-xl">🔔</span>
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </button>

                                    {/* Messages */}
                                    <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                        <span className="text-xl">💬</span>
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                                    </button>

                                    {/* Profile Dropdown */}
                                    {user ? (
                                        <>
                                            <div className="relative">
                                                <button className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-all">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white">
                                                        {user.avatar || '👤'}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                                </button>
                                            </div>

                                            {/* Logout Button */}
                                            <button
                                                onClick={handleLogout}
                                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:shadow-lg transition-all"
                                        >
                                            Login
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Page Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

// Sidebar Navigation Link Component
function NavLink({ href, text, active }) {
    return (
        <Link
            href={href}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                active 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
            <span className="font-medium">{text}</span>
        </Link>
    );
}