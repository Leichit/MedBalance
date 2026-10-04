import React, { useState } from 'react';
import { Building2, Globe, Search, Filter, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DEMO_ORGANIZATIONS, OrganizationEntry } from '../data/organizationCatalog';

interface OrganizationCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrgId: string;
}

export const OrganizationCatalogModal: React.FC<OrganizationCatalogModalProps> = ({
  isOpen,
  onClose,
  currentOrgId,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const countries = ['All', 'Kazakhstan', 'Germany', 'United States', 'South Korea', 'Turkey', 'Switzerland'];
  const types = ['All', 'Clinical Hospital', 'National Depot', 'Pharmacy Chain', 'Pharma Manufacturer'];

  const filteredOrgs = DEMO_ORGANIZATIONS.filter((org) => {
    const matchesCountry = selectedCountry === 'All' || org.country === selectedCountry;
    const matchesType = selectedType === 'All' || org.type === selectedType;
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesType && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Global Organization Directory</h2>
              <p className="text-[11px] text-slate-400">MedBalance Multi-Tenant Healthcare Network</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Disclaimer Ribbon */}
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-blue-800">
          <span>
            <strong>Demo Data:</strong> Demonstrates international architecture scalability. Active defense scenario is hosted at Astana Demo Hospital (KZ-DEMO-01).
          </span>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-2.5 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by organization name, city, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <label className="text-slate-500 font-semibold block mb-0.5">Filter by Country:</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-medium"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-0.5">Filter by Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[11px] font-medium"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* List of Organizations */}
        <div className="p-4 overflow-y-auto space-y-2.5 text-xs">
          {filteredOrgs.map((org) => {
            const isCurrent = org.id === currentOrgId || org.isCurrentDemoOrg;
            return (
              <div
                key={org.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent 
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-200' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs">{org.name}</span>
                      {isCurrent && (
                        <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded font-mono">
                          PRIMARY DEFENSE ORG
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {org.city}, {org.country} · {org.type}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                    {org.id}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Capacity: {org.activeBedsOrOutlets}</span>
                  <span className="text-emerald-700 font-semibold">{org.connectedSystem}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-4 rounded-xl transition-all shadow-xs"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
