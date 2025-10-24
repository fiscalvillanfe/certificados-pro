'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function addMonths(d: Date, m: number) { return new Date(d.getFullYear(), d.getMonth() + m, 1); }
function isSameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function toYMD(d: Date) { return d.toISOString().slice(0, 10); }
function fromYMD(s: string) { const [y, m, d] = s.split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); }

const weekdays = ['D','S','T','Q','Q','S','S'];

export type MiniCalendarProps = {
  value: string;
  onChange: (v: string) => void;
  onClose?: () => void;
  min?: string;
  max?: string;
};

export default function MiniCalendar({ value, onChange, onClose, min, max }: MiniCalendarProps) {
  const today = new Date();
  const valueDate = value ? fromYMD(value) : today;
  const [cursor, setCursor] = useState<Date>(startOfMonth(value ? valueDate : today));
  const minDate = min ? fromYMD(min) : undefined;
  const maxDate = max ? fromYMD(max) : undefined;

  const days = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    const startIdx = start.getDay();
    const total = startIdx + end.getDate();
    const rows = Math.ceil(total / 7);
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startIdx; i++) arr.push(null);
    for (let d = 1; d <= end.getDate(); d++) arr.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (arr.length < rows * 7) arr.push(null);
    return arr;
  }, [cursor]);

  function disabled(day: Date) {
    if (minDate && day < minDate) return true;
    if (maxDate && day > maxDate) return true;
    return false;
  }

  function pick(day: Date) {
    if (disabled(day)) return;
    onChange(toYMD(day));
    onClose?.();
  }

  return (
    <div className="card p-3 w-72 bg-neutral-900 border-white/10">
      <div className="flex items-center justify-between mb-2">
        <button className="p-2 rounded-lg hover:bg-neutral-800" onClick={() => setCursor(addMonths(cursor, -1))} aria-label="Mês anterior"><ChevronLeft size={18} /></button>
        <div className="text-sm font-medium">{cursor.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</div>
        <button className="p-2 rounded-lg hover:bg-neutral-800" onClick={() => setCursor(addMonths(cursor, 1))} aria-label="Próximo mês"><ChevronRight size={18} /></button>
      </div>

      <div className="grid grid-cols-7 text-[11px] text-neutral-400 mb-1">
        {weekdays.map((w) => <div key={w} className="text-center py-1">{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={i} className="h-9" />;
          const isToday = isSameDay(day, new Date());
          const isSelected = value && isSameDay(day, valueDate);
          const isDisabled = disabled(day);
          let cls = 'h-9 rounded-lg flex items-center justify-center text-sm transition select-none';
          if (isDisabled) cls += ' text-neutral-600 opacity-50 cursor-not-allowed';
          else if (isSelected) cls += ' bg-brand-600 text-white';
          else if (isToday) cls += ' border border-brand-500/60 text-neutral-100';
          else cls += ' hover:bg-neutral-800 cursor-pointer';
          return <button key={i} disabled={isDisabled} onClick={() => pick(day)} className={cls} title={toYMD(day)}>{day.getDate()}</button>;
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button className="px-2 py-1 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700" onClick={() => { const t = new Date(); setCursor(startOfMonth(t)); onChange(toYMD(t)); onClose?.(); }}>Hoje</button>
        <button className="px-2 py-1 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700" onClick={() => { const d = startOfMonth(new Date()); setCursor(d); onChange(toYMD(d)); onClose?.(); }}>Início do mês</button>
      </div>
    </div>
  );
}
