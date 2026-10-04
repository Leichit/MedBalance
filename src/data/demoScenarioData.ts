// Unified Test Data & Configuration for Midterm Defense
// Organization: Astana Demo Hospital (KZ-DEMO-01)
// Educational Item: DEMO-M01

export interface DemoSupplier {
  id: 'supplier-a' | 'supplier-b';
  name: string;
  pricePerPackKzt: number;
  deliveryCostKzt: number;
  totalCostKzt: number;
  leadTimeDays: number;
  deliveryScheduleDay: number;
  initialAvailableQty: number;
  currentAvailableQty: number;
  isAvailable: boolean;
  reliabilityScore: number;
  errorReason?: string;
}

export interface DemoRequisition {
  id: string; // REQ-DEMO-104
  version: string; // v1.0
  itemCode: string; // DEMO-M01
  itemName: string;
  accountingUnit: string; // pack (упаковка)
  orderedQty: number; // 300
  selectedSupplier: string; // Demo Supplier B
  procurementRoute: 'RFQ' | 'Direct Contract';
  rfqId: string; // RFQ-DEMO-021
  contractId?: string; // CTR-DEMO-A-01
  unitPriceKzt: number; // 6 000 KZT
  deliveryFeeKzt: number; // 150 000 KZT
  totalCostKzt: number; // 1 950 000 KZT
  budgetLimitKzt: number; // 2 000 000 KZT
  deliveryAddress: string;
  organizationName: string;
  organizationId: string;
  author: string;
  approver: string;
  status: 'draft' | 'pending_approval' | 'approved_signed' | 'sent_to_supplier' | 'rejected' | 'returned_for_changes';
  hashSha256: string;
  signedAt?: string;
  tampered: boolean;
  tamperedQty?: number;
  tamperWarning?: string;
}

export interface DemoShipment {
  orderId: string; // MB-DEMO-104
  shipmentId: string; // SHP-DEMO-104
  carrier: string; // Demo Logistics
  originCity: string;
  destinationCity: string;
  hospitalAddress: string;
  driverName: string;
  vehiclePlate: string;
  packsCount: number;
  lotNumber: string; // LOT-DEMO-104
  expiryDate: string;
  status: 'awaiting_confirmation' | 'confirmed' | 'dispatched' | 'in_transit' | 'arrived' | 'partially_received' | 'received';
  progressPercent: number; // 0 to 100
  currentCoordinates: { lat: number; lng: number };
  etaDays: number; // Day 12
  isDelayed: boolean;
  delayReason?: string;
  lastUpdated: string;
  temperatureColdChain: string; // +4.2°C (Optimal)
}

export interface DemoWarehouseStock {
  itemCode: string; // DEMO-M01
  itemName: string;
  unit: string; // pack
  dailyConsumption: number; // 35 packs/day
  day0Stock: number; // 600 packs
  day12PreDeliveryStock: number; // 180 packs (600 - 12*35)
  currentStock: number; // dynamically calculated
  orderedQty: number; // 300 packs
  receivedQty: number; // 280 packs (under-delivery of 20)
  discrepancyShortageQty: number; // 20 packs
  safetyStock: number; // 25 packs
  targetDay25Need: number; // 275 packs
  currentCoverageDays: number; // calculated stock / 35
  storekeeperName: string; // Demo Warehouse User
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  rfidTagId: string;
  itemCode: string;
  itemName: string;
  exitGateZone: string;
  authorizedIssuance: boolean;
  status: 'authorized' | 'unmatched';
  verificationOutcome: string;
  investigationStatus: 'verified' | 'action_required' | 'under_review';
  scannedBySensor: string;
}

export interface DirectContract {
  contractId: string; // CTR-DEMO-A-01
  supplierName: string; // Demo Supplier A
  itemCode: string; // DEMO-M01
  pricePerPackKzt: number; // 5 500 KZT
  totalAllocatedLimit: number; // 1,000 packs
  remainingVolumeLimit: number; // 500 packs
  status: 'Active' | 'Suspended' | 'Exhausted';
  validUntil: string;
  terms: string;
}

// Initial Data Constants conforming strictly to Prompt Section 12
export const INITIAL_DEMO_DATA = {
  organization: {
    name: 'Astana Demo Hospital',
    id: 'KZ-DEMO-01',
    address: 'Mangilik El Ave 53, Astana, Kazakhstan',
    recipientDept: 'Central Clinical Pharmacy Depot',
  },
  item: {
    code: 'DEMO-M01',
    name: 'DEMO-M01 (Educational item - no clinical recommendations)',
    nameRu: 'DEMO-M01 — учебный товар, без клинических рекомендаций',
    unit: 'pack',
    initialStock: 600,
    dailyConsumption: 35,
    plannedDeliveryDay: 25,
    coverageDays: 17.1, // 600 / 35
    needUntilDay25: 275, // 25 * 35 - 600
    safetyStock: 25,
    recommendedOrder: 300, // 275 + 25
    budgetLimitKzt: 2000000,
  },
  suppliers: {
    supplierA: {
      id: 'supplier-a',
      name: 'Demo Supplier A',
      pricePerPackKzt: 5500,
      deliveryCostKzt: 150000,
      totalCostKzt: 1800000, // 300 * 5500 + 150000
      leadTimeDays: 10,
      deliveryScheduleDay: 10,
      initialAvailableQty: 300,
      currentAvailableQty: 200, // Decreases to 200 in error event
      isAvailable: false, // flagged as shortage in RFQ flow
      reliabilityScore: 94,
      errorReason: 'Stockout alert: Supplier A warehouse inventory dropped to 200 packs. Cannot fulfill batch of 300 packs.',
    } as DemoSupplier,
    supplierB: {
      id: 'supplier-b',
      name: 'Demo Supplier B',
      pricePerPackKzt: 6000,
      deliveryCostKzt: 150000,
      totalCostKzt: 1950000, // 300 * 6000 + 150000
      leadTimeDays: 12,
      deliveryScheduleDay: 12,
      initialAvailableQty: 300,
      currentAvailableQty: 300,
      isAvailable: true,
      reliabilityScore: 98,
    } as DemoSupplier,
  },
  references: {
    rfqId: 'RFQ-DEMO-021',
    requisitionId: 'REQ-DEMO-104',
    orderId: 'MB-DEMO-104',
    shipmentId: 'SHP-DEMO-104',
    lotNumber: 'LOT-DEMO-104',
    carrier: 'Demo Logistics',
    signer: 'Demo Approver',
    storekeeper: 'Demo Warehouse User',
    author: 'Demo Procurement Officer',
  },
  directContract: {
    contractId: 'CTR-DEMO-A-01',
    supplierName: 'Demo Supplier A',
    itemCode: 'DEMO-M01',
    pricePerPackKzt: 5500,
    totalAllocatedLimit: 1000,
    remainingVolumeLimit: 500,
    status: 'Active',
    validUntil: '2026-12-31',
    terms: 'Fixed procurement rate of 5,500 KZT/pack. Restricted strictly to Demo Supplier A. Dual processing under both Contract and RFQ is forbidden by audit policy.',
  } as DirectContract,
  stockState: {
    itemCode: 'DEMO-M01',
    itemName: 'DEMO-M01 (Educational item - no clinical recommendations)',
    unit: 'pack',
    dailyConsumption: 35,
    day0Stock: 600,
    day12PreDeliveryStock: 180, // 600 - 12 * 35 = 180 packs
    currentStock: 180, // at Day 12 before receiving
    orderedQty: 300,
    receivedQty: 280,
    discrepancyShortageQty: 20,
    safetyStock: 25,
    targetDay25Need: 275,
    currentCoverageDays: 5.1, // 180 / 35 ≈ 5.1 days before delivery
    storekeeperName: 'Demo Warehouse User',
  } as DemoWarehouseStock,
  securityEvents: [
    {
      id: 'sec-01',
      timestamp: '11:42:15',
      rfidTagId: 'RFID-DEMO-9941',
      itemCode: 'DEMO-M01',
      itemName: 'DEMO-M01 (Batch LOT-DEMO-104)',
      exitGateZone: 'Gate 2 — Pharmacy Dispatch Loading Bay',
      authorizedIssuance: true,
      status: 'authorized',
      verificationOutcome: 'Verified against requisition REQ-DEMO-104 & internal transfer order #412. Exit approved.',
      investigationStatus: 'verified',
      scannedBySensor: 'Overhead RFID Portal Reader (Impinj Speedway R420)',
    },
    {
      id: 'sec-02',
      timestamp: '14:05:32',
      rfidTagId: 'RFID-DEMO-8812',
      itemCode: 'DEMO-M01',
      itemName: 'DEMO-M01 (Batch LOT-DEMO-104)',
      exitGateZone: 'Gate 4 — Staff Service Corridor',
      authorizedIssuance: false,
      status: 'unmatched',
      verificationOutcome: 'Unmatched movement detected. No active digital dispatch slip or transfer permit registered for this tag.',
      investigationStatus: 'action_required',
      scannedBySensor: 'Portal RFID Antenna #3 (North Corridor)',
    },
  ] as SecurityEvent[],
};
