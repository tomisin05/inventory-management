import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FilterBar from '../components/FilterBar';
import InventoryItemCard from '../components/InventoryItemCard';
import LowStockAlert from '../components/LowStockAlert';
import InventoryUploadModal from '../components/InventoryUploadModal';
import { getFilteredInventory, updateInventoryItem, deleteInventoryItem } from '../lib/firebase/inventory-operations';
import { updateUserStats } from '../lib/firebase/users';

function Dashboard() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    expiryDate: null,
    sortBy: 'updatedAt'
  });

  useEffect(() => {
    if (!user?.uid) return;
    fetchInventory();
  }, [user, filters]);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const items = await getFilteredInventory(user.uid, filters);
      setInventory(items);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Failed to fetch inventory items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemDelete = async (itemId) => {
    try {
      await deleteInventoryItem(itemId, user.uid);
      await updateUserStats(user.uid);
      fetchInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleUploadSuccess = async () => {
    setShowUploadModal(false);
    await updateUserStats(user.uid);
    fetchInventory();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Inventory</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add New Item
        </button>
      </div>

      <LowStockAlert userId={user.uid} />

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {inventory.map(item => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onDelete={() => handleItemDelete(item.id)}
            />
          ))}
        </div>
      )}

      {showUploadModal && (
        <InventoryUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
          userId={user.uid}
        />
      )}
    </div>
  );
}

export default Dashboard;