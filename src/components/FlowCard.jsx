// components/FlowCard.jsx
const FlowCard = ({ flow, onEdit, onDelete }) => {
    if (!flow) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image section */}
      <div className="relative pt-[56.25%]">
        <img 
          src={flow.fileUrl} 
          alt={flow.title} 
          className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100"
        />
      </div>
      
      {/* Content section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{flow.title}</h3>
        
        {/* Tournament info */}
        {flow.tournament?.name && (
          <p className="text-sm text-gray-600 mb-2">
            {flow.tournament.name} - {flow.round}
          </p>
        )}

        {/* Judge */}
        {flow.judge && (
          <p className="text-sm text-gray-600 mb-2">
            Judge: {flow.judge}
          </p>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {flow.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-sm rounded-full text-gray-600"
            >
              {tag} 
            </span>
          ))}
        </div>
        <div className="p-4">
        <p className="text-gray-600 text-sm">
        {flow.createdAt ? formatDate(flow.createdAt) : 'No date'}
        </p>
        </div>
      </div>

      {/* Add action buttons */}
      <div className="p-4 border-t border-gray-100 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(flow)}
          className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this flow?')) {
              onDelete(flow.id);
            }
          }}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>

    </div>
  );
};

export default FlowCard;


const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    
    let date;
    if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue.toDate === 'function') {
      date = dateValue.toDate();
    } else {
      return 'Invalid Date';
    }

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleDateString();
  };