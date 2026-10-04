import React, { useState, useMemo } from 'react';
import { MobileTopBar } from './components/MobileTopBar';
import { BottomNav, MobileTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { PredictiveRadarMobile } from './components/PredictiveRadarMobile';
import { AccountView, DemoRole } from './components/AccountView';
import { DrugForecastModal } from './components/DrugForecastModal';
import { AddDrugModal } from './components/AddDrugModal';
import { NotificationsModal } from './components/NotificationsModal';
import { DefenseDemoView } from './components/DefenseDemoView';
import { DeliveryTrackingView } from './components/DeliveryTrackingView';
import { MobileWarehouseView } from './components/MobileWarehouseView';
import { SystemOverviewView } from './components/SystemOverviewView';
import { DigitalSignatureModal } from './components/DigitalSignatureModal';
import { DirectContractModal } from './components/DirectContractModal';
import { CalculationExplainerModal } from './components/CalculationExplainerModal';
import { OrganizationCatalogModal } from './components/OrganizationCatalogModal';
import { 
  INITIAL_DEMO_DATA, 
  DemoRequisition, 
  DemoShipment, 
  DemoWarehouseStock, 
  SecurityEvent, 
  DirectContract 
} from './data/demoScenarioData';
import { INITIAL_DRUGS, INITIAL_ALERTS } from './data/mockData';
import { DrugItem, LogisticsAlert } from './types';
import { CheckCircle2, X, Sparkles, Play, ShieldAlert } from 'lucide-react';
import { formatNumber } from './utils/formatters';

export default function App() {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [drugs, setDrugs] = useState<DrugItem[]>(INITIAL_DRUGS);
  const [alerts, setAlerts] = useState<LogisticsAlert[]>(INITIAL_ALERTS);
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedDrugForModal, setSelectedDrugForModal] = useState<DrugItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [radarCategoryFilter, setRadarCategoryFilter] = useState<string | undefined>(undefined);

  // Active Demo Role (Prompt Section 3 Specification)
  const [currentDemoRole, setCurrentDemoRole] = useState<DemoRole>('Procurement Officer');

  // Real Demonstration Audit Log (Prompt Section 2 Specification)
  const [performedActionsLog, setPerformedActionsLog] = useState<{ time: string; action: string; role: string; details: string }[]>([
    {
      time: '08:30:00',
      action: 'Demand Horizon Calculated',
      role: 'Procurement Officer',
      details: 'Identified Day 17.1 burnout for DEMO-M01. Requirement: 300 packs to Day 25.',
    },
    {
      time: '08:45:12',
      action: 'Competitive Tender RFQ Issued',
      role: 'Procurement Officer',
      details: 'RFQ-DEMO-021 published to Demo Suppliers A & B.',
    },
  ]);

  const logAction = (action: string, details: string) => {
    const newEntry = {
      time: new Date().toLocaleTimeString(),
      action,
      role: currentDemoRole,
      details,
    };
    setPerformedActionsLog((prev) => [newEntry, ...prev]);
  };

  // Midterm Defense Interactive Scenario States
  const [requisition, setRequisition] = useState<DemoRequisition>({
    id: INITIAL_DEMO_DATA.references.requisitionId,
    version: 'v1.0',
    itemCode: INITIAL_DEMO_DATA.item.code,
    itemName: INITIAL_DEMO_DATA.item.name,
    accountingUnit: INITIAL_DEMO_DATA.item.unit,
    orderedQty: 300,
    selectedSupplier: 'Demo Supplier B',
    procurementRoute: 'RFQ',
    rfqId: INITIAL_DEMO_DATA.references.rfqId,
    unitPriceKzt: 6000,
    deliveryFeeKzt: 150000,
    totalCostKzt: 1950000,
    budgetLimitKzt: 2000000,
    deliveryAddress: INITIAL_DEMO_DATA.organization.address,
    organizationName: INITIAL_DEMO_DATA.organization.name,
    organizationId: INITIAL_DEMO_DATA.organization.id,
    author: INITIAL_DEMO_DATA.references.author,
    approver: INITIAL_DEMO_DATA.references.signer,
    status: 'pending_approval',
    hashSha256: '8e41bc720a45f9d6b2c9381ea8b3940173e1c62f928e4610d05c21980a37b120',
    tampered: false,
  });

  const [shipment, setShipment] = useState<DemoShipment>({
    orderId: INITIAL_DEMO_DATA.references.orderId,
    shipmentId: INITIAL_DEMO_DATA.references.shipmentId,
    carrier: INITIAL_DEMO_DATA.references.carrier,
    originCity: 'Karaganda Logistics Depot',
    destinationCity: 'Astana',
    hospitalAddress: INITIAL_DEMO_DATA.organization.address,
    driverName: 'Serik Akhmetov',
    vehiclePlate: '104 KZ 01',
    packsCount: 300,
    lotNumber: INITIAL_DEMO_DATA.references.lotNumber,
    expiryDate: '2028-11-30',
    status: 'in_transit',
    progressPercent: 65,
    currentCoordinates: { lat: 50.85, lng: 71.9 },
    etaDays: 12,
    isDelayed: false,
    lastUpdated: '5 mins ago',
    temperatureColdChain: '+4.2°C (Optimal)',
  });

  const [stockState, setStockState] = useState<DemoWarehouseStock>({
    ...INITIAL_DEMO_DATA.stockState,
    currentStock: 180, // Day 12 pre-intake stock level: 600 - 12 * 35 = 180 packs
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(
    INITIAL_DEMO_DATA.securityEvents
  );

  // Modals for Defense Scenario
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState<boolean>(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState<boolean>(false);
  const [isCalculationModalOpen, setIsCalculationModalOpen] = useState<boolean>(false);
  const [isOrganizationCatalogOpen, setIsOrganizationCatalogOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4200);
  };

  // KPI Calculations
  const criticalCount = useMemo(() => {
    return drugs.filter((d) => d.riskLevel === 'critical' || d.burnoutDays < 15).length;
  }, [drugs]);

  const warningCount = useMemo(() => {
    return drugs.filter((d) => d.riskLevel === 'warning' || (d.burnoutDays >= 15 && d.burnoutDays <= 30)).length;
  }, [drugs]);

  const totalUnitsCount = useMemo(() => {
    return drugs.reduce((acc, d) => acc + d.currentStock, 0);
  }, [drugs]);

  // Warehouse Intake Reconciliation (Strict Prompt Section 13 Math: 180 + 280 = 460 packs)
  const handleConfirmReceipt = (receivedQty: number) => {
    const updatedStock = stockState.day12PreDeliveryStock + receivedQty; // 180 + 280 = 460
    setStockState((prev) => ({
      ...prev,
      receivedQty,
      currentStock: updatedStock,
      currentCoverageDays: Number((updatedStock / prev.dailyConsumption).toFixed(1)),
    }));

    // Update DEMO-M01 in global drugs table
    setDrugs((prevDrugs) =>
      prevDrugs.map((d) => {
        if (d.id === 'DEMO-M01') {
          return {
            ...d,
            currentStock: updatedStock,
            burnoutDays: Math.round(updatedStock / d.dailyConsumption),
            riskLevel: 'normal',
          };
        }
        return d;
      })
    );

    // Update shipment status
    setShipment((prev) => ({
      ...prev,
      status: receivedQty < 300 ? 'partially_received' : 'received',
      progressPercent: 100,
    }));

    logAction(
      'Warehouse Intake Completed',
      `Received ${receivedQty} packs (shortage: 20). Stock: 180 ➔ ${updatedStock} packs.`
    );

    // Add audit alert
    const intakeAlert: LogisticsAlert = {
      id: `alert-intake-${Date.now()}`,
      drugId: 'DEMO-M01',
      drugName: 'DEMO-M01 Educational Item',
      targetType: 'hospital_inpatient',
      targetName: 'Astana Demo Hospital Central Depot',
      title: `Warehouse Intake Confirmed: +${receivedQty} packs`,
      message: `Physical count intake completed: ${receivedQty} packs received (shortage of 20 packs logged). Balance updated: 180 ➔ 460 packs.`,
      severity: 'info',
      timestamp: 'Just now',
      status: 'resolved',
      recommendedAction: 'Order MB-DEMO-104 partially completed. File discrepancy report with Demo Supplier B.',
      estimatedTransitTimeDays: 0,
    };
    setAlerts((prev) => [intakeAlert, ...prev]);
  };

  // Warehouse Dispense handler
  const handleDispense = (dept: string, qty: number): boolean => {
    if (qty > stockState.currentStock) return false;

    const newStock = stockState.currentStock - qty;
    setStockState((prev) => ({
      ...prev,
      currentStock: newStock,
      currentCoverageDays: Number((newStock / prev.dailyConsumption).toFixed(1)),
    }));

    setDrugs((prevDrugs) =>
      prevDrugs.map((d) => {
        if (d.id === 'DEMO-M01') {
          return {
            ...d,
            currentStock: newStock,
            burnoutDays: Math.round(newStock / d.dailyConsumption),
          };
        }
        return d;
      })
    );

    logAction('Departmental Dispense', `Dispensed ${qty} packs of DEMO-M01 to ${dept}.`);
    return true;
  };

  // Inventory audit submission
  const handleInventoryAudit = (physicalCount: number) => {
    const variance = physicalCount - stockState.currentStock;
    logAction(
      'Cycle Count Variance Submitted',
      `Physical: ${physicalCount} vs Book: ${stockState.currentStock}. Variance: ${variance} packs.`
    );

    const newAlert: LogisticsAlert = {
      id: `audit-${Date.now()}`,
      drugId: 'DEMO-M01',
      drugName: 'DEMO-M01 Educational Item',
      targetType: 'hospital_inpatient',
      targetName: 'Pharmacy Chief Inspection Board',
      title: `Cycle Count Variance: ${variance > 0 ? `+${variance}` : variance} packs`,
      message: `Physical count of ${physicalCount} entered vs book stock of ${stockState.currentStock}. Submitted for verification checklist.`,
      severity: 'medium',
      timestamp: 'Just now',
      status: 'pending',
      recommendedAction: 'Verify storekeeper physical inspection log prior to adjusting balance.',
      estimatedTransitTimeDays: 0,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // RFID Gate Event simulation
  const handleSimulateRfidGateEvent = (isAuthorized: boolean) => {
    const tag = isAuthorized ? `RFID-DEMO-${Math.floor(1000 + Math.random() * 9000)}` : 'RFID-DEMO-ALERT-404';
    const newEvent: SecurityEvent = {
      id: `sec-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      rfidTagId: tag,
      itemCode: 'DEMO-M01',
      itemName: 'DEMO-M01 (Batch LOT-DEMO-104)',
      exitGateZone: isAuthorized ? 'Gate 2 — Pharmacy Dispatch Loading Bay' : 'Gate 4 — Staff Service Corridor',
      authorizedIssuance: isAuthorized,
      status: isAuthorized ? 'authorized' : 'unmatched',
      verificationOutcome: isAuthorized
        ? 'Verified against active digital transfer order. Exit approved.'
        : 'Unmatched movement detected. No active digital dispatch slip registered for this RFID tag. Inspection required.',
      investigationStatus: isAuthorized ? 'verified' : 'action_required',
      scannedBySensor: isAuthorized ? 'Portal RFID Antenna #1' : 'Overhead Portal Reader #3',
    };
    setSecurityEvents((prev) => [newEvent, ...prev]);

    logAction(
      isAuthorized ? 'RFID Movement: Authorized' : 'RFID Alert: Unmatched Movement',
      `Tag ${tag} detected at perimeter portal. Investigation: ${isAuthorized ? 'Approved' : 'Inspection Required'}.`
    );
  };

  // Tamper document demo
  const handleTamperDocument = () => {
    setRequisition((prev) => ({
      ...prev,
      tampered: true,
      orderedQty: 1000,
      totalCostKzt: 6150000,
      tamperWarning: 'Document hash mismatch detected! Quantity modified post-signature.',
    }));
    logAction(
      'Document Tamper Simulated',
      'Changed quantity from 300 to 1,000 packs. Cryptographic hash invalidated, dispatch blocked.'
    );
    showToast('Tamper Simulation: Quantity altered to 1,000 packs! Computed hash no longer matches signature.');
  };

  // Restore original signed document
  const handleRestoreOriginal = () => {
    setRequisition((prev) => ({
      ...prev,
      tampered: false,
      orderedQty: 300,
      totalCostKzt: 1950000,
      tamperWarning: undefined,
    }));
    logAction('Original Document Restored', 'Restored 300 packs. Signature re-verified successfully.');
    showToast('Original signed requisition restored (300 packs). Cryptographic signature valid.');
  };

  // Inter-regional Stock Transfer Handler
  const handleTransferStock = (drugId: string, fromRegion: string, toRegion: string, amount: number) => {
    setDrugs((prevDrugs) =>
      prevDrugs.map((drug) => {
        if (drug.id !== drugId) return drug;

        const updatedRegions = drug.regionalDistribution.map((reg) => {
          if (reg.region === fromRegion) {
            const newStock = Math.max(0, reg.stock - amount);
            const newDays = Math.max(1, Math.round(newStock / reg.dailyBurn));
            return {
              ...reg,
              stock: newStock,
              daysRemaining: newDays,
              risk: (newDays < 15 ? 'critical' : newDays <= 30 ? 'warning' : 'normal') as any,
            };
          }
          if (reg.region === toRegion) {
            const newStock = reg.stock + amount;
            const newDays = Math.max(1, Math.round(newStock / reg.dailyBurn));
            return {
              ...reg,
              stock: newStock,
              daysRemaining: newDays,
              risk: (newDays < 15 ? 'critical' : newDays <= 30 ? 'warning' : 'normal') as any,
            };
          }
          return reg;
        });

        return {
          ...drug,
          regionalDistribution: updatedRegions,
        };
      })
    );

    logAction('Inter-Regional Stock Transfer', `Transferred ${amount} units from ${fromRegion} to ${toRegion}.`);
    showToast(`Inter-regional transfer of ${amount} units confirmed!`);
  };

  // Quick alert from card or modal
  const handleQuickAlert = (drug: DrugItem) => {
    const newAlert: LogisticsAlert = {
      id: `alert-${Date.now()}`,
      drugId: drug.id,
      drugName: drug.name,
      targetType: 'sk_pharmacy',
      targetName: 'SK-Pharmacy (National Distributor)',
      title: `Auto-Alert: Stock Depletion (${drug.burnoutDays}d)`,
      message: `Urgent allocation required from KZ MoH reserve fund or accelerated delivery from ${drug.supplier}.`,
      severity: 'high',
      timestamp: 'Just now',
      status: 'pending',
      recommendedAction: 'Allocate volume from emergency reserve.',
      estimatedTransitTimeDays: 2,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    logAction('Urgent Alert Dispatched', `Depletion alert for ${drug.name} (${drug.burnoutDays} days remaining).`);
    showToast(`Alert for "${drug.name}" dispatched to logistics gateway!`);
  };

  // Predictive Procurement Order
  const handleProcurementOrder = (drug: DrugItem) => {
    const recommendedQty = Math.round(drug.dailyConsumption * 45);
    setActiveTab('demo');
    logAction(
      'Predictive Procurement Initiated',
      `Launched requisition for ${drug.name} (${formatNumber(recommendedQty)} units).`
    );
    showToast(`Predictive procurement order created for "${drug.name}"!`);
  };

  // Custom alert from modal form
  const handleSendCustomAlert = (drug: DrugItem, targetType: string, customMsg: string) => {
    let targetName = 'SK-Pharmacy (National Distributor)';
    if (targetType === 'pharmacy_chain') targetName = 'KZ Retail Pharmacy Chains';
    if (targetType === 'hospital_inpatient') targetName = 'KZ Clinical Hospitals & Polyclinics';

    const newAlert: LogisticsAlert = {
      id: `alert-${Date.now()}`,
      drugId: drug.id,
      drugName: drug.name,
      targetType: targetType as any,
      targetName,
      title: `Logistics Officer Dispatch: ${drug.name}`,
      message: customMsg || `Urgent dispatch order due to stockout risk (${drug.burnoutDays} days remaining).`,
      severity: drug.burnoutDays < 15 ? 'high' : 'medium',
      timestamp: 'Just now',
      status: 'pending',
      recommendedAction: 'Expedite transit batch release or arrange inter-hospital stock reallocation.',
      estimatedTransitTimeDays: 2,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    logAction('Custom Alert Dispatched', `Sent notification to ${targetName} for ${drug.name}.`);
    showToast(`Dispatch order successfully sent: ${targetName}`);
  };

  // Alert Status Update
  const handleUpdateAlertStatus = (alertId: string, newStatus: LogisticsAlert['status']) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
    logAction('Alert Status Updated', `Alert ${alertId} updated to status: ${newStatus}`);
    showToast(`Order status updated to "${newStatus}"`);
  };

  // Add Drug Batch
  const handleAddDrug = (newDrug: DrugItem) => {
    setDrugs((prev) => [newDrug, ...prev]);
    logAction('Batch Added to Monitoring', `Added ${newDrug.name} to inventory database.`);
    showToast(`Batch "${newDrug.name}" successfully added to predictive monitoring`);
  };

  // Navigation Helper to Radar
  const handleNavigateToRadar = (category?: string) => {
    if (category) {
      setRadarCategoryFilter(category);
    }
    setActiveTab('radar');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-blue-600 selection:text-white">
      {/* Mobile Shell Container (Max-w-md, 100% on phones, centered with subtle rounded borders & deep shadow) */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 relative flex flex-col shadow-2xl border-x border-slate-300/40">
        
        {/* Mobile Top Bar */}
        <MobileTopBar
          onOpenAddModal={() => {
            // As requested in prompt: "Кнопка добавления партии открывает приёмку."
            setActiveTab('warehouse');
            showToast('Opened Mobile Warehouse Intake (Receiving Batch LOT-DEMO-104)');
          }}
          onOpenAlerts={() => setIsNotificationsModalOpen(true)}
          criticalCount={criticalCount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 left-0 right-0 z-50 px-4 max-w-md mx-auto pointer-events-none">
            <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700/60 animate-in fade-in slide-in-from-top-3 duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold leading-snug flex-1">
                {toastMessage}
              </span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white pointer-events-auto p-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Defense Presentation Quick Jump Bar */}
        {activeTab !== 'demo' && (
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-3.5 py-2 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-xs font-bold tracking-tight">Midterm Defense Demonstration</span>
            </div>
            <button
              onClick={() => setActiveTab('demo')}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
            >
              <Play className="w-3 h-3 fill-current" />
              Start 8-Step Demo
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 px-3.5 pt-3.5 pb-20 overflow-y-auto">
          {/* TAB: DEFENSE DEMO (Interactive 8-step Scenario) */}
          {activeTab === 'demo' && (
            <DefenseDemoView
              onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
              onOpenContractModal={() => setIsContractModalOpen(true)}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
              requisition={requisition}
              setRequisition={setRequisition}
              shipment={shipment}
              setShipment={setShipment}
              stockState={stockState}
              setStockState={setStockState}
              onShowToast={showToast}
            />
          )}

          {/* TAB: DELIVERY TRACKING */}
          {activeTab === 'delivery' && (
            <DeliveryTrackingView
              shipment={shipment}
              onUpdateStatus={(newStatus) => {
                setShipment((prev) => ({ ...prev, status: newStatus }));
                logAction('Delivery Status Transition', `Shipment SHP-DEMO-104 updated to: ${newStatus}`);
                showToast(`Shipment status updated to "${newStatus.replace('_', ' ')}"`);
              }}
              onAdvanceProgress={(progress) => {
                setShipment((prev) => ({ ...prev, progressPercent: progress }));
              }}
              onSimulateDelay={() => {
                setShipment((prev) => ({
                  ...prev,
                  isDelayed: true,
                  etaDays: 14,
                  delayReason: 'Weather advisory: Highway snow clearing delay on Karaganda-Astana corridor (+2 days).',
                }));
                logAction('Delivery Delay Simulated', 'Rescheduled arrival to Day 14 due to highway corridor advisory.');
                showToast('Simulation: Shipment delayed by +2 days. Rescheduled arrival to Day 14.');
              }}
              onResetShipment={() => {
                setShipment((prev) => ({
                  ...prev,
                  status: 'in_transit',
                  progressPercent: 65,
                  isDelayed: false,
                  etaDays: 12,
                }));
                showToast('Shipment reset to standard transit schedule (Day 12).');
              }}
              onProceedToWarehouse={() => setActiveTab('warehouse')}
            />
          )}

          {/* TAB: MOBILE WAREHOUSE */}
          {activeTab === 'warehouse' && (
            <MobileWarehouseView
              stockState={stockState}
              securityEvents={securityEvents}
              onConfirmReceipt={handleConfirmReceipt}
              onDispense={handleDispense}
              onSubmitInventoryAudit={handleInventoryAudit}
              onSimulateRfidGateEvent={handleSimulateRfidGateEvent}
              onResetWarehouse={() => {
                setStockState({
                  ...INITIAL_DEMO_DATA.stockState,
                  currentStock: 180,
                });
                showToast('Warehouse stock reset to pre-delivery Day 12 baseline (180 packs).');
              }}
              onShowToast={showToast}
            />
          )}

          {/* TAB: SYSTEM OVERVIEW & ARCHITECTURE */}
          {activeTab === 'system' && (
            <SystemOverviewView onShowToast={showToast} />
          )}

          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <HomeView
              criticalCount={criticalCount}
              warningCount={warningCount}
              totalDrugs={drugs.length}
              totalUnitsCount={totalUnitsCount}
              drugs={drugs}
              alerts={alerts}
              onUpdateAlertStatus={handleUpdateAlertStatus}
              onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
              onNavigateToRadar={handleNavigateToRadar}
              onOpenDrugModal={(drug) => setSelectedDrugForModal(drug)}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
              onOpenCalculationExplainer={() => setIsCalculationModalOpen(true)}
              onCreatePredictiveRequisition={() => {
                setActiveTab('demo');
                showToast('Opening Requisition REQ-DEMO-104 (DEMO-M01, 300 packs pre-filled)');
              }}
              onOpenOrganizationCatalog={() => setIsOrganizationCatalogOpen(true)}
              requisitionStatus={requisition.status}
              shipmentStatus={shipment.status}
              receivingDiscrepancyCount={1}
              currentDemoRole={currentDemoRole}
            />
          )}

          {/* TAB: PREDICTIVE RADAR */}
          {activeTab === 'radar' && (
            <PredictiveRadarMobile
              drugs={drugs}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              onSelectDrug={(drug) => setSelectedDrugForModal(drug)}
              onQuickAlert={handleQuickAlert}
              onOpenProcurementOrder={handleProcurementOrder}
              initialCategory={radarCategoryFilter}
            />
          )}

          {/* TAB: ACCOUNT & AUDIT */}
          {activeTab === 'account' && (
            <AccountView
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              onShowToast={showToast}
              onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
              currentDemoRole={currentDemoRole}
              setCurrentDemoRole={setCurrentDemoRole}
              onOpenOrganizationCatalog={() => setIsOrganizationCatalogOpen(true)}
              performedActionsLog={performedActionsLog}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          criticalCount={criticalCount}
        />

        {/* POPUP MODAL 1: Operational Notifications */}
        <NotificationsModal
          isOpen={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
          alerts={alerts}
          onUpdateAlertStatus={handleUpdateAlertStatus}
          onQuickDispatch={(alert) => {
            showToast(`Shipment for "${alert.drugName}" dispatched to recipient`);
          }}
        />

        {/* POPUP MODAL 2: Detailed Drug Deficit Forecast */}
        <DrugForecastModal
          drug={selectedDrugForModal}
          onClose={() => setSelectedDrugForModal(null)}
          onSendAlert={handleSendCustomAlert}
          onTransferStock={handleTransferStock}
        />

        {/* POPUP MODAL 3: Add New Drug Batch */}
        <AddDrugModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddDrug={handleAddDrug}
        />

        {/* POPUP MODAL 4: Digital Signature & Cryptographic Verification */}
        <DigitalSignatureModal
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          requisition={requisition}
          onConfirmSignature={() => {
            setRequisition((prev) => ({
              ...prev,
              status: 'approved_signed',
              signedAt: new Date().toLocaleTimeString(),
            }));
            logAction('Digital Signature Applied', 'Signed REQ-DEMO-104 with Demo Approver EDS certificate.');
            showToast('Document electronically signed by Demo Approver!');
          }}
          onTamperDocument={handleTamperDocument}
          onRestoreOriginal={handleRestoreOriginal}
        />

        {/* POPUP MODAL 5: Direct Contract Route Check */}
        <DirectContractModal
          isOpen={isContractModalOpen}
          onClose={() => setIsContractModalOpen(false)}
          contract={INITIAL_DEMO_DATA.directContract}
          onShowToast={showToast}
        />

        {/* POPUP MODAL 6: Demand Forecast Calculation Explainer */}
        <CalculationExplainerModal
          isOpen={isCalculationModalOpen}
          onClose={() => setIsCalculationModalOpen(false)}
          onCreateProcurement={() => {
            setIsCalculationModalOpen(false);
            setActiveTab('demo');
            showToast('Opening Requisition REQ-DEMO-104 (DEMO-M01, 300 packs pre-filled)');
          }}
        />

        {/* POPUP MODAL 7: Global Organizations Catalog Directory */}
        <OrganizationCatalogModal
          isOpen={isOrganizationCatalogOpen}
          onClose={() => setIsOrganizationCatalogOpen(false)}
          currentOrgId={INITIAL_DEMO_DATA.organization.id}
        />
      </div>
    </div>
  );
}
