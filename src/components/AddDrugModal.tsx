import React, { useState } from 'react';
import { X, Plus, Package } from 'lucide-react';
import { DrugItem, RiskLevel } from '../types';

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDrug: (newDrug: DrugItem) => void;
}

export const AddDrugModal: React.FC<AddDrugModalProps> = ({
  isOpen,
  onClose,
  onAddDrug,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [inn, setInn] = useState('');
  const [category, setCategory] = useState<DrugItem['category']>('Oncology');
  const [unit, setUnit] = useState('packs');
  const [currentStock, setCurrentStock] = useState(20000);
  const [dailyConsumption, setDailyConsumption] = useState(1200);
  const [nextDeliveryDays, setNextDeliveryDays] = useState(15);
  const [nextDeliveryQty, setNextDeliveryQty] = useState(30000);
  const [supplier, setSupplier] = useState('SK-Pharmacy / Santo');
  const [unitCostKzt, setUnitCostKzt] = useState(1200);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !inn) return;

    const burnoutDays = Math.max(1, Math.round(currentStock / dailyConsumption));
    let riskLevel: RiskLevel = 'normal';
    if (burnoutDays < 15) riskLevel = 'critical';
    else if (burnoutDays <= 30) riskLevel = 'warning';
    else if (burnoutDays > 90) riskLevel = 'surplus';

    const deliveryDateObj = new Date();
    deliveryDateObj.setDate(deliveryDateObj.getDate() + nextDeliveryDays);
    const nextDeliveryDate = deliveryDateObj.toISOString().split('T')[0];

    const newItem: DrugItem = {
      id: `med-${Date.now()}`,
      name,
      inn,
      category,
      unit,
      currentStock,
      dailyConsumption,
      consumptionTrendPercent: 10,
      burnoutDays,
      criticalThresholdDays: 20,
      riskLevel,
      nextDeliveryDate,
      nextDeliveryDays,
      nextDeliveryQty,
      deliveryStatus: 'on_schedule',
      supplier,
      isEssential: true,
      unitCostKzt,
      deficitCostImpactKzt: burnoutDays < nextDeliveryDays ? (nextDeliveryDays - burnoutDays) * dailyConsumption * unitCostKzt : 0,
      lastUpdated: 'Just now',
      prescriptionSubstitutes: ['INN Generic Equivalent'],
      regionalDistribution: [
        { region: 'Astana City', stock: Math.round(currentStock * 0.3), dailyBurn: Math.round(dailyConsumption * 0.3), daysRemaining: burnoutDays, risk: riskLevel },
        { region: 'Almaty City', stock: Math.round(currentStock * 0.35), dailyBurn: Math.round(dailyConsumption * 0.35), daysRemaining: burnoutDays, risk: riskLevel },
        { region: 'Shymkent City', stock: Math.round(currentStock * 0.2), dailyBurn: Math.round(dailyConsumption * 0.2), daysRemaining: burnoutDays, risk: riskLevel },
        { region: 'Karaganda Region', stock: Math.round(currentStock * 0.15), dailyBurn: Math.round(dailyConsumption * 0.15), daysRemaining: burnoutDays, risk: riskLevel },
      ],
    };

    onAddDrug(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-200 space-y-3.5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Add Drug Batch to Monitoring
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Brand / Trade Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Meropenem 1000 mg powder for injection"
              className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">INN (Active Ingredient):</label>
              <input
                type="text"
                required
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                placeholder="Meropenem"
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
              >
                <option value="Oncology">Oncology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Diabetology / Endocrinology">Diabetology / Endocrinology</option>
                <option value="Infectious Diseases">Infectious Diseases</option>
                <option value="Rare (Orphan) Diseases">Rare (Orphan) Diseases</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Stock:</label>
              <input
                type="number"
                min={0}
                required
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Daily Consumption:</label>
              <input
                type="number"
                min={1}
                required
                value={dailyConsumption}
                onChange={(e) => setDailyConsumption(Number(e.target.value))}
                className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Delivery in (days):</label>
              <input
                type="number"
                min={1}
                value={nextDeliveryDays}
                onChange={(e) => setNextDeliveryDays(Number(e.target.value))}
                className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Delivery Batch Size:</label>
              <input
                type="number"
                min={0}
                value={nextDeliveryQty}
                onChange={(e) => setNextDeliveryQty(Number(e.target.value))}
                className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Supplier / Distributor:</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Cost (₸):</label>
              <input
                type="number"
                min={1}
                value={unitCostKzt}
                onChange={(e) => setUnitCostKzt(Number(e.target.value))}
                className="w-full text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
            >
              Add to System
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
