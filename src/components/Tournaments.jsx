import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuth } from '../contexts/AuthContext';
import FlowUpload from '../components/FlowUpload';

export default function Tournaments() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '',
    date: '',
    location: '',
    description: ''
  });

  // Fetch ALL tournaments, not just user's tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      try {
        const tournamentsRef = collection(db, 'tournaments');
        // Remove the where clause to get all tournaments
        const querySnapshot = await getDocs(tournamentsRef);
        const tournamentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort tournaments by date
        tournamentsData.sort((a, b) => b.date.toDate() - a.date.toDate());
        setTournaments(tournamentsData);
      } catch (err) {
        setError('Error fetching tournaments');
        console.error('Error fetching tournaments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [user]);

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError('You must be logged in to create a tournament');
      return;
    }

    if (!newTournament.name || !newTournament.date || !newTournament.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const tournamentDate = new Date(newTournament.date);
      if (isNaN(tournamentDate)) {
        throw new Error('Invalid date format');
      }

      const tournamentData = {
        name: newTournament.name.trim(),
        date: tournamentDate,
        location: newTournament.location.trim(),
        description: newTournament.description?.trim() || '',
        flows: [],
        createdBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Remove participants array since everyone can access
        isPublic: true // Add this flag to indicate it's public
      };

      const docRef = await addDoc(collection(db, 'tournaments'), tournamentData);
      
      setTournaments(prev => [...prev, { 
        id: docRef.id, 
        ...tournamentData 
      }]);
      
      setShowCreateForm(false);
      setNewTournament({
        name: '',
        date: '',
        location: '',
        description: ''
      });
      
      alert('Tournament created successfully!');
    } catch (err) {
      setError('Error creating tournament: ' + err.message);
      console.error('Error creating tournament:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tournaments</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'Create Tournament'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreateTournament} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tournament Name</label>
            <input
              type="text"
              value={newTournament.name}
              onChange={(e) => setNewTournament({...newTournament, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newTournament.date}
              onChange={(e) => setNewTournament({...newTournament, date: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={newTournament.location}
              onChange={(e) => setNewTournament({...newTournament, location: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newTournament.description}
              onChange={(e) => setNewTournament({...newTournament, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="3"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Tournament
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-4">Loading tournaments...</div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-4">No tournaments found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map(tournament => (
            <div
              key={tournament.id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{tournament.name}</h3>
              <p className="text-gray-600 mb-2">
                Date: {tournament.date instanceof Date 
                    ? tournament.date.toLocaleDateString()
                    : new Date(tournament.date.seconds * 1000).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">Location: {tournament.location}</p>
              {tournament.description && (
                <p className="text-gray-600 mb-4">{tournament.description}</p>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setSelectedTournament(
                    selectedTournament?.id === tournament.id ? null : tournament
                  )}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {selectedTournament?.id === tournament.id ? 'Hide Upload' : 'Upload Flow'}
                </button>
                <span className="text-sm text-gray-500">
                  {tournament.flows?.length} flows
                </span>
              </div>
              
              {selectedTournament?.id === tournament.id && (
                <div className="mt-4 pt-4 border-t">
                  <FlowUpload
                    userId={user.uid}
                    tournamentId={tournament.id}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}