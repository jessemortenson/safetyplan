export default [
  {
    id: "mental-health-teams",
    name: "24/7 Mental Health Crisis Response",
    cost: 2440000,
    parents: [],
    description: "Launch a non-police 911 Mental Health Crisis Response that can respond to non-threatening calls for service  during all shifts, in all neighborhoods. Embed mental health professionals in 911 and train 911 operators to more effectively triage mental health calls and dispatch appropriate responders",
    theme: "right-response",
    targets: [{ id: "police-violence"}, {id: "mental-health"}]
  },
  {
    id: "alternative-responses",
    name: "Alternative Responses",
    cost: 1490000,
    parents: [],
    description: "Expand 311 capacity to take theft and property damage reports, and parking complaint calls. Create a non-police city staff unit to take theft and property damage reports, and collect evidence. Transfer parking-related call responses from 911 and MPD to 311 and existing Parking & Traffic Control staff, who already handle most of these calls. Provide coordinated support for people experiencing homelessness",
    theme: "right-response",
    targets: [{ id: "police-violence" }]
  },
  {
    id: "expanded-violence-prevention",
    name: "Expanded Violence Prevention",
    cost: 2030000,
    parents: [],
    description: "Transfer existing Community Navigators from MPD to the Office of Violence Prevention \n" +
      "and add a Southeast Asian Community Navigator. Expand Next Step, the City’s hospital-based, bedside violence intervention program, which \n" +
      "already serves HCMC and North Memorial, to Abbott Northwestern hospital. Expand the Blueprint-Approved Institute to Prevent Violence to serve both Northside and \n" +
      "Southside communities. Develop and implement the Group Violence Intervention in South Minneapolis. Increase the Office of Violence Prevention operating budget to open Northside and \n" +
      "Southside offices for violence interrupters, and fully staff and evaluate programs.",
    theme: "prevent-violence",
    targets: [{ id: "street-violence" }]
  },
  {
    id: "neighborhood-safety-organizing",
    name: "Neighborhood Safety Organizing",
    cost: 1940000,
    parents: [],
    description: "Transfer existing Crime Prevention Specialists from MPD to the Neighborhood and " +
    "Community Relations department, where they will help community groups and " +
    "neighborhood organizations prevent crime. Fund restorative justice and de-escalation training for neighborhood organizations and \n" +
      "other community-based organizations. Increase the Violence Prevention Fund to invest in community-led violence prevention \n" +
      "strategies.",
    theme: "prevent-violence",
    targets: [{ id: "street-violence" }]
  },
  {
    id: "police-accountability",
    name: "Police Accountability",
    cost: 335000,
    parents: [],
    description: "Increase capacity within the Civil Rights Department’s Office of Police Conduct Review to \n" +
      "investigate complaints about police officer behavior. Move oversight and accountability for the proposed Early Intervention System from MPD \n" +
      "to Civil Rights.",
    theme: "police-accountability",
    targets: [{ id: "police-violence" }]
  }
];
