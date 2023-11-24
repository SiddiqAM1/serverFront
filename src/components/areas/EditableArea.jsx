import react from "react"
import { useState } from "react";


const EditableArea = ({ area}) => {
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(area.name);
  
    const handleEdit = () => {
      setEditMode(true);
    };
  
    const handleConfirm = (id,name) => {
        console.log(id,name)
      // Make API call to update the name in the database
      fetch(`https://server-front-ochre.vercel.app/area/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name :name}), // Ensure 'name' is the correct key for your backend
    })
      .then(response=>response.json())
      .then(data=>{
        console.log(data)
      })
      .catch(error=>{
        console.log("Failed to update name")
      })
      // Update the UI with the new name once the update is successful
      setEditMode(false);
      // Perform the API call to update the name in the database
    };
  
    const handleCancel = () => {
      setEditMode(false);
      setEditedName(area.name); // Reset edited name to the original one
    };
  
    const handleChange = (e) => {
      setEditedName(e.target.value);
    };
  
    return (
      <div>
        {editMode ? (
          <>
            <input
              type="text"
              value={editedName}
              onChange={handleChange}
            />
            <button onClick={()=>{handleConfirm(area.id,editedName)}}>Confirm</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <>
            <span>{area.name}</span>
            <button onClick={handleEdit}>Edit</button>
          </>
        )}
      </div>
    );
  };

  export default EditableArea
  
