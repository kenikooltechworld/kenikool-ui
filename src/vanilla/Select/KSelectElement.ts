import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { generateId } from '../../core/utils/generateId.js';
import { parseV } from '../../core/parseV.js';
import { getIcon, type IconName } from '../../core/icons.js';

/**
 * Option interface for Select component
 */
export interface SelectOption {
  value: string;
  label: string;
  group?: string | undefined;
  icon?: string | undefined;
  disabled?: boolean | undefined;
}

/**
 * KSelectElement — <k-select> Web Custom Element.
 *
 * Custom dropdown select (not native <select>) with full visual control.
 *
 * 10 variants:
 * - default, filled, outlined, underlined, searchable, multi
 * - grouped, with-icon, compact, floating-label
 *
 * Usage:
 *   <k-select v="default" options='[{"value":"1","label":"Option 1"}]'></k-select>
 *   <k-select v="multi" value="1,2,3"></k-select>
 *   <k-select v="searchable" placeholder="Search..."></k-select>
 */
export class KSelectElement extends KBaseElement {
  private _trigger: HTMLButtonElement | null = null;
  private _dropdown: HTMLDivElement | null = null;
  private _listbox: HTMLUListElement | null = null;
  private _searchInput: HTMLInputElement | null = null;
  private _pillContainer: HTMLDivElement | null = null;
  private _placeholder: HTMLSpanElement | null = null;
  
  private _isOpen = false;
  private _focusedIndex = -1;
  private _options: SelectOption[] = [];
  private _selectedValues: string[] = [];
  private _filteredOptions: SelectOption[] = [];
  
  private _triggerId: string = '';
  private _listboxId: string = '';
  
  // Event listeners stored for cleanup
  private _documentClickHandler = (e: MouseEvent) => this._handleDocumentClick(e);
  private _keydownHandler = (e: KeyboardEvent) => this._handleKeydown(e);

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'options', 'value', 'placeholder', 'open'];
  }

  protected _render(): void {
    if (this._trigger) return; // Already rendered

    const tokens = parseV(this.getAttribute('v') ?? '');
    const isMulti = tokens.variant === 'multi' || this.hasAttribute('multi');
    const isSearchable = tokens.variant === 'searchable' || this.hasAttribute('searchable');

    // Generate IDs
    this._triggerId = generateId('select-trigger');
    this._listboxId = generateId('select-listbox');

    // Parse options
    this._parseOptions();

    // Parse initial value
    this._parseValue();

    // Create trigger button
    this._trigger = document.createElement('button');
    this._trigger.type = 'button';
    this._trigger.className = 'k-select__trigger';
    this._trigger.id = this._triggerId;

    // Trigger content area
    const triggerContent = document.createElement('div');
    triggerContent.className = 'k-select__trigger-content';

    // Placeholder or selected value display
    if (isMulti) {
      // Multi-select: pill container
      this._pillContainer = document.createElement('div');
      this._pillContainer.className = 'k-select__pills';
      triggerContent.appendChild(this._pillContainer);

      this._placeholder = document.createElement('span');
      this._placeholder.className = 'k-select__placeholder';
      this._placeholder.textContent = this.getAttribute('placeholder') ?? 'Select options...';
      triggerContent.appendChild(this._placeholder);

      this._renderPills();
    } else {
      // Single-select: text display
      this._placeholder = document.createElement('span');
      this._placeholder.className = 'k-select__placeholder';
      this._placeholder.textContent = this.getAttribute('placeholder') ?? 'Select an option...';
      triggerContent.appendChild(this._placeholder);

      this._renderTriggerText();
    }

    this._trigger.appendChild(triggerContent);

    // Dropdown arrow icon
    const arrow = document.createElement('span');
    arrow.className = 'k-select__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = '▼';
    this._trigger.appendChild(arrow);

    this.appendChild(this._trigger);

    // Create dropdown
    this._dropdown = document.createElement('div');
    this._dropdown.className = 'k-select__dropdown';
    this._dropdown.setAttribute('hidden', '');

    // Search input for searchable variant
    if (isSearchable || isMulti) {
      this._searchInput = document.createElement('input');
      this._searchInput.type = 'text';
      this._searchInput.className = 'k-select__search';
      this._searchInput.placeholder = 'Search...';
      this._dropdown.appendChild(this._searchInput);
    }

    // Listbox
    this._listbox = document.createElement('ul');
    this._listbox.className = 'k-select__listbox';
    this._listbox.id = this._listboxId;
    this._dropdown.appendChild(this._listbox);

    this.appendChild(this._dropdown);

    // Render options
    this._renderOptions();
  }

  protected _applyAccessibility(): void {
    if (!this._trigger || !this._listbox) return;

    const tokens = parseV(this.getAttribute('v') ?? '');

    // Trigger ARIA
    this._trigger.setAttribute('role', 'combobox');
    this._trigger.setAttribute('aria-haspopup', 'listbox');
    this._trigger.setAttribute('aria-expanded', String(this._isOpen));
    this._trigger.setAttribute('aria-controls', this._listboxId);
    this._trigger.setAttribute('aria-disabled', String(tokens.disabled));
    
    if (this._selectedValues.length > 0) {
      this._trigger.setAttribute('aria-activedescendant', `${this._listboxId}-option-${this._focusedIndex}`);
    }

    // Listbox ARIA
    this._listbox.setAttribute('role', 'listbox');
    this._listbox.setAttribute('aria-labelledby', this._triggerId);
    
    const isMulti = tokens.variant === 'multi' || this.hasAttribute('multi');
    if (isMulti) {
      this._listbox.setAttribute('aria-multiselectable', 'true');
    }

    // Disabled state
    if (tokens.disabled) {
      this._trigger.disabled = true;
      this._trigger.setAttribute('tabindex', '-1');
    } else {
      this._trigger.disabled = false;
      this._trigger.setAttribute('tabindex', '0');
    }
  }

  protected _attachEventListeners(): void {
    if (!this._trigger) return;

    // Trigger click
    this._trigger.addEventListener('click', () => this._toggleDropdown());

    // Search input
    if (this._searchInput) {
      this._searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        this._filterOptions(query);
      });

      // Backspace in multi-select removes last pill
      this._searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && this._searchInput!.value === '') {
          this._removeLastSelection();
        }
      });
    }

    // Keyboard navigation
    this.addEventListener('keydown', this._keydownHandler);
  }

  protected _detachEventListeners(): void {
    this.removeEventListener('keydown', this._keydownHandler);
    document.removeEventListener('click', this._documentClickHandler);
  }

  private _parseOptions(): void {
    const optionsAttr = this.getAttribute('options');
    if (!optionsAttr) {
      this._options = [];
      return;
    }

    try {
      const parsed = JSON.parse(optionsAttr);
      if (Array.isArray(parsed)) {
        this._options = parsed.map((opt) => {
          if (typeof opt === 'string') {
            return { value: opt, label: opt };
          }
          return {
            value: String(opt.value ?? ''),
            label: String(opt.label ?? opt.value ?? ''),
            group: opt.group ? String(opt.group) : undefined,
            icon: opt.icon ? String(opt.icon) : undefined,
            disabled: Boolean(opt.disabled),
          };
        });
      }
    } catch (e) {
      console.warn('[k-select] Invalid options JSON:', e);
      this._options = [];
    }

    this._filteredOptions = [...this._options];
  }

  private _parseValue(): void {
    const valueAttr = this.getAttribute('value');
    if (!valueAttr) {
      this._selectedValues = [];
      return;
    }

    // Support comma-separated values for multi-select
    this._selectedValues = valueAttr.split(',').map(v => v.trim()).filter(Boolean);
  }

  private _renderTriggerText(): void {
    if (!this._placeholder) return;

    if (this._selectedValues.length === 0) {
      this._placeholder.textContent = this.getAttribute('placeholder') ?? 'Select an option...';
      this._placeholder.classList.add('k-select__placeholder');
    } else {
      const selectedOption = this._options.find(opt => opt.value === this._selectedValues[0]);
      this._placeholder.textContent = selectedOption ? sanitizeText(selectedOption.label) : (this._selectedValues[0] ?? '');
      this._placeholder.classList.remove('k-select__placeholder');
    }
  }

  private _renderPills(): void {
    if (!this._pillContainer) return;

    this._pillContainer.innerHTML = '';

    if (this._selectedValues.length === 0) {
      this._placeholder?.style.setProperty('display', 'inline');
      return;
    }

    this._placeholder?.style.setProperty('display', 'none');

    this._selectedValues.forEach((value) => {
      const option = this._options.find(opt => opt.value === value);
      if (!option) return;

      const pill = document.createElement('span');
      pill.className = 'k-select__pill';
      pill.textContent = sanitizeText(option.label);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'k-select__pill-remove';
      removeBtn.innerHTML = '×';
      removeBtn.setAttribute('aria-label', `Remove ${option.label}`);
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._deselectValue(value);
      });

      pill.appendChild(removeBtn);
      this._pillContainer!.appendChild(pill);
    });
  }

  private _renderOptions(): void {
    if (!this._listbox) return;

    this._listbox.innerHTML = '';

    const tokens = parseV(this.getAttribute('v') ?? '');
    const isGrouped = tokens.variant === 'grouped' || this.hasAttribute('grouped');

    if (isGrouped) {
      this._renderGroupedOptions();
    } else {
      this._renderFlatOptions();
    }
  }

  private _renderFlatOptions(): void {
    this._filteredOptions.forEach((option, index) => {
      const li = this._createOptionElement(option, index);
      this._listbox!.appendChild(li);
    });

    if (this._filteredOptions.length === 0) {
      const noResults = document.createElement('li');
      noResults.className = 'k-select__no-results';
      noResults.textContent = 'No options found';
      this._listbox!.appendChild(noResults);
    }
  }

  private _renderGroupedOptions(): void {
    const grouped = new Map<string, SelectOption[]>();

    this._filteredOptions.forEach((option) => {
      const group = option.group ?? 'Ungrouped';
      if (!grouped.has(group)) {
        grouped.set(group, []);
      }
      grouped.get(group)!.push(option);
    });

    let globalIndex = 0;
    grouped.forEach((options, groupName) => {
      // Group header
      const groupHeader = document.createElement('li');
      groupHeader.className = 'k-select__group-header';
      groupHeader.textContent = sanitizeText(groupName ?? 'Ungrouped');
      groupHeader.setAttribute('role', 'presentation');
      this._listbox!.appendChild(groupHeader);

      // Group options
      options.forEach((option) => {
        const li = this._createOptionElement(option, globalIndex);
        this._listbox!.appendChild(li);
        globalIndex++;
      });
    });
  }

  private _createOptionElement(option: SelectOption, index: number): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'k-select__option';
    li.id = `${this._listboxId}-option-${index}`;
    li.setAttribute('role', 'option');
    li.setAttribute('data-value', option.value);
    li.setAttribute('data-index', String(index));

    const isSelected = this._selectedValues.includes(option.value);
    li.setAttribute('aria-selected', String(isSelected));
    
    if (isSelected) {
      li.classList.add('k-select__option--selected');
    }

    if (option.disabled) {
      li.classList.add('k-select__option--disabled');
      li.setAttribute('aria-disabled', 'true');
    }

    if (option.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'k-select__option-icon';
      iconSpan.innerHTML = getIcon(option.icon as any, 16);
      li.appendChild(iconSpan);
    }

    const label = document.createElement('span');
    label.textContent = sanitizeText(option.label);
    li.appendChild(label);

    // Click handler
    if (!option.disabled) {
      li.addEventListener('click', () => this._selectOption(option.value));
      li.addEventListener('mouseenter', () => {
        this._focusedIndex = index;
        this._updateFocusedOption();
      });
    }

    return li;
  }

  private _toggleDropdown(): void {
    if (this._isOpen) {
      this._closeDropdown();
    } else {
      this._openDropdown();
    }
  }

  private _openDropdown(): void {
    if (!this._dropdown || !this._listbox) return;

    const tokens = parseV(this.getAttribute('v') ?? '');
    if (tokens.disabled || tokens.loading) return;

    this._isOpen = true;
    this._dropdown.removeAttribute('hidden');
    this._trigger?.setAttribute('aria-expanded', 'true');

    // Smart positioning: detect edges and flip dropdown direction
    this._positionDropdown();

    // Focus search input if present
    if (this._searchInput) {
      this._searchInput.focus();
    }

    // Set first option as focused
    if (this._filteredOptions.length > 0 && this._focusedIndex === -1) {
      this._focusedIndex = 0;
      this._updateFocusedOption();
    }

    // Listen for outside clicks
    setTimeout(() => {
      document.addEventListener('click', this._documentClickHandler);
    }, 0);

    // Listen for scroll/resize to reposition
    window.addEventListener('scroll', () => this._positionDropdown(), true);
    window.addEventListener('resize', () => this._positionDropdown());

    // Dispatch event
    this._dispatch('open');
  }

  /**
   * Smart dropdown positioning with edge detection.
   * Automatically flips to open upward if no space below.
   * Adjusts horizontal position if overflowing viewport edges.
   */
  private _positionDropdown(): void {
    if (!this._dropdown || !this._trigger) return;

    const triggerRect = this._trigger.getBoundingClientRect();
    const dropdownHeight = Math.min(300, this._dropdown.scrollHeight); // max-height from CSS
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calculate available space
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const spaceRight = viewportWidth - triggerRect.left;
    const spaceLeft = triggerRect.right;

    // Reset positioning classes
    this._dropdown.classList.remove('k-select__dropdown--above', 'k-select__dropdown--below');
    this._dropdown.style.removeProperty('top');
    this._dropdown.style.removeProperty('bottom');
    this._dropdown.style.removeProperty('left');
    this._dropdown.style.removeProperty('right');
    this._dropdown.style.removeProperty('max-height');

    // Vertical positioning: flip if not enough space below
    const shouldOpenAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    if (shouldOpenAbove) {
      // Open upward
      this._dropdown.classList.add('k-select__dropdown--above');
      this._dropdown.style.bottom = `calc(100% + 4px)`;
      this._dropdown.style.top = 'auto';
      this._dropdown.style.maxHeight = `${Math.min(spaceAbove - 8, 300)}px`;
    } else {
      // Open downward (default)
      this._dropdown.classList.add('k-select__dropdown--below');
      this._dropdown.style.top = `calc(100% + 4px)`;
      this._dropdown.style.bottom = 'auto';
      this._dropdown.style.maxHeight = `${Math.min(spaceBelow - 8, 300)}px`;
    }

    // Horizontal positioning: prevent overflow
    const dropdownWidth = this._dropdown.offsetWidth;
    
    if (triggerRect.left + dropdownWidth > viewportWidth) {
      // Align to right edge if overflowing right
      this._dropdown.style.left = 'auto';
      this._dropdown.style.right = '0';
    } else {
      // Default: align to left
      this._dropdown.style.left = '0';
      this._dropdown.style.right = 'auto';
    }

    // If dropdown is still wider than viewport, constrain it
    if (dropdownWidth > viewportWidth - 16) {
      this._dropdown.style.maxWidth = `${viewportWidth - 16}px`;
    }
  }

  private _closeDropdown(): void {
    if (!this._dropdown) return;

    this._isOpen = false;
    this._dropdown.setAttribute('hidden', '');
    this._trigger?.setAttribute('aria-expanded', 'false');

    // Clear search
    if (this._searchInput) {
      this._searchInput.value = '';
      this._filterOptions('');
    }

    // Remove event listeners
    document.removeEventListener('click', this._documentClickHandler);
    window.removeEventListener('scroll', () => this._positionDropdown(), true);
    window.removeEventListener('resize', () => this._positionDropdown());

    // Remove positioning classes
    this._dropdown.classList.remove('k-select__dropdown--above', 'k-select__dropdown--below');

    // Dispatch event
    this._dispatch('close');
  }

  private _handleDocumentClick(e: MouseEvent): void {
    if (!this.contains(e.target as Node)) {
      this._closeDropdown();
    }
  }

  private _selectOption(value: string): void {
    const tokens = parseV(this.getAttribute('v') ?? '');
    const isMulti = tokens.variant === 'multi' || this.hasAttribute('multi');

    if (isMulti) {
      // Toggle selection
      if (this._selectedValues.includes(value)) {
        this._deselectValue(value);
      } else {
        this._selectedValues.push(value);
      }
      this._renderPills();
    } else {
      // Single select
      this._selectedValues = [value];
      this._renderTriggerText();
      this._closeDropdown();
    }

    // Update attribute
    this.setAttribute('value', this._selectedValues.join(','));

    // Update options display
    this._renderOptions();

    // Dispatch change event
    this._dispatch('change', {
      value: isMulti ? this._selectedValues : (this._selectedValues[0] ?? null),
      selectedOptions: this._options.filter(opt => this._selectedValues.includes(opt.value)),
    });
  }

  private _deselectValue(value: string): void {
    this._selectedValues = this._selectedValues.filter(v => v !== value);
    this.setAttribute('value', this._selectedValues.join(','));
    this._renderPills();
    this._renderOptions();

    const tokens = parseV(this.getAttribute('v') ?? '');
    const isMulti = tokens.variant === 'multi' || this.hasAttribute('multi');

    this._dispatch('change', {
      value: isMulti ? this._selectedValues : (this._selectedValues[0] ?? null),
      selectedOptions: this._options.filter(opt => this._selectedValues.includes(opt.value)),
    });
  }

  private _removeLastSelection(): void {
    if (this._selectedValues.length > 0) {
      const lastValue = this._selectedValues[this._selectedValues.length - 1];
      if (lastValue) {
        this._deselectValue(lastValue);
      }
    }
  }

  private _filterOptions(query: string): void {
    const lowerQuery = query.toLowerCase();
    this._filteredOptions = this._options.filter((option) =>
      option.label.toLowerCase().includes(lowerQuery) ||
      option.value.toLowerCase().includes(lowerQuery)
    );
    this._focusedIndex = -1;
    this._renderOptions();
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (!this._isOpen) {
      // Open dropdown on Enter or Space
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._openDropdown();
      }
      return;
    }

    // Navigate options
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._focusedIndex = Math.min(this._focusedIndex + 1, this._filteredOptions.length - 1);
        this._updateFocusedOption();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this._focusedIndex = Math.max(this._focusedIndex - 1, 0);
        this._updateFocusedOption();
        break;

      case 'Home':
        e.preventDefault();
        this._focusedIndex = 0;
        this._updateFocusedOption();
        break;

      case 'End':
        e.preventDefault();
        this._focusedIndex = this._filteredOptions.length - 1;
        this._updateFocusedOption();
        break;

      case 'Enter':
        e.preventDefault();
        if (this._focusedIndex >= 0 && this._focusedIndex < this._filteredOptions.length) {
          const option = this._filteredOptions[this._focusedIndex];
          if (option && !option.disabled) {
            this._selectOption(option.value);
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        this._closeDropdown();
        this._trigger?.focus();
        break;
    }
  }

  private _updateFocusedOption(): void {
    if (!this._listbox) return;

    // Remove focus from all options
    const options = this._listbox.querySelectorAll('.k-select__option');
    options.forEach((opt) => opt.classList.remove('k-select__option--focused'));

    // Add focus to current option
    if (this._focusedIndex >= 0 && this._focusedIndex < options.length) {
      const focusedOption = options[this._focusedIndex] as HTMLElement;
      focusedOption.classList.add('k-select__option--focused');
      focusedOption.scrollIntoView({ block: 'nearest' });
      this._trigger?.setAttribute('aria-activedescendant', focusedOption.id);
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) return;

    if (name === 'options') {
      this._parseOptions();
      this._renderOptions();
    }

    if (name === 'value') {
      this._parseValue();
      const tokens = parseV(this.getAttribute('v') ?? '');
      const isMulti = tokens.variant === 'multi' || this.hasAttribute('multi');
      if (isMulti) {
        this._renderPills();
      } else {
        this._renderTriggerText();
      }
      this._renderOptions();
    }

    if (name === 'placeholder' && this._placeholder) {
      if (this._selectedValues.length === 0) {
        this._placeholder.textContent = newValue ?? 'Select an option...';
      }
    }

    if (name === 'open' && this._dropdown) {
      if (newValue !== null) {
        this._openDropdown();
      } else {
        this._closeDropdown();
      }
    }
  }
}

customElements.define('k-select', KSelectElement);
