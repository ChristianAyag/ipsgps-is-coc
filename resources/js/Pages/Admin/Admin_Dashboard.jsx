import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Sample admin user data
    const admin = {
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: '👨‍💼',
        role: 'Super Admin',
        joinDate: 'January 2026'
    };

    // Sample analytics stats
    const analytics = [
        { id: 1, name: 'Total Users', value: '2,847', icon: '👥', change: '+12%', changeType: 'increase' },
        { id: 2, name: 'Active Projects', value: '156', icon: '📊', change: '+8%', changeType: 'increase' },
        { id: 3, name: 'Revenue', value: '$47.2K', icon: '💰', change: '+23%', changeType: 'increase' },
        { id: 4, name: 'Server Uptime', value: '99.9%', icon: '⚡', change: '0.1%', changeType: 'decrease' },
    ];

    // Sample user management data
    const recentUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Pro', status: 'active', joinDate: '2026-02-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Enterprise', status: 'active', joinDate: '2026-02-14' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', plan: 'Basic', status: 'suspended', joinDate: '2026-02-12' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', plan: 'Pro', status: 'active', joinDate: '2026-02-10' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', plan: 'Basic', status: 'pending', joinDate: '2026-02-09' },
    ];

    // Sample projects overview
    const allProjects = [
        { id: 1, name: 'Website Redesign', owner: 'John Doe', progress: 75, status: 'active', team: 4, deadline: '2026-03-15' },
        { id: 2, name: 'Mobile App Development', owner: 'Jane Smith', progress: 45, status: 'active', team: 6, deadline: '2026-04-20' },
        { id: 3, name: 'API Integration', owner: 'Bob Johnson', progress: 90, status: 'review', team: 3, deadline: '2026-03-10' },
        { id: 4, name: 'User Research', owner: 'Alice Brown', progress: 30, status: 'on-hold', team: 2, deadline: '2026-03-25' },
        { id: 5, name: 'Marketing Campaign', owner: 'Charlie Wilson', progress: 60, status: 'active', team: 5, deadline: '2026-03-30' },
    ];

    // Sample system alerts
    const systemAlerts = [
        { id: 1, type: 'warning', message: 'Server load high (85%)', time: '10 minutes ago', icon: '⚠️' },
        { id: 2, type: 'info', message: 'New user registration spike', time: '1 hour ago', icon: '📈' },
        { id: 3, type: 'success', message: 'Backup completed successfully', time: '3 hours ago', icon: '✅' },
        { id: 4, type: 'error', message: 'Payment gateway timeout', time: '5 hours ago', icon: '❌' },
    ];

    // Sample revenue data
    const revenueData = [
        { month: 'Jan', amount: 28500 },
        { month: 'Feb', amount: 32000 },
        { month: 'Mar', amount: 29800 },
        { month: 'Apr', amount: 35600 },
        { month: 'May', amount: 38900 },
        { month: 'Jun', amount: 47200 },
    ];

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const maxRevenue = Math.max(...revenueData.map(d => d.amount));

    return (
        <>
            <Head title="Admin Dashboard" />
            
            <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Sidebar */}
                <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-center border-b border-gray-200">
                        <span className={`text-2xl font-bold text-gray-800 ${!isSidebarOpen && 'text-xl'}`}>
                            {isSidebarOpen ? 'AdminPanel' : 'AP'}
                        </span>
                    </div>

                    {/* Sidebar Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute left-64 top-20 -translate-x-1/2 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all border border-gray-300"
                        style={{ left: isSidebarOpen ? '16rem' : '5rem' }}
                    >
                        <span className="text-gray-700">
                            {isSidebarOpen ? '◀' : '▶'}
                        </span>
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6">
                        <div className="space-y-1">
                            <NavItem icon="📊" text="Overview" active={activeTab === 'overview'} isOpen={isSidebarOpen} onClick={() => setActiveTab('overview')} />
                            <NavItem icon="👥" text="Users" active={activeTab === 'users'} isOpen={isSidebarOpen} onClick={() => setActiveTab('users')} />
                            <NavItem icon="📁" text="Projects" active={activeTab === 'projects'} isOpen={isSidebarOpen} onClick={() => setActiveTab('projects')} />
                            <NavItem icon="💰" text="Revenue" active={activeTab === 'revenue'} isOpen={isSidebarOpen} onClick={() => setActiveTab('revenue')} />
                            <NavItem icon="⚙️" text="Settings" active={activeTab === 'settings'} isOpen={isSidebarOpen} onClick={() => setActiveTab('settings')} />
                            <NavItem icon="🔒" text="Security" active={activeTab === 'security'} isOpen={isSidebarOpen} onClick={() => setActiveTab('security')} />
                            <NavItem icon="📊" text="Reports" active={activeTab === 'reports'} isOpen={isSidebarOpen} onClick={() => setActiveTab('reports')} />
                        </div>
                    </nav>

                    {/* Admin Profile */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-white text-xl">
                                {admin.avatar}
                            </div>
                            {isSidebarOpen && (
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{admin.name}</p>
                                    <p className="text-xs text-gray-600">{admin.role}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    {/* Top Navigation */}
                    <nav className="bg-white shadow-sm border-b border-gray-200">
                        <div className="px-6 py-4">
                            <div className="flex justify-between items-center">
                                {/* Search Bar */}
                                <div className="flex-1 max-w-lg">
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-500">🔍</span>
                                        <input
                                            type="text"
                                            placeholder="Search users, projects, or settings..."
                                            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all text-gray-900 placeholder-gray-500"
                                        />
                                    </div>
                                </div>

                                {/* Right Navigation */}
                                <div className="flex items-center space-x-4">
                                    {/* System Alerts */}
                                    <button className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                        <span className="text-xl">🔔</span>
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </button>

                                    {/* Messages */}
                                    <button className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                                        <span className="text-xl">💬</span>
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                                    </button>

                                    {/* Admin Profile Dropdown */}
                                    <div className="relative">
                                        <button className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-all">
                                            <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-white">
                                                {admin.avatar}
                                            </div>
                                            <span className="text-sm font-medium text-gray-800">{admin.name}</span>
                                        </button>
                                    </div>

                                    {/* Logout Button */}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Dashboard Content */}
                    <div className="p-6">
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 text-white mb-6 shadow-lg">
                            <h1 className="text-2xl font-bold mb-2 text-white">Admin Dashboard, {admin.name}! 👋</h1>
                            <p className="text-gray-200">Here's your system overview and analytics.</p>
                        </div>

                        {/* Analytics Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {analytics.map((stat) => (
                                <div key={stat.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-3xl">{stat.icon}</span>
                                        <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                    <p className="text-gray-600 font-medium">{stat.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            {/* Recent Users */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                                        <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                                            View All Users →
                                        </Link>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-sm text-gray-700 border-b border-gray-200">
                                                    <th className="pb-3 font-semibold">User</th>
                                                    <th className="pb-3 font-semibold">Plan</th>
                                                    <th className="pb-3 font-semibold">Status</th>
                                                    <th className="pb-3 font-semibold">Joined</th>
                                                    <th className="pb-3 font-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentUsers.map((user) => (
                                                    <tr key={user.id} className="border-b border-gray-100">
                                                        <td className="py-3">
                                                            <div>
                                                                <p className="font-semibold text-gray-900">{user.name}</p>
                                                                <p className="text-sm text-gray-600">{user.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                                                                user.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                                                                user.plan === 'Pro' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {user.plan}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                                                                user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {user.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-sm text-gray-700">{user.joinDate}</td>
                                                        <td className="py-3">
                                                            <button className="text-gray-700 hover:text-gray-900 text-sm mr-2 font-medium">Edit</button>
                                                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">Suspend</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* System Alerts */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">System Alerts</h2>
                                    <div className="space-y-4">
                                        {systemAlerts.map((alert) => (
                                            <div key={alert.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    alert.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                                    alert.type === 'error' ? 'bg-red-100 text-red-700' :
                                                    alert.type === 'success' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {alert.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900 font-medium">{alert.message}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Projects Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* All Projects */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Projects Overview</h2>
                                    <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                                        Manage Projects →
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {allProjects.slice(0, 4).map((project) => (
                                        <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                                    <p className="text-sm text-gray-600">Owner: {project.owner}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    project.status === 'review' ? 'bg-blue-100 text-blue-800' :
                                                    project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 flex-1">
                                                    <span className="text-sm text-gray-700">Progress:</span>
                                                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                                                        <div 
                                                            className="h-full bg-gray-700 rounded-full"
                                                            style={{ width: `${project.progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm text-gray-700">👥 {project.team}</span>
                                                    <span className="text-sm text-gray-700">📅 {project.deadline}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Revenue Chart */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
                                    <span className="text-sm text-green-600 font-medium">+23% this month</span>
                                </div>
                                <div className="h-64 flex items-end justify-between space-x-2">
                                    {revenueData.map((data, index) => (
                                        <div key={index} className="flex flex-col items-center flex-1">
                                            <div 
                                                className="w-full bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-lg transition-all hover:from-gray-800 hover:to-gray-700"
                                                style={{ height: `${(data.amount / maxRevenue) * 180}px` }}
                                            ></div>
                                            <span className="text-xs text-gray-700 mt-2 font-medium">{data.month}</span>
                                            <span className="text-xs font-semibold text-gray-900">${(data.amount/1000).toFixed(1)}K</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Admin Actions */}
                        <div className="mt-6">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Admin Actions</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <QuickActionButton icon="👥" text="Add User" />
                                    <QuickActionButton icon="📊" text="Generate Report" />
                                    <QuickActionButton icon="⚙️" text="System Settings" />
                                    <QuickActionButton icon="💰" text="View Payments" />
                                    <QuickActionButton icon="🔒" text="Security Scan" />
                                    <QuickActionButton icon="📧" text="Send Newsletter" />
                                    <QuickActionButton icon="🗑️" text="Cleanup" />
                                    <QuickActionButton icon="📈" text="Analytics" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Sidebar Navigation Item Component
function NavItem({ icon, text, active, isOpen, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                active 
                    ? 'bg-gray-800 text-white font-medium shadow-md' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium'
            }`}
        >
            <span className="text-xl">{icon}</span>
            {isOpen && <span className="font-medium">{text}</span>}
        </button>
    );
}

// Quick Action Button Component
function QuickActionButton({ icon, text }) {
    return (
        <button className="p-4 rounded-xl transition-all bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200 font-medium">
            <span className="text-2xl block mb-2">{icon}</span>
            <span className="text-sm font-medium">{text}</span>
        </button>
    );
}