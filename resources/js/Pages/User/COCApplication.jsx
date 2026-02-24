import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

export default function COCApplication() {
    return (
        <AppLayout title="COC Application Process">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">COC Application Process</h1>
                <p className="text-gray-600">Complete your Certificate of Competency application</p>
            </div>

            {/* Application Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl mb-4">
                        1
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Requirements</h3>
                    <p className="text-gray-600 text-sm mb-4">Prepare and submit all required documents for your COC application.</p>
                    <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Requirements →
                    </Link>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xl mb-4">
                        2
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay Application Fee</h3>
                    <p className="text-gray-600 text-sm mb-4">Process your payment through our secure payment gateway.</p>
                    <Link href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Proceed to Payment →
                    </Link>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl mb-4">
                        3
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Interview</h3>
                    <p className="text-gray-600 text-sm mb-4">Book your preferred schedule for the COC interview.</p>
                    <Link href="#" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        Schedule Now →
                    </Link>
                </div>
            </div>

            {/* Application Form Section */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Application Form</h2>
                <p className="text-gray-600 mb-4">Fill out the form below to start your application.</p>
                
                {/* Add your form fields here */}
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
                        Submit Application
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}