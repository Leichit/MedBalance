import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ShieldAlert,
  Wallet
} from 'lucide-react';
import { DrugItem } from '../types';
import { formatNumber, formatCurrencyKzt } from '../utils/formatters';

interface SurgeSimulatorProps {
  drugs: DrugItem[];
  onApplySimulation: (demandPercent: number, delayDays: number, category: string) => void;
  onResetSimulation: () => void;
  onClose?: () => void;
}

export const SurgeSimulator: React.FC<SurgeSimulatorProps> = ({
  drugs,
  onApplySimulation,
  onResetSimulation,
  onClose,
}) => {
  const [demandSpike, setDemandSpike] = useState<number>(30); // default +30%
  const [supplierDelay, setSupplierDelay] = useState<number>(10); // default 10 days delay
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isApplied, setIsApplied] = useState<boolean>(false);

  // Preset scenarios matching the official context
  const handlePresetAugust = () => {
    setDemandSpike(40);
    setSupplierDelay(14);
    setSelectedCategory('all');
    applyValues(40, 14, 'all');
  };

  const handlePresetNovember = () => {
    setDemandSpike(25);
    setSupplierDelay(20);
    setSelectedCategory('Antivirals');
    applyValues(25, 20, 'Antivirals');
  };

  const handlePresetEpidemic = () => {
    setDemandSpike(55);
    setSupplierDelay(7);
    setSelectedCategory('Infectious Diseases');
    applyValues(55, 7, 'Infectious Diseases');
  };

  const applyValues = (spike: number, delay: number, cat: string) => {
    setIsApplied(true);
    onApplySimulation(spike, delay, cat);
  };

  const handleApplyClick = () => {
    applyValues(demandSpike, supplierDelay, selectedCategory);
  };

  const handleResetClick = () => {
    setIsApplied(false);
    setDemandSpike(0);
    setSupplierDelay(0);
    setSelectedCategory('all');
    onResetSimulation();
  };

  // Calculate simulated preview numbers
  const simulationResults = useMemo(() => {
    let newlyDeficitDrugs = 0;
    let totalProjectedMoneyNeeded = 0;
    const affectedList: { name: string; oldDays: number; newDays: number; gapDays: number; extraCostKzt: number }[] = [];

    drugs.forEach((drug) => {
      if (selectedCategory !== 'all' && drug.category !== selectedCategory) {
        return;
      }

      const newDailyBurn = drug.dailyConsumption * (1 + demandSpike / 100);
      const newBurnoutDays = Math.max(1, Math.round(drug.currentStock / newDailyBurn));
      const newDeliveryDays = drug.nextDeliveryDays + supplierDelay;

      // Deficit gap
      const gap = newDeliveryDays - newBurnoutDays;
      if (gap > 0) {
        newlyDeficitDrugs++;
        const unitsNeeded = Math.round(gap * newDailyBurn);
        const extraCost = unitsNeeded * drug.unitCostKzt;
        totalProjectedMoneyNeeded += extraCost;

        affectedList.push({
          name: drug.name,
          oldDays: drug.burnoutDays,
          newDays: newBurnoutDays,
          gapDays: gap,
          extraCostKzt: extraCost,
        });
      }
    });

    return {
      newlyDeficitDrugs,
      totalProjectedMoneyNeeded,
      affectedList,
    };
  }, [drugs, demandSpike, supplierDelay, selectedCategory]);

  return (
    <div className="space-y-4 pb-6">
      {/* Strategic context card with 21B ₸ emergency fund reference */}
      <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-900">
                Demand & Deficit Simulator
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                What-If Model
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Stress-test unexpected hospitalization surges against the KZ Ministry of Health 21B ₸ reserve fund.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
          {isApplied && (
            <button
              onClick={handleResetClick}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
          <button
            onClick={handleApplyClick}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Calculate Impact
          </button>
        </div>
      </div>

      {/* Preset Scenarios Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handlePresetAugust}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs transition-all text-left space-y-1.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Scenario 1 (August Wave)
            </span>
            <span className="text-xs font-bold text-red-600 font-mono">+8.5B ₸</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
            Unplanned Hospitalization Surge (+40%)
          </h4>
          <p className="text-xs text-slate-600">
            Supplier delay of 14 days. Massive emergency replenishment requests from regional clinics.
          </p>
        </button>

        <button
          onClick={handlePresetNovember}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs transition-all text-left space-y-1.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Scenario 2 (November Wave)
            </span>
            <span className="text-xs font-bold text-red-600 font-mono">+4.4B ₸</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
            Winter ARVI Spike & Logistics Delay
          </h4>
          <p className="text-xs text-slate-600">
            +25% antiviral burn rate acceleration with 20-day transit bottleneck.
          </p>
        </button>

        <button
          onClick={handlePresetEpidemic}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-xs transition-all text-left space-y-1.5 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Scenario 3 (Epidemic Outbreak)
            </span>
            <span className="text-xs font-bold text-red-600 font-mono">Stress Test</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
            Antibiotics Surge (+55%)
          </h4>
          <p className="text-xs text-slate-600">
            Rapid stock depletion of reserve cephalosporins and clavulanic acid in intensive care.
          </p>
        </button>
      </div>

      {/* Main Interactive Controls & Projected Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Custom Sliders */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Simulation Parameters
          </h3>

          {/* Slider 1: Demand spike */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-red-600" />
                Unplanned Daily Burn Surge:
              </label>
              <span className="font-mono font-bold text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                +{demandSpike}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={demandSpike}
              onChange={(e) => setDemandSpike(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-600 font-mono">
              <span>0% (Baseline)</span>
              <span>+30%</span>
              <span>+60%</span>
              <span>+100% (2x Demand)</span>
            </div>
          </div>

          {/* Slider 2: Supplier delivery delay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Supplier Delivery Delay:
              </label>
              <span className="font-mono font-bold text-sm text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                +{supplierDelay} days
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={supplierDelay}
              onChange={(e) => setSupplierDelay(Number(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-600 font-mono">
              <span>0d (On Time)</span>
              <span>+10d</span>
              <span>+20d</span>
              <span>+30d (Critical Breach)</span>
            </div>
          </div>

          {/* Category selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Target Pharmacological Group:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories (Consolidated)</option>
              <option value="Infectious Diseases">Infectious Diseases (Antibiotics & Antivirals)</option>
              <option value="Diabetology & Endocrinology">Diabetology & Endocrinology</option>
              <option value="Oncology">Oncology (Chemotherapy)</option>
              <option value="Cardiology">Cardiology (Anticoagulants)</option>
              <option value="Rare (Orphan) Drugs">Rare (Orphan) Drugs</option>
            </select>
          </div>
        </div>

        {/* Right 6 Cols: Real-Time Impact Projection */}
        <div className="lg:col-span-6 bg-slate-50 rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Projected Impact on MoH 21B ₸ Reserve</span>
            <span className="text-xs font-normal text-slate-500 font-mono">MedBalance Model</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Deficit Positions:</span>
              <div className="text-2xl font-extrabold text-red-600 font-mono">
                {simulationResults.newlyDeficitDrugs}
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                with stockout gaps
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Emergency Reserve Draw:</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatCurrencyKzt(simulationResults.totalProjectedMoneyNeeded)}
              </div>
              <p className="text-[11px] text-blue-700 font-semibold">
                for expedited procurement
              </p>
            </div>
          </div>

          {/* Affected drugs preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Most Vulnerable Medications in Scenario:
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {simulationResults.affectedList.length === 0 ? (
                <div className="p-4 bg-white rounded-lg text-center text-xs text-emerald-700 font-medium border border-emerald-200">
                  Current stock runway and scheduled deliveries remain sufficient under these parameters.
                </div>
              ) : (
                simulationResults.affectedList.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <div className="text-slate-600 text-[11px]">
                        Was: {item.oldDays}d ➔ Now: <strong className="text-red-600">{item.newDays}d</strong> (Gap: {item.gapDays}d)
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      {formatCurrencyKzt(item.extraCostKzt)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Benefit of Predictive Interventions vs Emergency Budget Spending */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-700" />
              Strategic Advantage of MedBalance Early Detection:
            </div>
            <p className="text-blue-800 leading-relaxed text-[11px]">
              By detecting deficits 20 days prior to zero inventory, up to 65% of the supply gap is resolved via 
              <strong> inter-regional stock reallocation</strong> from surplus regional hubs, preserving state budget funds (21B ₸ reserve).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
