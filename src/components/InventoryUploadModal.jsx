import React, { useState, useRef } from 'react';
import { uploadInventoryItem } from '../lib/firebase/inventory-operations';
// src/components/FlowUpload.jsx
import Webcam from 'react-webcam';
import { useAuth } from '../contexts/AuthContext';

function InventoryUploadModal({ onClose, onSuccess, userId }) {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [metadata, setMetadata] = useState({
      name: '',
      quantity: 1,
      category: 'Pantry',
      expiryDate: '',
      notes: ''
    });
  
    const fileInputRef = useRef(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!file) {
        alert('Please select an image');
        return;
      }
  
      setIsUploading(true);
      try {
        await uploadInventoryItem(file, metadata, userId);
        onSuccess();
      } catch (error) {
        console.error('Error uploading item:', error);
        alert('Failed to upload item');
      } finally {
        setIsUploading(false);
      }
    };

  const [uploadMethod, setUploadMethod] = useState('file');
  const { user } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const webcamRef = useRef(null);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleCapture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Convert base64 to blob
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    
    // Create file from blob with unique name
    const capturedFile = new File(
      [blob], 
      `capture-${Date.now()}.jpg`, 
      { type: 'image/jpeg' }
    );
    setFile(capturedFile);
    setPreviewUrl(imageSrc);
  };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert('Please select a file or capture an image');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Use the existing uploadFlow function
//       const uploadMetadata = {
//         ...metadata,
//         pageCount: 1, // Default to 1 for single image uploads
//       };

//       const flowData = await uploadFlow(file, uploadMetadata, user.uid);
      
//       // Call onSubmit with the returned flow data
//       if (onSubmit) {
//         onSubmit(flowData);
//       }

//       // Reset form
//       setFile(null);
//       setPreviewUrl(null);
//       setMetadata({
//         title: '',
//         tournament: '',
//         round: '',
//         team: '',
//         judge: '',
//         division: '',
//         tags: [],
//         customTag: '',
//       });
//     } catch (error) {
//       console.error('Error uploading flow:', error);
//       alert('Failed to upload flow: ' + error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };



{/* //upload modal
    <div className="flex space-x-4 mb-4">
    <button
      type="button"
      onClick={() => setUploadMethod('file')}
      className={`px-4 py-2 rounded ${
        uploadMethod === 'file'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-700'
      }`}
    >
      Upload File
    </button>
    <button
      type="button"
      onClick={() => setUploadMethod('camera')}
      className={`px-4 py-2 rounded ${
        uploadMethod === 'camera'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-700'
      }`}
    >
      Use Camera
    </button>
  </div>

  <div className="flow-upload-container"> 


    // File Upload or Camera Section 
    <div className="mb-4">
      {uploadMethod === 'file' ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded-lg"
          />
          <button
            type="button"
            onClick={handleCapture}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Capture Photo
          </button>
        </div>
      )}
    </div>

 
    {previewUrl && (
      <div className="mb-4">
        <img
          src={previewUrl}
          alt="Preview"
          className="max-h-48 rounded-lg mx-auto"
        />
      </div>
    )}

    */}






  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          
        <div className="flex space-x-4 mb-4">
        <button
        type="button"
        onClick={() => setUploadMethod('file')}
        className={`px-4 py-2 rounded ${
            uploadMethod === 'file'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
        >
        Upload File
        </button>
        <button
        type="button"
        onClick={() => setUploadMethod('camera')}
        className={`px-4 py-2 rounded ${
            uploadMethod === 'camera'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
        >
        Use Camera
        </button>
    </div>

    <div className="flow-upload-container"> 


        // File Upload or Camera Section 
        <div className="mb-4">
        {uploadMethod === 'file' ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
            />
            </div>
        ) : (
            <div className="space-y-4">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
            />
            <button
                type="button"
                onClick={handleCapture}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Capture Photo
            </button>
            </div>
        )}
        </div>

    
        {previewUrl && (
        <div className="mb-4">
            <img
            src={previewUrl}
            alt="Preview"
            className="max-h-48 rounded-lg mx-auto"
            />
        </div>
        )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full"
                />
              </div>

              {/* Form fields for metadata */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={metadata.name}
                  onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                
                <input
                  type="number"
                  placeholder="Quantity"
                  value={metadata.quantity}
                  onChange={(e) => setMetadata({ ...metadata, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  min="0"
                />
                
                <select
                  value={metadata.category}
                  onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Refrigerated">Refrigerated</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Condiments">Condiments</option>
                  <option value="Other">Other</option>
                </select>
                
                <input
                  type="date"
                  placeholder="Expiry Date"
                  value={metadata.expiryDate}
                  onChange={(e) => setMetadata({ ...metadata, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                
                <textarea
                  placeholder="Notes"
                  value={metadata.notes}
                  onChange={(e) => setMetadata({ ...metadata, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default InventoryUploadModal; 