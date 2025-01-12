// src/components/FilterBar.jsx
import React from 'react';

function FilterBar({ filters, onFilterChange }) {
  const categories = [
    'All',
    'Pantry',
    'Refrigerated',
    'Frozen',
    'Beverages',
    'Snacks',
    'Condiments',
    'Other'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Search items..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            {categories.map(category => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiring Before
          </label>
          <input
            type="date"
            value={filters.expiryDate || ''}
            onChange={(e) => onFilterChange({ ...filters, expiryDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
