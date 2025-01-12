import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from './config';
import { createDocument, updateDocument, deleteDocument } from './db-operations';

export async function getFilteredInventory(userId, filters = {}) {
  try {
    let q = query(
      collection(db, 'inventory'),
      where('userId', '==', userId)
    );

    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters.expiryDate) {
      q = query(q, where('expiryDate', '<=', new Date(filters.expiryDate)));
    }

    // Always sort by updatedAt in descending order
    q = query(q, orderBy('updatedAt', 'desc'));

    const querySnapshot = await getDocs(q);
    let items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply search filter if present
    if (filters.search?.trim()) {
      const searchTerm = filters.search.trim().toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.detectedLabels.some(label => label.toLowerCase().includes(searchTerm))
      );
    }

    return items;
  } catch (error) {
    console.error('Error getting filtered inventory:', error);
    throw error;
  }
}

export async function deleteInventoryItem(itemId, userId) {
  try {
    const item = await getDocument('inventory', itemId);
    
    if (item.userId !== userId) {
      throw new UnauthorizedError('Only the owner can delete this item');
    }

    // Delete the file from storage if it exists
    if (item.imageUrl) {
      await deleteFileFromStorage(`inventory/${userId}/${item.fileName}`);
    }

    // Delete the inventory document
    await deleteDocument('inventory', itemId);
    
    // Update user stats
    await updateUserStats(userId);
    
    return true;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
}

export async function updateInventoryItem(itemId, updates, userId) {
  try {
    const item = await getDocument('inventory', itemId);
    
    if (item.userId !== userId) {
      throw new UnauthorizedError('Only the owner can update this item');
    }

    await updateDocument('inventory', itemId, {
      ...updates,
      updatedAt: new Date()
    });

    // Update user stats if quantity changed
    if (updates.quantity !== undefined) {
      await updateUserStats(userId);
    }

    return true;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
} 