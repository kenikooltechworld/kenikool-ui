import { describe, it, expect } from 'vitest';
import { parseV } from '../../src/core/parseV.js';

/** All VTokens keys in the order V_DEFAULTS defines them. */
const ALL_VTOKENS_KEYS = [
  'variant', 'size', 'color', 'radius',
  'loading', 'disabled', 'full', 'target',
  'cols', 'gap', 'span', 'surface', 'align',
  'justify', 'direction', 'textSize', 'weight', 'as', 'padding',
];

describe('parseV — universal tokens', () => {
  it('parses all button variants as variant field', () => {
    const variants = ['filled', 'outlined', 'ghost', 'subtle', 'soft',
                      'gradient', 'glow', 'minimal', 'elevated', 'destructive'];
    for (const v of variants) {
      expect(parseV(v).variant).toBe(v);
    }
  });

  it('parses all sizes', () => {
    expect(parseV('xs').size).toBe('xs');
    expect(parseV('sm').size).toBe('sm');
    expect(parseV('md').size).toBe('md');
    expect(parseV('lg').size).toBe('lg');
    expect(parseV('xl').size).toBe('xl');
  });

  it('parses all colors', () => {
    for (const c of ['primary', 'success', 'warning', 'error', 'info', 'default']) {
      expect(parseV(c).color).toBe(c);
    }
  });

  it('parses radius tokens', () => {
    expect(parseV('r-full').radius).toBe('full');
    expect(parseV('r-none').radius).toBe('none');
    expect(parseV('r-sm').radius).toBe('sm');
    expect(parseV('r-md').radius).toBe('md');
    expect(parseV('r-lg').radius).toBe('lg');
    expect(parseV('').radius).toBeNull();
  });

  it('parses state flags', () => {
    expect(parseV('loading').loading).toBe(true);
    expect(parseV('disabled').disabled).toBe(true);
    expect(parseV('full').full).toBe(true);
    expect(parseV('').loading).toBe(false);
    expect(parseV('').disabled).toBe(false);
    expect(parseV('').full).toBe(false);
  });

  it('parses CSS selector target', () => {
    expect(parseV('filled .hero').target).toBe('.hero');
    expect(parseV('filled #app').target).toBe('#app');
    expect(parseV('').target).toBeNull();
  });

  it('defaults: variant=filled, size=md, color=primary when v is empty', () => {
    const d = parseV('');
    expect(d.variant).toBe('filled');
    expect(d.size).toBe('md');
    expect(d.color).toBe('primary');
    expect(d.radius).toBeNull();
    expect(d.loading).toBe(false);
    expect(d.disabled).toBe(false);
    expect(d.full).toBe(false);
    expect(d.target).toBeNull();
  });
});

describe('parseV — layout tokens', () => {
  it('parses cols-N (1–12)', () => {
    expect(parseV('cols-1').cols).toBe(1);
    expect(parseV('cols-3').cols).toBe(3);
    expect(parseV('cols-12').cols).toBe(12);
  });

  it('parses cols-auto', () => {
    expect(parseV('cols-auto').cols).toBe('auto');
  });

  it('ignores out-of-range cols', () => {
    expect(parseV('cols-0').cols).toBeNull();
    expect(parseV('cols-13').cols).toBeNull();
  });

  it('parses gap-N', () => {
    expect(parseV('gap-4').gap).toBe('4');
    expect(parseV('gap-8').gap).toBe('8');
    expect(parseV('gap-0').gap).toBe('0');
    expect(parseV('gap-px').gap).toBe('px');
  });

  it('parses span-N and span-full', () => {
    expect(parseV('span-2').span).toBe(2);
    expect(parseV('span-12').span).toBe(12);
    expect(parseV('span-full').span).toBe('full');
  });

  it('parses surface tokens (base and surface only — no collision)', () => {
    expect(parseV('base').surface).toBe('base');
    expect(parseV('surface').surface).toBe('surface');
    // elevated and overlay fall through to variant (avoid button variant collision)
    expect(parseV('elevated').variant).toBe('elevated');
    expect(parseV('elevated').surface).toBeNull();
  });

  it('parses align tokens', () => {
    expect(parseV('align-start').align).toBe('start');
    expect(parseV('align-center').align).toBe('center');
    expect(parseV('align-end').align).toBe('end');
    expect(parseV('align-stretch').align).toBe('stretch');
    expect(parseV('align-baseline').align).toBe('baseline');
  });

  it('parses justify tokens', () => {
    expect(parseV('justify-start').justify).toBe('start');
    expect(parseV('justify-center').justify).toBe('center');
    expect(parseV('justify-end').justify).toBe('end');
    expect(parseV('justify-between').justify).toBe('between');
    expect(parseV('justify-around').justify).toBe('around');
    expect(parseV('justify-evenly').justify).toBe('evenly');
  });

  it('parses direction tokens', () => {
    expect(parseV('horizontal').direction).toBe('horizontal');
    expect(parseV('vertical').direction).toBe('vertical');
  });

  it('parses text-* size tokens', () => {
    expect(parseV('text-xs').textSize).toBe('xs');
    expect(parseV('text-base').textSize).toBe('base');
    expect(parseV('text-2xl').textSize).toBe('2xl');
    expect(parseV('text-4xl').textSize).toBe('4xl');
  });

  it('parses font weight tokens', () => {
    expect(parseV('normal').weight).toBe('normal');
    expect(parseV('medium').weight).toBe('medium');
    expect(parseV('semibold').weight).toBe('semibold');
    expect(parseV('bold').weight).toBe('bold');
  });

  it('parses semantic element tokens (as)', () => {
    for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'code', 'pre']) {
      expect(parseV(tag).as).toBe(tag);
    }
  });

  it('parses padding p-N tokens', () => {
    expect(parseV('p-4').padding).toBe('4');
    expect(parseV('p-0').padding).toBe('0');
    expect(parseV('p-6').padding).toBe('6');
  });

  it('parses compound layout strings correctly', () => {
    const t = parseV('cols-3 gap-4 align-center');
    expect(t.cols).toBe(3);
    expect(t.gap).toBe('4');
    expect(t.align).toBe('center');
    // universal defaults still correct
    expect(t.variant).toBe('filled');
    expect(t.size).toBe('md');
  });

  it('text + typography compound', () => {
    const t = parseV('h2 text-2xl semibold');
    expect(t.as).toBe('h2');
    expect(t.textSize).toBe('2xl');
    expect(t.weight).toBe('semibold');
  });

  it('layout defaults are all null', () => {
    const d = parseV('');
    expect(d.cols).toBeNull();
    expect(d.gap).toBeNull();
    expect(d.span).toBeNull();
    expect(d.surface).toBeNull();
    expect(d.align).toBeNull();
    expect(d.justify).toBeNull();
    expect(d.direction).toBeNull();
    expect(d.textSize).toBeNull();
    expect(d.weight).toBeNull();
    expect(d.as).toBeNull();
    expect(d.padding).toBeNull();
  });
});

describe('parseV — idempotency and structure', () => {
  it('same input always produces identical output', () => {
    const samples = [
      '', 'filled', 'filled lg',
      'outlined xl warning r-full disabled .hero',
      'cols-3 gap-4 align-center',
      'text-2xl bold h2',
      'surface p-6 r-lg',
    ];
    for (const s of samples) {
      expect(parseV(s)).toEqual(parseV(s));
    }
  });

  it('output always contains exactly all VTokens keys', () => {
    const samples = ['', 'filled', 'cols-3 gap-4', 'text-2xl bold h2'];
    for (const s of samples) {
      expect(Object.keys(parseV(s))).toEqual(ALL_VTOKENS_KEYS);
    }
  });

  it('token order does not affect output', () => {
    expect(parseV('lg filled error')).toEqual(parseV('filled error lg'));
    expect(parseV('gap-4 cols-3')).toEqual(parseV('cols-3 gap-4'));
    expect(parseV('bold text-2xl h2')).toEqual(parseV('h2 text-2xl bold'));
  });

  it('handles null and undefined input safely', () => {
    expect(parseV(null).variant).toBe('filled');
    expect(parseV(undefined).variant).toBe('filled');
    expect(parseV('').variant).toBe('filled');
  });
});
