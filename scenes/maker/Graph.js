import React, { useEffect, useRef } from "react";
// import dynamic from "next/dynamic";
import { forceCollide } from "d3-force-3d";

export default function Graph({ mitigations, harms }) {
  // https://coolors.co/eddcd2-fff1e6-fde2e4-fad2e1-c5dedd-dbe7e4-f0efeb-d6e2e9-bcd4e6-99c1de
  const mitigationColors = {
    health: "#BCD4E6",
    other1: "#99C1DE",
    other2: "#D6E2E9",
    other3: "#DBE7E4",
    other4: "#C5DEDD",
    other5: "#FFF1E6",
    other6: "#EDDCD2",
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

  const currencyFormatter = (num) => {
    if(num > 999 && num < 1000000){
      return `$${(num/1000).toFixed(1)}K`; // convert to K for number from > 1000 < 1 million
    }else if(num >= 1000000){
      return `$${(num/1000000).toFixed(1)}M`; // convert to M for number from > 1 million
    }else if(num < 900){
      return `$${num}`; // if value < 1000, nothing to do
    }
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

  const mitigationScaler = cost => .00002 * cost;
  const mitigationMapper = (m) => ({
    ...m,
    type: "mitigation",
    color: mitigationColors[m.theme],
    val: mitigationScaler(m.cost), // affects node size
  })

  const harmScaler = quantity => quantity;
  const harmMapper = (h) => ({
    ...h,
    type: "harm",
    color: "#bfacb5",
    val: harmScaler(h.quantity),
  });

  const mitigationToLinksReducer = (links, m) => {
    return links.concat(m.targets.map(t => ({ source: m.id, target: t.id })));
  }

  const cityBudgetScaler = cost => .00000002 * cost;
  const makeCityBudgetAndLinks = (mitigations) => {
    const budget = {
      id: "budget",
      type: "budget",
      name: "City Budget",
      description: "The City Budget",
      val: cityBudgetScaler(1470000000),
      color: '#aaa'
    };
    const links = mitigations.map(m => ({ source: m.id, target: budget.id }));

    return [budget, links];
  }

  const [budgetNode, budgetLinks] = makeCityBudgetAndLinks(mitigations);
  const graphData = {
    nodes: mitigations.map(mitigationMapper).concat(harms.map(harmMapper)).concat([budgetNode]),
    links: mitigations.reduce(mitigationToLinksReducer, []).concat(budgetLinks),
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
    const text = (node.type === 'mitigation' && node.val > 15) ? `${baseText}: ${node.name}` : baseText;
    ctx.fillText(text, x, y);
  }
  const circleMaker = (node, ctx, scale) => {
    const { x, y } = node;
    ctx.beginPath();
    ctx.arc(x, y, node.val/2, 0, 2 * Math.PI, false);
    ctx.fill();
  }
  const squareMaker = (node, ctx, scale) => {
    const { x, y } = node;
    const width = node.val * 1.5;
    const height = node.val;
    ctx.fillRect(x - width/2, y - height/2, width, height);
  }
  const shapeMaker = (node, ctx, scale) => {
    ctx.fillStyle = node.color;
    if (node.type === 'budget') {
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
      fg.d3Force('collide', forceCollide(n => n.val/2 + 10));
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
    width={960}
    height={640}
    cooldownTime={3000}
    nodeCanvasObject={shapeMaker}
    onEngineStop={onStop}
    ref={fgRef}
  />
}
