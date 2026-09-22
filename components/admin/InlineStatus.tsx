'use client';

import * as React from 'react';
import { Check, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type State = 'idle' | 'saving' | 'saved' | 'error';

/**
 * A status cell that writes straight to Firestore and reports the outcome
 * inline, so a failed permission check is visible rather than silent.
 */
export function InlineStatus<T extends string>({
  value, options, onSave, ariaLabel,
}: {
  value: T;
  options: readonly T[];
  onSave: (next: T) => Promise<void>;
  ariaLabel: string;
}) {
  const [current, setCurrent] = React.useState<T>(value);
  const [state, setState] = React.useState<State>('idle');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => { setCurrent(value); }, [value]);

  async function change(next: T) {
    const previous = current;
    setCurrent(next);
    setState('saving');
    setMessage('');
    try {
      await onSave(next);
      setState('saved');
      setTimeout(() => setState('idle'), 1800);
    } catch (err) {
      setCurrent(previous);
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Update failed');
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <select
          aria-label={ariaLabel}
          value={current}
          disabled={state === 'saving'}
          onChange={(e) => change(e.target.value as T)}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'appearance-none rounded-lg border py-1.5 pl-2.5 pr-7 text-xs font-semibold transition',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:opacity-60',
            state === 'error' ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-ink-200 bg-white text-ink-800 hover:border-ink-300',
          )}
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
      </div>

      {state === 'saving' ? <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-400" /> : null}
      {state === 'saved' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : null}
      {state === 'error' ? (
        <span title={message} className="flex items-center text-rose-600">
          <AlertCircle className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </div>
  );
}
