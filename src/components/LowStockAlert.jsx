import { useState, useEffect } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

function LowStockAlert({ userId, threshold = 3 }) {
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      const q = query(
        collection(db, 'inventory'),
        where('userId', '==', userId),
        where('quantity', '<=', threshold)
      );

      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLowStockItems(items);
    };

    fetchLowStockItems();
  }, [userId, threshold]);

  return (
    <div className="bg-yellow-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800">Low Stock Alert</h3>
      {lowStockItems.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {lowStockItems.map(item => (
            <li key={item.id} className="text-yellow-700">
              {item.name} - Only {item.quantity} left
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-yellow-700">No items running low</p>
      )}
    </div>
  );
}

export default LowStockAlert; 