'use client';

import React from 'react';
import { Calculator, CircleHelp, CreditCard, PackageOpen, Truck } from 'lucide-react';
import type { School } from '../../types/school';
import { formatCurrency } from '../../lib/utils';

export const FeeIntelligence: React.FC<{ school: School }> = ({ school }) => {
  const fees = school.fees;
  const annualComponent = (fees.components || []).find(
    component => component.frequency === 'annual' && /tuition/i.test(component.name || '')
  );
  const annualTuition = fees.tuitionAnnual || annualComponent?.formattedAmount || (
    typeof fees.cardFee === 'number' && fees.comparableAnnualAvailable !== false ? formatCurrency(fees.cardFee) : ''
  );
  const annualIsCalculated = Boolean(annualComponent?.isCalculated || /calculated|estimated|approx/i.test(annualTuition || ''));
  const firstYear =
    typeof fees.estimatedFirstYear === 'number'
      ? formatCurrency(fees.estimatedFirstYear)
      : fees.estimatedFirstYearText || null;
  const oneTime = (fees.components || []).filter(component => component.category === 'one_time');
  const transport = (fees.components || []).filter(component => component.category === 'transport');
  const optional = (fees.components || []).filter(component => component.mandatory === false && component.category !== 'transport');

  return (
    <section className="rounded-2xl border border-orange-100 bg-white p-6 shadow-warm-xs space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-700">Fee Intelligence</span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">See the cost in parts, not one misleading number</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Annual tuition, first-year estimates, one-time charges and optional costs are separated so parents can understand what each figure represents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><CreditCard className="w-4 h-4 text-[var(--color-primary)]" /> Annual tuition view</div>
          <p className="text-base font-black text-[var(--color-primary)] mt-2">{annualTuition || 'Not publicly disclosed'}</p>
          <p className="text-[10px] text-slate-500 mt-1">{annualIsCalculated ? 'Calculated / estimated annual equivalent' : annualTuition ? 'Documented annual figure or comparable annual record' : 'Ask the school for the current fee schedule'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><Calculator className="w-4 h-4 text-emerald-700" /> First-year view</div>
          <p className="text-base font-black text-emerald-800 mt-2">{firstYear || 'Not documented'}</p>
          <p className="text-[10px] text-slate-500 mt-1">Only shown where the school record carries a documented estimate or total.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800"><PackageOpen className="w-4 h-4 text-slate-600" /> One-time charges</div>
          {oneTime.length ? oneTime.slice(0, 5).map(item => (
            <div key={item.id} className="flex justify-between gap-3 text-[11px] mt-2"><span className="text-slate-500">{item.name}</span><span className="font-bold text-slate-900">{item.formattedAmount}</span></div>
          )) : <p className="text-[11px] text-slate-500 mt-2">No separately itemized one-time charge in the current record.</p>}
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800"><Truck className="w-4 h-4 text-slate-600" /> Transport</div>
          {transport.length ? transport.slice(0, 5).map(item => (
            <div key={item.id} className="text-[11px] mt-2"><div className="font-semibold text-slate-800">{item.name}</div><div className="text-slate-500">{item.formattedAmount}</div></div>
          )) : <p className="text-[11px] text-slate-500 mt-2">Transport is not separately documented in the current record.</p>}
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800"><CircleHelp className="w-4 h-4 text-slate-600" /> Optional / extra</div>
          {optional.length ? optional.slice(0, 5).map(item => (
            <div key={item.id} className="text-[11px] mt-2"><div className="font-semibold text-slate-800">{item.name}</div><div className="text-slate-500">{item.formattedAmount}</div></div>
          )) : <p className="text-[11px] text-slate-500 mt-2">No optional extra is itemized in the current record.</p>}
        </div>
      </div>

      {fees.disclaimer && <p className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 text-[11px] text-amber-900 leading-relaxed">{fees.disclaimer}</p>}
    </section>
  );
};
