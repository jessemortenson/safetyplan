import React, { useEffect, useRef } from "react";
// import dynamic from "next/dynamic";
import { forceCollide } from "d3-force-3d";
import currencyFormatter from "../../shared/utils/currencyFormatter";

export default function Graph({ mitigations, harms, showHarms, showCityBudget, showPoliceBudget, height, width }) {
  // https://coolors.co/eddcd2-fff1e6-fde2e4-fad2e1-c5dedd-dbe7e4-f0efeb-d6e2e9-bcd4e6-99c1de
  const mitigationColors = {
    health: "#BCD4E6",
    "right-response": "#BCD4E6",
    other1: "#99C1DE",
    "economic-justice": "#D6E2E9",
    other3: "#DBE7E4",
    prevention: "#C5DEDD",
    "prevent-violence": "#C5DEDD",
    thriving: "#FFF1E6",
    "police-accountability": "#EDDCD2",
  }
  // https://coolors.co/172121-444554-7f7b82-bfacb5-e5d0cc
  const harmColors = {
    "police-violence": "#444554",
    "mental-health": "#bfacb5",
    "addiction": "#7f7b82",
    "pandemic": "#172121",
    "physical-health": "#bfacb5",
    "unsafe-streets": "#7f7b82",
    "housing": "#7f7b82",
  }

  const dotMin = 10;
  const dotMax = 100;

  const costs = mitigations.map(m => m.cost);
  const costMin = Math.min(...costs);
  const costMax = Math.max(...costs);
  const mitigationRadiusTransform = () => 50 // (cost) => ((cost - costMin) / (costMax - costMin)) * (dotMax - dotMin) + dotMin;

  const harmSizes = harms.map(h => h.quantity);
  const harmMin = Math.min(...harmSizes);
  const harmMax = Math.max(...harmSizes);
  const harmRadiusTransform = () => 25 // (quantity) => ((quantity - harmMin) / (harmMax - harmMin)) * (dotMax - dotMin) + dotMin;

  const realCostScale = .0002;
  const mitigationScaler = cost => realCostScale * cost;
  const mitigationMapper = (m) => ({
    ...m,
    type: "mitigation",
    color: mitigationColors[m.theme],
    val: mitigationScaler(m.cost), // affects node size
  })

  const harmScaler = quantity => quantity * 50;
  const harmMapper = (h) => ({
    ...h,
    type: "harm",
    color: "#bfacb5",
    val: harmScaler(h.quantity),
  });


  const mitigationToLinksReducer = (links, m) => {
    if (!showHarms) return [];
    return links.concat(m.targets.filter(t => harms.find(h => h.id === t.id)).map(t => ({ source: m.id, target: t.id })));
  }

  // City Budget
  // 2021 Mayor's budget - debt service - capital improvement
  // pg 4 http://www2.minneapolismn.gov/www/groups/public/@finance/documents/webcontent/wcmsp-226230.pdf
  const cityBudgetTotal = 1470000000 - 120400000 - 198500000;
  const cityBudgetScaler = cost => showCityBudget ? realCostScale * cost : .00000002 * cost;
  const makeCityBudgetAndLinks = (mitigations) => {
    const budget = {
      id: "budget",
      type: "budget",
      name: `${currencyFormatter(cityBudgetTotal)}: City Budget`,
      description: "The City Budget",
      val: cityBudgetScaler(cityBudgetTotal),
      color: '#aaa'
    };
    const links = mitigations.map(m => ({ source: m.id, target: budget.id }));

    return [budget, links];
  }

  // Police Budget
  // pg 4 http://www2.minneapolismn.gov/www/groups/public/@finance/documents/webcontent/wcmsp-226230.pdf
  const policeBudgetTotal = 178700000;
  const policeBudget = {
    id: "police",
    type: "mitigation",
    name: "Police",
    description: "Minneapolis Police Department (Mayor's proposed 2021 budget)",
    val: policeBudgetTotal * realCostScale,
    cost: policeBudgetTotal,
    color: '#999',
  }
  const policeLink = {
    source: "police",
    target: "budget"
  }
  const policeBudgetMaybe = showPoliceBudget ? [policeBudget] : [];
  const policeLinksMaybe = showPoliceBudget ? [policeLink] : [];

  // Graph data
  const [budgetNode, budgetLinks] = makeCityBudgetAndLinks(mitigations);
  const harmsToShow = showHarms ? harms.map(harmMapper) : [];
  const graphData = {
    nodes: mitigations.map(mitigationMapper).concat(harmsToShow).concat([budgetNode]).concat(policeBudgetMaybe),
    links: mitigations.reduce(mitigationToLinksReducer, []).concat(budgetLinks).concat(policeLinksMaybe),
  };

  // Shape makers
  // TODO seems like this runs forever ??? shapemaker is getting called constantly
  const labelMaker = (node, ctx, scale) => {
    const {x, y} = node;
    ctx.fillStyle = '#000';
    const fontsize = scale < 1 ? 8 : 12 / scale;
    ctx.font = `${fontsize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const baseText = (node.type === 'harm' || node.type === 'budget') ? node.name : currencyFormatter(node.cost);
    const text = (node.type === 'mitigation' && (node.val > 15 || scale > 4)) ? `${baseText}: ${node.name}` : baseText;
    const words = text.split(' ');
    if (words.length < 3) {
      ctx.fillText(text, x, y);
    } else {
      const vertPad = scale < 3 ? 3 : 1;
      ctx.fillText(words.slice(0, Math.floor(words.length / 2)).join(' '), x, y-vertPad)
      ctx.fillText(words.slice(Math.floor(words.length / 2)).join(' '), x, y+vertPad);
    }
  }
  const circleMaker = (node, ctx, scale) => {
    const { x, y } = node;
    // treat node.val as the desired *area* of the circle, not its radius
    // so solve the circle for radius
    const radius = Math.round(Math.sqrt(node.val/Math.PI));
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }
  const squareMaker = (node, ctx, scale) => {
    const { x, y } = node;
    const width = node.val * 1;
    const height = node.val;
    ctx.fillRect(x - width/2, y - height/2, width, height);
  }
  const shapeMaker = (node, ctx, scale) => {
    ctx.fillStyle = node.color;
    if (node.type === 'budget' && !showCityBudget) {
      squareMaker(node, ctx, scale);
    } else {
      circleMaker(node, ctx, scale);
    }
    labelMaker(node, ctx, scale);
  }

  // Effects and callbacks
  const fgRef = useRef();
  useEffect(() => {
    console.log('running UseEffect');
    const fg = fgRef.current;
    if (fg.d3Force) {
      // fg.d3Force('charge', null);
      // treat n.val as the intended AREA, not radius
      // so solve for radius
      fg.d3Force('collide', forceCollide(n =>  Math.round(Math.sqrt(n.val/Math.PI)) + 10));
    }
  }, []);

  let simulationRuns = 0;
  const onStop = () => {
    simulationRuns++;
    const fg = fgRef.current;
    // Re zoom after the first simulation run
    if (simulationRuns === 1) {
      fg.zoomToFit(300);
    }
  }

  let ForceGraph2D = () => null;
  if (typeof window !== 'undefined') ForceGraph2D = require('react-force-graph').ForceGraph2D;
  // The Dynamic component with SSR disabled doesn't seem to work with refs
  // fix from https://github.com/vasturiano/react-globe.gl/issues/15
  // fix that didn't work but should have: https://github.com/vercel/next.js/issues/4957#issuecomment-413841689
  // const DynamicLoadedForceGraph2D = dynamic(() => import("react-force-graph").then(forceGraphModule => forceGraphModule.ForceGraph2D), { ssr: false });
  // const ForwardedRefForceGraph2D = React.forwardRef((props, ref) => (
  //   <DynamicLoadedForceGraph2D {...props} forwardedRef={ref} />
  // ));
  return <ForceGraph2D
    graphData={graphData}
    width={width}
    height={height}
    cooldownTime={2000}
    nodeCanvasObject={shapeMaker}
    nodeRelSize={.6}
    onEngineStop={onStop}
    ref={fgRef}
  />
}
