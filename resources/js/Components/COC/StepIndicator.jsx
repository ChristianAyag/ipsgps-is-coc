import React from 'react';

export default function StepIndicator({ currentStep, selectedMethod }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className="relative">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                    step === currentStep
                                        ? 'bg-blue-600 text-white'
                                        : step < currentStep
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                {step < currentStep ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    step
                                )}
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap">
                                {step === 1 && 'IP Leader'}
                                {step === 2 && 'Father'}
                                {step === 3 && 'Mother'}
                                {step === 4 && 'Choose'}
                                {step === 5 && selectedMethod === 'upload' ? 'Upload' : selectedMethod === 'camera' ? 'Camera' : 'Document'}
                            </div>
                        </div>
                        {step < 5 && (
                            <div className={`w-12 h-1 mx-2 ${
                                step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}