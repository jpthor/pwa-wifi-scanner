import React from 'react';
import { Scan } from 'lucide-react';
import CameraComponent from '../components/Camera';
import ImagePreview from '../components/ImagePreview';
import LoadingOverlay from '../components/LoadingOverlay';
import { useImageContext } from '../context/ImageContext';

const HomePage: React.FC = () => {
  // Wrap the context usage in a try-catch to provide better error handling
  try {
    const { imageData, handleFileUpload, isLoading } = useImageContext();

    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <LoadingOverlay />
        
        {!imageData ? (
          <div className="card p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <p className="text-gray-600">Capture an image with WiFi details</p>
            </div>
            
            <div className="flex justify-center mb-8">
              <label 
                htmlFor="file-input" 
                className={`scan-button ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Scan className="text-indigo-500 w-10 h-10 mb-3" strokeWidth={1.5} />
                <span className="text-indigo-500 font-medium text-lg">SCAN</span>
                <input 
                  id="file-input" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
        ) : (
          <ImagePreview />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in HomePage:", error);
    // Fallback UI when context is not available
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <div className="card p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light mb-2 text-red-500">Error Loading App</h2>
            <p className="text-gray-600">Please refresh the page to try again.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default HomePage;
