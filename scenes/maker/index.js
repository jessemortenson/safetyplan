import React, { useState } from "react";
import EditHarm from "./EditHarm";
import Panel from '../../shared/Panel';

export default function MakeSafetyPlan() {
  const [harms, setHarms] = useState([]);
  const [panelContent, setPanelContent] = useState(null);
  const addHarm = (event) => {
    event.preventDefault();
    editHarm({})
  }
  const editHarm = (harm) => {
    setPanelContent(<EditHarm harm={harm} saveHandler={saveHarm} />);
  }
  const saveHarm = (harm) => {
    if (!harm.id) {
      const highestExistingId = Math.max(...harms.map(h => h.id));
      harm.id = highestExistingId ? highestExistingId + 1 : 1;
    }
    const unchangedHarms = [...harms].filter(h => h.id !== harm.id);
    setHarms([...unchangedHarms, harm]);
    setPanelContent(null);
  };
  const closePanel = () => setPanelContent(null);
  const solutions = [];
  return (
    <div>
      <Panel content={panelContent} closePanel={closePanel} />
      <button type="button" onClick={addHarm}>Describe Harm</button>
      { harms.map(harm => <p key={harm.id}>{harm.name} - {harm.quantity}</p>) }
    </div>
  );
}
