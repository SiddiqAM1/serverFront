import React, { useState } from "react";
const apiUrl = process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;


const EditableArea = ({ area }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedArea, setEditedArea] = useState({
    name: area.name,
    BrochureLink: area.brochureLink,
    VideoLink: area.videoLink,
    Description: area.description
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!editedArea.name.trim()) newErrors.name = 'Name is required';
    if (editedArea.BrochureLink && !isValidUrl(editedArea.BrochureLink)) newErrors.BrochureLink = 'Invalid URL';
    if (editedArea.VideoLink && !isValidVideoLink(editedArea.VideoLink)) newErrors.VideoLink = 'Invalid Video ID';
    if (editedArea.Description && editedArea.Description.length > 500) newErrors.Description = 'Description must be less than 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  const isValidVideoLink = (link) => {
    // Check if the link is exactly 11 characters long and contains only alphanumeric characters and underscores
    const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    return videoIdRegex.test(link);
  };
  

  const handleEdit = () => {
    setEditMode(true);
    setMessage('');
  };

  const handleConfirm = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      setMessage('Updating area...');
      fetch(`${apiUrl}/api/area/update/${area.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedArea),
      })
        .then(response => response.json())
        .then(data => {
          setMessage('Area updated successfully!');
          setEditMode(false);
          setIsSubmitting(false);
        })
        .catch(error => {
          setMessage('Failed to update area. Please try again.');
          setIsSubmitting(false);
        });
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedArea({
      name: area.name,
      BrochureLink: area.BrochureLink,
      VideoLink: area.VideoLink,
      Description: area.Description
    });
    setErrors({});
    setMessage('');
  };

  const handleChange = (e) => {
    setEditedArea({ ...editedArea, [e.target.name]: e.target.value });
  };

  return (
    <div className="mt-2">
      {editMode ? (
        <div className="space-y-2">
          <input
            type="text"
            name="name"
            value={editedArea.name}
            onChange={handleChange}
            className={`w-full px-2 py-1 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          <input
            type="text"
            name="BrochureLink"
            value={editedArea.BrochureLink}
            onChange={handleChange}
            placeholder="Brochure Link"
            className={`w-full px-2 py-1 border rounded-md ${errors.BrochureLink ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.BrochureLink && <span className="text-red-500 text-xs">{errors.BrochureLink}</span>}
          <input
            type="text"
            name="VideoLink"
            value={editedArea.VideoLink}
            onChange={handleChange}
            placeholder="Video Link"
            className={`w-full px-2 py-1 border rounded-md ${errors.VideoLink ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.VideoLink && <span className="text-red-500 text-xs">{errors.VideoLink}</span>}
          <textarea
            name="Description"
            value={editedArea.Description}
            onChange={handleChange}
            placeholder="Description"
            className={`w-full px-2 py-1 border rounded-md ${errors.Description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.Description && <span className="text-red-500 text-xs">{errors.Description}</span>}
          <div className="flex space-x-2">
            <button 
              onClick={handleConfirm} 
              className="px-3 py-1 text-sm text-white bg-green-500 rounded-md disabled:bg-green-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Confirm'}
            </button>
            <button onClick={handleCancel} className="px-3 py-1 text-sm text-white bg-red-500 rounded-md">
              Cancel
            </button>
          </div>
          {message && <span className="text-blue-500 text-sm">{message}</span>}
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span>{area.name}</span>
          <button onClick={handleEdit} className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md">
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableArea;
