'use client';

import React from 'react';
import { ColDef, TABLE_HEADERS, QUICKADD } from './wispUtils';

/* ── Reusable form primitives ────────────────────────────────── */

interface FieldProps {
  dataKey: string;
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (key: string, value: string) => void;
  optLabel?: string;
}

export function TextField({ dataKey, label, placeholder, type, value, onChange, optLabel }: FieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-600 mb-1.5">
        {label} {optLabel && <span className="font-normal text-slate-400">{optLabel}</span>}
      </label>
      <input
        type={type || 'text'}
        value={value || ''}
        onChange={e => onChange(dataKey, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-wowzer-text focus:outline-none focus:ring-2 focus:ring-wowzer-primary/20 focus:border-wowzer-primary transition-all"
      />
    </div>
  );
}

interface AreaProps {
  dataKey: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (key: string, value: string) => void;
}

export function TextArea({ dataKey, label, placeholder, value, onChange }: AreaProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-600 mb-1.5">{label}</label>
      <textarea
        value={value || ''}
        onChange={e => onChange(dataKey, e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-wowzer-text focus:outline-none focus:ring-2 focus:ring-wowzer-primary/20 focus:border-wowzer-primary transition-all resize-y"
        style={{ minHeight: '70px' }}
      />
    </div>
  );
}

interface CheckProps {
  dataKey: string;
  label: string;
  checked: boolean;
  onChange: (key: string, value: boolean) => void;
}

export function Checkbox({ dataKey, label, checked, onChange }: CheckProps) {
  return (
    <label className="flex items-start gap-3 py-2 text-sm text-slate-600 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked || false}
        onChange={e => onChange(dataKey, e.target.checked)}
        className="w-4 h-4 mt-0.5 accent-wowzer-primary flex-shrink-0"
      />
      <span dangerouslySetInnerHTML={{ __html: label }} className="group-hover:text-wowzer-text transition-colors" />
    </label>
  );
}

/* ── Section wrapper ─────────────────────────────────────────── */

interface SectionProps {
  tag: string;
  title: string;
  law: string;
  plain: string;
  children: React.ReactNode;
}

export function Section({ tag, title, law, plain, children }: SectionProps) {
  return (
    <section className="pt-8 pb-2 border-t-2 border-slate-200 mt-8">
      <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-slate-400 mb-1">{tag}</div>
      <h2 className="font-heading font-semibold text-2xl text-wowzer-text tracking-tight mb-3">{title}</h2>
      <div className="text-[13.5px] text-slate-600 bg-slate-50 border-l-[3px] border-l-wowzer-primary pl-4 pr-3 py-3 rounded-r-md mb-5 leading-relaxed">
        <span className="text-wowzer-primary font-bold">⚖️ The law:</span>{' '}
        <span dangerouslySetInnerHTML={{ __html: law }} />
        <br /><br />
        <b>💬 In plain English:</b>{' '}
        <span dangerouslySetInnerHTML={{ __html: plain }} />
      </div>
      {children}
    </section>
  );
}

/* ── Dynamic repeatable table ────────────────────────────────── */

interface DynTableProps {
  tableKey: string;
  cols: ColDef[];
  rows: Record<string, string>[];
  onRowChange: (tableKey: string, rowIdx: number, colKey: string, value: string) => void;
  onAddRow: (tableKey: string) => void;
  onDeleteRow: (tableKey: string, rowIdx: number) => void;
  onQuickAdd: (tableKey: string, name: string) => void;
  hint?: string;
}

export function DynTable({ tableKey, cols, rows, onRowChange, onAddRow, onDeleteRow, onQuickAdd, hint }: DynTableProps) {
  const headers = TABLE_HEADERS[tableKey] || cols.map(c => c.k);
  const quickItems = QUICKADD[tableKey];

  return (
    <div>
      <div className="overflow-x-auto mb-2">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="text-left text-[10.5px] tracking-wider uppercase text-slate-400 font-bold px-1.5 py-1.5 border-b border-slate-200">{h}</th>
              ))}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {cols.map((c, ci) => (
                  <td key={ci} className="px-1 py-1 align-middle">
                    {c.t === 'sel' ? (
                      <select
                        value={row[c.k] || ''}
                        onChange={e => onRowChange(tableKey, ri, c.k, e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-[13px] bg-white focus:outline-none focus:border-wowzer-primary"
                      >
                        <option value=""></option>
                        {c.o?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={c.t || 'text'}
                        value={row[c.k] || ''}
                        onChange={e => onRowChange(tableKey, ri, c.k, e.target.value)}
                        placeholder={c.p}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-[13px] focus:outline-none focus:border-wowzer-primary"
                      />
                    )}
                  </td>
                ))}
                <td className="px-1 py-1 align-middle">
                  <button
                    onClick={() => onDeleteRow(tableKey, ri)}
                    className="text-slate-400 hover:text-red-500 text-lg px-1 leading-none transition-colors"
                    title="Remove"
                  >×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-1">
        <button
          onClick={() => onAddRow(tableKey)}
          className="bg-white border border-dashed border-slate-300 text-wowzer-primary rounded-lg px-3.5 py-2 text-[13px] font-semibold cursor-pointer hover:border-wowzer-primary hover:bg-wowzer-lighter transition-colors"
        >+ Add</button>
      </div>

      {quickItems && (
        <div className="flex items-center gap-1.5 flex-wrap mt-2 mb-2">
          <span className="text-[11.5px] text-slate-400 mr-1">Quick add:</span>
          {quickItems.map(name => (
            <button
              key={name}
              onClick={() => onQuickAdd(tableKey, name)}
              className="bg-slate-50 border border-slate-200 text-slate-500 rounded-full px-2.5 py-1 text-[12px] cursor-pointer hover:border-wowzer-primary hover:text-wowzer-primary hover:bg-wowzer-lighter transition-colors"
            >{name}</button>
          ))}
        </div>
      )}

      {hint && <p className="text-[12.5px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
