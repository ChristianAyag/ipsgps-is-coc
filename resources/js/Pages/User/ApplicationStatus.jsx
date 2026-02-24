import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ApplicationStatus() {
    // Sample application data
    const [applications, setApplications] = useState([
        { 
            id: 'COC-2024-001', 
            type: 'Certificate of Competency',
            dateSubmitted: '2024-02-15',
            status: 'under-review',
            progress: 60,
            nextStep: 'Document Verification',
            remarks: 'All documents received, under verification'
        },
        { 
            id: 'COC-2024-002', 
            type: 'Certificate of Competency',
            dateSubmitted: '2024-02-10',
            status: 'approved',
            progress: 100,
            nextStep: 'Ready for Release',
            remarks: 'Application approved. COC ready for claiming.'
        },
        { 
            id: 'COC-2024-003', 
            type: 'Certificate of Competency',
            dateSubmitted: '2024-02-01',
            status: 'pending',
            progress: 25,
            nextStep: 'Submit Additional Requirements',
            remarks: 'Additional documents required: Birth certificate'
        },
        { 
            id: 'COC-2024-004', 
            type: 'Certificate of Competency',
            dateSubmitted: '2024-01-28',
            status: 'rejected',
            progress: 0,
            nextStep: 'Reapply',
            remarks: 'Incomplete requirements. Please check email for details.'
        },
    ]);

    // Status badge color mapping
    const getStatusColor = (status) => {
        const colors = {
            'approved': 'bg-green-100 text-green-700 border-green-200',
            'under-review': 'bg-blue-100 text-blue-700 border-blue-200',
            'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'rejected': 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Card colors - Vibrant bold
    const getCardColor = (type) => {
        const colors = {
            'total': 'bg-white border-gray-300',
            'approved': 'bg-green-100 border-green-400',
            'under-review': 'bg-blue-100 border-blue-400',
            'pending': 'bg-orange-100 border-orange-400',
            'rejected': 'bg-red-100 border-red-400'
        };
        return colors[type] || 'bg-white border-gray-300';
    };

    // Text colors for the numbers
    const getNumberColor = (type) => {
        const colors = {
            'total': 'text-gray-900',
            'approved': 'text-green-800',
            'under-review': 'text-blue-800',
            'pending': 'text-orange-800',
            'rejected': 'text-red-800'
        };
        return colors[type] || 'text-gray-900';
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <AppLayout title="Application Status">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Application Status</h1>
                <p className="text-gray-600">Track the progress of your COC applications</p>
            </div>

            {/* Summary Cards - All in one row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {/* Total Applications */}
                <div className={`${getCardColor('total')} rounded-xl shadow-lg p-4 border-2`}>
                    <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                    <p className={`text-3xl font-bold ${getNumberColor('total')}`}>{applications.length}</p>
                </div>

                {/* Approved */}
                <div className={`${getCardColor('approved')} rounded-xl shadow-lg p-4 border-2`}>
                    <p className="text-sm text-gray-600 mb-1">Approved</p>
                    <p className={`text-3xl font-bold ${getNumberColor('approved')}`}>
                        {applications.filter(app => app.status === 'approved').length}
                    </p>
                </div>

                {/* Under Review */}
                <div className={`${getCardColor('under-review')} rounded-xl shadow-lg p-4 border-2`}>
                    <p className="text-sm text-gray-600 mb-1">Under Review</p>
                    <p className={`text-3xl font-bold ${getNumberColor('under-review')}`}>
                        {applications.filter(app => app.status === 'under-review').length}
                    </p>
                </div>

                {/* Pending */}
                <div className={`${getCardColor('pending')} rounded-xl shadow-lg p-4 border-2`}>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className={`text-3xl font-bold ${getNumberColor('pending')}`}>
                        {applications.filter(app => app.status === 'pending').length}
                    </p>
                </div>

                {/* Rejected - Now inline with other cards */}
                <div className={`${getCardColor('rejected')} rounded-xl shadow-lg p-4 border-2`}>
                    <p className="text-sm text-gray-600 mb-1">Rejected</p>
                    <p className={`text-3xl font-bold ${getNumberColor('rejected')}`}>
                        {applications.filter(app => app.status === 'rejected').length}
                    </p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by Application ID or Type..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="under-review">Under Review</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Application ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date Submitted</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progress</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Next Step</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {applications.map((application) => (
                                <tr key={application.id} className="hover:bg-gray-50 transition-all">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{application.id}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{application.type}</td>
                                    <td className="px-6 py-4 text-gray-600">{formatDate(application.dateSubmitted)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        application.status === 'approved' ? 'bg-green-500' :
                                                        application.status === 'rejected' ? 'bg-red-500' :
                                                        application.status === 'under-review' ? 'bg-blue-500' :
                                                        'bg-yellow-500'
                                                    }`}
                                                    style={{ width: `${application.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{application.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{application.nextStep}</span>
                                        {application.remarks && (
                                            <p className="text-xs text-gray-500 mt-1">{application.remarks}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium">
                                                View
                                            </button>
                                            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-all text-sm font-medium">
                                                Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Timeline Guide */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Application Process Timeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mx-auto mb-2">
                            1
                        </div>
                        <h3 className="font-semibold text-gray-900">Submit Requirements</h3>
                        <p className="text-sm text-gray-600">Initial submission of documents</p>
                        <p className="text-xs text-gray-500 mt-1">1-2 days</p>
                    </div>
                    
                    <div className="text-center p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold mx-auto mb-2">
                            2
                        </div>
                        <h3 className="font-semibold text-gray-900">Under Review</h3>
                        <p className="text-sm text-gray-600">Document verification</p>
                        <p className="text-xs text-gray-500 mt-1">3-5 days</p>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mx-auto mb-2">
                            3
                        </div>
                        <h3 className="font-semibold text-gray-900">Interview/Schedule</h3>
                        <p className="text-sm text-gray-600">Schedule and attend interview</p>
                        <p className="text-xs text-gray-500 mt-1">1 day</p>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mx-auto mb-2">
                            4
                        </div>
                        <h3 className="font-semibold text-gray-900">Approval & Release</h3>
                        <p className="text-sm text-gray-600">COC ready for claiming</p>
                        <p className="text-xs text-gray-500 mt-1">2-3 days</p>
                    </div>
                </div>
            </div>

        </AppLayout>
    );
}