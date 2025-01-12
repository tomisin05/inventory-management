import React, { useState, useRef } from 'react';
import { uploadInventoryItem } from '../lib/firebase/inventory-operations';

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          
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
                {/* Add your form fields here */}
                {/* Example: */}
                <input
                  type="text"
                  placeholder="Item name"
                  value={metadata.name}
                  onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {/* Add other fields similarly */}
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
  );
}

export default InventoryUploadModal; 