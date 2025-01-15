import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export async function uploadFileToStorage(file, userId) {
  try {
    // Generate a unique filename using timestamp
    const timestamp = Date.now();
    const filename = `${file.name}`;
    const path = `inventory/${userId}/${filename}`;
    // console.log('Uploading file to storage:', path);
    
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    // console.log('File uploaded successfully:', downloadURL);
    
    return {
      downloadURL,
      path,
      filename
    };
  } catch (error) {
    console.error('Error uploading file to storage:', error);
    throw error;
  }
}

export async function deleteFileFromStorage(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    // If file doesn't exist, don't throw an error
    if (error.code === 'storage/object-not-found') {
      return true;
    }
    console.error('Error deleting file from storage:', error);
    throw error;
  }
}

export async function getFileFromStorage(path) {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file from storage:', error);
    throw error;
  }
}