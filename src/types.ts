export type RiskLevel = 'critical' | 'warning' | 'normal' | 'surplus';

export type DeliveryStatus = 'on_schedule' | 'delayed' | 'customs_check' | 'shipped';

export type DrugCategory =
  | 'Oncology'
  | 'Cardiology'
  | 'Diabetology & Endocrinology'
  | 'Infectious Diseases'
  | 'Rare (Orphan) Drugs'
  | 'Antibiotics'
  | 'Insulins & Endocrinology'
  | 'Antivirals'
  | 'Intensive Care';

export interface RegionalStock {
  region: string;
  stock: number;
  dailyBurn: number;
  daysRemaining: number;
  risk: RiskLevel;
}

export interface DrugItem {
  id: string;
  name: string;
  inn: string; // International Nonproprietary Name
  category: DrugCategory;
  unit: string;
  currentStock: number;
  dailyConsumption: number;
  consumptionTrendPercent: number; // e.g. +18%
  burnoutDays: number; // days until stock hits 0
  criticalThresholdDays: number; // threshold when alert sounds (default 20 days)
  riskLevel: RiskLevel;
  nextDeliveryDate: string; // YYYY-MM-DD
  nextDeliveryDays: number; // days until delivery
  nextDeliveryQty: number;
  deliveryStatus: DeliveryStatus;
  supplier: string;
  isEssential: boolean; // Essential Medicines List
  unitCostKzt: number; // unit cost in KZT
  deficitCostImpactKzt: number; // projected monetary impact of deficit
  regionalDistribution: RegionalStock[];
  lastUpdated: string;
  prescriptionSubstitutes: string[]; // INN therapeutic equivalents
}

export interface LogisticsAlert {
  id: string;
  drugId: string;
  drugName: string;
  targetType: 'sk_pharmacy' | 'pharmacy_chain' | 'hospital_inpatient' | 'regional_depot';
  targetName: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
  status: 'pending' | 'dispatched' | 'in_transit' | 'resolved';
  recommendedAction: string;
  estimatedTransitTimeDays: number;
}

export interface SimulationParams {
  demandSpikePercent: number; // 0 to 100%
  supplierDelayDays: number; // 0 to 30 days
  selectedCategory: string;
  applyToAll: boolean;
}

export interface AIAnalysisResult {
  summary: string;
  urgentActions: string[];
  reserveFundAllocation: string;
  riskScore: number;
  logisticsRecommendations: string[];
  reallocationProposal: string;
}
