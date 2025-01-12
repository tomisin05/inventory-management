import React, { useState } from 'react';
import { updateItemQuantity } from '../lib/firebase/inventory';

function InventoryItemCard({ item, onEdit, onDelete }) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = async (increment) => {
    const newQuantity = Math.max(0, quantity + increment);
    setQuantity(newQuantity);
    await updateItemQuantity(item.id, newQuantity, item.userId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative pt-[100%]">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Quantity:</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleQuantityChange(-1)}
              className="px-2 py-1 bg-red-100 rounded"
            >
              -
            </button>
            <span>{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(1)}
              className="px-2 py-1 bg-green-100 rounded"
            >
              +
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600">Category: {item.category}</p>
        
        {item.expiryDate && (
          <p className="text-sm text-gray-600">
            Expires: {new Date(item.expiryDate).toLocaleDateString()}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {item.detectedLabels.map((label, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-sm rounded-full">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InventoryItemCard; 