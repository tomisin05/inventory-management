import { storage } from '../firebase/config';

export async function detectObjects(imageUrl) {
  try {
    const response = await fetch(import.meta.env.VITE_OBJECT_DETECTION_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OBJECT_DETECTION_API_KEY}`
      },
      body: JSON.stringify({ image: imageUrl })
    });

    if (!response.ok) {
      throw new Error('Object detection failed');
    }

    const data = await response.json();
    return data.labels || [];
  } catch (error) {
    console.error('Error in object detection:', error);
    return [];
  }
} 