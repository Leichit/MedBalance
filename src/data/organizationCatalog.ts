// International Healthcare Organizations Catalog (Demo Data)
// Demonstrates global scalability of the MedBalance platform architecture

export interface OrganizationEntry {
  id: string;
  name: string;
  country: string;
  city: string;
  type: 'Clinical Hospital' | 'Pharmacy Chain' | 'National Depot' | 'Regional Logistics Hub' | 'Pharma Manufacturer';
  activeBedsOrOutlets: string;
  connectedSystem: string;
  status: 'Active (Demo)' | 'Connected (Simulated)';
  isCurrentDemoOrg?: boolean;
}

export const DEMO_ORGANIZATIONS: OrganizationEntry[] = [
  // Primary Demo Institution (Kazakhstan)
  {
    id: 'KZ-DEMO-01',
    name: 'Astana Demo Hospital',
    country: 'Kazakhstan',
    city: 'Astana',
    type: 'Clinical Hospital',
    activeBedsOrOutlets: '650 Beds · Inpatient Surgery & Oncology',
    connectedSystem: 'DamuMed / KMIS Gateway (Simulated)',
    status: 'Active (Demo)',
    isCurrentDemoOrg: true,
  },
  {
    id: 'KZ-DEPOT-02',
    name: 'SK-Pharmacy Central Logistics Depot',
    country: 'Kazakhstan',
    city: 'Astana',
    type: 'National Depot',
    activeBedsOrOutlets: 'Cold-Chain Logistics Hub · 14 Regions',
    connectedSystem: 'ISLO National Drug System (Simulated)',
    status: 'Connected (Simulated)',
  },
  {
    id: 'KZ-HOSP-03',
    name: 'Almaty City Clinical Hospital #7',
    country: 'Kazakhstan',
    city: 'Almaty',
    type: 'Clinical Hospital',
    activeBedsOrOutlets: '800 Beds · Intensive Care & Trauma',
    connectedSystem: 'DamuMed EHR (Simulated)',
    status: 'Connected (Simulated)',
  },
  {
    id: 'KZ-CHAIN-04',
    name: 'Europharma National Pharmacy Chain',
    country: 'Kazakhstan',
    city: 'Shymkent',
    type: 'Pharmacy Chain',
    activeBedsOrOutlets: '320 Retail Branches',
    connectedSystem: 'Retail POS Gateway (Simulated)',
    status: 'Connected (Simulated)',
  },
  // International Scale Demonstrators
  {
    id: 'DE-CHAR-01',
    name: 'Charité Universitätsmedizin Berlin',
    country: 'Germany',
    city: 'Berlin',
    type: 'Clinical Hospital',
    activeBedsOrOutlets: '3,000 Beds · University Medical Center',
    connectedSystem: 'HL7 / FHIR Central Server (Simulated)',
    status: 'Connected (Simulated)',
  },
  {
    id: 'US-MAYO-01',
    name: 'Mayo Clinic Health System',
    country: 'United States',
    city: 'Rochester',
    type: 'Clinical Hospital',
    activeBedsOrOutlets: '1,200 Beds · Tertiary Referral Center',
    connectedSystem: 'Epic Systems Interoperability (Simulated)',
    status: 'Connected (Simulated)',
  },
  {
    id: 'KR-SNUH-01',
    name: 'Seoul National University Hospital',
    country: 'South Korea',
    city: 'Seoul',
    type: 'Clinical Hospital',
    activeBedsOrOutlets: '1,780 Beds · Digital Health Smart Hospital',
    connectedSystem: 'BESTCare 2.0 MIS (Simulated)',
    status: 'Connected (Simulated)',
  },
  {
    id: 'TR-ACIB-01',
    name: 'Acıbadem Healthcare Group',
    country: 'Turkey',
    city: 'Istanbul',
    type: 'Clinical Hospital',
    activeBedsOrOutlets: '22 Hospitals · International Patients',
    connectedSystem: 'Oracle Cerner API (Simulated)',
    status: 'Connected (Simulated)',
  },
  {
    id: 'CH-ROCH-01',
    name: 'F. Hoffmann-La Roche Central Supply',
    country: 'Switzerland',
    city: 'Basel',
    type: 'Pharma Manufacturer',
    activeBedsOrOutlets: 'Global API & Biologics Logistics',
    connectedSystem: 'SAP Supply Chain EDI (Simulated)',
    status: 'Connected (Simulated)',
  },
];
