import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';


const EditFlowModal = ({ flow, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: flow.title || '',
      tournament: flow.tournament?.name || '',
      round: flow.round || '',
      team: flow.team || '',
      judge: flow.judge || '',
      division: flow.division || '',
      tags: flow.tags || [],
      userId: flow.userId
    });
  
    // Add predefined options
    const rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7', 'Round 8', 'Quarters', 'Semis', 'Finals'];
    const divisions = ['Varsity', 'JV', 'Novice'];
    const commonTags = ['K', 'DA', 'CP', 'Case', 'Theory', 'T', 'Framework'];
  
    const handleInputChange = (name, value) => {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleTagChange = (tag) => {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(flow.id, formData);
        onClose();
      };
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Flow</h2>
            <button onClick={onClose}>
              <FiX className="h-6 w-6" />
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
  
            {/* Tournament */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tournament</label>
              <input
                type="text"
                value={formData.tournament}
                onChange={(e) => handleInputChange('tournament', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
  
            {/* Round */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Round</label>
              <select
                value={formData.round}
                onChange={(e) => handleInputChange('round', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Round</option>
                {rounds.map((round) => (
                  <option key={round} value={round}>{round}</option>
                ))}
              </select>
            </div>
  
            {/* Team */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Team</label>
              <input
                type="text"
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
  
            {/* Judge */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Judge</label>
              <input
                type="text"
                value={formData.judge}
                onChange={(e) => handleInputChange('judge', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
  
            {/* Division */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Division</label>
              <select
                value={formData.division}
                onChange={(e) => handleInputChange('division', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>
  
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {commonTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagChange(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.tags.includes(tag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
  
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    );
  };

export default EditFlowModal; 


