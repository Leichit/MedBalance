import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  ShoppingCart, 
  Layers, 
  Activity,
  Calendar,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { DrugItem, RiskLevel } from '../types';
import { formatNumber, formatCurrencyKzt } from '../utils/formatters';

interface PredictiveRadarMobileProps {
  drugs: DrugItem[];
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  onSelectDrug: (drug: DrugItem) => void;
  onQuickAlert: (drug: DrugItem) => void;
  onOpenProcurementOrder?: (drug: DrugItem) => void;
  initialCategory?: string;
}

// 5 Explicit Categories required by user
export const RADAR_CATEGORIES = [
  { id: 'Oncology', name: 'Oncology', icon: '🎗️', desc: 'Chemotherapy, targeted and immuno-oncology drugs' },
  { id: 'Cardiology', name: 'Cardiology', icon: '❤️', desc: 'Anticoagulants, antiarrhythmics, emergency cardiology' },
  { id: 'Diabetology & Endocrinology', name: 'Diabetology & Endocrinology', icon: '💉', desc: 'Long-acting insulins, oral hypoglycemic agents' },
  { id: 'Infectious Diseases', name: 'Infectious Diseases', icon: '💊', desc: 'Reserve cephalosporins, carbapenems, antivirals' },
  { id: 'Rare (Orphan) Drugs', name: 'Rare (Orphan) Drugs', icon: '🧬', desc: 'High-cost therapy, enzyme replacement, nusinersen' },
];

export const PredictiveRadarMobile: React.FC<PredictiveRadarMobileProps> = ({
  drugs,
  selectedRegion,
  setSelectedRegion,
  onSelectDrug,
  onQuickAlert,
  onOpenProcurementOrder,
  initialCategory,
}) => {
  // Accordion state: by default open the first category or initialCategory
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    RADAR_CATEGORIES.forEach((cat, idx) => {
      // If specific initial category matches or first item, open it
      initial[cat.id] = initialCategory ? cat.id === initialCategory : idx === 0;
    });
    return initial;
  });

  const [searchTerm, setSearchTerm] = useState('');

  const regionsList = [
    'All Regions',
    'Astana City',
    'Almaty City',
    'Shymkent City',
    'Karaganda Region',
    'Aktobe Region',
  ];

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Helper to compute regional data for a drug
  const getDrugRegionStats = (drug: DrugItem) => {
    if (selectedRegion === 'All Regions' || selectedRegion === 'All Regions of KZ') {
      return {
        stock: drug.currentStock,
        dailyBurn: drug.dailyConsumption,
        burnoutDays: drug.burnoutDays,
        risk: drug.riskLevel,
      };
    }

    const reg = drug.regionalDistribution.find((r) => r.region === selectedRegion || r.region.startsWith(selectedRegion) || selectedRegion.startsWith(r.region));
    if (reg) {
      return {
        stock: reg.stock,
        dailyBurn: reg.dailyBurn,
        burnoutDays: reg.daysRemaining,
        risk: reg.risk,
      };
    }

    return {
      stock: drug.currentStock,
      dailyBurn: drug.dailyConsumption,
      burnoutDays: drug.burnoutDays,
      risk: drug.riskLevel,
    };
  };

  // Calculate critical exhaustion date (Current date: Sept 10, 2026 + burnoutDays)
  const calculateBurnoutDate = (days: number): string => {
    const baseDate = new Date(2026, 8, 10); // Sept 10, 2026
    baseDate.setDate(baseDate.getDate() + days);
    const day = baseDate.getDate().toString().padStart(2, '0');
    const month = (baseDate.getMonth() + 1).toString().padStart(2, '0');
    return `${month}/${day}/${baseDate.getFullYear()}`;
  };

  // Summary counts for categories
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; critical: number; warning: number }> = {};
    RADAR_CATEGORIES.forEach((cat) => {
      const items = drugs.filter((d) => d.category === cat.id || d.category === cat.name);
      let crit = 0;
      let warn = 0;
      items.forEach((item) => {
        const regStats = getDrugRegionStats(item);
        if (regStats.risk === 'critical' || regStats.burnoutDays < 15) crit++;
        else if (regStats.risk === 'warning' || regStats.burnoutDays <= 30) warn++;
      });
      stats[cat.id] = { total: items.length, critical: crit, warning: warn };
    });
    return stats;
  }, [drugs, selectedRegion]);

  return (
    <div className="space-y-3.5 pb-6">
      {/* 1. TOP FILTER BLOCK (Region + Search) */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Regional Filter:</span>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {selectedRegion}
          </span>
        </div>

        {/* Region Selector Dropdown */}
        <div className="relative">
          <select
            id="mobile-region-selector"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-8 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
          >
            {regionsList.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="radar-search-input"
            type="text"
            placeholder="Search by drug name, INN, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Accordion Legend */}
      <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          Forecast Themes & Categories
        </span>
        <span className="text-[10px] text-slate-400">
          Tap category to expand
        </span>
      </div>

      {/* 2. INTERACTIVE CATEGORY ACCORDION */}
      <div className="space-y-2.5">
        {RADAR_CATEGORIES.map((cat) => {
          const isOpen = !!openCategories[cat.id];
          const stats = categoryStats[cat.id] || { total: 0, critical: 0, warning: 0 };
          const categoryDrugs = drugs.filter((drug) => {
            const matchesCategory = drug.category === cat.id || drug.category === cat.name;
            const matchesSearch =
              searchTerm === '' ||
              drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              drug.inn.toLowerCase().includes(searchTerm.toLowerCase()) ||
              drug.supplier.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
          });

          // If search term is entered and this category has matches, auto-open
          const shouldShowOpen = searchTerm ? categoryDrugs.length > 0 : isOpen;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
            >
              {/* Accordion Header */}
              <button
                id={`accordion-toggle-${cat.id}`}
                onClick={() => toggleCategory(cat.id)}
                className={`w-full p-3.5 text-left flex items-center justify-between gap-2 transition-colors ${
                  shouldShowOpen ? 'bg-gradient-to-r from-blue-50/70 to-white' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-base flex items-center justify-center shrink-0 shadow-2xs">
                    {cat.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                        {cat.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-semibold">
                        {stats.total}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Critical risk indicator badge if any */}
                  {stats.critical > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                      <AlertTriangle className="w-3 h-3" />
                      {stats.critical} deficit
                    </span>
                  ) : stats.warning > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                      {stats.warning} risk
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                      Normal
                    </span>
                  )}

                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    {shouldShowOpen ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Accordion Content (Predictive Analytics per Category) */}
              {shouldShowOpen && (
                <div className="p-3.5 pt-1 space-y-3 bg-slate-50/40 border-t border-slate-100">
                  {categoryDrugs.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-400">
                      {searchTerm ? 'No drugs match your query' : 'No drugs in this category yet'}
                    </div>
                  ) : (
                    categoryDrugs.map((drug) => {
                      const regStats = getDrugRegionStats(drug);
                      const burnoutDays = regStats.burnoutDays;
                      const isCritical = burnoutDays < 15;
                      const isWarning = burnoutDays >= 15 && burnoutDays <= 30;
                      const burnoutDateStr = calculateBurnoutDate(burnoutDays);

                      // Calculate risk percentage for visual progress bar
                      const riskProgress = Math.min(100, Math.max(8, Math.round((burnoutDays / 60) * 100)));

                      return (
                        <div
                          key={drug.id}
                          className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2.5 transition-all hover:border-blue-300"
                        >
                          {/* Drug Name & In-stock Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 
                                onClick={() => onSelectDrug(drug)}
                                className="text-xs font-bold text-slate-900 leading-snug hover:text-blue-600 cursor-pointer"
                              >
                                {drug.name}
                              </h4>
                              <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span>INN: {drug.inn}</span>
                                <span>•</span>
                                <span className="truncate">{drug.supplier}</span>
                              </div>
                            </div>

                            {/* Risk Scale Badge */}
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                                isCritical
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : isWarning
                                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {isCritical
                                ? `Deficit in ${burnoutDays}d`
                                : isWarning
                                ? `Watchlist (${burnoutDays}d)`
                                : `Normal (${burnoutDays}d)`}
                            </span>
                          </div>

                          {/* 4 KEY METRICS: CURRENT STOCK, DAILY BURN, DEMAND SPIKE, DEPLETION DATE */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100 text-xs">
                            {/* 1. Current Stock */}
                            <div>
                              <div className="text-[10px] text-slate-500 font-medium">Current Stock:</div>
                              <div className="text-xs font-extrabold text-slate-900 font-mono">
                                {formatNumber(regStats.stock)} {drug.unit}
                              </div>
                            </div>

                            {/* 2. Daily Burn Rate */}
                            <div>
                              <div className="text-[10px] text-slate-500 font-medium">Daily Burn Rate:</div>
                              <div className="text-xs font-bold text-slate-800 font-mono">
                                {formatNumber(regStats.dailyBurn)} {drug.unit}/day
                              </div>
                            </div>

                            {/* 3. Demand Surge (%) */}
                            <div>
                              <div className="text-[10px] text-slate-500 font-medium">Demand Surge:</div>
                              <div className="text-xs font-bold text-blue-700 flex items-center gap-0.5 font-mono">
                                <TrendingUp className="w-3 h-3 text-blue-600" />
                                +{drug.consumptionTrendPercent}%
                              </div>
                            </div>

                            {/* 4. Depletion Date */}
                            <div>
                              <div className="text-[10px] text-slate-500 font-medium">Depletion Date:</div>
                              <div className={`text-xs font-bold font-mono ${
                                isCritical ? 'text-red-600 font-extrabold' : isWarning ? 'text-amber-600' : 'text-slate-800'
                              }`}>
                                {burnoutDateStr}
                              </div>
                            </div>
                          </div>

                          {/* Visual Risk Scale Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                              <span className="flex items-center gap-1 font-semibold">
                                <Activity className="w-3 h-3 text-slate-400" />
                                Stock depletion runway
                              </span>
                              <span className={`font-mono font-bold ${isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {burnoutDays} days
                              </span>
                            </div>

                            {/* Risk Meter Bar */}
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden p-0.5">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isCritical
                                    ? 'bg-gradient-to-r from-red-600 to-rose-500'
                                    : isWarning
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                }`}
                                style={{ width: `${riskProgress}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400">
                              <span className="text-red-500 font-medium">&lt;15d (Critical)</span>
                              <span className="text-amber-500 font-medium">15–30d</span>
                              <span className="text-emerald-500 font-medium">&gt;30d (Normal)</span>
                            </div>
                          </div>

                          {/* Action Buttons: Predictive Procurement & Details */}
                          <div className="pt-1 flex items-center gap-2">
                            <button
                              id={`procurement-btn-${drug.id}`}
                              onClick={() => {
                                if (onOpenProcurementOrder) {
                                  onOpenProcurementOrder(drug);
                                } else {
                                  onQuickAlert(drug);
                                }
                              }}
                              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Create Predictive Procurement</span>
                            </button>

                            {/* Open Detailed Modal */}
                            <button
                              onClick={() => onSelectDrug(drug)}
                              className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl border border-slate-200 transition-colors"
                              title="Detailed trajectory & chart"
                              aria-label="Details"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
