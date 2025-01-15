import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './config';

export async function saveRecipe(recipeData, userId) {
  try {
    const docRef = await addDoc(collection(db, 'recipes'), {
      ...recipeData,
      userId,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...recipeData };
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
}

export async function getUserRecipes(userId) {
  try {
    const q = query(
      collection(db, 'recipes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}
