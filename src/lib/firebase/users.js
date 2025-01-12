import { doc, setDoc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { getDocument, updateDocument } from './db-operations';
import { validateUserData, validateProfileUpdates } from './validation';


export async function createUserDocument(user) {
  validateUserData(user);
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || '/public/default-avatar.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        totalItems: 0,
        itemsByCategory: {},
        lastScan: null
      };
      
      await setDoc(userRef, userData);
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

export async function updateUserStats(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const inventoryRef = collection(db, 'inventory');
    const q = query(inventoryRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const totalItems = querySnapshot.size;
    let itemsByCategory = {};
    
    querySnapshot.forEach(doc => {
      const item = doc.data();
      itemsByCategory[item.category] = (itemsByCategory[item.category] || 0) + item.quantity;
    });

    await updateDoc(userRef, {
      totalItems,
      itemsByCategory,
      updatedAt: new Date()
    });

    return { totalItems, itemsByCategory };
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

export async function getUserProfile(userId) {
  try {
    return await getDocument('users', userId);
  } catch (error) {
    if (error.message.includes('Document not found')) {
      return null;
    }
    console.error('Error getting user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId, updates) {
  try {
    validateProfileUpdates(updates);
    await updateDocument('users', userId, updates);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}