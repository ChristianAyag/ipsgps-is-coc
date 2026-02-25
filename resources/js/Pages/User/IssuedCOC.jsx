import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function IssuedCOC() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedYear, setSelectedYear] = useState('2024');
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    // Sample issued COC data
    const issuedCOCs = [
        {
            id: 'COC-2024-001',
            name: 'Juan Dela Cruz',
            type: 'Certificate of Competency',
            dateIssued: '2024-02-15',
            dateExpiry: '2027-02-15',
            status: 'active',
            issuedBy: 'Maria Santos',
            qrCode: 'qr-001',
            document: 'coc-001.pdf'
        },
        {
            id: 'COC-2024-002',
            name: 'Maria Garcia',
            type: 'Certificate of Competency',
            dateIssued: '2024-02-10',
            dateExpiry: '2027-02-10',
            status: 'active',
            issuedBy: 'John Reyes',
            qrCode: 'qr-002',
            document: 'coc-002.pdf'
        },
        {
            id: 'COC-2024-003',
            name: 'Pedro Santos',
            type: 'Certificate of Competency',
            dateIssued: '2024-02-01',
            dateExpiry: '2027-02-01',
            status: 'active',
            issuedBy: 'Maria Santos',
            qrCode: 'qr-003',
            document: 'coc-003.pdf'
        },
        {
            id: 'COC-2023-045',
            name: 'Ana Lopez',
            type: 'Certificate of Competency',
            dateIssued: '2023-12-10',
            dateExpiry: '2026-12-10',
            status: 'active',
            issuedBy: 'John Reyes',
            qrCode: 'qr-045',
            document: 'coc-045.pdf'
        },
        {
            id: 'COC-2023-032',
            name: 'Jose Mendoza',
            type: 'Certificate of Competency',
            dateIssued: '2023-11-15',
            dateExpiry: '2026-11-15',
            status: 'expired',
            issuedBy: 'Maria Santos',
            qrCode: 'qr-032',
            document: 'coc-032.pdf'
        },
        {
            id: 'COC-2024-004',
            name: 'Elena Rodriguez',
            type: 'Certificate of Competency',
            dateIssued: '2024-01-20',
            dateExpiry: '2027-01-20',
            status: 'active',
            issuedBy: 'John Reyes',
            qrCode: 'qr-004',
            document: 'coc-004.pdf'
        }
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Available years for filter
    const years = ['2024', '2023', '2022', '2021'];

    // Status badge colors
    const getStatusColor = (status) => {
        const colors = {
            'active': 'bg-green-100 text-green-700 border-green-200',
            'expired': 'bg-red-100 text-red-700 border-red-200',
            'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Filter COCs based on search, status, and year
    const filteredCOCs = issuedCOCs.filter(coc => {
        const matchesSearch = coc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             coc.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || coc.status === filterStatus;
        const matchesYear = coc.id.includes(selectedYear);
        return matchesSearch && matchesStatus && matchesYear;
    });

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Toggle dropdown
    const toggleDropdown = (id, event) => {
        event.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    // Handle action click
    const handleAction = (action, coc, event) => {
        event.stopPropagation();
        setOpenDropdownId(null);
        // Add your action logic here (e.g., navigate to view page, download PDF, etc.)
        console.log(`${action} clicked for:`, coc);
    };

    // Statistics
    const totalIssued = issuedCOCs.length;
    const activeCOCs = issuedCOCs.filter(coc => coc.status === 'active').length;
    const expiredCOCs = issuedCOCs.filter(coc => coc.status === 'expired').length;
    const issuedThisYear = issuedCOCs.filter(coc => coc.id.includes('2024')).length;

    return (
        <AppLayout title="Issued COC">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Issued Certificates of Competency</h1>
                <p className="text-gray-600">View and manage all issued COC documents</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Total Issued</p>
                    <p className="text-3xl font-bold text-gray-900">{totalIssued}</p>
                </div>

                <div className="bg-green-50 rounded-xl shadow-lg p-4 border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Active COCs</p>
                    <p className="text-3xl font-bold text-green-700">{activeCOCs}</p>
                </div>

                <div className="bg-red-50 rounded-xl shadow-lg p-4 border-2 border-red-200">
                    <p className="text-sm text-gray-600 mb-1">Expired COCs</p>
                    <p className="text-3xl font-bold text-red-700">{expiredCOCs}</p>
                </div>

                <div className="bg-blue-50 rounded-xl shadow-lg p-4 border-2 border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Issued in {selectedYear}</p>
                    <p className="text-3xl font-bold text-blue-700">{issuedThisYear}</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by name or COC number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                        </select>
                        <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                            Export List
                        </button>
                    </div>
                </div>
            </div>

            {/* Issued COCs Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">COC Number</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Recipient Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date Issued</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Issued By</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCOCs.length > 0 ? (
                                filteredCOCs.map((coc) => (
                                    <tr key={coc.id} className="hover:bg-gray-50 transition-all relative">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">{coc.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900">{coc.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{coc.type}</td>
                                        <td className="px-6 py-4 text-gray-600">{formatDate(coc.dateIssued)}</td>
                                        <td className="px-6 py-4 text-gray-600">{formatDate(coc.dateExpiry)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(coc.status)}`}>
                                                {coc.status.charAt(0).toUpperCase() + coc.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{coc.issuedBy}</td>
                                        <td className="px-6 py-4 relative">
                                            {/* Actions button with 3-dots SVG */}
                                            <button
                                                onClick={(e) => toggleDropdown(coc.id, e)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center justify-center"
                                                title="Actions"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                                </svg>
                                            </button>
                                            
                                            {/* Dropdown Menu */}
                                            {openDropdownId === coc.id && (
                                                <div 
                                                    ref={dropdownRef}
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                                                    style={{ minWidth: '180px' }}
                                                >
                                                    <div className="py-1">
                                                        <button 
                                                            onClick={(e) => handleAction('View', coc, e)}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-2"
                                                        >
                                                            <span className="text-base">👁️</span> View Details
                                                        </button>
                                                        <button 
                                                            onClick={(e) => handleAction('Download PDF', coc, e)}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-2"
                                                        >
                                                            <span className="text-base">📄</span> Download PDF
                                                        </button>
                                                        <button 
                                                            onClick={(e) => handleAction('Print', coc, e)}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-2"
                                                        >
                                                            <span className="text-base">🖨️</span> Print
                                                        </button>
                                                        <button 
                                                            onClick={(e) => handleAction('Share', coc, e)}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-2"
                                                        >
                                                            <span className="text-base">🔗</span> Share
                                                        </button>
                                                        <div className="border-t border-gray-200 my-1"></div>
                                                        <button 
                                                            onClick={(e) => handleAction('Revoke', coc, e)}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center gap-2"
                                                        >
                                                            <span className="text-base">✖️</span> Revoke COC
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <div className="text-4xl mb-4 font-bold text-gray-300">📄</div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No COCs Found</h3>
                                        <p className="text-gray-600 mb-4">No issued COCs match your search criteria.</p>
                                        <button 
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilterStatus('all');
                                                setSelectedYear('2024');
                                            }}
                                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                                        >
                                            Clear Filters
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredCOCs.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCOCs.length}</span> of <span className="font-medium">{filteredCOCs.length}</span> results
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-all">
                                Previous
                            </button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                                1
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition-all">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}