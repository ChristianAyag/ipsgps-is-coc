import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function AppLayout({ title, children }) {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user || null;

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    // Close dropdown when clicking outside
    const closeDropdown = () => {
        setIsProfileDropdownOpen(false);
    };

    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Sidebar - Fixed position */}
                <div className="w-64 fixed inset-y-0 left-0 bg-white/80 backdrop-blur-sm shadow-lg flex flex-col z-30">
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-center border-b border-gray-200 flex-shrink-0">
                        <Link href="/user/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            IPSGPS
                        </Link>
                    </div>

                    {/* Navigation - Scrollable if content overflows */}
                    <nav className="flex-1 px-3 py-6 overflow-y-auto">
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
                    <div className="h-4 flex-shrink-0"></div>
                </div>

                {/* Main Content - Offset for fixed sidebar */}
                <div className="flex-1 ml-64 overflow-auto">
                    {/* Top Navigation - Fixed position */}
                    <nav className="fixed top-0 right-0 left-64 bg-white/80 backdrop-blur-sm shadow-sm z-20">
                        <div className="px-6 py-4">
                            <div className="flex justify-between items-center">
                                {/* Empty div to maintain spacing when search is removed */}
                                <div className="flex-1"></div>

                                {/* Right Navigation */}
                                <div className="flex items-center space-x-4">
                                    {/* Notifications */}
                                    <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </button>

                                    {/* Profile Dropdown */}
                                    {user ? (
                                        <div className="relative">
                                            <button
                                                onClick={toggleProfileDropdown}
                                                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-all"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white">
                                                    {user.avatar || (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isProfileDropdownOpen && (
                                                <>
                                                    {/* Overlay to close dropdown when clicking outside */}
                                                    <div 
                                                        className="fixed inset-0 z-10" 
                                                        onClick={closeDropdown}
                                                    />
                                                    
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20 border border-gray-100">
                                                        <Link
                                                            href="/user/profile"
                                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                                                            onClick={closeDropdown}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            <span>My Profile</span>
                                                        </Link>
                                                        
                                                        <Link
                                                            href="/user/settings"
                                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
                                                            onClick={closeDropdown}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span>Settings</span>
                                                        </Link>
                                                        
                                                        <div className="border-t border-gray-100 my-1"></div>
                                                        
                                                        <button
                                                            onClick={() => {
                                                                closeDropdown();
                                                                handleLogout();
                                                            }}
                                                            className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                            </svg>
                                                            <span>Logout</span>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:shadow-lg transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Login</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Page Content - Offset for fixed top nav */}
                    <div className="p-6 mt-20">
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
            className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all ${
                active 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
            <span className="font-medium">{text}</span>
        </Link>
    );
}