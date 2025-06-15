import { useState, useRef, useEffect } from "react";
import ChevronDown from "../../assets/icons/ChevronDown";
import "./multi.dropdown.css";

export interface MultiOption {
  label: string;
  value: string;
}

interface MultiDropdownProps {
  id: string;
  label?: string;
  options: MultiOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  id,
  label,
  options,
  values,
  onChange,
  placeholder = "Не выбрано",
  disabled = false,
  error
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleOption = (value: string) => {
    const newValues = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
    onChange(newValues);
  };

  const selectedLabels = options
    .filter((opt) => values.includes(opt.value))
    .map((opt) => opt.label)
    .join(", ");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) {
          if (focusedIndex >= 0) toggleOption(options[focusedIndex].value);
        } else {
          setOpen(true);
          setFocusedIndex(0);
        }
        break;
      case "Escape":
        setOpen(false);
        setFocusedIndex(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (open) {
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;
    }
  };

  return (
    <div className="multi-dropdown-group" ref={ref}>
      {label && (
        <span id={`${id}-label`} className="multi-dropdown-label">
          {label}
        </span>
      )}
      <div
        id={id}
        className={`multi-dropdown-display ${open ? "open" : ""} ${error ? "input-error" : ""} ${disabled ? "is-disabled" : ""}`}
        tabIndex={0}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-multiselectable="true"
        aria-labelledby={`${id}-label`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        <span className="multi-dropdown-selected" title={selectedLabels}>
          {selectedLabels || placeholder}
        </span>
        <ChevronDown className="multi-dropdown-arrow" />

        {open && (
          <ul className="multi-dropdown-options custom-scroll">
            {options.map((option, idx) => {
              const checkboxId = `${id}-checkbox-${option.value}`;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={values.includes(option.value)}
                  className={`multi-dropdown-option ${values.includes(option.value) ? "selected" : ""} ${focusedIndex === idx ? "focused" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(option.value);
                  }}
                >
                  <input type="checkbox" id={checkboxId} name={id} readOnly checked={values.includes(option.value)} />
                  <span>{option.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && <div className="text-error">{error}</div>}
    </div>
  );
};

export default MultiDropdown;
