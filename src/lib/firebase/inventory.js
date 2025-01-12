import { uploadFileToStorage, deleteFileFromStorage } from './storage-utils';
import { createDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from './db-operations';
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export async function uploadInventoryItem(file, metadata, userId) {
  try {
    // Upload image to Storage
    const storagePath = `inventory/${userId}/${file.name}`;
    const downloadURL = await uploadFileToStorage(file, storagePath);

    // Perform object detection using API
    const detectedLabels = await detectObjects(downloadURL);

    // Create inventory document
    const itemData = {
      userId,
      fileName: file.name,
      imageUrl: downloadURL,
      name: metadata.name || detectedLabels[0], // Use first detected label if no name provided
      quantity: metadata.quantity || 1,
      category: metadata.category || 'Uncategorized',
      detectedLabels,
      notes: metadata.notes || '',
      expiryDate: metadata.expiryDate || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add inventory document
    const result = await createDocument('inventory', itemData);
    return result;
  } catch (error) {
    console.error('Error uploading inventory item:', error);
    throw error;
  }
}

// Function to perform object detection (integrate with your chosen API)
async function detectObjects(imageUrl) {
  // Implement your chosen object detection API here
  // Example using a generic API:
  const response = await fetch('YOUR_OBJECT_DETECTION_API_ENDPOINT', {
    method: 'POST',
    body: JSON.stringify({ image: imageUrl }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'YOUR_API_KEY'
    }
  });
  const data = await response.json();
  return data.labels;
}

export async function updateItemQuantity(itemId, quantity, userId) {
  try {
    const item = await getDocument('inventory', itemId);
    if (item.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await updateDocument('inventory', itemId, {
      quantity,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating item quantity:', error);
    throw error;
  }
} 