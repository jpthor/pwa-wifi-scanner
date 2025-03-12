import React, { useState } from 'react';
import { Edit, Save, X, Download } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';
import { generateWifiQRCode, saveQRCodeToDevice } from '../utils/wifiUtils';

const OcrResult: React.FC = () => {
  const { ocrResult, isLoading } = useImageContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    ssid: '',
    password: '',
    security: 'WPA'
  });

  // Initialize form data when OCR result changes
  React.useEffect(() => {
    if (ocrResult) {
      setFormData({
        ssid: ocrResult.ssid || '',
        password: ocrResult.password || '',
        security: ocrResult.security || 'WPA'
      });
    }
  }, [ocrResult]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Generate QR code and show it immediately
    try {
      const qrData = generateWifiQRCode(formData.ssid, formData.password, formData.security);
      setQRCodeData(qrData);
      setShowQRCode(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please check your WiFi details.');
    }
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
  };

  const handleSaveQRCode = async () => {
    if (!qrCodeData) return;
    
    try {
      await saveQRCodeToDevice(qrCodeData, formData.ssid);
    } catch (error) {
      console.error('Error saving QR code:', error);
      alert('Failed to save QR code. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="card p-6 w-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!ocrResult) {
    return (
      <div className="card p-6 w-full">
        <h2 className="text-xl font-medium mb-4 gradient-text">No Results</h2>
        <p className="text-gray-600">No WiFi details were found. Please try scanning again.</p>
      </div>
    );
  }

  return (
    <div className="card p-6 w-full">
      {showQRCode ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium gradient-text">WiFi QR Code</h2>
            <button 
              onClick={handleCloseQRCode}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4 text-center">
            <p className="text-gray-600 mb-2">Network: {formData.ssid}</p>
            <div className="qr-container">
              {qrCodeData && (
                <img 
                  src={qrCodeData} 
                  alt="WiFi QR Code" 
                  className="max-w-full max-h-full"
                />
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => setIsEditing(true)}
              className="wifi-form-button-outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              <span>Edit</span>
            </button>
            
            <button 
              onClick={handleSaveQRCode}
              className="wifi-form-button"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-medium mb-4 gradient-text">WiFi Details</h2>
          
          {isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="wifi-form-group">
                <label htmlFor="ssid" className="wifi-form-label">Network Name (SSID)</label>
                <input
                  type="text"
                  id="ssid"
                  name="ssid"
                  value={formData.ssid}
                  onChange={handleInputChange}
                  className="wifi-form-input"
                  required
                />
              </div>
              
              <div className="wifi-form-group">
                <label htmlFor="password" className="wifi-form-label">Password</label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="wifi-form-input"
                />
              </div>
              
              <div className="wifi-form-group">
                <label htmlFor="security" className="wifi-form-label">Security Type</label>
                <select
                  id="security"
                  name="security"
                  value={formData.security}
                  onChange={handleInputChange}
                  className="wifi-form-input"
                >
                  <option value="WPA">WPA/WPA2/WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="wifi-form-button"
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-gray-600 mb-1"><span className="font-medium">Network:</span> {formData.ssid}</p>
                <p className="text-gray-600 mb-1"><span className="font-medium">Password:</span> {formData.password}</p>
                <p className="text-gray-600"><span className="font-medium">Security:</span> {formData.security}</p>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="wifi-form-button-outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <span>Edit</span>
                </button>
                
                <button 
                  onClick={handleSave}
                  className="wifi-form-button"
                >
                  <Save className="w-4 h-4 mr-2" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OcrResult;
