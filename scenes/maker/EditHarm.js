import React, { useState } from "react";

export default function EditHarm({saveHandler, harm}) {
  const defaultHarm = { id: null, name: "", quantity: 0, parents: [], description: "" };
  const [editedHarm, setHarm] = useState({...defaultHarm, ...harm});
  const propertyEditor = (property) => (event) => {
    event.preventDefault();
    const integerProperties = ['quantity'];
    const value = (integerProperties.includes(property)) ? Number.parseInt(event.target.value) : event.target.value;
    const changingHarm = { ...editedHarm, [property]: value};
    setHarm(changingHarm);
  }
  const save = (event) => {
    event.preventDefault();
    saveHandler(editedHarm);
  }
  return (
    <form onSubmit={save}>
      <div className="fields">
        <label htmlFor="name">Name: <input type="text" name="name" value={editedHarm.name} onChange={propertyEditor('name')} /></label>
        <label htmlFor="quantity">Quantity: <input type="text" name="quantity" value={editedHarm.quantity} onChange={propertyEditor('quantity')} /></label>
        <label htmlFor="description">Description: <input type="text" name="description" value={editedHarm.description} onChange={propertyEditor('description')} /></label>
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
