export function formatCurrencyKzt(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B ₸`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M ₸`;
  }
  return `${amount.toLocaleString('en-US')} ₸`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export function getRiskBadgeClass(risk: 'critical' | 'warning' | 'normal' | 'surplus'): string {
  switch (risk) {
    case 'critical':
      return 'bg-red-50 text-red-700 border border-red-200';
    case 'warning':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'normal':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'surplus':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
}

export function getRiskLabel(risk: 'critical' | 'warning' | 'normal' | 'surplus'): string {
  switch (risk) {
    case 'critical':
      return 'Critical Deficit (< 15 days)';
    case 'warning':
      return 'Risk Zone (15–30 days)';
    case 'normal':
      return 'Normal Stock (30–90 days)';
    case 'surplus':
      return 'Surplus (> 90 days)';
  }
}
