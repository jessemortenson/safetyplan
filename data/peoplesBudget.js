export default {
  mitigations: [
    {
      id: "mental-health-teams",
      name: "24/7 Mental Health Teams",
      cost: 4500000,
      parents: [],
      description: "24/7 city-wide, rapid-response mobile mental health teams",
      theme: "health",
      targets: [{ id: "police-violence"}, {id: "mental-health"}]
    },
    {
      id: "trauma-counselor-schools",
      name: "Trauma counselors",
      cost: 1000000,
      parents: [],
      description: "Trauma counselors for youth in schools",
      theme: "health",
      targets: [{ id: "mental-health" }],
    },
    {
      id: "multilingual-pandemic-materials",
      name: "Multilingual pandemic materials",
      cost: 5000,
      parents: [],
      description: "Pandemic response resources made available in all languages reflected in Minneapolis communities",
      theme: "health",
      targets: [{ id: "pandemic" }],
    },
    {
      id: "culturally-specific-mental-health",
      name: "Culturally-specific mental health",
      cost: 1000000,
      parents: [],
      description: "Expand existing culturally-specific, community and mental health programs with emphasis on programs offering services in Spanish, Somali, Oromo, Hmong, and languages other than English",
      theme: "health",
      targets: [{ id: "mental-health" }],
    },
    {
      id: "indigenous-trad-healing",
      name: "Indigenous traditional healing",
      cost: 500000,
      parents: [],
      description: "Fund traditional Indigenous healing methods for relatives experiencing opioid addiction and homelessness",
      theme: "health",
      targets: [{ id: "housing" }, { id: "addiction" }]
    },
    {
      id: "health-dept-cuts",
      name: "Restore Health Dept cuts",
      cost: 90000,
      parents: [],
      description: "Restore funding to the health department cuts that disproportionately affect BIPOC communities, including the cuts for nurses who address asthma and lead exposure, air quality testing, and the Lead and Healthy Homes program",
      theme: "health",
      targets: [{ id: "physical-health" }],
    },
    {
      id: "safe-consumption-sites",
      name: "Safe consumption sites",
      cost: 150000,
      parents: [],
      description: "Fund a pilot study for safe consumption sites",
      theme: "health",
      targets: [{ id: "addiction" }, { id: "physical-health" }],
    },
    {
      id: "culturally-specific-drop-in",
      name: "Culturally-specific drop-in centers",
      cost: 1000000,
      parents: [],
      description: "Fund the development of a minimum of two culturally-specific, community-based drop-in centers with a focus on harm reduction, at least one in North and one in South.",
      theme: "health",
      targets: [{ id: "addiction" }, { id: "physical-health" }],
    },
    {
      id: "grassroots-harm-reduction",
      name: "Grassroots harm reduction",
      cost: 100000,
      parents: [],
      description: "Fund grassroots harm reduction groups like Southside Harm Reduction and SWOP MPLS’s outreach teams",
      theme: "health",
      targets: [{ id: "addiction" }, { id: "physical-health" }],
    },
    {
      id: "harm-reduction-supplies",
      name: "Harm reduction supplies",
      cost: 500000,
      parents: [],
      description: "Fund harm reduction supplies, including clean syringes for existing syringe exchanges, grassroots programs and outreach programs outside of Syringe Service Programs (ex. public health outreach workers, shelters etc.)",
      theme: "health",
      targets: [{ id: "addiction" }, { id: "physical-health" }],
    },
    {
      id: "mobile-outreach-medicine",
      name: "Mobile outreach & medicine support",
      cost: 250000,
      parents: [],
      description: "Fund vehicle and other mobile support for outreach teams, such as mobile medicine and shelter for care and connecting with services",
      theme: "health",
      targets: [{ id: "physical-health" }],
    },
    {
      id: "public-health-education",
      name: "Public health education",
      cost: 300000,
      parents: [],
      description: "Fund the development and delivery of public health education about safer drug use, safer sexual health, infectious diseases, and connecting to low barrier, culturally specific community resources. This education must be destigmatized, evidence-based, harm reduction-based and developed by people with lived experience in partnership with existing grassroots harm reduction programs",
      theme: "health",
      targets: [{ id: "physical-health" }, { id: "addiction" }]
    },
    {
      id: "build-safer-streets",
      name: "Build safer streets",
      cost: 2500000,
      parents: [],
      description: "Build safer streets for pedestrians and bikers according to SMPSC’s recommendations",
      theme: "health",
      targets: [{ id: "unsafe-streets"}]
    }
  ],
  harms: [
    {
      id: "police-violence",
      name: "Police violence",
      quantity: 20
    },
    {
      id: "mental-health",
      name: "Mental health care",
      quantity: 40,
    },
    {
      id: "addiction",
      name: "Addiction & unsafe drug use",
      quantity: 15,
    },
    {
      id: "pandemic",
      name: "Covid-19 pandemic",
      quantity: 70,
    },
    {
      id: "physical-health",
      name: "Physical health care",
      quantity: 40,
    },
    {
      id: "unsafe-streets",
      name: "Unsafe streets",
      quantity: 40,
    },
    {
      id: "housing",
      name: "Housing access",
      quantity: 20,
    }
  ],
}
