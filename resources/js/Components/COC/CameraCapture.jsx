import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [error, setError] = useState('');
    const [isStarting, setIsStarting] = useState(true);
    const [hasCamera, setHasCamera] = useState(true);

    // Universal camera start function
    const startCamera = useCallback(async () => {
        try {
            setIsStarting(true);
            setError('');

            // Check if browser supports camera
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                // Fallback for older browsers
                const getUserMedia = navigator.getUserMedia || 
                                   navigator.webkitGetUserMedia || 
                                   navigator.mozGetUserMedia || 
                                   navigator.msGetUserMedia;
                
                if (!getUserMedia) {
                    throw new Error('browser-not-supported');
                }
                
                // Use older callback-based API
                getUserMedia.call(navigator, { video: true }, (stream) => {
                    handleSuccess(stream);
                }, (err) => {
                    handleError(err);
                });
                return;
            }

            // Modern browsers - try different constraints
            const constraintsList = [
                { 
                    video: { 
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                },
                { video: { facingMode: 'environment' } },
                { video: true },
                { video: { width: { ideal: 640 }, height: { ideal: 480 } } }
            ];

            let stream = null;
            let lastError = null;

            // Try each constraint until one works
            for (const constraints of constraintsList) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                    break;
                } catch (err) {
                    lastError = err;
                    console.warn('Constraint failed:', constraints, err);
                }
            }

            if (!stream) {
                throw lastError || new Error('Could not access camera');
            }

            handleSuccess(stream);

        } catch (err) {
            handleError(err);
        } finally {
            setIsStarting(false);
        }
    }, []);

    const handleSuccess = (stream) => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            
            // Play video with promise
            const playPromise = videoRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setCameraActive(true);
                        setError('');
                        setHasCamera(true);
                    })
                    .catch(err => {
                        console.warn('Auto-play failed:', err);
                        // Still mark as active, user might need to interact
                        setCameraActive(true);
                    });
            }
        }
    };

    const handleError = (err) => {
        console.error('Camera error:', err);
        
        // User-friendly error messages
        if (err.message === 'browser-not-supported') {
            setError(
                <div>
                    <p className="mb-2">Your browser doesn't support camera access.</p>
                    <p className="text-sm">Please use one of these browsers:</p>
                    <ul className="list-disc ml-5 mt-2 text-sm">
                        <li>Google Chrome (recommended)</li>
                        <li>Microsoft Edge</li>
                        <li>Mozilla Firefox</li>
                        <li>Safari</li>
                        <li>Opera</li>
                    </ul>
                </div>
            );
            setHasCamera(false);
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError(
                <div>
                    <p className="mb-2">Camera access was denied.</p>
                    <p className="text-sm">To allow camera access:</p>
                    <ul className="list-disc ml-5 mt-2 text-sm">
                        <li>Click the camera/lock icon in your browser's address bar</li>
                        <li>Select "Allow" for camera access</li>
                        <li>Refresh the page and try again</li>
                    </ul>
                </div>
            );
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setError(
                <div>
                    <p className="mb-2">No camera found on your device.</p>
                    <p className="text-sm">Please check:</p>
                    <ul className="list-disc ml-5 mt-2 text-sm">
                        <li>Is your camera connected/working?</li>
                        <li>Do you have camera drivers installed?</li>
                        <li>Is another app using the camera?</li>
                    </ul>
                </div>
            );
            setHasCamera(false);
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            setError(
                <div>
                    <p className="mb-2">Camera is already in use by another application.</p>
                    <p className="text-sm">Please close other apps that might be using the camera (Zoom, Skype, etc.) and try again.</p>
                </div>
            );
        } else {
            setError(
                <div>
                    <p className="mb-2">Could not access camera.</p>
                    <p className="text-sm">Error: {err.message || 'Unknown error'}</p>
                    <p className="text-sm mt-2">Try these steps:</p>
                    <ul className="list-disc ml-5 mt-2 text-sm">
                        <li>Refresh the page</li>
                        <li>Check camera permissions</li>
                        <li>Try a different browser</li>
                        <li>Restart your browser</li>
                    </ul>
                </div>
            );
        }
    };

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => {
                track.stop();
            });
            videoRef.current.srcObject = null;
            setCameraActive(false);
        }
    }, []);

    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current && cameraActive) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            
            // Draw the current video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert to File object
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `document-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    const previewUrl = URL.createObjectURL(blob);
                    onCapture(file, previewUrl);
                }
            }, 'image/jpeg', 0.9);
            
            // Stop camera after capture
            stopCamera();
        }
    }, [cameraActive, stopCamera, onCapture]);

    // Start camera when component mounts
    useEffect(() => {
        startCamera();
        
        // Cleanup when component unmounts
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    return (
        <div className="space-y-4">
            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-600 text-sm mb-3">{error}</div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => {
                                setError('');
                                startCamera();
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                        >
                            Try Again
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Camera View */}
            {!error && (
                <>
                    <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-auto max-h-96 object-contain"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Loading State */}
                        {isStarting && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                                <div className="text-white text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mb-2"></div>
                                    <p>Starting camera...</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Camera Controls */}
                        {cameraActive && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={capturePhoto}
                                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                                    title="Take photo"
                                >
                                    <div className="w-14 h-14 bg-red-500 rounded-full border-4 border-white"></div>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Position the document clearly in frame and tap the red button to capture
                        </p>
                    </div>

                    {/* Tips */}
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700 flex items-start gap-2">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>
                                <strong>Tips for best results:</strong><br />
                                • Ensure good lighting<br />
                                • Hold the camera steady<br />
                                • Make sure all text is readable<br />
                                • Avoid shadows and glare
                            </span>
                        </p>
                    </div>

                    {/* Cancel Button */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                stopCamera();
                                onClose();
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}