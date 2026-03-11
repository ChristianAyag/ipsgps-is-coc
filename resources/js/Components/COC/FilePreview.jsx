import React from 'react';

export default function FilePreview({ file, fileName, onRemove }) {
    const getFileIcon = () => {
        if (file.type?.startsWith('image/')) {
            return (
                <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className="h-12 w-12 object-cover rounded-lg"
                />
            );
        } else {
            return (
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                </div>
            );
        }
    };

    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        {getFileIcon()}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{fileName}</p>
                        <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-800"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
}