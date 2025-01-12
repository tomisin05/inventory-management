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
  );
}

export default InventoryUploadModal; 