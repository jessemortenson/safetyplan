import React, { useState } from "react";
import EditHarm from "./EditHarm";
import EditMitigation from './EditMitigation';

export default function MakeSafetyPlan({ setPanelContent }) {
  const [harms, setHarms] = useState([]);
  const [mitigations, setMitigations] = useState([]);
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
  const addMitigation = (event) => {
    event.preventDefault();
    editMitigation({});
  }
  const editMitigation = (mitigation) => {
    setPanelContent(<EditMitigation mitigation={mitigation} saveHandler={saveMitigation} />);
  }
  const saveMitigation = (mitigation) => {
    if (!mitigation.id) {
      const highestExistingId = Math.max(...mitigations.map(m => m.id));
      mitigation.id = highestExistingId ? highestExistingId + 1 : 1;
    }
    const unchangedMitigations = [...mitigations].filter(m => m.id !== mitigation.id);
    setMitigations([...unchangedMitigations, mitigation]);
    setPanelContent(null);
  }
  return (
    <div>

      <div className="row">

        <div className="one-half column">
          <h2>Harms</h2>
          <h3>What is causing people to be unsafe in Minneapolis?</h3>
          <button type="button" onClick={addHarm}>Describe Harm</button>
          { harms.map(harm => <p key={harm.id}>{harm.name} - {harm.quantity}</p>) }
        </div>

        <div className="one-half column">
          <h2>Mitigations</h2>
          <h3>What solutions reduce the risk of someone being harmed, or help them heal?</h3>
          <button type="button" onClick={addMitigation}>Describe Mitigation</button>
          { mitigations.map(mitigation => <p key={mitigation.id}>{mitigation.name} - ${mitigation.cost}</p>) }
        </div>

      </div>
    </div>
  );
}
