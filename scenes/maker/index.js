import React, { useState } from "react";
import { SteppedLineTo } from 'react-lineto';
import styles from '../../styles/Maker.module.css'
import EditHarm from "./EditHarm";
import EditMitigation from './EditMitigation';
import Graph from './Graph';
import peoplesBudget from '../../data/peoplesBudget';

/*
 * mitigation: { id: null, name: "", cost: 0, parents: [], description: "", theme: "" }
 * harm: { id: null, name: "", quantity: 0, parents: [], description: "" }
 * office: { id: null, name: "", parents: [], description: "" }
 */

export default function MakeSafetyPlan({ setPanelContent }) {
  // State!
  const [harms, setHarms] = useState(peoplesBudget.harms);
  const [mitigations, setMitigations] = useState(peoplesBudget.mitigations);

  const entityArraySorter = (a, b) => a.id > b.id ? 1 : -1;

  // Harms
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
    setHarms([...unchangedHarms, harm].sort(entityArraySorter));
    setPanelContent(null);
  };

  // Mitigations
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
    setMitigations([...unchangedMitigations, mitigation].sort(entityArraySorter));
    setPanelContent(null);
  }

  // Hover actions
  const highlightMouseEnterFactory = (entityType, entityId) => (event) => {
    const entityCollection = (entityType === 'harm') ? harms : mitigations;
    const entity = entityCollection.find(e => e.id === entityId);
    if (!entity) return;

    const newEntity = { ...entity, highlight: 1 };
    const otherEntities = entityCollection
      .filter(e => e.id !== entity.id)
      .map(e => ({ ...e, highlight: -1 }))
    if (entityType === 'harm') {
      setHarms([newEntity, ...otherEntities].sort(entityArraySorter));
    } else {
      setMitigations([newEntity, ...otherEntities].sort(entityArraySorter));
    }
  }
  const highlightMouseExitFactory = () => (event) => {
    const newHarms = harms.map(h => ({...h, highlight: 0}));
    const newMitigations = mitigations.map(m => ({...m, highlight: 0}));
    setHarms(newHarms);
    setMitigations(newMitigations);
  }
  const getHighlightClass = (highlight) => {
    if (highlight === 1) return 'highlighted';
    if (highlight === -1) return 'lowlighted';
    return '';
  }

  // Connections
  // connection = { mitigation
  return (
    <div>
      <div className="row">
        <div className="twelve columns">
          <Graph mitigations={mitigations} harms={harms} />
        </div>
      </div>

      <div className="row">
        <div className="one-half column">
          <h2>Harms</h2>
          <h3>What is causing people to be unsafe in Minneapolis?</h3>
          <button type="button" onClick={addHarm}>Describe Harm</button>
          <div className="safetyItems">
            { harms.map(harm => <div
              key={harm.id}
              className={(`harm-${harm.id} ${getHighlightClass(harm.highlight)}`)}
              onMouseEnter={highlightMouseEnterFactory('harm', harm.id)}
              onMouseLeave={highlightMouseExitFactory()}
            >
              {harm.name} - {harm.quantity}
            </div>) }
          </div>
        </div>

        <div className="one-half column">
          <h2>Mitigations</h2>
          <h3>What solutions reduce the risk of someone being harmed, or help them heal?</h3>
          <button type="button" onClick={addMitigation}>Describe Mitigation</button>
          <div className="safetyItems">
            { mitigations.map(mitigation => <div
              key={mitigation.id}
              className={(`mitigation-${mitigation.id} ${getHighlightClass(mitigation.highlight)}`)}
              onMouseEnter={highlightMouseEnterFactory('mitigation', mitigation.id)}
              onMouseLeave={highlightMouseExitFactory()}
            >
              {mitigation.name} - ${mitigation.cost}
            </div>) }
          </div>
        </div>

        {/*{*/}
        {/*  process.browser && (*/}
        {/*    // Draw connections to represent mitigation of harms*/}
        {/*    mitigations.map(m =>  m.targets.map(mTarget => <SteppedLineTo*/}
        {/*      key={`${m.id}-${mTarget.id}`}*/}
        {/*      from={(`mitigation-${m.id}`)}*/}
        {/*      to={(`harm-${mTarget.id}`)}*/}
        {/*      fromAnchor={'left'}*/}
        {/*      toAnchor={'right'}*/}
        {/*      orientation={'h'}*/}
        {/*    />))*/}
        {/*  )*/}
        {/*}*/}
      </div>
    </div>
  );
}
