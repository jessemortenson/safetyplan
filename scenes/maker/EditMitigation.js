import React, { useState } from "react";

export default function EditMitigation({saveHandler, mitigation}) {
  const defaultMitigation = { id: null, name: "", cost: 0, parents: [], description: "" };
  const [editedMitigation, setMitigation] = useState({...defaultMitigation, ...mitigation});
  const propertyEditor = (property) => (event) => {
    event.preventDefault();
    const integerProperties = ['cost'];
    const value = (integerProperties.includes(property)) ? Number.parseInt(event.target.value) : event.target.value;
    const changingMitigation = { ...editedMitigation, [property]: value};
    setMitigation(changingMitigation);
  }
  const save = (event) => {
    event.preventDefault();
    saveHandler(editedMitigation);
  }
  return (
    <form onSubmit={save}>
      <div className="fields">
        <label htmlFor="name">Name: <input type="text" name="name" value={editedMitigation.name} onChange={propertyEditor('name')} /></label>
        <label htmlFor="cost">Cost: <input type="text" name="cost" value={editedMitigation.cost} onChange={propertyEditor('cost')} /></label>
        <label htmlFor="description">Description: <input type="text" name="description" value={editedMitigation.description} onChange={propertyEditor('description')} /></label>
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
