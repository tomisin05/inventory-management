import { uploadFileToStorage, deleteFileFromStorage } from './storage-utils';
import { createDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from './db-operations';
import { updateUserStats } from './users';
import { UnauthorizedError } from './errors';
import { validateFlowMetadata, validateFlowData, validateFlowUpdates } from './validation';
import { createUserDocument } from './users';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, getDoc  } from 'firebase/firestore';
import { db } from './config';

export async function uploadFlow(file, metadata, userId) {
  try {
    validateFlowMetadata(metadata);
    // Upload file to Storage

    // First check if tournament exists with this name
    const tournamentsRef = collection(db, 'tournaments');
    const q = query(
      tournamentsRef, 
      where('name', '==', metadata.tournament?.trim() || '')
    );
    console.log( metadata.tournament?.trim() || '')
    console.log('Query', q)
    const tournamentSnapshot = await getDocs(q);
    let tournamentId = null;
    
    // If tournament exists, get its ID
    if (!tournamentSnapshot.empty) { 
      const tournamentDoc = tournamentSnapshot.docs[0];
      tournamentId = tournamentDoc.id; 
      console.log('Tournament ID', tournamentId) 
      
      // Update tournament's flow count
      const currentFlows = tournamentDoc.data().flows || [];
      console.log('Current Flows', currentFlows)
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        flows: [...currentFlows, file.name], 
        updatedAt: new Date()
      });
      console.log('Current Flows', currentFlows) 
    }
 
    const storagePath = `flows/${userId}/${file.name}`;
    const downloadURL = await uploadFileToStorage(file, storagePath);

    // Create flow document 
    const flowData = {
        userId,
        fileName: file.name,
        fileUrl: downloadURL,  
        title: metadata.title || file.name, 
        tournament: {
            id: tournamentId, 
          name: metadata.tournament || null,
          date: metadata.tournamentDate || null,
        },
        round: metadata.round || null,
        team: metadata.team.trim().toLowerCase() || null,
        tags: Array.isArray(metadata.tags) ? metadata.tags : [], 
        judge: metadata.judge || null,
        division: metadata.division || null,
        pageCount: metadata.pageCount || 1,
        fileSize: file.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        searchableText: createSearchableText(metadata), 
        status: 'active'
      };

    // Add flow document
    const result = await createDocument('flows', flowData);

    // First check if user exists
    const userExists = await checkUserExists(userId);
    
    if (!userExists) {
      await createUserDocument(userId);
    }

    // Update user statistics
    await updateUserStats(userId);

    return result;
  } catch (error) {
    console.error('Error uploading flow:', error);
    throw error;
  }
}
  
  // Helper function to create searchable text
  function createSearchableText(metadata) {
    return [
      metadata.title,
      metadata.tournament,
      metadata.round,
      metadata.team,
      metadata.judge,
      metadata.division,
      ...(metadata.tags || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }
  

async function checkUserExists(userId) {
    try {
      await getDocument('users', userId);
      return true;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return false;
      }
      throw error;
    }
  }

export async function getUserFlows(userId, filters = {}) {
  try {
    const conditions = [
      { field: 'userId', operator: '==', value: userId },
      { field: 'status', operator: '==', value: 'active' } 
    ];

    // Add filter conditions
    if (filters) {
        if (filters.tournament?.trim()) {
          conditions.push({ field: 'tournament', operator: '==', value: filters.tournament });
        }
        if (filters.round?.trim()) {
          conditions.push({ field: 'round', operator: '==', value: filters.round });
        }
        if (filters.team?.trim()) {
          conditions.push({ field: 'team', operator: '==', value: filters.team });
        }
        if (filters.judge?.trim()) {
          conditions.push({ field: 'judge', operator: '==', value: filters.judge });
        }
        if (filters.division?.trim()) {
          conditions.push({ field: 'division', operator: '==', value: filters.division });
        }
        if (filters.tags && filters.tags.length > 0) {
          conditions.push({ field: 'tags', operator: 'array-contains-any', value: filters.tags });
        }
        if (filters.startDate) {
          conditions.push({ field: 'createdAt',  operator: '>=', value: new Date(filters.startDate) });
        }
        if (filters.endDate) {
          conditions.push({ 
            field: 'createdAt', operator: '<=',  value: new Date(filters.endDate + 'T23:59:59')});
        }
      }
    const sortOptions = { field: 'createdAt', direction: 'desc' };
        
    return await queryDocuments('flows', conditions, sortOptions);
  } catch (error) {
    console.error('Error getting user flows:', error);
    throw error;
  }
}

export async function deleteFlow(flowId, userId) {
    try {
      // Get the flow document first to check authorization and get file URL
      const flow = await getDocument('flows', flowId);
      
      // Check if user owns the flow
      if (flow.userId !== userId) {
        throw new UnauthorizedError('Only the owner can delete this flow');
      }
  
      // Delete the file from storage if it exists
      if (flow.fileUrl) {
        await deleteFileFromStorage(flow.fileUrl);
      }

      if (flow.tournament?.id) {
        await removeFlowFromTournament(flow.tournament.id, flowId, userId);
      }
  
      // Delete the flow document
      await deleteDocument('flows', flowId);
      return true;
    } catch (error) {
      console.error('Error deleting flow:', error);
      throw error;
    }
  }
  
  export async function updateFlow(flowId, updates, userId) {
    try {
      
      // First check if the document exists
      const flowRef = doc(db, 'flows', flowId);
      const flowSnap = await getDoc(flowRef);
    
      if (!flowSnap.exists()) {
        throw new Error('Flow not found');
      }

      const flowData = flowSnap.data();
      
      // Check if user owns the flow
    if (flowData.userId !== userId) {
        throw new Error('Only the owner can update this flow');
      }
  
      // Add timestamp and preserve existing data
      const updatedFlow = {
        ...flowData,
        ...updates,
        updatedAt: new Date(),
      };
  
      await updateDoc(flowRef, updatedFlow);
      return true;
    } catch (error) {
      console.error('Error updating flow:', error);
      throw error;
    }
  }

export async function getFilteredFlows(userId, filters) {
  try {
    let q = query(
      collection(db, 'flows'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );


    if (filters.round) {
      q = query(q, where('round', '==', filters.round));
    }

    if (filters.division) {
      q = query(q, where('division', '==', filters.division));
    }

    if (filters.tags && filters.tags.length > 0) {
      q = query(q, where('tags', 'array-contains-any', filters.tags));
    }

    // Date range filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      q = query(q, where('createdAt', '>=', startDate));
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the day
      q = query(q, where('createdAt', '<=', endDate));
    }

    // Always sort by createdAt in descending order
    q = query(q, orderBy('createdAt', 'desc'));

    // Get the documents
    const querySnapshot = await getDocs(q);
    let flows = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Type in Filters
    if (filters.team?.trim()) {
      const teamSearch = filters.team.trim().toLowerCase();
      flows = flows.filter(flow => 
        flow.team?.toLowerCase().includes(teamSearch)
      );
    }

    if (filters.judge?.trim()) {
      const judgeSearch = filters.judge.trim().toLowerCase();
      flows = flows.filter(flow =>
        flow.judge?.toLowerCase().includes(judgeSearch)
      );
    }

    if (filters.title?.trim()) {
      const titleSearch = filters.title.trim().toLowerCase();
      flows = flows.filter(flow =>
        flow.title?.toLowerCase().includes(titleSearch)
      );
    }

    if (filters.tournament?.trim()) {
        const tournamentSearch = filters.tournament.trim().toLowerCase();
        flows = flows.filter(flow =>
            flow.tournament?.name?.toLowerCase().includes(tournamentSearch)
        );
    }

    return flows;


    
  } catch (error) {
    console.error('Error getting filtered flows:', error);
    throw error;
  }
}
 