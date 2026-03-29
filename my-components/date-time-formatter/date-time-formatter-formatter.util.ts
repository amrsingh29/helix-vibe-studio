/**
 * @generated
 * @context Shared date/time formatting for design preview and runtime display.
 * @decisions Intl.DateTimeFormat for presets; Intl.RelativeTimeFormat for relative; parse ISO or epoch ms.
 * @references cookbook/02-ui-view-components.md
 * @modified 2026-03-22
 */
import type { DateTimeFormatKey } from './date-time-formatter.types';

export function parseDateTimeValue(value: unknown): Date | null {
  if (value == null) {
    return null;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const s = String(value).trim();
  if (s === '') {
    return null;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateTime(value: unknown, formatKey: DateTimeFormatKey): string {
  const date = parseDateTimeValue(value);
  if (!date) {
    return '—';
  }

  switch (formatKey) {
    case 'shortMonthDayYear':
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    case 'longMonthDayYear':
      return new Intl.DateTimeFormat(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    case 'dayShortMonthYear':
      return new Intl.DateTimeFormat(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    case 'usShort':
      return new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }).format(date);
    case 'euShort':
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    case 'isoDate':
      return date.toISOString().slice(0, 10);
    case 'shortWithTime':
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);
    case 'relative':
      return formatRelative(date);
    default:
      return date.toLocaleString();
  }
}

function formatRelative(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, 'second');
  }
  if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute');
  }
  if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, 'hour');
  }
  if (Math.abs(diffDay) < 7) {
    return rtf.format(diffDay, 'day');
  }
  if (Math.abs(diffWeek) < 4) {
    return rtf.format(diffWeek, 'week');
  }
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/** Parse fontSize string to number; fallback 14 */
export function parseFontSize(value: unknown): number {
  const s = String(value ?? '').trim();
  if (s === '') {
    return 14;
  }
  const n = parseInt(s, 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 72) : 14;
}
