import React, { useState, useEffect } from 'react';
import EditableArea from "./EditableArea"
const apiUrl = process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_URL_DEV : process.env.REACT_APP_API_URL_PROD;
// const apiUrl = process.env.REACT_APP_API_URL_DEV;
console.log(apiUrl,process.env.NODE_ENV)



const Area = () => {
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    file: null,
    PaymentPlanLink: '',
    FloorPlanLink: '',
    BrochureLink: '',
    VideoLink: '',
    Description: '',
    cluster: false,
    data: [{
      name: '',
      file: null,
      PaymentPlanLink: '',
    FloorPlanLink: '',
      BrochureLink: '',
      VideoLink: '',
      Description: '',
    }]
  });
const [isSubmitting, setIsSubmitting] = useState(false);
const [message, setMessage] = useState('');
const [errors, setErrors] = useState({
  name: '',
  file: '',
  PaymentPlanLink: '',
    FloorPlanLink: '',
  BrochureLink: '',
  VideoLink: '',
  Description: '',
  nested: []
});

  
  

  useEffect(() => {
    fetch(`${apiUrl}/api/area`)
    // .then((response) => console.log(response))

      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.areas);
        setAreas(data.areas);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: '',
      file: '',
      PaymentPlanLink: '',
      FloorPlanLink: '',
      BrochureLink: '',
      VideoLink: '',
      Description: '',
      nested: []
    };
  
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.file) newErrors.file = 'Image is required';
    if (!formData.VideoLink.trim()) newErrors.VideoLink = 'Video is required';
    if (!formData.Description.trim()) newErrors.Description = 'Description is required';
  
    // Validate nested data
    formData.data.forEach((item, index) => {
      newErrors.nested[index] = {};
      if (!item.name.trim()) newErrors.nested[index].name = 'Name is required';
      if (!item.file) newErrors.nested[index].file = 'Image is required';
      if (!item.VideoLink.trim()) newErrors.nested[index].VideoLink = 'Video is required';
      if (!item.Description.trim()) newErrors.nested[index].Description = 'Description is required';
    });
  
    setErrors(newErrors);
    return Object.values(newErrors).every(error => 
      typeof error === 'string' ? error === '' : Object.values(error).every(e => e === '')
    );
  };
  

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleClusterChange = (e) => {
    setFormData({ ...formData, cluster: e.target.checked });
  };
  // const handleNestedDataChange = (index, field, value) => {
  //   const newData = [...formData.data];
  //   newData[index][field] = value;
  //   setFormData({ ...formData, data: newData });
  // };
  const handleNestedDataChange = (index, field, value) => {
    const newData = [...formData.data];
    if (field === 'file') {
      newData[index][field] = value.target.files[0];
    } else {
      newData[index][field] = value;
    }
    setFormData({ ...formData, data: newData });
  };
  
  const addNestedData = () => {
    setFormData({
      ...formData,
      data: [...formData.data, {
        name: '',
        file: null,
        BrochureLink: '',
        PaymentPlanLink: '',
        FloorPlanLink: '',
        VideoLink: '',
        Description: ''
      }]
    });
  };
  
  const removeNestedData = (index) => {
    const newData = formData.data.filter((_, i) => i !== index);
    setFormData({ ...formData, data: newData });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };
  //   e.preventDefault();
  //   const formDataToSend = new FormData();
  //   for (const key in formData) {
  //     if (key === 'file') {
  //       formDataToSend.append('file', formData.file);
  //     } else if (key === 'data') {
  //       formDataToSend.append('data', JSON.stringify(formData.data));
  //     } else {
  //       formDataToSend.append(key, formData[key]);
  //     }
  //   }
  
  //   fetch(`${apiUrl}/api/area/upload`, {
  //     method: 'POST',
  //     body: formDataToSend,
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setFormData({
  //         name: '',
  //         file: null,
  //         BrochureLink: '',
  //         VideoLink: '',
  //         Description: '',
  //         cluster: false,
  //         data: []
  //       });
  //     })
  //     .catch((error) => console.error('Error:', error));
  //   e.target["file"].value = "";
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    setMessage('');
  
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'file') {
        formDataToSend.append('file', formData.file);
      } else if (key === 'data') {
        formDataToSend.append('data', JSON.stringify(formData.data));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/area/upload`, {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();
      setMessage(data.message || 'Area created successfully!');
      setFormData({
        name: '',
        file: null,
        BrochureLink: '',
        VideoLink: '',
        Description: '',
        cluster: false,
        data: []
      });
      e.target["file"].value = "";
    } catch (error) {
      setMessage('Error creating area. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const handleDelete = (id, index) => {
    fetch(`${apiUrl}/api/area/delete/${id}`).then((response) => console.log(response))
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // If successful, update the state to remove the deleted area
        if (data.message === 'Area Deleted Successfully') {
          setAreas((prevAreas) => prevAreas.filter((_, i) => i !== index));
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
<div className="areaUpload max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name:</label>
      <input
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleTextChange}
      />
      {errors.name && <span className="mt-1 text-sm text-red-600">{errors.name}</span>}
    </div>

    <div className="mb-4">
      <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-700">Image:</label>
      <input
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        type="file"
        id="file"
        name="file"
        onChange={handleFileChange}
      />
      {errors.file && <span className="mt-1 text-sm text-red-600">{errors.file}</span>}
    </div>

    <div className="mb-4">
      <label htmlFor="BrochureLink" className="block mb-2 text-sm font-medium text-gray-700">Brochure Link:</label>
      <input
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        type="text"
        id="BrochureLink"
        name="BrochureLink"
        value={formData.BrochureLink}
        onChange={handleTextChange}
      />
      {errors.BrochureLink && <span className="mt-1 text-sm text-red-600">{errors.BrochureLink}</span>}
    </div>

    <div className="mb-4">
      <label htmlFor="VideoLink" className="block mb-2 text-sm font-medium text-gray-700">Video Link:</label>
      <input
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        type="text"
        id="VideoLink"
        name="VideoLink"
        value={formData.VideoLink}
        onChange={handleTextChange}
      />
      {errors.VideoLink && <span className="mt-1 text-sm text-red-600">{errors.VideoLink}</span>}
    </div>

    <div className="mb-4">
      <label htmlFor="Description" className="block mb-2 text-sm font-medium text-gray-700">Description:</label>
      <textarea
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        id="Description"
        name="Description"
        value={formData.Description}
        onChange={handleTextChange}
      />
      {errors.Description && <span className="mt-1 text-sm text-red-600">{errors.Description}</span>}
    </div>

    <div className="mb-4">
      <label htmlFor="cluster" className="inline-flex items-center">
        <input
          type="checkbox"
          id="cluster"
          name="cluster"
          checked={formData.cluster}
          onChange={handleClusterChange}
          className="mr-2 leading-tight"
        />
        <span className="text-sm font-medium text-gray-700">Cluster</span>
      </label>
    </div>

    {formData.cluster && (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Nested Data</h3>
        {formData.data.map((item, index) => (
          <div key={index} className="border-t pt-4 mt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Item {index + 1}</h4>
            {formData.cluster && (
  <div className="mb-4">
    {formData.data?.map((item, index) => (
      <div key={index} className="border-t pt-4 mt-4">
        <div className="mb-2">
          <label htmlFor={`nestedName${index}`} className="block mb-1 text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            id={`nestedName${index}`}
            value={item?.name || ''}
            onChange={(e) => handleNestedDataChange(index, 'name', e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <label htmlFor={`nestedFile${index}`} className="block mb-1 text-sm font-medium text-gray-700">Image:</label>
          <input
            type="file"
            id={`nestedFile${index}`}
            onChange={(e) => handleNestedDataChange(index, 'file', e.target.files[0])}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <label htmlFor={`nestedBrochureLink${index}`} className="block mb-1 text-sm font-medium text-gray-700">Brochure Link:</label>
          <input
            type="text"
            id={`nestedBrochureLink${index}`}
            value={item?.BrochureLink || ''}
            onChange={(e) => handleNestedDataChange(index, 'BrochureLink', e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <label htmlFor={`nestedPaymentPlanLink${index}`} className="block mb-1 text-sm font-medium text-gray-700">Payment Plan Link:</label>
          <input
            type="text"
            id={`nestedPaymentPlanLink${index}`}
            value={item?.PaymentPlanLink || ''}
            onChange={(e) => handleNestedDataChange(index, 'PaymentPlanLink', e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <label htmlFor={`nestedFloorPlanLink${index}`} className="block mb-1 text-sm font-medium text-gray-700">Floor Plan Link:</label>
          <input
            type="text"
            id={`nestedFloorPlanLink${index}`}
            value={item?.FloorPlanLink || ''}
            onChange={(e) => handleNestedDataChange(index, 'FloorPlanLink', e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <label htmlFor={`nestedVideoLink${index}`} className="block mb-1 text-sm font-medium text-gray-700">Video Link:</label>
          <input
            type="text"
            id={`nestedVideoLink${index}`}
            value={item?.VideoLink || ''}
            onChange={(e) => handleNestedDataChange(index, 'VideoLink', e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-2">
          <label htmlFor={`nestedDescription${index}`} className="block mb-1 text-sm font-medium text-gray-700">Description:</label>
          <textarea
            id={`nestedDescription${index}`}
            value={item?.Description || ''}
            onChange={(e) => handleNestedDataChange(index, 'Description', e.target.value)}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button type="button" onClick={() => removeNestedData(index)} className="mt-2 px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100">Remove</button>
      </div>
    ))}
    <button type="button" onClick={addNestedData} className="mt-2 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100">Add Nested Data</button>
  </div>
)}

          </div>
        ))}
        <button type="button" onClick={addNestedData} className="mt-2 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100">Add Nested Data</button>
      </div>
    )}

    <button type="submit" disabled={isSubmitting} className="w-full px-3 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>

  {message && <span className="mt-4 text-sm text-green-600">{message}</span>}
</div>


      {/* Display the list of areas */}
      <div className="areaList mt-8">
  <h2 className="text-2xl font-bold mb-4">Areas</h2>
  <ul className="space-y-4">
    {areas.map((area, index) => (
      <li key={area.id} className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {area?.image?.url && (
              <img
                src={area.image.url}
                alt={area.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
            )}
            <div>
              <strong className="text-lg font-semibold text-gray-800">{area.name}</strong>
              <EditableArea area={area}/>
            </div>
          </div>
          <button 
            onClick={() => handleDelete(area.id, index)}
            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100"
          >
            Delete
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {area.BrochureLink && (
            <p><strong>Brochure:</strong> <a href={area.BrochureLink} className="text-blue-600 hover:underline">View Brochure</a></p>
          )}
          {area.VideoLink && (
            <p><strong>Video:</strong> <a href={area.VideoLink} className="text-blue-600 hover:underline">Watch Video</a></p>
          )}
          {area.Description && (
            <p><strong>Description:</strong> {area.Description}</p>
          )}
        </div>
      </li>
    ))}
  </ul>
</div>


    </>
  );

}

export default Area;
