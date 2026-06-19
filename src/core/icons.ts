/**
 * icons — Central SVG icon registry for Kenikool UI.
 *
 * All icons are exported as SVG path strings to ensure consistency
 * and zero dependency on external icon fonts or libraries.
 *
 * Usage:
 *   import { ICON_SUN } from 'kenikool-ui/core/icons';
 *   element.innerHTML = `<svg ...><path d="${ICON_SUN}" /></svg>`;
 */

export const ICONS = {
  /** Sun icon for Light theme */
  sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707M6.343 17.657l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',

  /** Moon icon for Dark theme */
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',

  /** Dracula / Vampire icon */
  dracula: 'M12 2L4 5v6c0 5 3 8 8 8s8-3 8-8V5l-8-3z',

  /** Chevron Down for dropdowns */
  chevronDown: 'M6 9l6 6 6-6',

  /** Checkmark for active states */
  check: 'M20 6L9 17l-5-5',

  /** Search icon */
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',

  /** X / Close icon */
  close: 'M18 6L6 18M6 6l12 12',

  /** User profile icon */
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',

  /** Right arrow icon */
  'arrow-right': 'M5 12h14 M12 5l7 7-7 7',

  /** Settings / Gear icon */
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.8l-1 1.8a1.65 1.65 0 0 0-1.8 1.65 1.65 1.65 0 0 0-1.65-1.65l-1-1.8a1.65 1.65 0 0 0-.33-1.8l-1 1.8a1.65 1.65 0 0 0-1.65 1.65 1.65 1.65 0 0 0-1.65-1.65l-1-1.8a1.65 1.65 0 0 0-.33-1.8l1-1.8a1.65 1.65 0 0 0 1.8-1.65 1.65 1.65 0 0 0 1.65 1.65l1 1.8a1.65 1.65 0 0 0 .33 1.8l1-1.8a1.65 1.65 0 0 0 1.65-1.65 1.65 1.65 0 0 0 1.65 1.65l1 1.8a1.65 1.65 0 0 0 .33 1.8z',

  /** Eye icon for visibility */
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  'eye-off': 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 3l18 18',

  /** Home icon */
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',

  /** Notification bell icon */
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 13-3 13h18s-3-6-3-13z',

  /** Plus icon for increment */
  plus: 'M12 5v14M5 12h14',

  /** Minus icon for decrement */
  minus: 'M5 12h14',

  /** Calendar icon for date picker */
  calendar: 'M3 9h18M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M9 3v4M15 3v4',
} as const;

export type IconName = keyof typeof ICONS;

/**
 * Generates a full SVG string for a given icon.
 * @param iconName Name of the icon from the ICONS registry.
 * @param size Optional size in pixels (default 16).
 * @param className Optional CSS class for the SVG.
 */
export function getIcon(iconName: IconName, size = 16, className = ''): string {
  const path = ICONS[iconName];
  if (!path) return ''; // Return empty string if icon name not found to avoid <path d="undefined">
  return `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}">
      <path d="${path}" />
    </svg>
  `.trim();
}
