// import React, { useState } from 'react';
// import { updateItemQuantity } from '../lib/firebase/inventory';

// function InventoryItemCard({ item, onEdit, onDelete }) {
//   const [quantity, setQuantity] = useState(item.quantity);

//   const handleQuantityChange = async (increment) => {
//     const newQuantity = Math.max(0, quantity + increment);
//     setQuantity(newQuantity);
//     await updateItemQuantity(item.id, newQuantity, item.userId);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="relative pt-[100%]">
//         <img 
//           src={item.imageUrl.downloadURL} 
//           alt={item.name} 
//           className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100"
//           loading='lazy'
//         />
//       </div>
      
//       <div className="p-4">
//         <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
        
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-gray-600">Quantity:</span>
//           <div className="flex items-center space-x-2">
//             <button 
//               onClick={() => handleQuantityChange(-1)}
//               className="px-2 py-1 bg-red-100 rounded"
//             >
//               -
//             </button>
//             <span>{quantity}</span>
//             <button 
//               onClick={() => handleQuantityChange(1)}
//               className="px-2 py-1 bg-green-100 rounded"
//             >
//               +
//             </button>
//           </div>
//         </div>

//         <p className="text-sm text-gray-600">Category: {item.category}</p>
        
//         {item.expiryDate && (
//           <p className="text-sm text-gray-600">
//             Expires: {new Date(item.expiryDate).toLocaleDateString()}
//           </p>
//         )}

//         <div className="flex flex-wrap gap-2 mt-2">
//           {item.detectedLabels.map((label, index) => (
//             <span key={index} className="px-2 py-1 bg-gray-100 text-sm rounded-full">
//               {label}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default InventoryItemCard; 

import React, { useState } from 'react';
import { updateInventoryItem, deleteInventoryItem } from '../lib/firebase/inventory-operations';


function InventoryItemCard({ item, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });
  const [loading, setLoading] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateInventoryItem(item.id, editedItem);
      onEdit(editedItem);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      try {
        await deleteInventoryItem(item.id);
        onDelete(item.id);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      } finally {
        setLoading(false);
      }
    }
  };

  const displayDate = (date) => {
    if (!date) return '';
    const nextDay = new Date(new Date(date).getTime() + (24 * 60 * 60 * 1000));
    return nextDay.toLocaleDateString();
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editedItem.name}
              onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={editedItem.quantity}
              onChange={(e) => setEditedItem({ ...editedItem, quantity: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={editedItem.category}
              onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="date"
              value={editedItem.expiryDate || ''}
              onChange={(e) => setEditedItem({ ...editedItem, expiryDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={editedItem.notes || ''}
              onChange={(e) => setEditedItem({ ...editedItem, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative pt-[100%]">
        <img
          src={item.imageUrl.downloadURL}
          alt={item.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        
        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-600">
            Quantity: {item.quantity}
          </p>
          <p className="text-sm text-gray-600">
            Category: {item.category}
          </p>
          {item.expiryDate && (
            <p className="text-sm text-gray-600">
             Expires: {displayDate(item.expiryDate)}
            </p>
          )}
          {item.notes && (
            <p className="text-sm text-gray-600">
              Notes: {item.notes}
            </p>
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            disabled={loading}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default InventoryItemCard;
