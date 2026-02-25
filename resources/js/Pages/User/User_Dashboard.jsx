import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    // Sample user data
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '👤',
        plan: 'Pro',
        joinDate: 'January 2026'
    };

    // Sample stats
    const stats = [
        { id: 1, name: 'Total Projects', value: '12', icon: '📊', change: '+2', changeType: 'increase' },
        { id: 2, name: 'Active Tasks', value: '24', icon: '✅', change: '+5', changeType: 'increase' },
        { id: 3, name: 'Team Members', value: '8', icon: '👥', change: '+1', changeType: 'increase' },
        { id: 4, name: 'Completion Rate', value: '87%', icon: '📈', change: '+12%', changeType: 'increase' },
    ];

    // Sample recent activity
    const recentActivity = [
        { id: 1, action: 'Completed task', project: 'Website Redesign', time: '2 hours ago', icon: '✅' },
        { id: 2, action: 'Added new member', project: 'Mobile App', time: '5 hours ago', icon: '👤' },
        { id: 3, action: 'Updated deadline', project: 'Dashboard UI', time: '1 day ago', icon: '📅' },
        { id: 4, action: 'Created new project', project: 'API Integration', time: '2 days ago', icon: '🚀' },
    ];

    // Sample projects
    const projects = [
        { id: 1, name: 'Website Redesign', progress: 75, members: 4, dueDate: 'Mar 15', status: 'active', color: 'blue' },
        { id: 2, name: 'Mobile App Development', progress: 45, members: 6, dueDate: 'Apr 20', status: 'active', color: 'indigo' },
        { id: 3, name: 'API Integration', progress: 90, members: 3, dueDate: 'Mar 10', status: 'active', color: 'purple' },
        { id: 4, name: 'User Research', progress: 30, members: 2, dueDate: 'Mar 25', status: 'pending', color: 'orange' },
    ];

    return (
        <AppLayout title="Dashboard" user={user}>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6">
                <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
                <p className="text-blue-100">Here's what's happening with your projects today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat) => (
                    <div key={stat.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{stat.icon}</span>
                            <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-gray-600">{stat.name}</p>
                    </div>
                ))}
            </div>

            {/* Projects and Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Projects Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
                            <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-2 h-2 bg-${project.color}-500 rounded-full`}></div>
                                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                project.status === 'active' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500">Due {project.dueDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">Progress:</span>
                                            <div className="w-32 h-2 bg-gray-200 rounded-full">
                                                <div 
                                                    className={`h-full bg-${project.color}-500 rounded-full`}
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">👥 {project.members}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">
                                            <span className="font-medium">{activity.action}</span>{' '}
                                            in <span className="font-medium">{activity.project}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Quick Action Button Component
function QuickActionButton({ icon, text, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
        green: 'bg-green-50 text-green-600 hover:bg-green-100',
        purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
        orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    };

    return (
        <button className={`p-4 rounded-xl transition-all ${colorClasses[color]}`}>
            <span className="text-2xl block mb-2">{icon}</span>
            <span className="text-sm font-medium">{text}</span>
        </button>
    );
}