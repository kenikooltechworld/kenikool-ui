/**
 * kenikool-ui/vanilla entry point.
 *
 * Importing this module registers all <k-*> custom elements as a side effect.
 * Users do not call customElements.define() themselves.
 *
 * Usage:
 *   import 'kenikool-ui/vanilla';
 *   // All <k-button>, <k-input>, etc. now work in HTML
 *
 * Each component import below is intentionally a side-effect import.
 * They are listed in the sideEffects field of package.json so bundlers
 * do not tree-shake them away.
 */

// Component registrations — each file calls customElements.define() at the bottom
import './Button/KButtonElement.js';
import './Badge/KBadgeElement.js';
import './Card/KCardElement.js';
import './Modal/KModalElement.js';

// Layout components — responsive by default, zero config
import './Grid/KGridElement.js';
import './Row/KRowElement.js';
import './Col/KColElement.js';
import './Stack/KStackElement.js';
import './Box/KBoxElement.js';
import './Container/KContainerElement.js';
import './Section/KSectionElement.js';
import './Frame/KFrameElement.js';
import './Text/KTextElement.js';
import './Divider/KDividerElement.js';

// Navigation components
import './NavbarHorizontal/KNavbarHorizontalElement.js';

import './Input/KInputElement.js';
import './NumberInput/KNumberInputElement.js';
import './Date/KDateElement.js';
import './Slider/KSliderElement.js';
import './Color/KColorElement.js';
import './Select/KSelectElement.js';
import './Checkbox/KCheckboxElement.js';
import './Toast/KToastElement.js';
import './Tooltip/KTooltipElement.js';
import './Avatar/KAvatarElement.js';
import './Loader/KLoaderElement.js';
import './Tabs/KTabsElement.js';
import './Tab/KTabElement.js';

// Carousel components
import './Carousel/KCarouselElement.js';
import './CarouselSlide/KCarouselSlideElement.js';

// Image components
import './Image/KImageElement.js';

// Lightbox component
import './Lightbox/KLightboxElement.js';

export { toastManager } from './Toast/KToastManager.js';
import './ThemeSwitcher/KThemeSwitcherElement.js';

// Public type exports — all types a user might need for TypeScript projects
export type { VTokens, Theme, Size, Color, Radius } from '../core/types.js';
import { applyTheme, getInitialTheme } from '../themes/themeCore.js';
export { parseV } from '../core/parseV.js';

// Theme API — exported so vanilla users can call applyTheme() / getInitialTheme()
// without needing a separate React entry.
applyTheme(getInitialTheme());
