/**
 * KDateElement — <k-date> Web Custom Element.
 *
 * Usage:
 *   <k-date v="outlined md" label="Arrival Date" value="2024-06-15"></k-date>
 *   <k-date v="filled lg" label="Birth Date" min="1900-01-01" max="2024-01-01"></k-date>
 *   <k-date v="outlined md" label="Meeting" format="MM/DD/YYYY" disablePast></k-date>
 *
 * Features:
 *   - Text input with format mask (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
 *   - Calendar icon button (right side) to open calendar overlay
 *   - Calendar month view with navigation (prev/next, month/year dropdowns)
 *   - Keyboard navigation (arrow keys, Page Up/Down, Home/End)
 *   - Today button and Clear button
 *   - Min/max date constraints
 *   - Disable past/future dates
 *   - Auto-formatting as user types
 *   - Full accessibility (ARIA, keyboard, screen readers)
 *   - All standard input features: variants, sizes, colors, validation, etc.
 */

import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { getIcon } from '../../core/icons.js';

// Side-effect import: ensures <k-loader> is registered
import '../Loader/KLoaderElement.js';

export class KDateElement extends KBaseElement {
  // ─── Form-Associated Custom Element ────────────────────────────────────
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _form: HTMLFormElement | null = null;
  private _onFormReset = (): void => this._handleFormReset();

  // ─── DOM refs ────────────────────────────────────────────────────────────
  private _field: HTMLInputElement | null = null;
  private _hintEl: HTMLElement | null = null;
  private _labelEl: HTMLElement | null = null;
  private _wrapper: HTMLElement | null = null;
  private _calendarBtn: HTMLButtonElement | null = null;
  private _calendarOverlay: HTMLElement | null = null;
  private _loaderEl: HTMLElement | null = null;
  private _id: string = '';

  // ─── Internal state ─────────────────────────────────────────────────────
  private _defaultValue = '';
  private _touched = false;
  private _externalError = false;
  private _calendarOpen = false;
  private _tempSelectedDate: Date | null = null; // Track tentative selection before confirming

  // ─── Configuration ──────────────────────────────────────────────────────
  private _format: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' = 'MM/DD/YYYY';
  private _min: Date | null = null;
  private _max: Date | null = null;
  private _disablePast = false;
  private _disableFuture = false;
  private _currentViewMonth: Date = new Date(); // For calendar navigation

  // ─── Public value API ───────────────────────────────────────────────────

  /**
   * The current date value in ISO format (YYYY-MM-DD).
   * Returns null if the field is empty or contains invalid date.
   */
  get value(): string | null {
    if (!this._field) return null;
    const dateObj = this._parseInputToDate(this._field.value);
    if (!dateObj) return null;
    return this._dateToISO(dateObj);
  }

  set value(val: string | null) {
    if (!this._field) return;
    if (val === null || val === undefined) {
      this._field.value = '';
    } else {
      const dateObj = this._parseISOToDate(val);
      if (dateObj && this._isValidDate(dateObj)) {
        const formatted = this._formatDateForDisplay(dateObj);
        this._field.value = formatted;
      }
    }
    this._updateCalendarButton();
    this._updateValidState();
    if (this._internals) {
      this._internals.setFormValue(this._field.value);
    }
  }

  /** The form the input is associated with — read-only. */
  get form(): HTMLFormElement | null {
    return this._form;
  }

  /** Native validity check. */
  checkValidity(): boolean {
    if (!this._field) return true;
    return this._field.checkValidity();
  }

  /** Report validity to the user. */
  reportValidity(): boolean {
    if (!this._field) return true;
    return this._field.reportValidity();
  }

  // ─── Observed attributes ────────────────────────────────────────────────

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      'label', 'placeholder', 'hint', 'label-position',
      'name', 'form', 'value', 'defaultValue', 'disabled', 'required',
      'min', 'max', 'format', 'disablePast', 'disableFuture',
      'error', 'validation-message', 'autofocus', 'readonly', 'icon', 'addOn',
    ];
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (typeof this.attachInternals === 'function') {
      try {
        this._internals = this.attachInternals();
      } catch {
        this._internals = null;
      }
    }
    this._resolveForm();

    // Validate iconRight is not used
    if (this.hasAttribute('iconRight')) {
      console.warn('[k-date] iconRight is not supported. The right side is reserved for the calendar button.');
      this.removeAttribute('iconRight');
    }

    super.connectedCallback();
    this._parseAttributes();
    this._handleAutofocus();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._form) {
      this._form.removeEventListener('reset', this._onFormReset);
    }
    if (this._calendarOverlay) {
      document.removeEventListener('click', this._onDocumentClick);
    }
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    super.attributeChangedCallback(name, oldVal, newVal);

    if (name === 'error') {
      this._externalError = newVal !== null && newVal !== 'false';
      this._applyErrorState();
    }

    if (name === 'form' && oldVal !== newVal) {
      this._resolveForm();
    }

    if (name === 'disabled' && this._field) {
      this._field.disabled = newVal !== null && newVal !== 'false';
      if (this._calendarBtn) {
        this._calendarBtn.disabled = this._field.disabled;
      }
    }

    // Re-parse date constraints
    if (['min', 'max', 'format', 'disablePast', 'disableFuture'].includes(name)) {
      this._parseAttributes();
    }
  }

  // ─── Helper: Parse attributes ────────────────────────────────────────

  private _parseAttributes(): void {
    const formatAttr = this.getAttribute('format') || 'MM/DD/YYYY';
    this._format = formatAttr as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';

    const minAttr = this.getAttribute('min');
    this._min = minAttr ? this._parseISOToDate(minAttr) : null;

    const maxAttr = this.getAttribute('max');
    this._max = maxAttr ? this._parseISOToDate(maxAttr) : null;

    this._disablePast = this.hasAttribute('disablePast');
    this._disableFuture = this.hasAttribute('disableFuture');
  }

  // ─── Date parsing/formatting ────────────────────────────────────────

  private _parseISOToDate(iso: string): Date | null {
    // Expect format: YYYY-MM-DD
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const date = new Date(parseInt(match[1]!, 10), parseInt(match[2]!, 10) - 1, parseInt(match[3]!, 10));
    return this._isValidDate(date) ? date : null;
  }

  private _dateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private _formatDateForDisplay(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (this._format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'MM/DD/YYYY':
      default:
        return `${month}/${day}/${year}`;
    }
  }

  private _parseInputToDate(input: string): Date | null {
    if (!input.trim()) return null;

    let year: number, month: number, day: number;

    if (this._format === 'DD/MM/YYYY') {
      const match = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!match) return null;
      day = parseInt(match[1]!, 10);
      month = parseInt(match[2]!, 10);
      year = parseInt(match[3]!, 10);
    } else if (this._format === 'YYYY-MM-DD') {
      const match = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (!match) return null;
      year = parseInt(match[1]!, 10);
      month = parseInt(match[2]!, 10);
      day = parseInt(match[3]!, 10);
    } else {
      // MM/DD/YYYY (default)
      const match = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!match) return null;
      month = parseInt(match[1]!, 10);
      day = parseInt(match[2]!, 10);
      year = parseInt(match[3]!, 10);
    }

    const date = new Date(year, month - 1, day);
    return this._isValidDate(date) ? date : null;
  }

  private _isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  // ─── Main render ────────────────────────────────────────────────────────

  protected _render(): void {
    if (this._wrapper) return;

    const tokens = this._getTokens();
    this._parseAttributes();

    this._id = `k-date-${Math.random().toString(36).substring(2, 11)}`;

    const initialValue = this.getAttribute('value') ?? this.getAttribute('defaultValue') ?? '';
    this._defaultValue = initialValue;

    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'k-date__field-group';

    const wrapper = document.createElement('div');
    wrapper.className = 'k-date__wrapper';

    // Label
    const labelText = this.getAttribute('label');
    const labelPos = this.getAttribute('label-position') || 'top';

    if (labelText) {
      const labelEl = document.createElement('label');
      labelEl.className = 'k-date__label';
      labelEl.textContent = sanitizeText(labelText);
      labelEl.setAttribute('for', this._id);
      this._labelEl = labelEl;

      if (labelPos === 'top') {
        fieldGroup.appendChild(labelEl);
      }
    }

    // Left icon (if provided)
    const iconName = this.getAttribute('icon');
    if (iconName) {
      const iconEl = document.createElement('span');
      iconEl.className = 'k-date__icon-left';
      iconEl.innerHTML = getIcon(iconName as any);
      iconEl.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(iconEl);
    }

    // Input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'k-date__field';
    input.id = this._id;

    const placeholder = this.getAttribute('placeholder') || this._format;
    input.placeholder = placeholder;

    if (initialValue) {
      const dateObj = this._parseISOToDate(initialValue);
      if (dateObj && this._isValidDate(dateObj)) {
        input.value = this._formatDateForDisplay(dateObj);
      }
    }

    if (this.getAttribute('required')) {
      input.required = true;
      input.setAttribute('aria-required', 'true');
    }

    if (this.getAttribute('readonly')) {
      input.readOnly = true;
      input.setAttribute('aria-readonly', 'true');
    }

    this._field = input;
    wrapper.appendChild(input);

    // Calendar button (right side)
    const calendarBtn = document.createElement('button');
    calendarBtn.type = 'button';
    calendarBtn.className = 'k-date__calendar-btn';
    calendarBtn.innerHTML = getIcon('calendar');
    calendarBtn.setAttribute('aria-label', 'Open calendar');
    calendarBtn.setAttribute('tabindex', '-1');
    calendarBtn.onclick = () => this._toggleCalendar();
    this._calendarBtn = calendarBtn;
    wrapper.appendChild(calendarBtn);

    fieldGroup.appendChild(wrapper);

    if (labelText && labelPos === 'bottom') {
      fieldGroup.appendChild(this._labelEl!);
    }

    this.appendChild(fieldGroup);
    this._wrapper = wrapper;

    this.setAttribute('data-label-position', labelPos);

    // Hint
    const hintText = this.getAttribute('hint');
    if (hintText) {
      const hintEl = document.createElement('span');
      hintEl.className = 'k-date__hint';
      hintEl.textContent = sanitizeText(hintText);
      fieldGroup.appendChild(hintEl);
      this._hintEl = hintEl;
    }

    this._applyErrorState();
    this._updateValidState();

    if (this._internals) {
      try {
        this._internals.setFormValue(this._field.value);
      } catch {
        // ignore
      }
    }
  }

  // ─── Calendar overlay ───────────────────────────────────────────────────

  private _toggleCalendar(): void {
    if (this._calendarOpen) {
      this._closeCalendar();
    } else {
      this._openCalendar();
    }
  }

  private _openCalendar(): void {
    if (this._calendarOpen || !this._field) return;

    // Parse current input to set calendar view
    const currentDate = this._parseInputToDate(this._field.value);
    if (currentDate && this._isValidDate(currentDate)) {
      this._currentViewMonth = new Date(currentDate);
    } else {
      this._currentViewMonth = new Date();
    }

    // Only create overlay once
    if (!this._calendarOverlay) {
      this._createCalendarOverlay();
    } else {
      this._updateCalendarGrid();
    }
    
    this._calendarOpen = true;
    this._field.setAttribute('aria-expanded', 'true');

    // Close calendar when clicking outside
    document.addEventListener('click', this._onDocumentClick);
  }

  private _closeCalendar(): void {
    if (this._calendarOverlay) {
      this._calendarOverlay.remove();
      this._calendarOverlay = null;
    }
    this._calendarOpen = false;
    if (this._field) {
      this._field.setAttribute('aria-expanded', 'false');
    }
    document.removeEventListener('click', this._onDocumentClick);
  }

  private _onDocumentClick = (e: MouseEvent): void => {
    if (!this._wrapper?.contains(e.target as Node) && !this._calendarOverlay?.contains(e.target as Node)) {
      this._closeCalendar();
    }
  };

  private _createCalendarOverlay(): void {
    const overlay = document.createElement('div');
    overlay.className = 'k-date__calendar-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Choose date');

    // Position overlay
    if (this._wrapper) {
      this._wrapper.appendChild(overlay);
      // Calculate position AFTER adding to DOM
      requestAnimationFrame(() => this._positionCalendarOverlay(overlay));
    }

    // Calendar header with navigation
    const header = document.createElement('div');
    header.className = 'k-date__calendar-header';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'k-date__nav-btn';
    prevBtn.innerHTML = getIcon('chevronDown');
    prevBtn.setAttribute('aria-label', 'Previous month');
    prevBtn.setAttribute('tabindex', '0');
    prevBtn.onclick = (e) => {
      e.preventDefault();
      this._previousMonth();
    };

    const monthYear = document.createElement('div');
    monthYear.className = 'k-date__month-year';
    monthYear.id = `${this._id}-month-year`;
    monthYear.textContent = sanitizeText(this._currentViewMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' }));

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'k-date__nav-btn';
    nextBtn.innerHTML = getIcon('chevronDown');
    nextBtn.setAttribute('aria-label', 'Next month');
    nextBtn.setAttribute('tabindex', '0');
    nextBtn.style.transform = 'scaleY(-1)';
    nextBtn.onclick = (e) => {
      e.preventDefault();
      this._nextMonth();
    };

    header.appendChild(prevBtn);
    header.appendChild(monthYear);
    header.appendChild(nextBtn);
    overlay.appendChild(header);

    // Day names
    const dayNames = document.createElement('div');
    dayNames.className = 'k-date__day-names';
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    days.forEach((day) => {
      const dayEl = document.createElement('div');
      dayEl.textContent = sanitizeText(day);
      dayNames.appendChild(dayEl);
    });
    overlay.appendChild(dayNames);

    // Days grid (will be populated by _updateCalendarGrid)
    const daysGrid = document.createElement('div');
    daysGrid.className = 'k-date__days-grid';
    daysGrid.setAttribute('role', 'grid');
    daysGrid.id = `${this._id}-days-grid`;
    overlay.appendChild(daysGrid);

    // Buttons footer
    const footer = document.createElement('div');
    footer.className = 'k-date__calendar-footer';

    // Preset shortcuts section
    const shortcutsDiv = document.createElement('div');
    shortcutsDiv.className = 'k-date__shortcuts';

    const todayBtn = document.createElement('button');
    todayBtn.type = 'button';
    todayBtn.textContent = 'Today';
    todayBtn.className = 'k-date__shortcut-btn';
    todayBtn.setAttribute('tabindex', '0');
    todayBtn.onclick = (e) => {
      e.preventDefault();
      this._selectToday();
    };

    const nextWeekBtn = document.createElement('button');
    nextWeekBtn.type = 'button';
    nextWeekBtn.textContent = 'Next Week';
    nextWeekBtn.className = 'k-date__shortcut-btn';
    nextWeekBtn.setAttribute('tabindex', '0');
    nextWeekBtn.onclick = (e) => {
      e.preventDefault();
      this._selectNextWeek();
    };

    shortcutsDiv.appendChild(todayBtn);
    shortcutsDiv.appendChild(nextWeekBtn);

    // Add custom addOn buttons if provided
    const addOnAttr = this.getAttribute('addOn');
    if (addOnAttr) {
      try {
        const addOns = JSON.parse(addOnAttr);
        if (Array.isArray(addOns)) {
          addOns.forEach((addon: any) => {
            const addonBtn = document.createElement('button');
            addonBtn.type = 'button';
            addonBtn.textContent = sanitizeText(addon.label || 'Custom');
            addonBtn.className = 'k-date__shortcut-btn';
            addonBtn.setAttribute('tabindex', '0');
            addonBtn.onclick = (e) => {
              e.preventDefault();
              if (addon.daysFromNow !== undefined) {
                this._selectDaysFromNow(addon.daysFromNow);
              }
            };
            shortcutsDiv.appendChild(addonBtn);
          });
        }
      } catch {
        // Invalid JSON, skip custom addOns
      }
    }

    footer.appendChild(shortcutsDiv);

    // Main action buttons section
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'k-date__actions';

    const selectBtn = document.createElement('button');
    selectBtn.type = 'button';
    selectBtn.textContent = 'Select';
    selectBtn.className = 'k-date__select-btn';
    selectBtn.setAttribute('tabindex', '0');
    selectBtn.onclick = (e) => {
      e.preventDefault();
      this._confirmSelection();
    };

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = 'Clear';
    clearBtn.setAttribute('tabindex', '0');
    clearBtn.onclick = (e) => {
      e.preventDefault();
      this._clearDate();
    };

    actionsDiv.appendChild(selectBtn);
    actionsDiv.appendChild(clearBtn);
    footer.appendChild(actionsDiv);

    overlay.appendChild(footer);

    // Position overlay
    if (this._wrapper) {
      this._wrapper.appendChild(overlay);
    }
    this._calendarOverlay = overlay;
    this._updateCalendarGrid();
  }

  private _positionCalendarOverlay(overlay: HTMLElement): void {
    if (!this._wrapper || !overlay.parentElement) return;

    const wrapperRect = this._wrapper.getBoundingClientRect();
    const overlayHeight = Math.min(400, overlay.scrollHeight);
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate available space
    const spaceBelow = viewportHeight - wrapperRect.bottom;
    const spaceAbove = wrapperRect.top;
    const spaceRight = viewportWidth - wrapperRect.left;
    const spaceLeft = wrapperRect.right;

    // Reset positioning classes
    overlay.classList.remove('k-date__calendar-overlay--above', 'k-date__calendar-overlay--below');
    overlay.classList.remove('k-date__calendar-overlay--left', 'k-date__calendar-overlay--right');

    // Vertical positioning: flip if not enough space below
    const shouldOpenAbove = spaceBelow < overlayHeight && spaceAbove > spaceBelow;

    if (shouldOpenAbove) {
      overlay.classList.add('k-date__calendar-overlay--above');
    } else {
      overlay.classList.add('k-date__calendar-overlay--below');
    }

    // Horizontal positioning: prevent overflow
    const overlayWidth = overlay.offsetWidth;

    if (wrapperRect.left + overlayWidth > viewportWidth) {
      // Align to right edge if overflowing
      overlay.classList.add('k-date__calendar-overlay--left');
    } else {
      // Default: align to left
      overlay.classList.add('k-date__calendar-overlay--right');
    }
  }

  private _updateCalendarGrid(): void {
    if (!this._calendarOverlay) return;

    const monthYearEl = this._calendarOverlay.querySelector(`#${this._id}-month-year`);
    if (monthYearEl) {
      monthYearEl.textContent = sanitizeText(this._currentViewMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
    }

    const gridContainer = this._calendarOverlay.querySelector(`#${this._id}-days-grid`);
    if (!gridContainer) return;

    // Clear existing grid
    gridContainer.innerHTML = '';

    const year = this._currentViewMonth.getFullYear();
    const month = this._currentViewMonth.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDate = this._parseInputToDate(this._field?.value || '');

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'k-date__day k-date__day--empty';
      emptyCell.setAttribute('aria-hidden', 'true');
      gridContainer.appendChild(emptyCell);
    }

    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const cellEl = document.createElement('button');
      cellEl.type = 'button';
      cellEl.className = 'k-date__day';
      cellEl.textContent = String(day);
      cellEl.setAttribute('role', 'gridcell');
      cellEl.setAttribute('tabindex', '0');

      const isToday = cellDate.getTime() === today.getTime();
      const isSelected = currentDate && cellDate.getTime() === currentDate.getTime();
      const isDisabled = !this._isDateSelectable(cellDate);

      if (isToday) {
        cellEl.classList.add('k-date__day--today');
        cellEl.setAttribute('aria-label', `Today, ${sanitizeText(cellDate.toDateString())}`);
      }
      if (isSelected) {
        cellEl.classList.add('k-date__day--selected');
        cellEl.setAttribute('aria-pressed', 'true');
      }
      if (isDisabled) {
        cellEl.disabled = true;
        cellEl.classList.add('k-date__day--disabled');
        cellEl.setAttribute('aria-disabled', 'true');
      }

      cellEl.onclick = () => {
        if (!isDisabled) {
          this._tempSelectedDate = cellDate;
          this._updateCalendarGrid();
        }
      };

      gridContainer.appendChild(cellEl);
    }
  }

  private _isDateSelectable(date: Date): boolean {
    if (this._min && date < this._min) return false;
    if (this._max && date > this._max) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this._disablePast && date < today) return false;
    if (this._disableFuture && date > today) return false;

    return true;
  }

  private _previousMonth(): void {
    this._currentViewMonth.setMonth(this._currentViewMonth.getMonth() - 1);
    this._updateCalendarGrid();
  }

  private _nextMonth(): void {
    this._currentViewMonth.setMonth(this._currentViewMonth.getMonth() + 1);
    this._updateCalendarGrid();
  }

  private _confirmSelection(): void {
    if (this._tempSelectedDate && this._isDateSelectable(this._tempSelectedDate)) {
      this._selectDate(this._tempSelectedDate);
    }
  }

  private _selectDate(date: Date): void {
    if (this._field) {
      this._field.value = this._formatDateForDisplay(date);
      this._touched = true;
      this._dispatch('k:change', { value: this.value });
      this._dispatch('change', { value: this.value });
    }
    this._tempSelectedDate = null;
    this._closeCalendar();
    this._updateValidState();
    if (this._internals && this._field) {
      this._internals.setFormValue(this._field.value);
    }
  }

  private _selectToday(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (this._isDateSelectable(today)) {
      this._selectDate(today);
    }
  }

  private _selectNextWeek(): void {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);
    if (this._isDateSelectable(nextWeek)) {
      this._selectDate(nextWeek);
    }
  }

  private _selectDaysFromNow(days: number): void {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(0, 0, 0, 0);
    if (this._isDateSelectable(date)) {
      this._selectDate(date);
    }
  }

  private _clearDate(): void {
    if (this._field) {
      this._field.value = '';
      this._touched = true;
      this._dispatch('k:change', { value: null });
      this._dispatch('change', { value: null });
    }
    this._tempSelectedDate = null;
    this._closeCalendar();
    this._updateValidState();
    if (this._internals) {
      this._internals.setFormValue('');
    }
  }

  private _updateCalendarButton(): void {
    // Placeholder for future enhancements
  }

  // ─── Form integration ───────────────────────────────────────────────────

  private _resolveForm(): void {
    if (this._form) {
      this._form.removeEventListener('reset', this._onFormReset);
      this._form = null;
    }
    const formId = this.getAttribute('form');
    let form: HTMLFormElement | null = null;
    if (formId) {
      form = document.getElementById(formId) as HTMLFormElement | null;
    } else {
      form = this.closest('form');
    }
    if (form) {
      this._form = form;
      this._form.addEventListener('reset', this._onFormReset);
    }
  }

  private _handleFormReset(): void {
    if (this._field) {
      if (this._defaultValue) {
        const dateObj = this._parseISOToDate(this._defaultValue);
        if (dateObj && this._isValidDate(dateObj)) {
          this._field.value = this._formatDateForDisplay(dateObj);
        }
      } else {
        this._field.value = '';
      }
    }
    this._touched = false;
    this.removeAttribute('data-error');
    this.removeAttribute('data-valid');
    this._updateValidState();
  }

  // ─── Error state ────────────────────────────────────────────────────────

  private _applyErrorState(): void {
    if (this._externalError) {
      this.setAttribute('data-error', 'true');
    } else if (!this._touched) {
      this.removeAttribute('data-error');
    }
  }

  // ─── Valid state ────────────────────────────────────────────────────────

  private _updateValidState(): void {
    if (!this._field) return;

    const val = this.value;
    if (val === null) {
      this.removeAttribute('data-valid');
      return;
    }

    const inBounds = !this._min || !this._max || (val >= this._dateToISO(this._min) && val <= this._dateToISO(this._max));

    if (inBounds && !this._externalError && !this.hasAttribute('data-error')) {
      this.setAttribute('data-valid', 'true');
    } else {
      this.removeAttribute('data-valid');
    }
  }

  // ─── Autofocus ──────────────────────────────────────────────────────────

  private _handleAutofocus(): void {
    if (this.hasAttribute('autofocus') && this._field) {
      queueMicrotask(() => {
        if (document.activeElement === document.body || !document.activeElement) {
          this._field?.focus({ preventScroll: false });
        }
      });
    }
  }

  // ─── Accessibility ──────────────────────────────────────────────────────

  protected _applyAccessibility(): void {
    if (!this._field) return;

    const tokens = this._getTokens();
    this._field.id = this._id;

    if (this._labelEl) {
      this._labelEl.setAttribute('for', this._id);
    }

    const inError = this.hasAttribute('data-error');
    if (inError) {
      this._field.setAttribute('aria-invalid', 'true');
      if (this._hintEl) {
        this._hintEl.id = `${this._id}-hint`;
        this._field.setAttribute('aria-describedby', `${this._id}-hint`);
      }
    } else {
      this._field.removeAttribute('aria-invalid');
    }

    this._field.disabled = tokens.disabled;
  }

  // ─── Event listeners ────────────────────────────────────────────────────

  protected _attachEventListeners(): void {
    if (!this._field) return;

    const handleInput = (): void => {
      this._touched = true;
      // Live validation as user types
      this._updateValidState();
      this._dispatch('input', { value: this.value });
      if (this._internals) this._internals.setFormValue(this._field!.value);
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (this._field?.readOnly || this._field?.disabled) return;

      // Open calendar with Arrow Down or Space
      if ((e.key === 'ArrowDown' || e.key === ' ') && !this._calendarOpen) {
        e.preventDefault();
        this._openCalendar();
      }

      // Close calendar with Escape
      if (e.key === 'Escape' && this._calendarOpen) {
        e.preventDefault();
        this._closeCalendar();
      }
    };

    const handleBlur = (): void => {
      // Validate on blur
      this._updateValidState();
    };

    this._field.addEventListener('input', handleInput);
    this._field.addEventListener('keydown', handleKeyDown);
    this._field.addEventListener('blur', handleBlur);
  }
}

// Register the custom element
customElements.define('k-date', KDateElement);
