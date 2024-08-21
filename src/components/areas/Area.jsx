import React, { useState, useEffect } from 'react';
import EditableArea from "./EditableArea"

const Area = () => {
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    file: null,
  });

  useEffect(() => {
    fetch('http://ec2-3-29-139-74.me-central-1.compute.amazonaws.com:4000//api/area')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAreas(data.areas);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleTextChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('file', formData.file);

    fetch('https://server-sigma-peach.vercel.app/api/area/upload', {
      method: 'POST',
      body: formDataToSend,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setFormData({ name: '', file: null });
        
      })
      .catch((error) => console.error('Error:', error));
        e.target["file"].value=""
  };

  const handleDelete = (id, index) => {
    fetch(`https://server-sigma-peach.vercel.app/api/area/delete/${id}`)
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
      <div className="areaUpload">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="text">Text:</label>
            <input
              type="text"
              id="text"
              name="text"
              value={formData.name}
              onChange={handleTextChange}
            />
          </div>
          <div>
            <label htmlFor="file">File:</label>
            <input
              type="file"
              id="file"
              name="file"

              onChange={handleFileChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="areaList">
        <h2>Areas</h2>
        <ul>
          {areas.map((area, index) => (
            <li key={area.id}>
              <strong>{area.name}</strong>
              <EditableArea area={area}/>
              {/* Convert the Buffer data to a Blob and create a URL */}
              {area.image.url && (
                <img
                  src={area.image.url}
                  alt={area.name}
                />
              )}
              <button onClick={() => handleDelete(area.id, index)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Area;
