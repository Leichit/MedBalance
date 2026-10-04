import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Truck, 
  Send, 
  ArrowUpDown, 
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { DrugItem, RiskLevel } from '../types';
import { formatNumber, formatCurrencyKzt, getRiskBadgeClass } from '../utils/formatters';

interface DeficitRadarTableProps {
  drugs: DrugItem[];
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  onSelectDrug: (drug: DrugItem) => void;
  onQuickAlert: (drug: DrugItem) => void;
}

export const DeficitRadarTable: React.FC<DeficitRadarTableProps> = ({
  drugs,
  selectedRegion,
  setSelectedRegion,
  onSelectDrug,
  onQuickAlert,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<'all' | RiskLevel>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'burnout' | 'stock' | 'consumption' | 'gap'>('burnout');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(drugs.map(d => d.category));
    return ['all', ...Array.from(set)];
  }, [drugs]);

  // Filtered & sorted drugs
  const filteredDrugs = useMemo(() => {
    return drugs
      .filter((drug) => {
        const matchesSearch =
          drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drug.inn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          drug.supplier.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRisk = selectedRisk === 'all' || drug.riskLevel === selectedRisk;
        const matchesCategory = selectedCategory === 'all' || drug.category === selectedCategory;

        let matchesRegion = true;
        if (selectedRegion !== 'All Regions' && selectedRegion !== 'All Regions of KZ') {
          const reg = drug.regionalDistribution.find(r => r.region === selectedRegion || r.region.startsWith(selectedRegion) || selectedRegion.startsWith(r.region));
          matchesRegion = !!reg;
        }

        return matchesSearch && matchesRisk && matchesCategory && matchesRegion;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'burnout') {
          diff = a.burnoutDays - b.burnoutDays;
        } else if (sortBy === 'stock') {
          diff = a.currentStock - b.currentStock;
        } else if (sortBy === 'consumption') {
          diff = a.dailyConsumption - b.dailyConsumption;
        } else if (sortBy === 'gap') {
          const gapA = a.nextDeliveryDays - a.burnoutDays;
          const gapB = b.nextDeliveryDays - b.burnoutDays;
          diff = gapB - gapA; // highest deficit gap first
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [drugs, searchTerm, selectedRisk, selectedCategory, selectedRegion, sortBy, sortOrder]);

  const handleSort = (type: 'burnout' | 'stock' | 'consumption' | 'gap') => {
    if (sortBy === type) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-blue-100 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Predictive Radar of Stock & Shortages</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {filteredDrugs.length} of {drugs.length} items
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Real-time consumption tracking, exhaustion horizons, and distributor transit alignment
            </p>
          </div>

          {/* Region Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <select
              id="region-filter-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-sm font-medium bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="All Regions">All Regions (Consolidated)</option>
              <option value="Astana">Astana</option>
              <option value="Almaty">Almaty</option>
              <option value="Shymkent">Shymkent</option>
              <option value="Karaganda Region">Karaganda Region</option>
              <option value="Aktobe Region">Aktobe Region</option>
            </select>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-drugs-input"
              type="text"
              placeholder="Search by drug name (Ceftriaxone, Insulin...), INN or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              id="category-filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              id="risk-filter-all"
              onClick={() => setSelectedRisk('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRisk === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              id="risk-filter-critical"
              onClick={() => setSelectedRisk('critical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRisk === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
              }`}
            >
              Deficit (&lt;15d)
            </button>
            <button
              id="risk-filter-warning"
              onClick={() => setSelectedRisk('warning')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRisk === 'warning'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Warning (15-30d)
            </button>
            <button
              id="risk-filter-normal"
              onClick={() => setSelectedRisk('normal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRisk === 'normal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              Adequate
            </button>
            <button
              id="risk-filter-surplus"
              onClick={() => setSelectedRisk('surplus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRisk === 'surplus'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Surplus (&gt;90d)
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <th className="py-3 px-4">Medication / INN / Category</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-blue-700 select-none"
                onClick={() => handleSort('stock')}
              >
                <div className="flex items-center gap-1">
                  <span>Stock</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-blue-700 select-none"
                onClick={() => handleSort('consumption')}
              >
                <div className="flex items-center gap-1">
                  <span>Daily Burn</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-blue-700 select-none"
                onClick={() => handleSort('burnout')}
              >
                <div className="flex items-center gap-1">
                  <span>Runway</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Distributor Transit</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-blue-700 select-none"
                onClick={() => handleSort('gap')}
              >
                <div className="flex items-center gap-1">
                  <span>Stockout Gap</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredDrugs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <p className="text-base font-semibold text-slate-700">No medications found</p>
                  <p className="text-xs text-slate-500 mt-1">Try modifying your search criteria or active filters</p>
                </td>
              </tr>
            ) : (
              filteredDrugs.map((drug) => {
                // Calculate regional slice if a specific region is picked
                let displayStock = drug.currentStock;
                let displayDailyBurn = drug.dailyConsumption;
                let displayDays = drug.burnoutDays;
                let displayRisk = drug.riskLevel;

                if (selectedRegion !== 'All Regions' && selectedRegion !== 'All Regions of KZ') {
                  const regData = drug.regionalDistribution.find(r => r.region === selectedRegion || r.region.startsWith(selectedRegion) || selectedRegion.startsWith(r.region));
                  if (regData) {
                    displayStock = regData.stock;
                    displayDailyBurn = regData.dailyBurn;
                    displayDays = regData.daysRemaining;
                    displayRisk = regData.risk;
                  }
                }

                // Gap between delivery and stock burnout
                const deficitGapDays = drug.nextDeliveryDays - displayDays;
                const hasDeficitGap = deficitGapDays > 0;

                return (
                  <tr 
                    key={drug.id} 
                    id={`drug-row-${drug.id}`}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectDrug(drug)}
                  >
                    {/* Drug Name & Info */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-2">
                        {drug.name}
                        {drug.isEssential && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                            Essential
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 font-mono mt-0.5">
                        INN: {drug.inn}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {drug.category}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {drug.supplier}
                        </span>
                      </div>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      <div>{formatNumber(displayStock)} {drug.unit}</div>
                      <div className="text-[11px] text-slate-600 font-normal">
                        {formatCurrencyKzt(displayStock * drug.unitCostKzt)}
                      </div>
                    </td>

                    {/* Consumption Velocity */}
                    <td className="py-3.5 px-4 font-mono text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{formatNumber(displayDailyBurn)} / day</span>
                        {drug.consumptionTrendPercent > 10 && (
                          <span className="text-[11px] font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded flex items-center">
                            +{drug.consumptionTrendPercent}%
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 font-sans">
                        Demand trend
                      </div>
                    </td>

                    {/* Burnout Days & Progress Bar */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-extrabold font-mono ${
                          displayRisk === 'critical' ? 'text-red-600' :
                          displayRisk === 'warning' ? 'text-amber-600' :
                          displayRisk === 'normal' ? 'text-blue-700' : 'text-emerald-700'
                        }`}>
                          {displayDays}d
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getRiskBadgeClass(displayRisk)}`}>
                          {displayRisk === 'critical' ? 'Deficit' :
                           displayRisk === 'warning' ? 'Warning' :
                           displayRisk === 'normal' ? 'Adequate' : 'Surplus'}
                        </span>
                      </div>
                      {/* Visual progress meter */}
                      <div className="w-28 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div 
                          className={`h-full rounded-full ${
                            displayRisk === 'critical' ? 'bg-red-500' :
                            displayRisk === 'warning' ? 'bg-amber-500' :
                            displayRisk === 'normal' ? 'bg-blue-600' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (displayDays / 45) * 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Next Delivery */}
                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>In {drug.nextDeliveryDays}d ({drug.nextDeliveryDate})</span>
                      </div>
                      <div className="text-slate-600 font-mono mt-0.5">
                        Batch: +{formatNumber(drug.nextDeliveryQty)} {drug.unit}
                      </div>
                      <div className="mt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          drug.deliveryStatus === 'delayed' ? 'bg-red-100 text-red-800' :
                          drug.deliveryStatus === 'customs_check' ? 'bg-amber-100 text-amber-800' :
                          drug.deliveryStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {drug.deliveryStatus === 'delayed' ? 'Flight Delayed' :
                           drug.deliveryStatus === 'customs_check' ? 'Customs Inspection' :
                           drug.deliveryStatus === 'shipped' ? 'In SK-Pharmacy Transit' :
                           'On Schedule'}
                        </span>
                      </div>
                    </td>

                    {/* Deficit Gap Indicator */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {hasDeficitGap ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs">
                          <div className="font-bold text-red-700 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Deficit: {deficitGapDays}d</span>
                          </div>
                          <div className="text-[11px] text-red-600 mt-0.5 font-medium">
                            Stockouts before shipment arrives
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs">
                          <div className="font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>No Gap</span>
                          </div>
                          <div className="text-[11px] text-emerald-600 mt-0.5">
                            Shipment arrives before zero stock
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`quick-alert-${drug.id}`}
                          onClick={() => onQuickAlert(drug)}
                          title="Generate automated alert for SK-Pharmacy / pharmacies"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Alert</span>
                        </button>
                        <button
                          id={`view-forecast-${drug.id}`}
                          onClick={() => onSelectDrug(drug)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                          title="Open predictive model and detailed inventory"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
