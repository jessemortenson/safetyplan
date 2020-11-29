import React, { useState, useRef, useEffect } from "react";
import EditHarm from "./EditHarm";
import EditMitigation from './EditMitigation';
import Graph from './Graph';
import peoplesBudget from '../../data/peoplesBudget';
import safetyForAllBudget from "../../data/safetyForAllBudget";
import defaultHarms from '../../data/harms';
import currencyFormatter from "../../shared/utils/currencyFormatter";

/*
 * mitigation: { id: null, name: "", cost: 0, parents: [], description: "", theme: "" }
 * harm: { id: null, name: "", quantity: 0, parents: [], description: "" }
 * office: { id: null, name: "", parents: [], description: "" }
 */

export default function MakeSafetyPlan({ setPanelContent }) {
  const plans = [
    {
      id: "peoplesBudget",
      name: "People's Budget",
      authors: "Black Visions, Reclaim the Block and others",
      url: "https://docs.google.com/document/d/16-3SKF5E040Zax0nemxedPWRRsv3FJgStKO4s0lCeWw/edit",
      mitigations: peoplesBudget,
    },
    {
      id: "safetyForAll",
      name: "Safety for All",
      authors: "Councilmembers Phillipe Cunningham, Steve Fletcher, Lisa Bender",
      url: "https://beta.documentcloud.org/documents/20417659-2020-11-27-minneapolis-safety-for-all-budget-proposal",
      mitigations: safetyForAllBudget,
    }
  ]

  // State!
  const [planId, setPlanId] = useState('peoplesBudget')
  const [harms, setHarms] = useState(defaultHarms);
  const [showHarms, setShowHarms] = useState(false);
  const [harmHighlighted, setHarmHighlighted] = useState(null);
  const initialPlan = plans.find(p => p.id === planId);
  const [mitigations, setMitigations] = useState((initialPlan && initialPlan.mitigations) || []);
  const [mitigationsHighlighted, setMitigationsHighlighted] = useState([]);
  const [graphDimensions, setGraphDimensions] = useState({ width: 960, height: 640 })

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

  // Set Plan
  const setPlanClickHandlerFactory = (plan) => (event) => {
    event.preventDefault();

    // Update the plan - and correspondingly update mitigations
    setPlanId(plan.id);
    setMitigations(plan.mitigations);
  }
  const currentPlan = plans.find(p => p.id === planId);
  const currentPlanCost = currentPlan.mitigations.reduce((cost, m) => m.cost + cost, 0);

  // Set show harms
  const showHarmsChangeHandler = (event) => {
    setShowHarms(!showHarms);
  }

  // Set mitigation highlighted
  const mitigationHighlightHandlerFactory = (mitigation) => (event) => {
    event.preventDefault();
    const wasAlreadyHighlighted = mitigationsHighlighted.find(id => id === mitigation.id);
    if (wasAlreadyHighlighted) {
      setMitigationsHighlighted([...mitigationsHighlighted].filter(id => id !== mitigation.id));
    } else {
      setMitigationsHighlighted([...mitigationsHighlighted].concat([mitigation.id]));
    }
  }

  // Set Harm highlighted
  const harmHighlightFactory = (harm) => (event) => {
    event.preventDefault();
    if (harmHighlighted === harm.id) {
      setHarmHighlighted(null);
    } else {
      setHarmHighlighted(harm.id);
    }
  }
  const getHarmHighlightClass = (harm) => {
    if (harmHighlighted !== null && harmHighlighted !== harm.id) {
      return "lowlighted";
    }
    if (harmHighlighted === harm.id) {
      return "highlighted";
    }
    return "";
  }

  // responsive graph size ???
  const graphContainerRef = useRef();
  useEffect(() => {
    if (graphContainerRef.current && graphContainerRef.current.offsetWidth && graphContainerRef.current.offsetWidth !== graphDimensions.width) {
      const newDimensions = { width: graphContainerRef.current.offsetWidth, height: graphContainerRef.current.offsetWidth / 2 }
      if (window.matchMedia("(orientation: portrait) and (max-width: 540px)").matches) {
        // go portrait for mobile devices in portrait orientation
        newDimensions.height = newDimensions.width * 1.5;
      }
      setGraphDimensions(newDimensions);
    }
  });

  return (
    <div>
      <div className="row">
        <div className="twelve columns plan-selection">
          { plans.map(plan => (
            <button key={plan.id} className={plan.id === planId ? "button-primary" : ""} onClick={setPlanClickHandlerFactory(plan)}>
              {plan.name}
            </button>
          ))}
        </div>
      </div>

      <div className="row plan-info">
        <div className="nine columns">
          Plan shown: { currencyFormatter(currentPlanCost) } <strong>{currentPlan.name }</strong> by {currentPlan.authors}
        </div>
        <div className="three columns plan-learn-more"><a href={currentPlan.url} target="_blank">Read the plan</a></div>
      </div>

      <div className="row graph-controls">
        <div className="twelve columns">
          <label>
            <input type="checkbox" checked={showHarms} onChange={showHarmsChangeHandler} />
            <span className="label-body">Show Harms addressed by proposals</span>
          </label>
        </div>
      </div>

      <div className="row">
        <div className="twelve columns maker-graph" ref={graphContainerRef}>
          <Graph
            mitigations={mitigations}
            harms={harms}
            showHarms={showHarms}
            height={graphDimensions.height}
            width={graphDimensions.width}
          />
        </div>
      </div>

      <div className="row">
        <div className="one-half column">
          <h2>Proposals</h2>
          <h3>What solutions reduce the risk of someone being harmed, or help them heal?</h3>
          {/*<button type="button" onClick={addMitigation}>Describe Mitigation</button>*/}
          <div className="safetyItems">
            { mitigations.filter(m => harmHighlighted === null || m.targets.find(t => t.id === harmHighlighted)).sort((a, b) => {
              if (a.cost > b.cost) {
                return -1;
              }
              if (b.cost < a.cost) {
                return 1;
              }
              return 0;
            }).map(mitigation => <div
              key={mitigation.id}
              className={(`mitigation-${mitigation.id}`)}
              onClick={mitigationHighlightHandlerFactory(mitigation)}
              // onMouseEnter={highlightMouseEnterFactory('mitigation', mitigation.id)}
              // onMouseLeave={highlightMouseExitFactory()}
            >
              <span className="toggle">{ mitigationsHighlighted.includes(mitigation.id) ? "[-]" : "[+]" }</span>{" "}
              {mitigation.name} - {currencyFormatter(mitigation.cost)}
              { mitigationsHighlighted.includes(mitigation.id) &&
                (
                  <p>{mitigation.description}</p>
                )
              }
            </div>) }
          </div>
        </div>

        <div className="one-half column">
          <h2>Harms</h2>
          <h3>What are some of the root causes of risk/unsafety to people in Minneapolis?</h3>
          {/*<button type="button" onClick={addHarm}>Describe Harm</button>*/}
          <div className="safetyItems">
            { harms.sort((a, b) => {
              if (a.quantity > b.quantity) {
                return -1;
              }
              if (b.quantity < a.quantity) {
                return 1;
              }
              return 0;
            }).map(harm => <div
              key={harm.id}
              className={`harm-${harm.id} ${getHarmHighlightClass(harm)}`}
              onClick={harmHighlightFactory(harm)}
              // onMouseEnter={highlightMouseEnterFactory('harm', harm.id)}
              // onMouseLeave={highlightMouseExitFactory()}
            >
              {harm.name}
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
