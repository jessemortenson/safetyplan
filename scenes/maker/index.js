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
      authors: "Black Visions, Reclaim the Block, Take Action MN, Jewish Community Action, Inquilinxs Unidxs, " +
        "Reviving Sisterhood, Outfront MN, Violence Free MN, SWOP Mpls, Navigate MN and others",
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
  const [showHelp, setShowHelp] = useState(false);
  const [harms, setHarms] = useState(defaultHarms);
  const [showHarms, setShowHarms] = useState(true);
  const [showCityBudget, setShowCityBudget] = useState(false);
  const [showPoliceBudget, setShowPoliceBudget] = useState(false);
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
  const harmsByQuantitySorter = (a, b) => {
    if (a.quantity > b.quantity) {
      return -1;
    }
    if (b.quantity < a.quantity) {
      return 1;
    }
    return 0;
  };
  const harmsByAlphaSorter = (a, b) => a.name.localeCompare(b.name, 'en', { numeric: true });

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

  // Toggle help
  const toggleHelpHandler = (event) => {
    event.preventDefault();
    setShowHelp(!showHelp);
  }

  // Set Plan
  const setPlanClickHandlerFactory = (plan) => (event) => {
    event.preventDefault();

    // Update the plan - and correspondingly update mitigations
    setPlanId(plan.id);
    setMitigations(plan.mitigations);
    setHarmHighlighted(null);
  }
  const currentPlan = plans.find(p => p.id === planId);
  const currentPlanCost = currentPlan.mitigations.reduce((cost, m) => m.cost + cost, 0);

  // Set show harms
  const showHarmsChangeHandler = (event) => {
    setShowHarms(!showHarms);
  }

  // Set show City Budget
  const showCityBudgetChangeHandler = (event) => {
    setShowCityBudget(!showCityBudget);
  }

  // Set show Police Budget
  const showPoliceBudgetChangeHandler = (event) => {
    setShowPoliceBudget(!showPoliceBudget);
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
  const harmHighlightChangeHandler = (event) => {
    event.preventDefault();
    if (event.target.value === "" && harmHighlighted !== null) {
      setHarmHighlighted(null);
    } else if (event.target.value !== harmHighlighted) {
      setHarmHighlighted(event.target.value);
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

  // Filter mitigations & harms
  const mitigationsShown = mitigations.filter(m => harmHighlighted === null || m.targets.find(t => t.id === harmHighlighted));
  const harmsTargetedByMitigations = harms.filter((h) => {
    let harmTargetedByMitigation = false;
    mitigations.forEach(m => {
      if (m.targets.find(t => t.id === h.id)) {
        harmTargetedByMitigation = true;
      }
    });
    return harmTargetedByMitigation;
  });
  const harmsToShow = (harmHighlighted !== null && [harms.find(h => h.id === harmHighlighted)]) || harmsTargetedByMitigations;

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

  // elements
  const harmSelectDropDown = (
    <select className="u-full-width" onChange={harmHighlightChangeHandler}>
      <option value="" selected={harmHighlighted === null}>-- show only proposals re:...</option>
      <option value="">All</option>
      { harmsTargetedByMitigations.sort(harmsByAlphaSorter).map(h => (
        <option value={h.id} selected={harmHighlighted === h.id}>{h.name}</option>
      ))}
    </select>
  );

  return (
    <div>
      <div className="row">
        <div className="twelve columns how-to">
          <p className="how-to-link"><a href="#" onClick={toggleHelpHandler}><strong>How to use this tool ❓</strong></a></p>
          { showHelp && <div>
            <p>This tool visualizes two proposals for new public safety programs in
              Minneapolis. To start, click either the <strong>People's Budget</strong> or <strong>Safety For All</strong> button to examine one of them.
              Each solution in the
              proposal is represented by a circle, sized proportionately to its budget cost. Each solution is also linked to
              one or more harms that the solution attempts to fix (these are pale-purple circles).</p>
              <p>You can pinch (or use mouse/trackpad scrolling) to zoom in. You can also hide or show elements of the
              graph by checking or unchecking the checkboxes. Try showing the size of the police budget to put things
              in perspective, or unchecking the "Show Harms" checkbox if you want to just see proposed solutions.</p>
            <p>You can also scroll past the graph to see a list of the solutions in the proposal. Click a solution in the list
              to read more details about it. You can use the drop-downs to focus in on solutions related to a specific harm.
              <br /><em><a href="#" onClick={toggleHelpHandler}>hide this help message</a></em>
            </p>
            <p></p>
          </div> }

        </div>
      </div>

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
          Plan shown: <strong>{ currencyFormatter(currentPlanCost) }</strong> <strong>{currentPlan.name }</strong> by {currentPlan.authors}
        </div>
        <div className="three columns plan-learn-more"><a href={currentPlan.url} target="_blank">Read the plan</a></div>
      </div>

      <div className="row graph-controls">
        <div className="eight columns">
          <label>
            <input type="checkbox" checked={showHarms} onChange={showHarmsChangeHandler} />
            <span className="label-body">Show Harms addressed by proposals</span>
          </label>
          <label>
            <input type="checkbox" checked={showCityBudget} onChange={showCityBudgetChangeHandler} />
            <span className="label-body">Show size of City Budget</span>
          </label>
          <label>
            <input type="checkbox" checked={showPoliceBudget} onChange={showPoliceBudgetChangeHandler} />
            <span className="label-body">Show size of Police Budget</span>
          </label>
        </div>
        <div className="four columns harm-selector-graph">
          { harmSelectDropDown }
        </div>
      </div>

      <div className="row">
        <div className="twelve columns maker-graph" ref={graphContainerRef}>
          <Graph
            mitigations={mitigations.filter(m => harmHighlighted === null || m.targets.find(t => t.id === harmHighlighted))}
            harms={harmsToShow}
            showHarms={showHarms}
            showCityBudget={showCityBudget}
            showPoliceBudget={showPoliceBudget}
            height={graphDimensions.height}
            width={graphDimensions.width}
          />
        </div>
      </div>

      <div className="row">
        <div className="one-half column mitigations-list">
          <h2>Proposals</h2>
          <h3>What solutions reduce the risk of someone being harmed, or help them heal?</h3>
          <div className="harm-selector-mobile">
            { harmSelectDropDown }
          </div>
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

        <div className="one-half column harms-list">
          <h2>Harms</h2>
          <h3>What are some of the root causes of risk/unsafety to people in Minneapolis?</h3>
          {/*<button type="button" onClick={addHarm}>Describe Harm</button>*/}
          <div className="safetyItems">
            { harmsTargetedByMitigations.sort(harmsByQuantitySorter).map(harm => <div
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
