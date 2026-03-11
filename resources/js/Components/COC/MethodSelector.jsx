import React from 'react';

export default function MethodSelector({ selectedMethod, onSelect }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                </div>
                <h2 className="text-xl font-bold text-gray-900">Choose Upload Method</h2>
            </div>
            
            <p className="text-gray-600 mb-6">How would you like to provide your supporting document?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload File Option */}
                <div 
                    onClick={() => onSelect('upload')}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        selectedMethod === 'upload' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                >
                    <div className="text-center">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                            selectedMethod === 'upload' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                            <svg className={`w-10 h-10 ${
                                selectedMethod === 'upload' ? 'text-blue-600' : 'text-gray-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Upload File</h3>
                        <p className="text-sm text-gray-500">
                            Upload a document from your device
                        </p>
                        <div className="mt-4 text-xs text-gray-400">
                            Supports: JPG, PNG, PDF (Max 5MB)
                        </div>
                    </div>
                </div>

                {/* Take Photo Option */}
                <div 
                    onClick={() => onSelect('camera')}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        selectedMethod === 'camera' 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                >
                    <div className="text-center">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                            selectedMethod === 'camera' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                            <svg className={`w-10 h-10 ${
                                selectedMethod === 'camera' ? 'text-blue-600' : 'text-gray-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Take Photo</h3>
                        <p className="text-sm text-gray-500">
                            Use your camera to capture the document
                        </p>
                        <div className="mt-4 text-xs text-gray-400">
                            Take a clear photo of your document
                        </div>
                    </div>
                </div>
            </div>

            {/* Help text for camera issues */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700 flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Camera not working?</strong> Just use the "Upload File" option instead - it works on all devices and browsers!
                    </span>
                </p>
            </div>
        </div>
    );
}