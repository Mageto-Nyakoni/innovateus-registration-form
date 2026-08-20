export const countryOptions = [
  { label: 'Select country (required)', value: '', disabled: true },
  { label: 'United States', value: 'United States' },
  { label: 'Outside the United States', value: 'Outside the United States' }
]

export const usStateOptions = [
  { label: 'Select state (required)', value: '', disabled: true },
  { label: 'AL', value: 'AL' },
  { label: 'AK', value: 'AK' },
  { label: 'AS', value: 'AS' },
  { label: 'AZ', value: 'AZ' },
  { label: 'AR', value: 'AR' },
  { label: 'CA', value: 'CA' },
  { label: 'CO', value: 'CO' },
  { label: 'CT', value: 'CT' },
  { label: 'DE', value: 'DE' },
  { label: 'DC', value: 'DC' },
  { label: 'FL', value: 'FL' },
  { label: 'GA', value: 'GA' },
  { label: 'GU', value: 'GU' },
  { label: 'HI', value: 'HI' },
  { label: 'ID', value: 'ID' },
  { label: 'IL', value: 'IL' },
  { label: 'IN', value: 'IN' },
  { label: 'IA', value: 'IA' },
  { label: 'KS', value: 'KS' },
  { label: 'KY', value: 'KY' },
  { label: 'LA', value: 'LA' },
  { label: 'ME', value: 'ME' },
  { label: 'MD', value: 'MD' },
  { label: 'MA', value: 'MA' },
  { label: 'MI', value: 'MI' },
  { label: 'MN', value: 'MN' },
  { label: 'MS', value: 'MS' },
  { label: 'MO', value: 'MO' },
  { label: 'MT', value: 'MT' },
  { label: 'NE', value: 'NE' },
  { label: 'NV', value: 'NV' },
  { label: 'NH', value: 'NH' },
  { label: 'NJ', value: 'NJ' },
  { label: 'NM', value: 'NM' },
  { label: 'NY', value: 'NY' },
  { label: 'NC', value: 'NC' },
  { label: 'ND', value: 'ND' },
  { label: 'MP', value: 'MP' },
  { label: 'OH', value: 'OH' },
  { label: 'OK', value: 'OK' },
  { label: 'OR', value: 'OR' },
  { label: 'PA', value: 'PA' },
  { label: 'PR', value: 'PR' },
  { label: 'RI', value: 'RI' },
  { label: 'SC', value: 'SC' },
  { label: 'SD', value: 'SD' },
  { label: 'TN', value: 'TN' },
  { label: 'TX', value: 'TX' },
  { label: 'UT', value: 'UT' },
  { label: 'VT', value: 'VT' },
  { label: 'VI', value: 'VI' },
  { label: 'VA', value: 'VA' },
  { label: 'WA', value: 'WA' },
  { label: 'WV', value: 'WV' },
  { label: 'WI', value: 'WI' },
  { label: 'WY', value: 'WY' }
]

export const governmentOrganizationOptions = [
  { label: 'Select', value: '', disabled: true },
  {
    label: "Yes, I'm an employee of a government agency",
    value: "Yes, I'm an employee of a government agency"
  },
  {
    label: "Yes, I'm a contractor or consultant working with a government agency",
    value: "Yes, I'm a contractor or consultant working with a government agency"
  },
  {
    label:
      "Yes, I work for a government-affiliated organization (e.g., public university, nonprofit, or quasi-governmental organization)",
    value:
      "Yes, I work for a government-affiliated organization (e.g., public university, nonprofit, or quasi-governmental organization)"
  },
  {
    label: 'No, I do not work for or support a government or government-affiliated organization',
    value: 'No, I do not work for or support a government or government-affiliated organization'
  }
]

export const governmentLevelOptions = [
  { label: 'Select', value: '', disabled: true },
  {
    label: 'International or Intergovernmental Organization (e.g. UN, OECD, EU)',
    value: 'International or Intergovernmental Organization (e.g. UN, OECD, EU)'
  },
  { label: 'National or Federal Level', value: 'National or Federal Level' },
  { label: 'State or Provincial level', value: 'State or Provincial level' },
  { label: 'Tribal Government', value: 'Tribal Government' },
  { label: 'County or equivalent level', value: 'County or equivalent level' },
  { label: 'Municipal, City, or Local level', value: 'Municipal, City, or Local level' },
  { label: 'Other level not listed here', value: 'Other level not listed here' }
]

export const workshopSeries = [
  {
    id: 'practical-evaluation',
    title: 'Practical Approaches to Evaluating AI for Public Benefit',
    badge: 'PB'
  },
  {
    id: 'ai-energy-environment',
    title: 'AI, Energy, and the Environment: Use, Policy, and Tradeoffs',
    badge: 'EE'
  },
  {
    id: 'public-procurement',
    title: 'AI for Public-Sector Procurement',
    badge: 'PP'
  },
  {
    id: 'democratic-public-ai',
    title: 'Democratic and Public AI: Practical Strategies for Buying, Building, and Governing AI',
    badge: 'DA'
  },
  {
    id: 'public-health',
    title: 'AI in Public Health',
    badge: 'PH'
  },
  {
    id: 'predictive-ai',
    title: 'The Good, the Bad and the Ugly of Predictive AI',
    badge: 'PA'
  },
  {
    id: 'legal-practice',
    title: 'Using AI in Public Sector Legal Practice',
    badge: 'LP'
  },
  {
    id: 'worker-centered-adoption',
    title: 'Worker-Centered AI Adoption in the Public Sector',
    badge: 'WC'
  },
  {
    id: 'ai-insourcing',
    title: 'AI Insourcing and the Government Product Model',
    badge: 'IG'
  },
  {
    id: 'amplify',
    title: 'Amplify: Mastering Public Communication in the AI Age',
    badge: 'AM'
  },
  {
    id: 'ai-agents',
    title: "Working with AI Agents in the Public Sector: What Works (and What Doesn't)",
    badge: 'AG'
  },
  {
    id: 'public-hr',
    title: 'AI for Public HR Professionals',
    badge: 'HR'
  },
  {
    id: 'cybersecurity',
    title: 'AI and Cybersecurity in the Public Sector for the Non-Expert',
    badge: 'CY'
  },
  {
    id: 'prompting-lab',
    title: 'The Prompting Lab: Real Prompts, Real Challenges, All Platforms',
    badge: 'PL'
  }
]
