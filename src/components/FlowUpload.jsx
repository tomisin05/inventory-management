// src/components/FlowUpload.jsx
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { uploadFlow } from '../lib/firebase/flows';
import { useAuth } from '../contexts/AuthContext';

function FlowUpload({ onSubmit }) {
  const { user } = useAuth();
  const [uploadMethod, setUploadMethod] = useState('file');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    tournament: '',
    round: '',
    team: '',
    judge: '',
    division: '',
    tags: [],
    customTag: '' // For adding custom tags
  });
  const webcamRef = useRef(null);

  // Predefined options
  const rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7', 'Round 8', 'Quarters', 'Semis', 'Finals'];
  const divisions = ['Varsity', 'JV', 'Novice'];
  const commonTags = ['K', 'DA', 'CP', 'Case', 'Theory', 'T', 'Framework'];


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleMetadataChange = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (metadata.customTag && !metadata.tags.includes(metadata.customTag)) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, prev.customTag],
        customTag: '' // Clear custom tag input
      }));
    }
  };

  const handleCapture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Convert base64 to blob
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    
    // Create file from blob with unique name
    const capturedFile = new File(
      [blob], 
      `capture-${Date.now()}.jpg`, 
      { type: 'image/jpeg' }
    );
    setFile(capturedFile);
    setPreviewUrl(imageSrc);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file or capture an image');
      return;
    }

    setIsLoading(true);
    try {
      // Use the existing uploadFlow function
      const uploadMetadata = {
        ...metadata,
        pageCount: 1, // Default to 1 for single image uploads
      };

      const flowData = await uploadFlow(file, uploadMetadata, user.uid);
      
      // Call onSubmit with the returned flow data
      if (onSubmit) {
        onSubmit(flowData);
      }

      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setMetadata({
        title: '',
        tournament: '',
        round: '',
        team: '',
        judge: '',
        division: '',
        tags: [],
        customTag: '',
      });
    } catch (error) {
      console.error('Error uploading flow:', error);
      alert('Failed to upload flow: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Method Selection */}
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`px-4 py-2 rounded ${
            uploadMethod === 'file'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('camera')}
          className={`px-4 py-2 rounded ${
            uploadMethod === 'camera'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Use Camera
        </button>
      </div>

      <div className="flow-upload-container"> 
        {/* File Upload or Camera Section */}
        <div className="mb-4">
          {uploadMethod === 'file' ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={handleCapture}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Capture Photo
              </button>
            </div>
          )}
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 rounded-lg mx-auto"
            />
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={metadata.title}
            onChange={(e) => handleMetadataChange('title', e.target.value)}
            className="w-full px-4 py-2 rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <input
            type="text"
            name="tournament"
            placeholder="Tournament"
            value={metadata.tournament}
            onChange={(e) => handleMetadataChange('tournament', e.target.value)}
            className="w-full px-4 py-2 rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          <select
            name="round"
            value={metadata.round}
            onChange={(e) => handleMetadataChange('round', e.target.value)}
            className="w-full px-4 py-2 rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Round</option>
            {rounds.map((round) => (
              <option key={round} value={round}>
                {round}
              </option>
            ))}
          </select>

          <select
            name="division"
            value={metadata.division}
            onChange={(e) => handleMetadataChange('division', e.target.value)}
            className="w-full px-4 py-2 rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Division</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="team"
            placeholder="Team"
            value={metadata.team}
            onChange={(e) => handleMetadataChange('team', e.target.value)}
            className="w-full px-4 py-2 rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          <input
            type="text"
            name="judge"
            placeholder="Judge"
            value={metadata.judge}
            onChange={(e) => handleMetadataChange('judge', e.target.value)}
            className="w-full px-4 py-2 rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Tag Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded ${
                    metadata.tags.includes(tag)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Custom Tag */}
            <form onSubmit={handleAddCustomTag} className="mt-4 flex">
              <input
                type="text"
                name="customTag"
                placeholder="Add Custom Tag"
                value={metadata.customTag}
                onChange={(e) =>
                  handleMetadataChange('customTag', e.target.value)
                }
                className="flex-grow px-4 py-2 rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded text-white ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isLoading ? 'Uploading...' : 'Upload Flow'}
        </button>
      </div>
    </div>
  );
}

export default FlowUpload;
