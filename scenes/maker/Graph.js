import React from 'react';
import {ForceGraph, ForceGraphNode, ForceGraphLink} from 'react-vis-force';

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

  const renderMitigationTargets = (mitigation) => mitigation.targets.map(t => (
    <ForceGraphLink link={{ source: mitigation.id, target: t.id }} />
  ));

  return (
    <ForceGraph simulationOptions={{ height: 480, width: 960 }} showLabels zoom zoomOptions={{ minScale: 100, maxScale: 200 }}>
      { mitigations.map(m => <ForceGraphNode node={{ id: m.id }} fill={mitigationColors[m.theme]} radius={mitigationRadiusTransform(m.cost)} />) }
      { harms.map(h => <ForceGraphNode node={{ id: h.id }} fill={harmColors[h.id]} radius={harmRadiusTransform(h.quantity)} />) }

      { mitigations.map(m => renderMitigationTargets(m)) }

      {/*<ForceGraphNode node={{ id: 'first-node' }} fill="red" />*/}
      {/*<ForceGraphNode node={{ id: 'second-node' }} fill="blue" />*/}
      {/*<ForceGraphLink link={{ source: 'first-node', target: 'second-node' }} />*/}
    </ForceGraph>
  );
}
