import React from 'react';
import dynamic from 'next/dynamic'

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

  const mitigationToLinksReducer = (links, m) => {
    return links.concat(m.targets.map(t => ({ source: m.id, target: t.id })));
  }

  const makeCityBudgetAndLinks = (mitigations) => {
    const budget = { id: "budget", name: "City Budget", description: "The City Budget" };
    const links = mitigations.map(m => ({ source: m.id, target: budget.id }));

    return [budget, links];
  }

  const [budgetNode, budgetLinks] = makeCityBudgetAndLinks(mitigations);
  const graphData = {
    nodes: mitigations.concat(harms).concat([budgetNode]),
    links: mitigations.reduce(mitigationToLinksReducer, []).concat(budgetLinks),
  };

  const DynamicLoadedForceGraph2D = dynamic(() => import("react-force-graph").then(forceGraphModule => forceGraphModule.ForceGraph2D), { ssr: false });

  return <DynamicLoadedForceGraph2D graphData={graphData} width={960} height={640} />
}
